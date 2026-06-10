// Shared user-assumptions validation and normalization.
//
// This is the single implementation behind BOTH the client
// (src/utils/assumptionsAPIHelpers.js) and the shared-assumptions server
// (src/server/sharedAssumptionsNormalization.js / Validation.js) — they were
// previously hand-copied near-twins with behavioral drift. Pure ES6: no
// browser or Node-specific APIs.
//
// Error reporting is injected: callers pass a `createError(message)` factory
// so the server can throw SharedAssumptionsError(400, ...) while the client
// throws plain Errors with its own prefix.

// Explicit .js extension: the shared-assumptions serverless functions import
// this module under native Node ESM, which requires fully-specified paths.
import { isPlainObject } from './typeGuards.js';

const ALLOWED_TOP_LEVEL_KEYS = ['globalParameters', 'categories', 'recipients'];

// Keys that could rewire an object's prototype when later code assigns into
// merged structures (e.g. merged[fieldName] = value).
const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

// Keep attacker-controlled keys from bloating error messages.
const describeKey = (key) => {
  const text = String(key);
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
};

const defaultCreateError = (message) => new Error(message);

export const areValuesEqual = (valueA, valueB) => {
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    if (valueA.length !== valueB.length) {
      return false;
    }

    return valueA.every((item, index) => areValuesEqual(item, valueB[index]));
  }

  if (Array.isArray(valueA) || Array.isArray(valueB)) {
    return false;
  }

  if (valueA === valueB) {
    return true;
  }

  return typeof valueA === 'number' && typeof valueB === 'number' && Number.isNaN(valueA) && Number.isNaN(valueB);
};

/**
 * Remove keys from parent[key] where predicate(childKey, childValue) returns
 * true; delete parent[key] entirely if it becomes empty.
 */
export const pruneObject = (parent, key, predicate) => {
  const obj = parent[key];
  if (!obj) return;
  for (const childKey of Object.keys(obj)) {
    if (predicate(childKey, obj[childKey])) {
      delete obj[childKey];
    }
  }
  if (Object.keys(obj).length === 0) {
    delete parent[key];
  }
};

const areOverrideSetsEqual = (overridesA, overridesB) => {
  const keysA = Object.keys(overridesA);
  const keysB = Object.keys(overridesB);
  return keysA.length === keysB.length && keysA.every((key) => areValuesEqual(overridesA[key], overridesB[key]));
};

/**
 * Normalize an effects array in place, removing values that match defaults
 * and effects reduced to only their effectId. Returns true if the array ends
 * up empty.
 *
 * For recipient effects, pass `getRecipientDefaultWrapper` (effectId →
 * recipient default `{effectId, overrides, multipliers, disabled?}` wrapper,
 * or null). The no-op value for a field is then the recipient's own default —
 * `wrapper.overrides[field] ?? base value` and `wrapper.multipliers[field] ??
 * 1` — so an explicit reset against a customized recipient default survives
 * instead of being dropped (mirrors the generator's curated-profile
 * normalization).
 */
export const normalizeEffects = (effects, getDefaultEffect, getRecipientDefaultWrapper = null) => {
  for (let index = effects.length - 1; index >= 0; index -= 1) {
    const effect = effects[index];
    const defaultEffect = getDefaultEffect(effect.effectId);

    if (getRecipientDefaultWrapper) {
      const wrapper = getRecipientDefaultWrapper(effect.effectId);
      const wrapperOverrides = wrapper?.overrides;

      if (effect.overrides && defaultEffect) {
        if (Object.keys(effect.overrides).length === 0) {
          delete effect.overrides;
        } else if (wrapperOverrides && Object.keys(wrapperOverrides).length > 0) {
          // At combine time a user overrides object REPLACES the recipient
          // default's overrides wholesale (mergeRecipientEffectWithUser), so
          // pruning individual fields would change what the replacement
          // reconstructs to. The only identity-safe prune is dropping a user
          // object that matches the recipient default exactly.
          if (areOverrideSetsEqual(effect.overrides, wrapperOverrides)) {
            delete effect.overrides;
          }
        } else {
          pruneObject(effect, 'overrides', (field, value) => areValuesEqual(value, defaultEffect[field]));
        }
      }

      // Multipliers merge per-field at combine time, so each field's no-op
      // value is the recipient default's multiplier (1 when none).
      pruneObject(effect, 'multipliers', (field, value) => areValuesEqual(value, wrapper?.multipliers?.[field] ?? 1));

      if (Object.hasOwn(effect, 'disabled')) {
        const defaultDisabled = Boolean(wrapper?.disabled ?? defaultEffect?.disabled);
        if (Boolean(effect.disabled) === defaultDisabled) {
          delete effect.disabled;
        } else {
          effect.disabled = Boolean(effect.disabled);
        }
      }
    } else if (defaultEffect) {
      // Category effects store values directly
      for (const field of Object.keys(effect)) {
        if (field !== 'effectId' && areValuesEqual(effect[field], defaultEffect[field])) {
          delete effect[field];
        }
      }
    }

    // Remove effect if only effectId remains
    if (Object.keys(effect).length === 1) {
      effects.splice(index, 1);
    }
  }
  return effects.length === 0;
};

