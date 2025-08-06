import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import { effectToCostPerLife } from '../../utils/effectsCalculation';
import { formatNumberWithCommas } from '../../utils/formatters';
import { getEffectType, validateEffectField, validateEffects } from '../../utils/effectValidation';
import { useAssumptions } from '../../contexts/AssumptionsContext';

/**
 * Component for editing all effects of a category
 */

const CategoryEffectEditor = ({ category, categoryId, globalParameters, onSave, onCancel }) => {
  const [tempEffects, setTempEffects] = useState([]);
  const [errors, setErrors] = useState({});
  const { defaultAssumptions } = useAssumptions();

  // Get default effects for comparison
  const defaultEffects = useMemo(() => {
    if (!defaultAssumptions?.categories?.[categoryId]?.effects) {
      return [];
    }
    return defaultAssumptions.categories[categoryId].effects;
  }, [defaultAssumptions, categoryId]);

  // Initialize temp effects from category
  useEffect(() => {
    if (category && category.effects) {
      // Deep clone the effects to avoid mutations
      setTempEffects(JSON.parse(JSON.stringify(category.effects)));
    }
  }, [category]);

  // Validate all effects on mount and when effects change
  useEffect(() => {
    if (tempEffects.length > 0) {
      const validation = validateEffects(tempEffects);
      setErrors(validation.errors);
    }
  }, [tempEffects]);

  // Update a specific field of an effect
  const updateEffectField = (effectIndex, fieldName, value) => {
    setTempEffects((prev) => {
      const newEffects = [...prev];
      newEffects[effectIndex] = {
        ...newEffects[effectIndex],
        [fieldName]: value,
      };
      return newEffects;
    });

    // Validate this field immediately
    const effect = { ...tempEffects[effectIndex], [fieldName]: value };
    const effectType = getEffectType(effect);
    const error = validateEffectField(fieldName, value, effectType);
    const errorKey = `${effectIndex}-${fieldName}`;

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
      try {
        // Check for invalid values that would cause calculation errors
        const effectType = getEffectType(effect);
        if (effectType === 'qaly' && (effect.costPerQALY === 0 || effect.costPerQALY === undefined)) {
          return Infinity; // Invalid but don't throw error during editing
        }
        if (
          effectType === 'population' &&
          (effect.costPerMicroprobability === 0 || effect.costPerMicroprobability === undefined)
        ) {
          return Infinity; // Invalid but don't throw error during editing
        }

        return effectToCostPerLife(effect, globalParameters);
      } catch {
        // During editing, return Infinity for invalid calculations instead of throwing
        // This allows users to type without errors appearing for temporary invalid states
        return Infinity;
      }
    });
  }, [tempEffects, globalParameters]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    const validCosts = effectCostPerLife.filter((cost) => cost !== Infinity && cost > 0);
    if (validCosts.length === 0) return Infinity;

    // Use harmonic mean for combining multiple effects
    const harmonicMean = validCosts.length / validCosts.reduce((sum, cost) => sum + 1 / cost, 0);
    return harmonicMean;
  }, [effectCostPerLife]);

  // Check if there are any validation errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Handle save
  const handleSave = () => {
    // Re-validate all effects before saving
    const validation = validateEffects(tempEffects);
    if (validation.isValid) {
      onSave(tempEffects);
    } else {
      setErrors(validation.errors);
    }
  };

  if (!category) return null;

  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col border border-gray-300 rounded-lg bg-white shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Editing assumptions for category: {category.name}</h3>
            <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Back to categories</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {tempEffects.length > 1 && (
            <div className="mt-2 text-sm text-gray-600">
              Combined Cost per Life:{' '}
              <span className="font-semibold">
                ${combinedCostPerLife === Infinity ? '∞' : formatNumberWithCommas(Math.round(combinedCostPerLife))}
              </span>
            </div>
          )}
        </div>

        {/* Effects List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {tempEffects.map((effect, index) => {
              const effectType = getEffectType(effect);
              const costPerLife = effectCostPerLife[index];

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3 flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Effect {index + 1}: {effect.effectId}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cost per Life:{' '}
                      <span className="font-medium">
                        ${costPerLife === Infinity ? '∞' : formatNumberWithCommas(Math.round(costPerLife))}
                      </span>
                    </div>
                  </div>

                  {effectType === 'qaly' ? (
                    <QalyEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                    />
                  ) : effectType === 'population' ? (
                    <PopulationEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                    />
                  ) : (
                    <div className="text-sm text-red-600">Unknown effect type</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {hasErrors && <span className="text-red-600">Please fix errors before saving</span>}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={hasErrors}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  hasErrors ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CategoryEffectEditor.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    effects: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CategoryEffectEditor;
