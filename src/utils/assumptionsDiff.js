// Renders the user-assumptions diff (the normalized `userAssumptions`
// structure — see assumptionsNormalization.js) as display-ready change
// entries, and reverts individual entries.
//
// Both entry points take NORMALIZED user assumptions (what
// `getNormalizedUserAssumptionsForSharing()` returns). Revert results must be
// re-normalized by the caller (`setAllUserAssumptions` does this), which
// prunes structures a revert empties out.

import { areValuesEqual } from './assumptionsNormalization.js';
import { formatCurrency, formatNumberWithCommas } from './formatters';
import {
  GLOBAL_PARAMETER_DEFINITIONS,
  GLOBAL_PARAMETER_DEFINITIONS_BY_ID,
} from '../constants/globalParameterDefinitions';
import { getEffectFields } from '../constants/effectFieldDefinitions';

const CURRENCY_FIELDS = new Set(['costPerQALY', 'costPerMicroprobability']);

const formatPlainNumber = (value) => formatNumberWithCommas(String(value));

const formatEffectFieldValue = (field, value) =>
  CURRENCY_FIELDS.has(field) ? formatCurrency(value) : formatPlainNumber(value);

const formatGlobalParameterValue = (definition, value) => {
  if (definition.format === 'percentage') {
    // Same ×100 rounding the editor form uses, to strip float artifacts.
    const percentValue = Math.round(value * 100 * 1e10) / 1e10;
    return `${formatPlainNumber(percentValue)}%`;
  }
  return formatPlainNumber(value);
};

// Effect fields are labeled by the shared field definitions; anything else
// that passed validation (a numeric field on the base effect that the editor
// doesn't surface) falls back to its raw name rather than failing the view.
const getEffectFieldLabel = (baseEffect, field) =>
  getEffectFields(baseEffect).find((definition) => definition.name === field)?.label ?? field;

const getDefaultEffectOrThrow = (defaultAssumptions, categoryId, effectId) => {
  const effect = defaultAssumptions.categories?.[categoryId]?.effects?.find(
    (candidate) => candidate.effectId === effectId
  );
  if (!effect) {
    throw new Error(`Unknown effect "${effectId}" in category "${categoryId}" while building assumptions diff`);
  }
  return effect;
};

const buildStatusEntry = ({ path, effectLabel, fromDisabled, toDisabled }) => ({
  path,
  effectLabel,
  fieldLabel: 'Status',
  fromDisplay: fromDisabled ? 'disabled' : 'enabled',
  toDisplay: toDisabled ? 'disabled' : 'enabled',
});

const buildGlobalParameterEntries = (defaultAssumptions, userGlobalParameters) => {
  const entries = GLOBAL_PARAMETER_DEFINITIONS.filter((definition) =>
    Object.hasOwn(userGlobalParameters, definition.id)
  ).map((definition) => ({
    path: { section: 'globalParameters', parameterName: definition.id },
    fieldLabel: definition.label,
    fromDisplay: formatGlobalParameterValue(definition, defaultAssumptions.globalParameters[definition.id]),
    toDisplay: formatGlobalParameterValue(definition, userGlobalParameters[definition.id]),
  }));

  const unknownParameter = Object.keys(userGlobalParameters).find(
    (parameterName) => !GLOBAL_PARAMETER_DEFINITIONS_BY_ID[parameterName]
  );
  if (unknownParameter) {
    throw new Error(`Global parameter "${unknownParameter}" has no display definition`);
  }

  return entries;
};