/**
 * Deep schema validation of user assumptions against the default assumptions.
 * Rejects unknown sections/parameters/categories/recipients/effects/fields,
 * wrong value types (finite numbers; boolean `disabled`), duplicate effect
 * ids, and prototype-rewiring keys. Anything that doesn't look like output of
 * the app's own assumptions editor is rejected: stale or hostile data can
 * silently flip an effect's calculation model or crash importers.
 */
export const validateAssumptionsShape = (assumptions, defaultAssumptions, createError = defaultCreateError) => {
  const invalid = (message) => createError(message);

  const rejectForbiddenKeys = (value, path) => {
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_OBJECT_KEYS.has(key)) {
        throw invalid(`Forbidden key '${key}' in ${path}.`);
      }
    }
  };

  const requirePlainObject = (value, path) => {
    if (!isPlainObject(value)) {
      throw invalid(`${path} must be an object.`);
    }
  };

  const validateEffectEntries = (effects, baseEffects, context, isRecipientEffect) => {
    if (!Array.isArray(effects)) {
      throw invalid(`effects for ${context} must be an array.`);
    }

    const seenEffectIds = new Set();
    for (const effect of effects) {
      if (!isPlainObject(effect)) {
        throw invalid(`effects for ${context} must be objects.`);
      }
      rejectForbiddenKeys(effect, `effects for ${context}`);

      const baseEffect =
        typeof effect.effectId === 'string'
          ? baseEffects?.find((candidate) => candidate.effectId === effect.effectId)
          : null;
      if (!baseEffect) {
        throw invalid(`unknown effect "${describeKey(effect.effectId)}" in ${context}.`);
      }
      if (seenEffectIds.has(effect.effectId)) {
        throw invalid(`duplicates effect "${effect.effectId}" in ${context}.`);
      }
      seenEffectIds.add(effect.effectId);

      const effectLabel = `effect "${effect.effectId}" in ${context}`;

      if (Object.hasOwn(effect, 'disabled') && typeof effect.disabled !== 'boolean') {
        throw invalid(`'disabled' on ${effectLabel} must be a boolean.`);
      }

      const validateFieldValue = (field, value, label) => {
        if (!isFiniteNumber(baseEffect[field])) {
          throw invalid(`unknown field "${describeKey(field)}" on ${label}.`);
        }
        if (!isFiniteNumber(value)) {
          throw invalid(`field "${field}" on ${label} must be a finite number.`);
        }
      };

      if (isRecipientEffect) {
        for (const key of Object.keys(effect)) {
          if (!['effectId', 'overrides', 'multipliers', 'disabled'].includes(key)) {
            throw invalid(
              `unknown field "${describeKey(key)}" on ${effectLabel}; recipient effects support 'overrides', 'multipliers', and 'disabled'.`
            );
          }
        }
        for (const mapName of ['overrides', 'multipliers']) {
          if (effect[mapName] === undefined) continue;
          if (!isPlainObject(effect[mapName])) {
            throw invalid(`'${mapName}' on ${effectLabel} must be an object.`);
          }
          rejectForbiddenKeys(effect[mapName], `'${mapName}' on ${effectLabel}`);
          for (const [field, value] of Object.entries(effect[mapName])) {
            validateFieldValue(field, value, `'${mapName}' of ${effectLabel}`);
          }
        }
      } else {
        for (const [field, value] of Object.entries(effect)) {
          if (field === 'effectId' || field === 'disabled') continue;
          validateFieldValue(field, value, effectLabel);
        }
      }
    }
  };

  requirePlainObject(assumptions, 'assumptions');
  rejectForbiddenKeys(assumptions, 'assumptions');
  for (const key of Object.keys(assumptions)) {
    if (!ALLOWED_TOP_LEVEL_KEYS.includes(key)) {
      throw invalid(`unknown section "${describeKey(key)}" in assumptions.`);
    }
  }

  if (assumptions.globalParameters !== undefined) {
    requirePlainObject(assumptions.globalParameters, 'assumptions.globalParameters');
    rejectForbiddenKeys(assumptions.globalParameters, 'assumptions.globalParameters');
    for (const [param, value] of Object.entries(assumptions.globalParameters)) {
      if (!Object.hasOwn(defaultAssumptions.globalParameters || {}, param)) {
        throw invalid(`unknown global parameter "${describeKey(param)}".`);
      }
      if (!isFiniteNumber(value)) {
        throw invalid(`global parameter "${param}" must be a finite number.`);
      }
    }
  }

  if (assumptions.categories !== undefined) {
    requirePlainObject(assumptions.categories, 'assumptions.categories');
    rejectForbiddenKeys(assumptions.categories, 'assumptions.categories');
    for (const [categoryId, category] of Object.entries(assumptions.categories)) {
      const baseCategory = defaultAssumptions.categories?.[categoryId];
      if (!baseCategory) {
        throw invalid(`unknown category "${describeKey(categoryId)}".`);
      }
      const path = `assumptions.categories.${categoryId}`;
      requirePlainObject(category, path);
      rejectForbiddenKeys(category, path);
      for (const key of Object.keys(category)) {
        if (key !== 'effects') {
          throw invalid(`unknown field "${describeKey(key)}" on ${path}. Only 'effects' is supported.`);
        }
      }
      if (category.effects !== undefined) {
        validateEffectEntries(category.effects, baseCategory.effects, `category "${categoryId}"`, false);
      }
    }
  }

  if (assumptions.recipients !== undefined) {
    requirePlainObject(assumptions.recipients, 'assumptions.recipients');
    rejectForbiddenKeys(assumptions.recipients, 'assumptions.recipients');
    for (const [recipientId, recipient] of Object.entries(assumptions.recipients)) {
      const baseRecipient = defaultAssumptions.recipients?.[recipientId];
      if (!baseRecipient) {
        throw invalid(`unknown recipient "${describeKey(recipientId)}".`);
      }
      const recipientPath = `assumptions.recipients.${recipientId}`;
      requirePlainObject(recipient, recipientPath);
      rejectForbiddenKeys(recipient, recipientPath);
      for (const key of Object.keys(recipient)) {
        if (key !== 'categories') {
          throw invalid(`unknown field "${describeKey(key)}" on ${recipientPath}. Only 'categories' is supported.`);
        }
      }
      if (recipient.categories !== undefined && !isPlainObject(recipient.categories)) {
        throw invalid(`'categories' on ${recipientPath} must be an object.`);
      }
      for (const [categoryId, category] of Object.entries(recipient.categories || {})) {
        const baseCategory = defaultAssumptions.categories?.[categoryId];
        if (!baseCategory || !Object.hasOwn(baseRecipient.categories || {}, categoryId)) {
          throw invalid(`category "${describeKey(categoryId)}" is not associated with recipient "${recipientId}".`);
        }
        const path = `${recipientPath}.categories.${categoryId}`;
        requirePlainObject(category, path);
        rejectForbiddenKeys(category, path);
        for (const key of Object.keys(category)) {
          if (key !== 'effects') {
            throw invalid(`unknown field "${describeKey(key)}" on ${path}. Only 'effects' is supported.`);
          }
        }
        if (category.effects !== undefined) {
          validateEffectEntries(
            category.effects,
            baseCategory.effects,
            `recipient "${recipientId}" (category "${categoryId}")`,
            true
          );
        }
      }
    }
  }
};

