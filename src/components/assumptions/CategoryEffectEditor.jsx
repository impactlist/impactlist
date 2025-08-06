import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import { effectToCostPerLife } from '../../utils/effectsCalculation';
import { formatNumberWithCommas } from '../../utils/formatters';

/**
 * Detect the type of an effect based on its fields
 */
const getEffectType = (effect) => {
  if (effect.costPerQALY !== undefined) return 'qaly';
  if (effect.costPerMicroprobability !== undefined) return 'population';
  return 'unknown';
};

/**
 * Component for editing all effects of a category
 */
// eslint-disable-next-line no-unused-vars
const CategoryEffectEditor = ({ category, categoryId, globalParameters, onSave, onCancel }) => {
  const [tempEffects, setTempEffects] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize temp effects from category
  useEffect(() => {
    if (category && category.effects) {
      // Deep clone the effects to avoid mutations
      setTempEffects(JSON.parse(JSON.stringify(category.effects)));
    }
  }, [category]);

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

    // Clear error for this field
    const errorKey = `${effectIndex}-${fieldName}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
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

  // Validate all effects
  const validateEffects = () => {
    const newErrors = {};
    let isValid = true;

    tempEffects.forEach((effect, index) => {
      const effectType = getEffectType(effect);

      // Common validations
      if (effect.startTime < 0) {
        newErrors[`${index}-startTime`] = 'Start time must be non-negative';
        isValid = false;
      }
      if (effect.windowLength < 0) {
        newErrors[`${index}-windowLength`] = 'Window length must be non-negative';
        isValid = false;
      }

      // Type-specific validations
      if (effectType === 'qaly') {
        if (effect.costPerQALY === 0 || effect.costPerQALY === undefined) {
          newErrors[`${index}-costPerQALY`] = 'Cost per QALY cannot be zero';
          isValid = false;
        }
      } else if (effectType === 'population') {
        if (effect.costPerMicroprobability === 0 || effect.costPerMicroprobability === undefined) {
          newErrors[`${index}-costPerMicroprobability`] = 'Cost per microprobability cannot be zero';
          isValid = false;
        }
        if (
          !effect.populationFractionAffected ||
          effect.populationFractionAffected <= 0 ||
          effect.populationFractionAffected > 1
        ) {
          newErrors[`${index}-populationFractionAffected`] = 'Population fraction must be between 0 and 1';
          isValid = false;
        }
        if (effect.qalyImprovementPerYear === 0) {
          newErrors[`${index}-qalyImprovementPerYear`] = 'QALY improvement cannot be zero';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle save
  const handleSave = () => {
    if (validateEffects()) {
      onSave(tempEffects);
    }
  };

  if (!category) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Effects for {category.name}</h3>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Back to categories</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Combined Cost per Life:{' '}
          <span className="font-semibold">
            ${combinedCostPerLife === Infinity ? '∞' : formatNumberWithCommas(Math.round(combinedCostPerLife))}
          </span>
        </div>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Type:{' '}
                      {effectType === 'qaly'
                        ? 'QALY-based'
                        : effectType === 'population'
                          ? 'Population-based'
                          : 'Unknown'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Cost per Life:{' '}
                    <span className="font-medium">
                      ${costPerLife === Infinity ? '∞' : formatNumberWithCommas(Math.round(costPerLife))}
                    </span>
                  </div>
                </div>

                {effectType === 'qaly' ? (
                  <QalyEffectInputs effect={effect} effectIndex={index} errors={errors} onChange={updateEffectField} />
                ) : effectType === 'population' ? (
                  <PopulationEffectInputs
                    effect={effect}
                    effectIndex={index}
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
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
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
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
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
