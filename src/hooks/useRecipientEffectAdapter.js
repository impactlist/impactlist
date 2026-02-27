import { useMemo } from 'react';
import { getOverridePlaceholderValue } from '../utils/effectFieldHelpers';
import { parseFormattedNumber } from '../utils/effectEditorUtils';

const hasValue = (value) => value !== undefined && value !== null && value !== '';

const getFieldNames = (fieldDefinitions = []) =>
  fieldDefinitions.map((field) => (typeof field === 'string' ? field : field.name));

export const useRecipientEffectAdapter = ({
  fieldDefinitions,
  effectIndex,
  defaultCategoryEffect,
  userCategoryEffect,
  defaultRecipientEffect,
  errors,
  overrides,
  multipliers,
}) => {
  const fieldNames = useMemo(() => getFieldNames(fieldDefinitions), [fieldDefinitions]);

  const defaultEffect = useMemo(() => {
    const next = { ...(defaultCategoryEffect || {}) };
    fieldNames.forEach((fieldName) => {
      const defaultValue = getOverridePlaceholderValue(fieldName, {
        defaultCategoryEffect,
        userCategoryEffect,
        defaultRecipientEffect,
      });
      if (hasValue(defaultValue)) {
        next[fieldName] = defaultValue;
      }
    });
    return next;
  }, [fieldNames, defaultCategoryEffect, userCategoryEffect, defaultRecipientEffect]);

  const effect = useMemo(() => {
    const next = { ...(defaultEffect || {}) };
    fieldNames.forEach((fieldName) => {
      let currentValue = overrides?.[fieldName];

      if (!hasValue(currentValue) && hasValue(multipliers?.[fieldName])) {
        const baseValue = defaultEffect?.[fieldName];
        const multiplier = parseFormattedNumber(multipliers[fieldName]);
        const baseNumeric = parseFormattedNumber(baseValue);
        if (!isNaN(multiplier) && !isNaN(baseNumeric)) {
          currentValue = baseNumeric * multiplier;
        }
      }

      if (hasValue(currentValue)) {
        next[fieldName] = currentValue;
      }
    });
    return next;
  }, [fieldNames, defaultEffect, overrides, multipliers]);

  const normalizedErrors = useMemo(() => {
    const next = { ...errors };
    fieldNames.forEach((fieldName) => {
      const legacyKey = `${effectIndex}-${fieldName}-override`;
      const categoryKey = `${effectIndex}-${fieldName}`;
      if (!next[categoryKey] && next[legacyKey]) {
        next[categoryKey] = next[legacyKey];
      }
    });
    return next;
  }, [errors, effectIndex, fieldNames]);

  return { effect, defaultEffect, normalizedErrors };
};
