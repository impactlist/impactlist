import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import {
  calculateEffectCostPerLife,
  calculateCombinedCostPerLife,
  cleanEffectsForSave,
} from '../../utils/effectEditorUtils';
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
    // Store the value as-is (string with formatting)
    // The validation will clean it when checking
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
    return tempEffects.map((effect) => calculateEffectCostPerLife(effect, globalParameters));
  }, [tempEffects, globalParameters]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Check if there are any validation errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Handle save
  const handleSave = () => {
    try {
      const cleanedEffects = cleanEffectsForSave(tempEffects);

      // Re-validate all effects before saving
      const validation = validateEffects(cleanedEffects);
      if (validation.isValid) {
        onSave(cleanedEffects);
      } else {
        setErrors(validation.errors);
      }
    } catch (error) {
      console.error('Error cleaning effects for save:', error);
      // Fail hard and loud - throw the error to prevent silent failures
      throw error;
    }
  };

  if (!category) return null;

  return (
    <div className="h-full p-2">
      <div className="h-full flex flex-col border border-gray-300 rounded-lg bg-white shadow-sm">
        <EffectEditorHeader
          title={`Editing assumptions for category: ${category.name}`}
          combinedCostPerLife={tempEffects.length > 1 ? combinedCostPerLife : undefined}
          showCombinedCost={tempEffects.length > 1}
          onClose={onCancel}
        />

        {/* Effects List */}
        <div className="overflow-y-auto px-3 py-3 max-h-[calc(80vh-300px)]">
          <div className="space-y-3">
            {tempEffects.map((effect, index) => {
              const effectType = getEffectType(effect);
              const costPerLife = effectCostPerLife[index];

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="mb-2 flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Effect {index + 1}: {effect.effectId}
                      </h4>
                    </div>
                    <EffectCostDisplay cost={costPerLife} showInfinity={true} className="text-sm" />
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

        <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} />
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
