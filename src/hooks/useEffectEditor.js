import { useState, useEffect, useMemo } from 'react';
import { calculateEffectCostPerLife, calculateCombinedCostPerLife } from '../utils/effectEditorUtils';
import { validateEffects, validateRecipientEffects } from '../utils/effectValidation';

/**
 * Custom hook for managing effect editor state and calculations
 * @param {Array} initialEffects - Initial effects to edit
 * @param {Object} globalParameters - Global parameters for calculations
 * @param {boolean} isRecipient - Whether this is for recipient editing (uses different validation)
 * @returns {Object} Effect editor state and methods
 */
export const useEffectEditor = (initialEffects, globalParameters, isRecipient = false) => {
  const [tempEffects, setTempEffects] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize effects
  useEffect(() => {
    if (initialEffects && initialEffects.length > 0) {
      setTempEffects(JSON.parse(JSON.stringify(initialEffects)));
    }
  }, [initialEffects]);

  // Validate effects when they change
  useEffect(() => {
    if (tempEffects.length > 0) {
      const validation = isRecipient ? validateRecipientEffects(tempEffects) : validateEffects(tempEffects);
      setErrors(validation.errors || {});
    }
  }, [tempEffects, isRecipient]);

  // Calculate cost per life for each effect
  const effectCostPerLife = useMemo(() => {
    return tempEffects.map((effect) => calculateEffectCostPerLife(effect, globalParameters));
  }, [tempEffects, globalParameters]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Check if there are validation errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    tempEffects,
    setTempEffects,
    errors,
    setErrors,
    effectCostPerLife,
    combinedCostPerLife,
    hasErrors,
  };
};
