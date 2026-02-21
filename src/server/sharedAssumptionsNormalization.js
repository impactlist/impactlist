import { categoriesById, globalParameters, recipientsById } from '../data/generatedData.js';

const createServerDefaultAssumptions = () => {
  return {
    globalParameters: { ...globalParameters },
    categories: JSON.parse(JSON.stringify(categoriesById)),
    recipients: JSON.parse(JSON.stringify(recipientsById)),
  };
};

const areValuesEqual = (valueA, valueB) => {
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

const pruneObject = (parent, key, predicate) => {
  const obj = parent[key];
  if (!obj) {
    return;
  }

  Object.keys(obj).forEach((childKey) => {
    if (predicate(childKey, obj[childKey])) {
      delete obj[childKey];
    }
  });

  if (Object.keys(obj).length === 0) {
    delete parent[key];
  }
};

const normalizeEffects = (effects, getDefaultEffect, isRecipientEffect = false) => {
  for (let index = effects.length - 1; index >= 0; index -= 1) {
    const effect = effects[index];
    const defaultEffect = getDefaultEffect(effect.effectId);

    if (isRecipientEffect) {
      if (effect.overrides && defaultEffect) {
        pruneObject(effect, 'overrides', (field, value) => areValuesEqual(value, defaultEffect[field]));
      }
      pruneObject(effect, 'multipliers', (_, value) => value === 1);

      if (Object.hasOwn(effect, 'disabled')) {
        const defaultDisabled = defaultEffect ? Boolean(defaultEffect.disabled) : false;
        if (Boolean(effect.disabled) === defaultDisabled) {
          delete effect.disabled;
        } else {
          effect.disabled = Boolean(effect.disabled);
        }
      }
    } else if (defaultEffect) {
      Object.keys(effect).forEach((field) => {
        if (field !== 'effectId' && areValuesEqual(effect[field], defaultEffect[field])) {
          delete effect[field];
        }
      });
    }

    if (Object.keys(effect).length === 1) {
      effects.splice(index, 1);
    }
  }

  return effects.length === 0;
};

export const normalizeSharedUserAssumptions = (userAssumptions, defaultAssumptions) => {
  if (!userAssumptions) {
    return null;
  }

  const data = JSON.parse(JSON.stringify(userAssumptions));

  pruneObject(data, 'globalParameters', (parameter, value) =>
    areValuesEqual(value, defaultAssumptions.globalParameters?.[parameter])
  );

  if (data.categories) {
    Object.keys(data.categories).forEach((categoryId) => {
      const category = data.categories[categoryId];

      if (!category.effects) {
        delete data.categories[categoryId];
        return;
      }

      const isEmptyCategory = normalizeEffects(category.effects, (effectId) =>
        defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId)
      );

      if (isEmptyCategory) {
        delete data.categories[categoryId];
      }
    });

    if (Object.keys(data.categories).length === 0) {
      delete data.categories;
    }
  }

  if (data.recipients) {
    Object.keys(data.recipients).forEach((recipientId) => {
      const recipient = data.recipients[recipientId];
      if (!recipient.categories) {
        delete data.recipients[recipientId];
        return;
      }

      Object.keys(recipient.categories).forEach((categoryId) => {
        const category = recipient.categories[categoryId];

        if (!category.effects) {
          delete recipient.categories[categoryId];
          return;
        }

        const isEmptyCategory = normalizeEffects(
          category.effects,
          (effectId) =>
            defaultAssumptions.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.find(
              (effect) => effect.effectId === effectId
            ) || defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId),
          true
        );

        if (isEmptyCategory) {
          delete recipient.categories[categoryId];
        }
      });

      if (Object.keys(recipient.categories).length === 0) {
        delete data.recipients[recipientId];
      }
    });

    if (Object.keys(data.recipients).length === 0) {
      delete data.recipients;
    }
  }

  return Object.keys(data).length > 0 ? data : null;
};

export const serverDefaultAssumptions = createServerDefaultAssumptions();
