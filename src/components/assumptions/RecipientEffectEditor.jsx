import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import DisableToggleButton from '../shared/DisableToggleButton';
import { applyRecipientEffectToBase, calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import { calculateEffectCostPerLife } from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { getEffectType, validateRecipientEffectField, cleanAndParseValue } from '../../utils/effectValidation';
import { getEffectFieldNames } from '../../constants/effectFieldDefinitions';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import YearSelector from '../shared/YearSelector';

/**
 * Component for editing all effects of a recipient's category
 */
const RecipientEffectEditor = ({
  recipient,
  recipientId,
  category,
  categoryId,
  globalParameters,
  onSave,
  onCancel,
}) => {
  const [tempEditToEffects, setTempEditToEffects] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
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
    // Get user's actual values (not merged with defaults)
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    // Always start with base structure
    const initialEffects = baseCategoryEffects.map((effect) => {
      const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
      const userEffect = userRecipientEffects?.find((e) => e.effectId === effect.effectId);

      // Merge user values with default recipient values
      // Default recipient values should appear as actual editable values
      let effectOverrides = {};
      let effectMultipliers = {};

      // Start with default recipient values as the base
      if (defaultRecipientEffect?.overrides) {
        effectOverrides = { ...defaultRecipientEffect.overrides };
      }
      if (defaultRecipientEffect?.multipliers) {
        effectMultipliers = { ...defaultRecipientEffect.multipliers };
      }

      // Merge user values on top (field by field, not wholesale replacement)
      if (userEffect) {
        if (userEffect.overrides) {
          // Merge user overrides with default overrides
          Object.keys(userEffect.overrides).forEach((field) => {
            // User override takes precedence
            effectOverrides[field] = userEffect.overrides[field];
            // Clear any multiplier for this field
            delete effectMultipliers[field];
          });
        }
        if (userEffect.multipliers) {
          // Merge user multipliers with default multipliers
          Object.keys(userEffect.multipliers).forEach((field) => {
            // User multiplier takes precedence
            effectMultipliers[field] = userEffect.multipliers[field];
            // Clear any override for this field
            delete effectOverrides[field];
          });
        }
      }

      return {
        effectId: effect.effectId,
        overrides: effectOverrides,
        multipliers: effectMultipliers,
        disabled: userEffect?.disabled || defaultRecipientEffect?.disabled || false,
        // Keep base values for reference during editing
        _baseEffect: effect,
        _defaultRecipientEffect: defaultRecipientEffect,
        _userEffect: userEffect,
      };
    });

    setTempEditToEffects(initialEffects);

    // Initialize field modes based on the initial effects
    const modes = {};
    initialEffects.forEach((effect, effectIndex) => {
      const fieldNames = getEffectFieldNames(effect._baseEffect);
      fieldNames.forEach((fieldName) => {
        const modeKey = `${effectIndex}-${fieldName}`;
        // Check if there's an override or multiplier to determine initial mode
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
          modes[modeKey] = 'override'; // Default to override mode
        }
      });
    });
    setFieldModes(modes);
  }, [recipientId, categoryId, baseCategoryEffects, defaultRecipientEffects, userAssumptions]);

  // Toggle disabled state for a recipient effect
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

  // Handle mode change for a field
  const handleModeChange = (effectIndex, fieldName, newMode) => {
    const modeKey = `${effectIndex}-${fieldName}`;
    setFieldModes((prev) => ({
      ...prev,
      [modeKey]: newMode,
    }));
  };

  // Update a specific field of an effect
  const updateEffectField = (effectIndex, fieldName, type, value) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      // Initialize objects if needed
      if (!effect.overrides) effect.overrides = {};
      if (!effect.multipliers) effect.multipliers = {};

      if (type === 'override') {
        effect.overrides = { ...effect.overrides, [fieldName]: value };
      } else if (type === 'multiplier') {
        effect.multipliers = { ...effect.multipliers, [fieldName]: value };
      }

      // Clean up empty values
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

    // Validate this field immediately
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
    // Use current year if previewYear is empty or invalid
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      // Check if effect is disabled at either category or recipient level
      if (baseEffect.disabled || effect.disabled) {
        return Infinity;
      }

      // Build a clean effect to apply based on selected modes
      const effectToApply = {
        effectId: effect.effectId,
        overrides: {},
        multipliers: {},
      };

      const fieldNames = getEffectFieldNames(baseEffect);
      fieldNames.forEach((fieldName) => {
        const modeKey = `${tempEditToEffects.indexOf(effect)}-${fieldName}`;
        const selectedMode = fieldModes[modeKey] || 'override';

        if (selectedMode === 'override') {
          const value = effect.overrides?.[fieldName];
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.overrides[fieldName] = value;
          } else {
            // If override is empty, check for a default recipient value
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
            // If multiplier is empty, check for a default recipient value
            const defaultValue = effect._defaultRecipientEffect?.multipliers?.[fieldName];
            if (defaultValue !== '' && defaultValue !== null && defaultValue !== undefined) {
              effectToApply.multipliers[fieldName] = defaultValue;
            }
          }
        }
      });

      // Create modified effect with overrides/multipliers applied
      const modifiedEffect = applyRecipientEffectToBase(baseEffect, effectToApply, `effect ${effect.effectId}`);
      return calculateEffectCostPerLife(modifiedEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear, fieldModes]);

  // Calculate base cost per life for each effect (without recipient-specific overrides)
  const baseEffectCostPerLife = useMemo(() => {
    // Use current year if previewYear is empty or invalid
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      // Calculate cost using only the base category effect
      return calculateEffectCostPerLife(baseEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Check if any base effects have time intervals
  const hasTimeIntervals = useMemo(() => {
    return tempEditToEffects.some((effect) => {
      const baseEffect = effect._baseEffect;
      return (
        baseEffect?.validTimeInterval &&
        (baseEffect.validTimeInterval[0] !== null || baseEffect.validTimeInterval[1] !== null)
      );
    });
  }, [tempEditToEffects]);

  // Check if there are any errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Handle save
  const handleSave = () => {
    if (hasErrors) {
      return;
    }

    // Clean up effects for saving
    const effectsToSave = tempEditToEffects
      .map((effect, effectIndex) => {
        const cleanEffect = {
          effectId: effect.effectId,
          overrides: {},
          multipliers: {},
          disabled: effect.disabled || false,
        };

        // Get field names for this effect
        const fieldNames = getEffectFieldNames(effect._baseEffect);

        // Check if there were any default recipient values or user values
        const defaultRecipientEffect = effect._defaultRecipientEffect;
        const userEffect = effect._userEffect;

        // Track if we need to save this effect (even with empty values) to clear defaults
        let needsClearing = false;

        // Process each field based on its selected mode
        fieldNames.forEach((fieldName) => {
          const modeKey = `${effectIndex}-${fieldName}`;
          const selectedMode = fieldModes[modeKey] || 'override';

          // Check if there was any default or user value that might need clearing
          const hadDefaultOverride = defaultRecipientEffect?.overrides?.[fieldName];
          const hadDefaultMultiplier = defaultRecipientEffect?.multipliers?.[fieldName];
          const hadUserOverride = userEffect?.overrides?.[fieldName];
          const hadUserMultiplier = userEffect?.multipliers?.[fieldName];

          if (selectedMode === 'override') {
            // Save override value if it exists and mode is 'override'
            const value = effect.overrides?.[fieldName];
            if (value !== null && value !== undefined && value !== '') {
              const { numValue } = cleanAndParseValue(value);
              if (!isNaN(numValue)) {
                cleanEffect.overrides[fieldName] = numValue;
              } else {
                throw new Error(
                  `Failed to convert override ${fieldName} to number in effect ${effect.effectId}. Value: "${value}"`
                );
              }
            } else {
              // Empty override - check if we're clearing any existing value
              if (hadDefaultOverride || hadUserOverride || hadDefaultMultiplier || hadUserMultiplier) {
                // User has cleared a field that had a value - need to save this clearing
                needsClearing = true;
              }
            }
          } else if (selectedMode === 'multiplier') {
            // Save multiplier value if it exists and mode is 'multiplier'
            const value = effect.multipliers?.[fieldName];
            if (value !== null && value !== undefined && value !== '') {
              const { numValue } = cleanAndParseValue(value);
              if (!isNaN(numValue)) {
                cleanEffect.multipliers[fieldName] = numValue;
              } else {
                throw new Error(
                  `Failed to convert multiplier ${fieldName} to number in effect ${effect.effectId}. Value: "${value}"`
                );
              }
            } else {
              // Empty multiplier - check if we're clearing any existing value
              if (hadDefaultMultiplier || hadUserMultiplier || hadDefaultOverride || hadUserOverride) {
                // User has cleared a field that had a value - need to save this clearing
                needsClearing = true;
              }
            }
          }
        });

        // Include effect if it has values, is disabled, or needs clearing
        if (
          Object.keys(cleanEffect.overrides).length > 0 ||
          Object.keys(cleanEffect.multipliers).length > 0 ||
          cleanEffect.disabled ||
          needsClearing
        ) {
          return cleanEffect;
        }
        return null;
      })
      .filter(Boolean);

    onSave(effectsToSave);
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex flex-col flex-1 min-h-0 border border-gray-300 rounded-lg bg-white shadow-sm">
        <EffectEditorHeader
          title={`Edit Effects: ${recipient.name} - ${category.name}`}
          description={
            <div>
              <p>
                Set at most one value (override or multiplier) for each parameter. An override replaces the default
                value for the category, while a multiplier multiplies the default category value. These are the
                underlying parameters that are used to compute the cost per life.
              </p>
              {tempEditToEffects.length > 1 && hasTimeIntervals && (
                <div className="flex items-center gap-2 mt-2">
                  <YearSelector
                    value={previewYear}
                    onChange={setPreviewYear}
                    label="Preview calculations for year:"
                    id="recipient-effect-preview-year"
                    className=""
                  />
                </div>
              )}
            </div>
          }
          combinedCostPerLife={combinedCostPerLife}
          showCombinedCost={false}
          onClose={onCancel}
        />

        {/* Effects List */}
        <div className="overflow-y-auto px-3 py-2 max-h-[calc(80vh-300px)]">
          {/* Cost per life display - only show when there are multiple effects */}
          {tempEditToEffects.length > 1 && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-medium text-gray-800">
                Combined cost per life:{' '}
                <span className={combinedCostPerLife === Infinity ? 'text-red-600' : 'text-green-600'}>
                  ${combinedCostPerLife === Infinity ? '∞' : formatCurrency(combinedCostPerLife).replace('$', '')}
                </span>
              </div>
            </div>
          )}

          {/* Effects */}
          <div className="space-y-3">
            {tempEditToEffects.map((effect, index) => {
              const baseEffect = effect._baseEffect;
              const effectType = getEffectType(baseEffect);
              const costPerLife = effectCostPerLife[index];
              const baseCost = baseEffectCostPerLife[index];

              // Get all the different effect sources for the input components
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
                <div
                  key={effect.effectId}
                  className={`border border-gray-400 rounded-lg p-3 transition-all duration-200`}
                >
                  <div className="mb-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className="text-lg font-medium text-gray-800 whitespace-nowrap"
                          style={isFullyDisabled ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                        >
                          Effect {index + 1}: {effect.effectId}
                        </h3>
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

                  <div
                    style={isFullyDisabled ? { pointerEvents: 'none', filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                  >
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

        <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} />
      </div>
    </div>
  );
};

RecipientEffectEditor.propTypes = {
  recipient: PropTypes.object.isRequired,
  recipientId: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RecipientEffectEditor;