const buildCategoryEffectEntries = ({ categoryId, userEffect, defaultEffect, effectLabel }) => {
  const entries = [];
  const pathFor = (field) => ({ section: 'categories', categoryId, effectId: userEffect.effectId, field });

  // Definition order first so entries read in the same order as the editor.
  const orderedFields = getEffectFields(defaultEffect).map((definition) => definition.name);
  const extraFields = Object.keys(userEffect).filter(
    (field) => field !== 'effectId' && field !== 'disabled' && !orderedFields.includes(field)
  );

  [...orderedFields, ...extraFields].forEach((field) => {
    if (!Object.hasOwn(userEffect, field)) {
      return;
    }
    entries.push({
      path: pathFor(field),
      effectLabel,
      fieldLabel: getEffectFieldLabel(defaultEffect, field),
      fromDisplay: formatEffectFieldValue(field, defaultEffect[field]),
      toDisplay: formatEffectFieldValue(field, userEffect[field]),
    });
  });

  if (Object.hasOwn(userEffect, 'disabled') && Boolean(userEffect.disabled) !== Boolean(defaultEffect.disabled)) {
    entries.push(
      buildStatusEntry({
        path: pathFor('disabled'),
        effectLabel,
        fromDisabled: Boolean(defaultEffect.disabled),
        toDisabled: Boolean(userEffect.disabled),
      })
    );
  }

  return entries;
};

const buildCategoryGroups = (defaultAssumptions, userCategories) =>
  Object.entries(userCategories)
    .map(([categoryId, userCategory]) => {
      const defaultCategory = defaultAssumptions.categories?.[categoryId];
      if (!defaultCategory) {
        throw new Error(`Unknown category "${categoryId}" while building assumptions diff`);
      }

      const showEffectLabels = defaultCategory.effects.length > 1;
      const entries = (userCategory.effects ?? []).flatMap((userEffect) =>
        buildCategoryEffectEntries({
          categoryId,
          userEffect,
          defaultEffect: getDefaultEffectOrThrow(defaultAssumptions, categoryId, userEffect.effectId),
          effectLabel: showEffectLabels ? userEffect.effectId : null,
        })
      );

      return { categoryId, categoryName: defaultCategory.name, entries };
    })
    .filter((group) => group.entries.length > 0)
    .sort((groupA, groupB) => groupA.categoryName.localeCompare(groupB.categoryName));

// One side of a recipient field row, always as a concrete number the user
// can compare: an absolute override, a multiplier resolved against the cause
// value (noted "× n"), or the cause value itself (noted "from cause" — the
// number tracks the cause rather than being pinned on the recipient).
const describeRecipientChannel = ({ field, override, multiplier, causeValue }) => {
  if (override !== undefined) {
    return { display: formatEffectFieldValue(field, override), note: null };
  }
  if (multiplier !== undefined) {
    return {
      display: formatEffectFieldValue(field, causeValue * multiplier),
      note: `× ${formatPlainNumber(multiplier)}`,
    };
  }
  return { display: formatEffectFieldValue(field, causeValue), note: 'from cause' };
};

/**
 * Per-field override/multiplier channels for one recipient effect, before
 * (recipient's default wrapper) and after (user wrapper merged the way
 * `createCombinedAssumptions` does): a user overrides object replaces the
 * default overrides wholesale, user multipliers merge per field, and each
 * channel evicts the other for the field it targets.
 */
const resolveRecipientChannels = ({ defaultWrapper, userWrapper, field }) => {
  const defaultOverride = defaultWrapper?.overrides?.[field];
  const defaultMultiplier = defaultWrapper?.multipliers?.[field];
  const hasUserMultiplier = userWrapper.multipliers !== undefined && Object.hasOwn(userWrapper.multipliers, field);
  const userOverrides = userWrapper.overrides;

  const toOverride = hasUserMultiplier ? undefined : userOverrides ? userOverrides[field] : defaultOverride;
  const toMultiplier = hasUserMultiplier
    ? userWrapper.multipliers[field]
    : userOverrides && Object.hasOwn(userOverrides, field)
      ? undefined
      : defaultMultiplier;

  return { fromOverride: defaultOverride, fromMultiplier: defaultMultiplier, toOverride, toMultiplier };
};

