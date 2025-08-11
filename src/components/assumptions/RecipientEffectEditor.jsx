import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import { applyRecipientEffectToBase } from '../../utils/effectsCalculation';
import { calculateEffectCostPerLife, calculateCombinedCostPerLife } from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import {
  getEffectType,
  validateRecipientEffectField,
  validateRecipientEffects,
  cleanAndParseValue,
} from '../../utils/effectValidation';
import { useAssumptions } from '../../contexts/AssumptionsContext';

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
  const [tempEffects, setTempEffects] = useState([]);
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

  // Initialize temp effects from recipient's current effects
  useEffect(() => {
    // Get user's actual values (not merged with defaults)
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    // Always start with base structure
    const initialEffects = baseCategoryEffects.map((effect) => {
      const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
      const userEffect = userRecipientEffects?.find((e) => e.effectId === effect.effectId);

      return {
        effectId: effect.effectId,
        // Only use user values if they exist, otherwise empty (defaults show as placeholders)
        overrides: userEffect?.overrides || {},
        multipliers: userEffect?.multipliers || {},
        // Keep base values for reference during editing
        _baseEffect: effect,
        _defaultRecipientEffect: defaultRecipientEffect,
      };
    });

    setTempEffects(initialEffects);
  }, [recipientId, categoryId, baseCategoryEffects, defaultRecipientEffects, userAssumptions]);

  // Validate all effects on mount and when effects change
  useEffect(() => {
    if (tempEffects.length > 0) {
      const validation = validateRecipientEffects(tempEffects);
      setErrors(validation.errors);
    }
  }, [tempEffects]);

  // Update a specific field of an effect
  const updateEffectField = (effectIndex, fieldName, type, value) => {
    setTempEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      // Initialize objects if needed
      if (!effect.overrides) effect.overrides = {};
      if (!effect.multipliers) effect.multipliers = {};

      if (type === 'override') {
        effect.overrides = { ...effect.overrides, [fieldName]: value };
        // Clear multiplier when setting override
        if (value !== '' && value !== null && value !== undefined) {
          effect.multipliers = { ...effect.multipliers };
          delete effect.multipliers[fieldName];
        }
      } else if (type === 'multiplier') {
        effect.multipliers = { ...effect.multipliers, [fieldName]: value };
        // Clear override when setting multiplier
        if (value !== '' && value !== null && value !== undefined) {
          effect.overrides = { ...effect.overrides };
          delete effect.overrides[fieldName];
        }
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
      getEffectType(tempEffects[effectIndex]._baseEffect)
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
    return tempEffects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      // Merge with default recipient effect for any empty fields
      const effectToApply = {
        effectId: effect.effectId,
        overrides: {},
        multipliers: {},
      };

      // Build a set of fields that have user overrides
      const userOverrideFields = new Set();
      if (effect.overrides) {
        Object.entries(effect.overrides).forEach(([field, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.overrides[field] = value;
            userOverrideFields.add(field);
          }
        });
      }

      // Build a set of fields that have user multipliers
      const userMultiplierFields = new Set();
      if (effect.multipliers) {
        Object.entries(effect.multipliers).forEach(([field, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.multipliers[field] = value;
            userMultiplierFields.add(field);
          }
        });
      }

      // Add default overrides for fields that don't have user values
      if (effect._defaultRecipientEffect?.overrides) {
        Object.entries(effect._defaultRecipientEffect.overrides).forEach(([field, value]) => {
          if (!userOverrideFields.has(field) && !userMultiplierFields.has(field)) {
            effectToApply.overrides[field] = value;
          }
        });
      }

      // Add default multipliers for fields that don't have user values
      if (effect._defaultRecipientEffect?.multipliers) {
        Object.entries(effect._defaultRecipientEffect.multipliers).forEach(([field, value]) => {
          if (!userOverrideFields.has(field) && !userMultiplierFields.has(field)) {
            effectToApply.multipliers[field] = value;
          }
        });
      }

      // Create modified effect with overrides/multipliers applied
      const modifiedEffect = applyRecipientEffectToBase(baseEffect, effectToApply, `effect ${effect.effectId}`);
      return calculateEffectCostPerLife(modifiedEffect, globalParameters);
    });
  }, [tempEffects, globalParameters]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

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
    const effectsToSave = tempEffects
      .map((effect) => {
        const cleanEffect = {
          effectId: effect.effectId,
          overrides: {},
          multipliers: {},
        };

        // Process overrides - convert strings to numbers
        if (effect.overrides) {
          Object.entries(effect.overrides).forEach(([fieldName, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              const { numValue } = cleanAndParseValue(value);
              if (!isNaN(numValue)) {
                cleanEffect.overrides[fieldName] = numValue;
              } else {
                throw new Error(
                  `Failed to convert override ${fieldName} to number in effect ${effect.effectId}. Value: "${value}"`
                );
              }
            }
          });
        }

        // Process multipliers - convert strings to numbers
        if (effect.multipliers) {
          Object.entries(effect.multipliers).forEach(([fieldName, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              const { numValue } = cleanAndParseValue(value);
              if (!isNaN(numValue)) {
                cleanEffect.multipliers[fieldName] = numValue;
              } else {
                throw new Error(
                  `Failed to convert multiplier ${fieldName} to number in effect ${effect.effectId}. Value: "${value}"`
                );
              }
            }
          });
        }

        // Only include effect if it has overrides or multipliers
        if (Object.keys(cleanEffect.overrides).length > 0 || Object.keys(cleanEffect.multipliers).length > 0) {
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
          description="Set at most one value (override or multiplier) for each parameter. These are the underlying parameters that are used to compute the cost per life."
          combinedCostPerLife={combinedCostPerLife}
          showCombinedCost={false}
          onClose={onCancel}
        />

        {/* Effects List */}
        <div className="overflow-y-auto px-3 py-3 max-h-[calc(80vh-300px)]">
          {/* Cost per life display - only show when there are multiple effects */}
          {tempEffects.length > 1 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Combined cost per life:</span>
                <span
                  className={`text-lg font-bold ${combinedCostPerLife === Infinity ? 'text-red-600' : 'text-green-600'}`}
                >
                  ${combinedCostPerLife === Infinity ? 'Invalid' : formatCurrency(combinedCostPerLife).replace('$', '')}
                </span>
              </div>
            </div>
          )}

          {/* Effects */}
          <div className="space-y-6">
            {tempEffects.map((effect, index) => {
              const baseEffect = effect._baseEffect;
              const effectType = getEffectType(baseEffect);
              const costPerLife = effectCostPerLife[index];

              // Get all the different effect sources for the input components
              const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
              const defaultCategoryEffect = defaultAssumptions?.categories?.[categoryId]?.effects?.find(
                (e) => e.effectId === effect.effectId
              );
              const userCategoryEffect = userAssumptions?.categories?.[categoryId]?.effects?.find(
                (e) => e.effectId === effect.effectId
              );

              return (
                <div key={effect.effectId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Effect {index + 1}: {effectType === 'qaly' ? 'QALY' : 'Population'}
                    </h3>
                    <EffectCostDisplay cost={costPerLife} showInfinity={false} className="text-sm" />
                  </div>

                  <div>
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