/**
 * Validate, then normalize user assumptions by removing values that match
 * defaults. Returns the pruned data, or null if nothing custom remains.
 * Throws (via createError) on data the current schema doesn't know — callers
 * feeding it external data (saved entries, shared links, persisted sessions)
 * must handle that.
 */
export const normalizeUserAssumptions = (userAssumptions, defaultAssumptions, createError = defaultCreateError) => {
  if (!userAssumptions) {
    return null;
  }

  const data = JSON.parse(JSON.stringify(userAssumptions));
  validateAssumptionsShape(data, defaultAssumptions, createError);

  // Normalize global parameters
  pruneObject(data, 'globalParameters', (param, value) =>
    areValuesEqual(value, defaultAssumptions.globalParameters?.[param])
  );

  // Normalize categories
  if (data.categories) {
    for (const categoryId of Object.keys(data.categories)) {
      const category = data.categories[categoryId];
      if (category.effects) {
        const isEmpty = normalizeEffects(category.effects, (effectId) =>
          defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId)
        );
        if (isEmpty) delete data.categories[categoryId];
      } else {
        delete data.categories[categoryId];
      }
    }
    if (Object.keys(data.categories).length === 0) {
      delete data.categories;
    }
  }

  // Normalize recipients
  if (data.recipients) {
    for (const recipientId of Object.keys(data.recipients)) {
      const recipient = data.recipients[recipientId];
      if (!recipient.categories) {
        // A recipient entry with nothing in it is meaningless — drop it.
        delete data.recipients[recipientId];
        continue;
      }

      for (const categoryId of Object.keys(recipient.categories)) {
        const category = recipient.categories[categoryId];
        if (category.effects) {
          const isEmpty = normalizeEffects(
            category.effects,
            // Field values diff against the base category effect…
            (effectId) =>
              defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId) ||
              null,
            // …adjusted by the recipient's own default wrapper when one exists.
            (effectId) =>
              defaultAssumptions.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.find(
                (effect) => effect.effectId === effectId
              ) || null
          );
          if (isEmpty) delete recipient.categories[categoryId];
        } else {
          delete recipient.categories[categoryId];
        }
      }
      if (Object.keys(recipient.categories).length === 0) {
        delete data.recipients[recipientId];
      }
    }
    if (Object.keys(data.recipients).length === 0) {
      delete data.recipients;
    }
  }

  return Object.keys(data).length > 0 ? data : null;
};