const buildRecipientEffectEntries = ({
  recipientId,
  categoryId,
  userWrapper,
  defaultWrapper,
  baseEffect,
  userCategoryEffect,
  effectLabel,
}) => {
  const entries = [];
  const pathFor = (field) => ({
    section: 'recipients',
    recipientId,
    categoryId,
    effectId: userWrapper.effectId,
    field,
  });

  const orderedFields = getEffectFields(baseEffect).map((definition) => definition.name);
  const extraFields = [
    ...Object.keys(defaultWrapper?.overrides ?? {}),
    ...Object.keys(defaultWrapper?.multipliers ?? {}),
    ...Object.keys(userWrapper.overrides ?? {}),
    ...Object.keys(userWrapper.multipliers ?? {}),
  ].filter((field) => !orderedFields.includes(field));

  [...orderedFields, ...new Set(extraFields)].forEach((field) => {
    const { fromOverride, fromMultiplier, toOverride, toMultiplier } = resolveRecipientChannels({
      defaultWrapper,
      userWrapper,
      field,
    });

    if (areValuesEqual(fromOverride, toOverride) && areValuesEqual(fromMultiplier, toMultiplier)) {
      return;
    }

    // Cause values the two sides resolve against: "before" uses the default
    // cause value; "now" honors the user's own cause edits, matching what
    // the recipient actually calculates with (and what its editor shows as
    // the baseline).
    const fromCauseValue = baseEffect[field];
    const toCauseValue = userCategoryEffect?.[field] ?? baseEffect[field];
    const from = describeRecipientChannel({
      field,
      override: fromOverride,
      multiplier: fromMultiplier,
      causeValue: fromCauseValue,
    });
    const to = describeRecipientChannel({
      field,
      override: toOverride,
      multiplier: toMultiplier,
      causeValue: toCauseValue,
    });

    entries.push({
      path: pathFor(field),
      effectLabel,
      fieldLabel: getEffectFieldLabel(baseEffect, field),
      fromDisplay: from.display,
      fromNote: from.note,
      toDisplay: to.display,
      toNote: to.note,
    });
  });

  if (Object.hasOwn(userWrapper, 'disabled')) {
    const fromDisabled = Boolean(defaultWrapper?.disabled ?? baseEffect.disabled);
    const toDisabled = Boolean(userWrapper.disabled);
    if (fromDisabled !== toDisabled) {
      entries.push(buildStatusEntry({ path: pathFor('disabled'), effectLabel, fromDisabled, toDisabled }));
    }
  }

  return entries;
};

const buildRecipientGroups = (defaultAssumptions, userRecipients, userCategories) =>
  Object.entries(userRecipients)
    .map(([recipientId, userRecipient]) => {
      const defaultRecipient = defaultAssumptions.recipients?.[recipientId];
      if (!defaultRecipient) {
        throw new Error(`Unknown recipient "${recipientId}" while building assumptions diff`);
      }

      const categories = Object.entries(userRecipient.categories ?? {})
        .map(([categoryId, userCategory]) => {
          const defaultCategory = defaultAssumptions.categories?.[categoryId];
          if (!defaultCategory) {
            throw new Error(`Unknown category "${categoryId}" while building assumptions diff`);
          }

          const defaultWrappers = defaultRecipient.categories?.[categoryId]?.effects ?? [];
          const userCategoryEffects = userCategories?.[categoryId]?.effects;
          const showEffectLabels = defaultCategory.effects.length > 1;

          const entries = (userCategory.effects ?? []).flatMap((userWrapper) =>
            buildRecipientEffectEntries({
              recipientId,
              categoryId,
              userWrapper,
              defaultWrapper: defaultWrappers.find((wrapper) => wrapper.effectId === userWrapper.effectId) ?? null,
              baseEffect: getDefaultEffectOrThrow(defaultAssumptions, categoryId, userWrapper.effectId),
              userCategoryEffect:
                userCategoryEffects?.find((effect) => effect.effectId === userWrapper.effectId) ?? null,
              effectLabel: showEffectLabels ? userWrapper.effectId : null,
            })
          );

          return { categoryId, categoryName: defaultCategory.name, entries };
        })
        .filter((categoryGroup) => categoryGroup.entries.length > 0);

      return { recipientId, recipientName: defaultRecipient.name, categories };
    })
    .filter((recipientGroup) => recipientGroup.categories.length > 0)
    .sort((groupA, groupB) => groupA.recipientName.localeCompare(groupB.recipientName));

