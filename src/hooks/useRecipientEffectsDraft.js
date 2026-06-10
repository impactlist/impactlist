import { useEffect, useMemo, useState } from 'react';
import { applyRecipientEffectToBase, calculateCombinedCostPerLife } from '../utils/effectsCalculation';
import {
  buildRecipientEditableEffects,
  calculateEffectCostPerLife,
  getRecipientEffectsChangeState,
  haveEffectsChanged,
} from '../utils/effectEditorUtils';
import { getEffectType, validateRecipientEffectField } from '../utils/effectValidation';
import { getCurrentYear } from '../utils/donationDataHelpers';

/**
 * Draft state for editing one recipient category's effect overrides — the
 * single home for the logic previously duplicated between
 * RecipientEffectEditor and MultiCategoryRecipientEditor's sections.
 *
 * Drafts are wrappers ({effectId, overrides, multipliers, disabled}) holding
 * stringly in-progress values, each carrying an internal `_baseEffect`
 * reference for display/calculation. `_baseEffect` must never reach saved
 * state — use `getEffectsToSave()`, which reduces drafts to the minimal
 * wrapper shape.
 *
 * The UI is override-only: editing a field writes an override and removes any
 * multiplier for that field; clearing the input removes the override.
 */
const useRecipientEffectsDraft = ({
  recipientId,
  categoryId,
  category,
  globalParameters,
  previewYear,
  defaultAssumptions,
  userAssumptions,
}) => {
  const [effects, setEffects] = useState([]);
  const [errors, setErrors] = useState({});

  // The recipient's own default effect wrappers for this category.
  const defaultRecipientEffects = useMemo(
    () => defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects || [],
    [defaultAssumptions, recipientId, categoryId]
  );

  const baseCategoryEffects = useMemo(() => category?.effects || [], [category]);

  const baselineEffects = useMemo(() => {
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
    const userCategoryEffects = userAssumptions?.categories?.[categoryId]?.effects;
    return buildRecipientEditableEffects({
      baseCategoryEffects,
      defaultRecipientEffects,
      userRecipientEffects,
      userCategoryEffects,
    });
  }, [baseCategoryEffects, defaultRecipientEffects, userAssumptions, recipientId, categoryId]);

  // (Re)initialize drafts whenever the baseline changes (entity switch, save,
  // reset, external assumption load).
  useEffect(() => {
    setEffects(baselineEffects);
  }, [baselineEffects]);

  const toggleEffectDisabled = (effectIndex) => {
    setEffects((prev) => {
      const newEffects = [...prev];
      newEffects[effectIndex] = {
        ...newEffects[effectIndex],
        disabled: !newEffects[effectIndex].disabled,
      };
      return newEffects;
    });
  };

  const updateEffectField = (effectIndex, fieldName, value) => {
    setEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      // Replace BOTH nested maps with fresh objects: drafts initially share
      // them with the baseline (setEffects(baselineEffects)), so an in-place
      // delete would corrupt the baseline that hasUnsavedChanges diffs
      // against (e.g. silently erasing a default multiplier from it).
      const nextOverrides = { ...(effect.overrides || {}), [fieldName]: value };
      if (value === '' || value === null || value === undefined) {
        delete nextOverrides[fieldName];
      }
      const nextMultipliers = { ...(effect.multipliers || {}) };
      // Override-only UI: editing a field always removes multiplier mode for that field.
      delete nextMultipliers[fieldName];

      effect.overrides = nextOverrides;
      effect.multipliers = nextMultipliers;
      newEffects[effectIndex] = effect;
      return newEffects;
    });

    // Validate this field immediately (the effect's type comes from its base
    // effect, which never changes for a draft).
    const error = validateRecipientEffectField(
      fieldName,
      value,
      'override',
      getEffectType(effects[effectIndex]._baseEffect)
    );
    const errorKey = `${effectIndex}-${fieldName}-override`;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
        delete newErrors[`${effectIndex}-${fieldName}-multiplier`];
      }
      return newErrors;
    });
  };

  // Preview cost per life for each draft, applying in-progress overrides to
  // the base effect. Disabled at either level shows as Infinity.
  const effectCostPerLife = useMemo(() => {
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return effects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      if (baseEffect.disabled || effect.disabled) {
        return Infinity;
      }

      const effectToApply = {
        effectId: effect.effectId,
        overrides: { ...(effect.overrides || {}) },
        multipliers: { ...(effect.multipliers || {}) },
        disabled: effect.disabled,
      };

      if (Object.keys(effectToApply.overrides).length === 0) delete effectToApply.overrides;
      if (Object.keys(effectToApply.multipliers).length === 0) delete effectToApply.multipliers;

      const modifiedEffect = applyRecipientEffectToBase(baseEffect, effectToApply, `effect ${effect.effectId}`);
      return calculateEffectCostPerLife(modifiedEffect, globalParameters, yearForCalculation);
    });
  }, [effects, globalParameters, previewYear]);

  const combinedCostPerLife = useMemo(() => calculateCombinedCostPerLife(effectCostPerLife), [effectCostPerLife]);

  // The per-effect sources the input components compare against (recipient
  // default wrapper, category default, user's category-level edits).
  const effectInputSources = useMemo(
    () =>
      effects.map((effect) => ({
        defaultRecipientEffect: defaultRecipientEffects.find((e) => e.effectId === effect.effectId),
        defaultCategoryEffect: defaultAssumptions?.categories?.[categoryId]?.effects?.find(
          (e) => e.effectId === effect.effectId
        ),
        userCategoryEffect: userAssumptions?.categories?.[categoryId]?.effects?.find(
          (e) => e.effectId === effect.effectId
        ),
      })),
    [effects, defaultRecipientEffects, defaultAssumptions, userAssumptions, categoryId]
  );

  const hasTimeIntervals = useMemo(
    () =>
      effects.some((effect) => {
        const interval = effect._baseEffect?.validTimeInterval;
        return interval && (interval[0] !== null || interval[1] !== null);
      }),
    [effects]
  );

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const hasUnsavedChanges = useMemo(() => haveEffectsChanged(effects, baselineEffects), [effects, baselineEffects]);

  // Reduce drafts to the minimal save shape ({effectId, overrides,
  // multipliers, disabled} only — no `_baseEffect`, no unchanged effects).
  const getEffectsToSave = () => getRecipientEffectsChangeState(effects).effectsToSave;

  return {
    effects,
    errors,
    hasErrors,
    hasUnsavedChanges,
    hasTimeIntervals,
    effectCostPerLife,
    combinedCostPerLife,
    effectInputSources,
    toggleEffectDisabled,
    updateEffectField,
    getEffectsToSave,
  };
};

export default useRecipientEffectsDraft;
