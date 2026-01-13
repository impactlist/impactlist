import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import DisableToggleButton from '../shared/DisableToggleButton';
import { applyRecipientEffectToBase, calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import { calculateEffectCostPerLife, sortEffectsByActiveDate } from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { getEffectType, validateRecipientEffectField, cleanAndParseValue } from '../../utils/effectValidation';
import { getEffectFieldNames } from '../../constants/effectFieldDefinitions';
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
  const [fieldModes, setFieldModes] = useState({});
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

  // Initialize temp effects from recipient's current effects
  useEffect(() => {
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    const initialEffects = baseCategoryEffects.map((effect) => {
      const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
      const userEffect = userRecipientEffects?.find((e) => e.effectId === effect.effectId);

      let effectOverrides = {};
      let effectMultipliers = {};

      if (defaultRecipientEffect?.overrides) {
        effectOverrides = { ...defaultRecipientEffect.overrides };
      }
      if (defaultRecipientEffect?.multipliers) {
        effectMultipliers = { ...defaultRecipientEffect.multipliers };
      }

      if (userEffect) {
        if (userEffect.overrides) {
          Object.keys(userEffect.overrides).forEach((field) => {
            effectOverrides[field] = userEffect.overrides[field];
            delete effectMultipliers[field];
          });
        }
        if (userEffect.multipliers) {
          Object.keys(userEffect.multipliers).forEach((field) => {
            effectMultipliers[field] = userEffect.multipliers[field];
            delete effectOverrides[field];
          });
        }
      }

      return {
        effectId: effect.effectId,
        overrides: effectOverrides,
        multipliers: effectMultipliers,
        disabled: userEffect?.disabled || defaultRecipientEffect?.disabled || false,
        _baseEffect: effect,
        _defaultRecipientEffect: defaultRecipientEffect,
        _userEffect: userEffect,
      };
    });

    const sortedEffects = sortEffectsByActiveDate(initialEffects);
    setTempEditToEffects(sortedEffects);

    // Initialize field modes
    const modes = {};
    sortedEffects.forEach((effect, effectIndex) => {
      const fieldNames = getEffectFieldNames(effect._baseEffect);
      fieldNames.forEach((fieldName) => {
        const modeKey = `${effectIndex}-${fieldName}`;
        if (
          effect.overrides &&
          effect.overrides[fieldName] !== undefined &&
          effect.overrides[fieldName] !== null &&
          effect.overrides[fieldName] !== ''
        ) {
          modes[modeKey] = 'override';
        } else if (
          effect.multipliers &&
          effect.multipliers[fieldName] !== undefined &&
          effect.multipliers[fieldName] !== null &&
          effect.multipliers[fieldName] !== ''
        ) {
          modes[modeKey] = 'multiplier';
        } else {
          modes[modeKey] = 'override';
        }
      });
    });
    setFieldModes(modes);
  }, [recipientId, categoryId, baseCategoryEffects, defaultRecipientEffects, userAssumptions]);

  // Report changes to parent whenever effects or errors change
  useEffect(() => {
    onEffectsChange(categoryId, tempEditToEffects, errors, fieldModes);
  }, [categoryId, tempEditToEffects, errors, fieldModes, onEffectsChange]);

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

  const handleModeChange = (effectIndex, fieldName, newMode) => {
    const modeKey = `${effectIndex}-${fieldName}`;
    setFieldModes((prev) => ({
      ...prev,
      [modeKey]: newMode,
    }));
  };

  const updateEffectField = (effectIndex, fieldName, type, value) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      if (!effect.overrides) effect.overrides = {};
      if (!effect.multipliers) effect.multipliers = {};

      if (type === 'override') {
        effect.overrides = { ...effect.overrides, [fieldName]: value };
      } else if (type === 'multiplier') {
        effect.multipliers = { ...effect.multipliers, [fieldName]: value };
      }

      if (value === '' || value === null || value === undefined) {
        if (type === 'override') {
          delete effect.overrides[fieldName];
        } else {
          delete effect.multipliers[fieldName];
        }
      }

      newEffects[effectIndex] = effect;
      return newEffects;
    });

    const error = validateRecipientEffectField(
      fieldName,
      value,
      type,
      getEffectType(tempEditToEffects[effectIndex]._baseEffect)
    );
    const errorKey = `${effectIndex}-${fieldName}-${type}`;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
      return newErrors;
    });
  };

  // Calculate cost per life for each effect
  const effectCostPerLife = useMemo(() => {
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect, effectIndex) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      if (baseEffect.disabled || effect.disabled) {
        return Infinity;
      }

      const effectToApply = {
        effectId: effect.effectId,
        overrides: {},
        multipliers: {},
      };

      const fieldNames = getEffectFieldNames(baseEffect);
      fieldNames.forEach((fieldName) => {
        const modeKey = `${effectIndex}-${fieldName}`;
        const selectedMode = fieldModes[modeKey] || 'override';

        if (selectedMode === 'override') {
          const value = effect.overrides?.[fieldName];
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.overrides[fieldName] = value;
          } else {
            const defaultValue = effect._defaultRecipientEffect?.overrides?.[fieldName];
            if (defaultValue !== '' && defaultValue !== null && defaultValue !== undefined) {
              effectToApply.overrides[fieldName] = defaultValue;
            }
          }
        } else if (selectedMode === 'multiplier') {
          const value = effect.multipliers?.[fieldName];
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.multipliers[fieldName] = value;
          } else {
            const defaultValue = effect._defaultRecipientEffect?.multipliers?.[fieldName];
            if (defaultValue !== '' && defaultValue !== null && defaultValue !== undefined) {
              effectToApply.multipliers[fieldName] = defaultValue;
            }
          }
        }
      });

      const modifiedEffect = applyRecipientEffectToBase(baseEffect, effectToApply, `effect ${effect.effectId}`);
      return calculateEffectCostPerLife(modifiedEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear, fieldModes]);

  // Calculate base cost per life for each effect
  const baseEffectCostPerLife = useMemo(() => {
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;
      return calculateEffectCostPerLife(baseEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear]);

  // Calculate combined cost per life for this category
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  return (
    <div ref={sectionRef} className="rounded-lg bg-white shadow-sm mb-4">
      {/* Category header */}
      <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            <Link to={`/category/${categoryId}`} className="text-blue-600 hover:underline">
              {category.name}
            </Link>
          </h3>
          {/* Only show combined cost when there are multiple effects */}
          {tempEditToEffects.length > 1 && (
            <div className="text-sm">
              <span className="text-gray-600">Combined cost per life: </span>
              <span
                className={
                  combinedCostPerLife === Infinity || combinedCostPerLife < 0
                    ? 'text-red-600 font-medium'
                    : 'text-green-600 font-medium'
                }
              >
                {combinedCostPerLife === Infinity ? '∞' : formatCurrency(combinedCostPerLife)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Effects list */}
      <div className="p-3 space-y-3">
        {tempEditToEffects.map((effect, index) => {
          const baseEffect = effect._baseEffect;
          const effectType = getEffectType(baseEffect);
          const costPerLife = effectCostPerLife[index];
          const baseCost = baseEffectCostPerLife[index];

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
            <div key={effect.effectId} className="rounded-lg p-3 shadow-sm bg-gray-50 transition-all duration-200">
              <div className="mb-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className="text-base font-medium text-gray-800 whitespace-nowrap"
                      style={isFullyDisabled ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                    >
                      Effect {index + 1}: {effect.effectId}
                    </h4>
                    {!isDisabledByCategory && (
                      <DisableToggleButton
                        isDisabled={isDisabledByRecipient}
                        onToggle={() => toggleEffectDisabled(index)}
                        className={isDisabledByRecipient ? 'enable-button' : ''}
                        style={{ pointerEvents: 'auto' }}
                      />
                    )}
                    {isDisabledByCategory && (
                      <span className="text-xs text-gray-500" style={{ filter: 'grayscale(100%)', opacity: 0.6 }}>
                        (Disabled in category)
                      </span>
                    )}
                  </div>
                  <div style={isFullyDisabled ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}>
                    <EffectCostDisplay
                      cost={costPerLife}
                      baseCost={baseCost}
                      showInfinity={true}
                      className="text-sm whitespace-nowrap"
                    />
                  </div>
                </div>
                {baseEffect?.validTimeInterval && (
                  <p
                    className="text-xs text-gray-500 mt-1"
                    style={isFullyDisabled ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                  >
                    Active:{' '}
                    {baseEffect.validTimeInterval[0] === null
                      ? `Until ${baseEffect.validTimeInterval[1]}`
                      : `${baseEffect.validTimeInterval[0]} - ${baseEffect.validTimeInterval[1] || 'present'}`}
                    {(previewYear < baseEffect.validTimeInterval[0] ||
                      (baseEffect.validTimeInterval[1] && previewYear > baseEffect.validTimeInterval[1])) && (
                      <span className="ml-2 text-orange-600">(Not active in {previewYear})</span>
                    )}
                  </p>
                )}
              </div>

              <div style={isFullyDisabled ? { pointerEvents: 'none', filter: 'grayscale(100%)', opacity: 0.6 } : {}}>
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
                    onModeChange={handleModeChange}
                    fieldModes={fieldModes}
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
                    onModeChange={handleModeChange}
                    fieldModes={fieldModes}
                    globalParameters={globalParameters}
                    isDisabled={isFullyDisabled}
                  />
                ) : (
                  <div className="text-sm text-red-600">Unknown effect type</div>
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
  const handleEffectsChange = useCallback((categoryId, effects, errors, fieldModes) => {
    setCategoryData((prev) => ({
      ...prev,
      [categoryId]: { effects, errors, fieldModes },
    }));
  }, []);

  // Check if any category has errors
  const hasErrors = useMemo(() => {
    return Object.values(categoryData).some((data) => Object.keys(data.errors || {}).length > 0);
  }, [categoryData]);

  // Helper function to check if two values are meaningfully different
  const isDifferentFromDefault = (currentValue, defaultValue) => {
    if (
      (currentValue === null || currentValue === undefined || currentValue === '') &&
      (defaultValue === null || defaultValue === undefined || defaultValue === '')
    ) {
      return false;
    }

    if (
      currentValue === null ||
      currentValue === undefined ||
      currentValue === '' ||
      defaultValue === null ||
      defaultValue === undefined ||
      defaultValue === ''
    ) {
      return true;
    }

    const current = parseFloat(currentValue);
    const defaultNum = parseFloat(defaultValue);

    if (isNaN(current) || isNaN(defaultNum)) {
      return currentValue !== defaultValue;
    }

    return Math.abs(current - defaultNum) >= 0.0001;
  };

  // Handle save - collect and clean effects from all categories
  const handleSave = () => {
    if (hasErrors) return;

    const allCategoryEffects = {};

    Object.entries(categoryData).forEach(([categoryId, data]) => {
      const { effects, fieldModes } = data;
      if (!effects) return;

      const effectsToSave = effects
        .map((effect, effectIndex) => {
          const cleanEffect = {
            effectId: effect.effectId,
            overrides: {},
            multipliers: {},
            disabled: effect.disabled || false,
          };

          const fieldNames = getEffectFieldNames(effect._baseEffect);
          const defaultRecipientEffect = effect._defaultRecipientEffect;
          const userEffect = effect._userEffect;
          const defaultDisabled = defaultRecipientEffect?.disabled || false;
          const userDisabled = userEffect?.disabled;
          const currentDisabled = effect.disabled || false;
          const disabledDiffersFromDefault = currentDisabled !== defaultDisabled;
          // Also need to clear if user had a custom disabled value that's now reverted
          const userHadDisabledOverride = userDisabled !== undefined;
          const disabledNeedsClearing = userHadDisabledOverride && currentDisabled === defaultDisabled;

          let needsClearing = disabledNeedsClearing;

          fieldNames.forEach((fieldName) => {
            const modeKey = `${effectIndex}-${fieldName}`;
            const selectedMode = fieldModes[modeKey] || 'override';

            const currentValue =
              selectedMode === 'override' ? effect.overrides?.[fieldName] : effect.multipliers?.[fieldName];

            const defaultValue =
              selectedMode === 'override'
                ? defaultRecipientEffect?.overrides?.[fieldName]
                : defaultRecipientEffect?.multipliers?.[fieldName];

            // Check if user previously had a custom value for this field
            const userHadOverride =
              userEffect?.overrides?.[fieldName] !== undefined && userEffect?.overrides?.[fieldName] !== null;
            const userHadMultiplier =
              userEffect?.multipliers?.[fieldName] !== undefined && userEffect?.multipliers?.[fieldName] !== null;
            const userHadCustomValue = selectedMode === 'override' ? userHadOverride : userHadMultiplier;

            if (isDifferentFromDefault(currentValue, defaultValue)) {
              if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
                const { numValue } = cleanAndParseValue(currentValue);
                if (!isNaN(numValue)) {
                  if (selectedMode === 'override') {
                    cleanEffect.overrides[fieldName] = numValue;
                  } else {
                    cleanEffect.multipliers[fieldName] = numValue;
                  }
                }
              } else {
                if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
                  needsClearing = true;
                }
              }
            } else if (
              userHadCustomValue &&
              (currentValue === null || currentValue === undefined || currentValue === '')
            ) {
              // User had a custom value but now cleared it - need to clear even if default is also empty
              needsClearing = true;
            }
          });

          if (
            Object.keys(cleanEffect.overrides).length > 0 ||
            Object.keys(cleanEffect.multipliers).length > 0 ||
            disabledDiffersFromDefault ||
            needsClearing
          ) {
            if (!disabledDiffersFromDefault) {
              delete cleanEffect.disabled;
            }
            return cleanEffect;
          }
          return null;
        })
        .filter(Boolean);

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

  return (
    <div className="flex flex-col flex-1 min-h-0 p-2">
      <div className="flex flex-col flex-1 min-h-0 rounded-lg bg-white shadow-md">
        <EffectEditorHeader
          title={
            <>
              Edit effects for recipient
              <span className="group align-middle">
                <span className="text-sm text-gray-500 cursor-help ml-1 align-top">ⓘ</span>
                <span className="invisible group-hover:visible absolute left-6 z-50 p-2 mt-1 w-72 max-w-[calc(100%-3rem)] text-xs font-normal text-white bg-gray-800 rounded-lg shadow-lg">
                  See the FAQ to learn how to edit these assumptions, and for a description of what effects are.
                </span>
              </span>{' '}
              :{' '}
              <Link to={`/recipient/${recipientId}`} className="text-blue-600 hover:underline">
                {recipient.name}
              </Link>
            </>
          }
          description={
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{categories.length} categories</span>
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
          showCombinedCost={false}
        />

        {/* Scrollable container for all category sections */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-2 overscroll-contain">
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

        <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} />
      </div>
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