/**
 * Build the display model of everything the user's assumptions change
 * relative to the site defaults.
 *
 * @param {Object} defaultAssumptions - The site's default assumptions.
 * @param {Object|null} userAssumptions - NORMALIZED user assumptions diff.
 * @returns {{changeCount: number, globalParameters: Array, categories: Array, recipients: Array}}
 */
export const buildAssumptionsDiff = (defaultAssumptions, userAssumptions) => {
  const globalParameters = buildGlobalParameterEntries(defaultAssumptions, userAssumptions?.globalParameters ?? {});
  const categories = buildCategoryGroups(defaultAssumptions, userAssumptions?.categories ?? {});
  const recipients = buildRecipientGroups(
    defaultAssumptions,
    userAssumptions?.recipients ?? {},
    userAssumptions?.categories ?? {}
  );

  const changeCount =
    globalParameters.length +
    categories.reduce((count, group) => count + group.entries.length, 0) +
    recipients.reduce(
      (count, group) =>
        count + group.categories.reduce((categoryCount, category) => categoryCount + category.entries.length, 0),
      0
    );

  return { changeCount, globalParameters, categories, recipients };
};

const findEffectOrThrow = (effects, effectId, pathDescription) => {
  const effect = effects?.find((candidate) => candidate.effectId === effectId);
  if (!effect) {
    throw new Error(`Cannot revert assumptions change: no effect "${effectId}" under ${pathDescription}`);
  }
  return effect;
};

/**
 * Return new user assumptions with one diff entry reverted to its default.
 * The result is NOT normalized — callers must feed it through
 * `setAllUserAssumptions`/`normalizeUserAssumptions`, which prunes whatever
 * the revert emptied.
 */
export const revertAssumptionsDiffEntry = (userAssumptions, path, defaultAssumptions) => {
  const next = JSON.parse(JSON.stringify(userAssumptions ?? {}));

  if (path.section === 'globalParameters') {
    if (!next.globalParameters || !Object.hasOwn(next.globalParameters, path.parameterName)) {
      throw new Error(`Cannot revert assumptions change: global parameter "${path.parameterName}" is not customized`);
    }
    delete next.globalParameters[path.parameterName];
    return next;
  }

  if (path.section === 'categories') {
    const effect = findEffectOrThrow(
      next.categories?.[path.categoryId]?.effects,
      path.effectId,
      `category "${path.categoryId}"`
    );
    delete effect[path.field];
    return next;
  }

  if (path.section === 'recipients') {
    const effect = findEffectOrThrow(
      next.recipients?.[path.recipientId]?.categories?.[path.categoryId]?.effects,
      path.effectId,
      `recipient "${path.recipientId}" category "${path.categoryId}"`
    );

    if (path.field === 'disabled') {
      delete effect.disabled;
      return next;
    }

    // A user multiplier for the field stops applying once deleted (multipliers
    // merge per field, so the recipient default's multiplier resurfaces).
    if (effect.multipliers) {
      delete effect.multipliers[path.field];
    }

    // A user overrides object replaces the default overrides wholesale, so
    // reverting one field means writing the default's value back into the
    // user object (or dropping the field when the default has none).
    // Normalization then prunes the object if it now matches the default set.
    if (effect.overrides) {
      const defaultWrapper = defaultAssumptions.recipients?.[path.recipientId]?.categories?.[
        path.categoryId
      ]?.effects?.find((wrapper) => wrapper.effectId === path.effectId);

      if (defaultWrapper?.overrides && Object.hasOwn(defaultWrapper.overrides, path.field)) {
        effect.overrides[path.field] = defaultWrapper.overrides[path.field];
      } else {
        delete effect.overrides[path.field];
      }
    }

    return next;
  }

  throw new Error(`Cannot revert assumptions change: unknown section "${path.section}"`);
};
