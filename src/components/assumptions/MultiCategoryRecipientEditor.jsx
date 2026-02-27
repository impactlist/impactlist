import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import DisableToggleButton from '../shared/DisableToggleButton';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import { applyRecipientEffectToBase, calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import {
  buildRecipientEditableEffects,
  calculateEffectCostPerLife,
  getRecipientEffectsChangeState,
  haveEffectsChanged,
} from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { getEffectType, validateRecipientEffectField } from '../../utils/effectValidation';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import YearSelector from '../shared/YearSelector';

/**
 * A single category's effect section within the multi-category editor.
 * Manages its own effect state and reports changes to the parent.
 */
const CategoryEffectSection = ({
  recipientId,
  category,
  categoryId,
  globalParameters,
  previewYear,
  onEffectsChange,
  sectionRef,
}) => {
  const [tempEditToEffects, setTempEditToEffects] = useState([]);
  const [errors, setErrors] = useState({});
  const { defaultAssumptions, userAssumptions } = useAssumptions();

  // Get default effects for this recipient category
  const defaultRecipientEffects = useMemo(() => {
    if (!defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects) {
      return [];
    }
    return defaultAssumptions.recipients[recipientId].categories[categoryId].effects;
  }, [defaultAssumptions, recipientId, categoryId]);

  // Get base category effects for reference
  const baseCategoryEffects = useMemo(() => {
    if (!category?.effects) {
      return [];
    }
    return category.effects;
  }, [category]);

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

  // Initialize temp effects from recipient's current effects
  useEffect(() => {
    setTempEditToEffects(baselineEffects);
  }, [baselineEffects]);

  const hasUnsavedChanges = useMemo(() => {
    return haveEffectsChanged(tempEditToEffects, baselineEffects);
  }, [tempEditToEffects, baselineEffects]);

  const toggleEffectDisabled = (effectIndex) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      newEffects[effectIndex] = {
        ...newEffects[effectIndex],
        disabled: !newEffects[effectIndex].disabled,
      };
      return newEffects;
    });
  };

  const updateEffectField = (effectIndex, fieldName, value) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      if (!effect.overrides) effect.overrides = {};
      if (!effect.multipliers) effect.multipliers = {};

      effect.overrides = { ...effect.overrides, [fieldName]: value };

      if (value === '' || value === null || value === undefined) {
        delete effect.overrides[fieldName];
      }
      // Override-only UI: editing a field always removes multiplier mode for that field.
      delete effect.multipliers[fieldName];

      newEffects[effectIndex] = effect;
      return newEffects;
    });

    const error = validateRecipientEffectField(
      fieldName,
      value,
      'override',
      getEffectType(tempEditToEffects[effectIndex]._baseEffect)
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

  // Calculate cost per life for each effect
  const effectCostPerLife = useMemo(() => {
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect) => {
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
  }, [tempEditToEffects, globalParameters, previewYear]);

  // Calculate combined cost per life for this category
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Report changes to parent whenever effects or errors change
  useEffect(() => {
    onEffectsChange(categoryId, tempEditToEffects, errors, hasUnsavedChanges, combinedCostPerLife);
  }, [categoryId, tempEditToEffects, errors, hasUnsavedChanges, combinedCostPerLife, onEffectsChange]);

  return (
    <div ref={sectionRef} className="effect-card effect-card--flush effect-card--category-group mb-4 overflow-hidden">
      {/* Category header */}
      <div className="effect-card__category-header rounded-t-lg px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--text-strong)]">
            <Link to={`/category/${categoryId}`} className="assumptions-link">
              {category.name}
            </Link>
          </h3>
          {/* Only show combined cost when there are multiple effects */}
          {tempEditToEffects.length > 1 && (
            <div className="effect-card__summary">
              <span>Combined cost per life: </span>
              <span
                className={
                  combinedCostPerLife === Infinity || combinedCostPerLife < 0
                    ? 'effect-card__summary-value effect-card__summary-value--invalid'
                    : 'effect-card__summary-value'
                }
              >
                {combinedCostPerLife === Infinity ? '∞' : formatCurrency(combinedCostPerLife)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Effects list */}
      <div className="effect-card__category-body p-3 space-y-3">
        {tempEditToEffects.map((effect, index) => {
          const baseEffect = effect._baseEffect;
          const effectType = getEffectType(baseEffect);
          const costPerLife = effectCostPerLife[index];

          const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
          const defaultCategoryEffect = defaultAssumptions?.categories?.[categoryId]?.effects?.find(
            (e) => e.effectId === effect.effectId
          );
          const userCategoryEffect = userAssumptions?.categories?.[categoryId]?.effects?.find(
            (e) => e.effectId === effect.effectId
          );

          const isDisabledByCategory = baseEffect?.disabled || false;
          const isDisabledByRecipient = effect.disabled || false;
          const isFullyDisabled = isDisabledByCategory || isDisabledByRecipient;

          return (
            <div key={effect.effectId} className="effect-card effect-card--section transition-all duration-200">
              <div className="mb-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`effect-card__title ${isFullyDisabled ? 'effect-disabled' : ''}`}>
                      Effect {index + 1}: {effect.effectId}
                    </h4>
                    {!isDisabledByCategory && (
                      <DisableToggleButton
                        isDisabled={isDisabledByRecipient}
                        onToggle={() => toggleEffectDisabled(index)}
                      />
                    )}
                    {isDisabledByCategory && (
                      <span className={`effect-card__disabled-note ${isFullyDisabled ? 'effect-disabled' : ''}`}>
                        (Disabled in category)
                      </span>
                    )}
                  </div>
                  <div className={isFullyDisabled ? 'effect-disabled' : ''}>
                    <EffectCostDisplay cost={costPerLife} showInfinity={true} className="text-sm whitespace-nowrap" />
                  </div>
                </div>
                {baseEffect?.validTimeInterval && (
                  <p className={`effect-card__meta mt-1 ${isFullyDisabled ? 'effect-disabled' : ''}`}>
                    Active:{' '}
                    {baseEffect.validTimeInterval[0] === null
                      ? `Until ${baseEffect.validTimeInterval[1]}`
                      : `${baseEffect.validTimeInterval[0]} - ${baseEffect.validTimeInterval[1] || 'present'}`}
                    {(previewYear < baseEffect.validTimeInterval[0] ||
                      (baseEffect.validTimeInterval[1] && previewYear > baseEffect.validTimeInterval[1])) && (
                      <span className="effect-card__meta--inactive ml-2">(Not active in {previewYear})</span>
                    )}
                  </p>
                )}
              </div>

              <div className={isFullyDisabled ? 'effect-disabled-content' : ''}>
                {effectType === 'qaly' ? (
                  <RecipientQalyEffectInputs
                    effectIndex={index}
                    defaultCategoryEffect={defaultCategoryEffect}
                    userCategoryEffect={userCategoryEffect}
                    defaultRecipientEffect={defaultRecipientEffect}
                    errors={errors}
                    overrides={effect.overrides}
                    multipliers={effect.multipliers}
                    onChange={updateEffectField}
                    globalParameters={globalParameters}
                    isDisabled={isFullyDisabled}
                  />
                ) : effectType === 'population' ? (
                  <RecipientPopulationEffectInputs
                    effectIndex={index}
                    defaultCategoryEffect={defaultCategoryEffect}
                    userCategoryEffect={userCategoryEffect}
                    defaultRecipientEffect={defaultRecipientEffect}
                    errors={errors}
                    overrides={effect.overrides}
                    multipliers={effect.multipliers}
                    onChange={updateEffectField}
                    globalParameters={globalParameters}
                    isDisabled={isFullyDisabled}
                  />
                ) : (
                  <div className="text-sm text-[var(--danger)]">Unknown effect type</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CategoryEffectSection.propTypes = {
  recipientId: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onEffectsChange: PropTypes.func.isRequired,
  sectionRef: PropTypes.object,
};

/**
 * Component for editing effects across all categories of a multi-category recipient.
 * Renders a scrollable list of category sections, each containing its own effect editor.
 */
const MultiCategoryRecipientEditor = ({
  recipient,
  recipientId,
  categories,
  activeCategory,
  globalParameters,
  onSave,
  onCancel,
}) => {
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
  const [categoryData, setCategoryData] = useState({});
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);
  // Keep hook usage consistent with other editors even though defaults aren't needed here
  useAssumptions();

  // Scroll to active category on mount
  useEffect(() => {
    if (activeCategory && sectionRefs.current[activeCategory] && scrollContainerRef.current) {
      // Small delay to ensure refs are set
      setTimeout(() => {
        sectionRefs.current[activeCategory]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeCategory]);

  // Handle effects change from a category section
  const handleEffectsChange = useCallback((categoryId, effects, errors, hasUnsavedChanges, combinedCostPerLife) => {
    setCategoryData((prev) => ({
      ...prev,
      [categoryId]: { effects, errors, hasUnsavedChanges, combinedCostPerLife },
    }));
  }, []);

  // Check if any category has errors
  const hasErrors = useMemo(() => {
    return Object.values(categoryData).some((data) => Object.keys(data.errors || {}).length > 0);
  }, [categoryData]);

  const hasUnsavedChanges = useMemo(() => {
    return Object.values(categoryData).some((data) => data.hasUnsavedChanges);
  }, [categoryData]);

  // Handle save - collect and clean effects from all categories
  const handleSave = () => {
    if (hasErrors || !hasUnsavedChanges) return;

    const allCategoryEffects = {};

    Object.entries(categoryData).forEach(([categoryId, data]) => {
      const { effects } = data;
      if (!effects) return;

      const { effectsToSave } = getRecipientEffectsChangeState(effects);

      if (effectsToSave.length > 0) {
        allCategoryEffects[categoryId] = effectsToSave;
      }
    });

    onSave(allCategoryEffects);
  };

  // Check if any category has time intervals
  const hasTimeIntervals = useMemo(() => {
    return categories.some(({ category }) =>
      category?.effects?.some(
        (effect) =>
          effect?.validTimeInterval && (effect.validTimeInterval[0] !== null || effect.validTimeInterval[1] !== null)
      )
    );
  }, [categories]);

  const recipientCombinedCostPerLife = useMemo(() => {
    if (categories.length === 0) {
      return undefined;
    }

    let totalWeightedCost = 0;
    let totalWeight = 0;

    for (const { categoryId } of categories) {
      const cost = categoryData[categoryId]?.combinedCostPerLife;
      if (typeof cost !== 'number') {
        return undefined;
      }

      const fraction = recipient?.categories?.[categoryId]?.fraction ?? 0;
      if (cost !== Infinity && fraction > 0) {
        totalWeightedCost += cost * fraction;
        totalWeight += fraction;
      }
    }

    if (totalWeight === 0) {
      return Infinity;
    }

    return totalWeightedCost / totalWeight;
  }, [categories, categoryData, recipient]);

  return (
    <div className="assumptions-shell assumptions-shell--editor overflow-hidden">
      <EffectEditorHeader
        title={
          <>
            Edit effects for recipient
            <InfoTooltipIcon
              className="effect-editor-help"
              content="See the FAQ to learn how to edit these assumptions, and for a description of what effects are."
            />{' '}
            :{' '}
            <Link to={`/recipient/${recipientId}`} className="assumptions-link">
              {recipient.name}
            </Link>
          </>
        }
        description={
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-muted)]">{categories.length} categories</span>
            {hasTimeIntervals && (
              <YearSelector
                value={previewYear}
                onChange={setPreviewYear}
                label="Preview for year:"
                id="multi-category-preview-year"
              />
            )}
          </div>
        }
        combinedCostPerLife={recipientCombinedCostPerLife}
        showCombinedCost={categories.length > 1}
      />

      {/* Scrollable container for all category sections */}
      <div ref={scrollContainerRef} className="px-3 py-2">
        {categories.map(({ categoryId, category }) => (
          <CategoryEffectSection
            key={categoryId}
            recipientId={recipientId}
            category={category}
            categoryId={categoryId}
            globalParameters={globalParameters}
            previewYear={previewYear}
            onEffectsChange={handleEffectsChange}
            sectionRef={(el) => {
              sectionRefs.current[categoryId] = el;
            }}
          />
        ))}
      </div>

      <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} disabled={!hasUnsavedChanges} />
    </div>
  );
};

MultiCategoryRecipientEditor.propTypes = {
  recipient: PropTypes.object.isRequired,
  recipientId: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      category: PropTypes.object.isRequired,
    })
  ).isRequired,
  activeCategory: PropTypes.string,
  globalParameters: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default MultiCategoryRecipientEditor;
