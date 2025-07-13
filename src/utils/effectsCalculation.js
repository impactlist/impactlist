/* eslint-env browser */

import { getGlobalParameters, getPopulationWeight } from '../config/globalParameters.js';
import { categoriesById, recipientsById } from '../data/generatedData.js';

// Get custom effectiveness data from localStorage
const getCustomEffectivenessData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedData = window.localStorage.getItem('customEffectivenessData');
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
};

// Apply overrides to an effect in the correct order: category overrides, then recipient overrides
const applyEffectOverrides = (baseEffect, categoryId, effectName, recipientName = null, customData = null) => {
  const effectiveCustomData = customData || getCustomEffectivenessData();
  if (!effectiveCustomData) return baseEffect;

  let modifiedEffect = { ...baseEffect };

  // Step 1: Apply category overrides (affects all recipients in this category)
  if (effectiveCustomData.categories?.[categoryId]?.effects?.[effectName]) {
    const categoryOverrides = effectiveCustomData.categories[categoryId].effects[effectName];
    modifiedEffect = { ...modifiedEffect, ...categoryOverrides };
  }

  // Step 2: Apply recipient overrides (affects only this specific recipient)
  if (recipientName && effectiveCustomData.recipients?.[recipientName]?.[categoryId]?.effects?.[effectName]) {
    const recipientOverrides = effectiveCustomData.recipients[recipientName][categoryId].effects[effectName];

    // Handle both absolute overrides and multipliers
    Object.entries(recipientOverrides).forEach(([paramName, paramValue]) => {
      if (paramName.endsWith('Multiplier')) {
        // Apply multiplier to existing value
        const baseParamName = paramName.replace('Multiplier', '');
        if (modifiedEffect[baseParamName] !== undefined) {
          modifiedEffect[baseParamName] = modifiedEffect[baseParamName] * paramValue;
        }
      } else {
        // Direct override
        modifiedEffect[paramName] = paramValue;
      }
    });
  }

  return modifiedEffect;
};

// Helper function to calculate equivalent cost-per-life for display purposes
export const calculateCostPerLifeEquivalent = (
  categoryId,
  effectName = null,
  recipientName = null,
  customEffectivenessData = null
) => {
  // Create a test donation of $1000 to calculate the rate
  const testAmount = 1000;

  try {
    // Get category data
    const category = getCategoryById(categoryId);
    if (!category || !category.effects) {
      return null;
    }

    // Find the effect to analyze (use first effect if none specified)
    const targetEffect = effectName ? category.effects.find((e) => e.name === effectName) : category.effects[0];

    if (!targetEffect) {
      return null;
    }

    // Apply overrides
    const finalEffect = applyEffectOverrides(
      targetEffect,
      categoryId,
      targetEffect.name,
      recipientName,
      customEffectivenessData
    );

    // Calculate impact for the test amount
    const impactResult = calculateEffectImpact(finalEffect, testAmount);

    // Convert to cost-per-life equivalent
    // totalImpact represents "life-years saved" or equivalent weighted benefit
    if (impactResult.totalImpact <= 0) {
      return null; // Can't calculate meaningful cost per life for zero/negative impact
    }

    return testAmount / impactResult.totalImpact;
  } catch (error) {
    console.warn(`Error calculating cost per life equivalent for ${categoryId}:`, error);
    return null;
  }
};

// Helper function to get cost-per-life for a specific recipient
export const calculateRecipientCostPerLife = (recipientId, customEffectivenessData = null) => {
  try {
    // Find recipient data
    const recipient = recipientsById[recipientId];
    if (!recipient || !recipient.effects) return null;

    // Create a test donation to calculate cost per life
    const testDonation = {
      recipientId: recipientId,
      amount: 1000,
      credit: 1.0,
    };

    // We need to temporarily set the custom data in localStorage if provided,
    // or use a modified calculation approach
    if (customEffectivenessData) {
      // Calculate manually with the provided custom data
      let totalImpact = 0;
      const creditedAmount = testDonation.amount * testDonation.credit;

      for (const recipientEffect of recipient.effects) {
        const category = getCategoryById(recipientEffect.categoryId);
        if (!category || !category.effects) continue;

        for (const categoryEffect of category.effects) {
          const effectAmount = creditedAmount * recipientEffect.fraction;
          const finalEffect = applyEffectOverrides(
            categoryEffect,
            recipientEffect.categoryId,
            categoryEffect.name,
            recipient.name,
            customEffectivenessData
          );
          const result = calculateEffectImpact(finalEffect, effectAmount);
          totalImpact += result.totalImpact;
        }
      }

      return totalImpact > 0 ? 1000 / totalImpact : null;
    } else {
      // Use the standard calculation which reads from localStorage
      const totalImpact = calculateDonationImpact(testDonation, recipient);
      return totalImpact.totalImpact > 0 ? 1000 / totalImpact.totalImpact : null;
    }
  } catch (error) {
    console.warn(`Error calculating recipient cost per life for ${recipientId}:`, error);
    return null;
  }
};

// Get category data by ID
const getCategoryById = (categoryId) => {
  const category = categoriesById[categoryId];
  if (!category) {
    throw new Error(`Category ${categoryId} not found in categoriesById`);
  }
  return category;
};

export const calculateBenefitOverTime = (effect) => {
  const { discountRate, populationGrowthRate, timeHorizon, populationLimit } = getGlobalParameters();

  const startTime = effect.startTime || 0;
  const windowLength = effect.windowLength || 1;
  const endTime = Math.min(startTime + windowLength, timeHorizon);
  const halfLife = effect.halfLife || null;
  const benefitPerYear = effect.benefitPerYear || 1;

  if (startTime >= timeHorizon) {
    return 0;
  }

  // Calculate the combined rate for discounting, population growth, and decay
  let combinedRate = populationGrowthRate - discountRate;
  if (halfLife) {
    const decayRate = Math.log(2) / halfLife;
    combinedRate -= decayRate;
  }

  // Apply population ceiling constraint
  let populationFactor = 1;
  if (populationLimit) {
    const growthFactor = Math.pow(1 + populationGrowthRate, startTime);
    populationFactor = Math.min(growthFactor, populationLimit);
  } else {
    populationFactor = Math.pow(1 + populationGrowthRate, startTime);
  }

  let totalBenefit;

  if (Math.abs(combinedRate) < 1e-10) {
    // If combined rate is essentially zero, use linear calculation
    totalBenefit = benefitPerYear * (endTime - startTime) * Math.pow(Math.E, -discountRate * startTime);
  } else {
    // Use exponential integral for continuous compounding
    const discountedStart = Math.pow(Math.E, -discountRate * startTime + combinedRate * startTime);
    const discountedEnd = Math.pow(Math.E, -discountRate * endTime + combinedRate * endTime);
    totalBenefit = (benefitPerYear * (discountedEnd - discountedStart)) / combinedRate;
  }

  return totalBenefit * populationFactor;
};

export const calculateEffectImpact = (effect, donationAmount) => {
  // Calculate how many people are affected
  let peopleAffected = 0;

  if (effect.peoplePerDollar) {
    peopleAffected = effect.peoplePerDollar * donationAmount;
  } else if (effect.probabilityPerDollar && effect.populationPercentAffected) {
    const { populationGrowthRate, currentPopulation } = getGlobalParameters();
    const totalPopulation = currentPopulation * Math.pow(1 + populationGrowthRate, effect.startTime || 0);
    const affectedPopulation = totalPopulation * (effect.populationPercentAffected / 100);
    const probability = effect.probabilityPerDollar * donationAmount;
    peopleAffected = probability * affectedPopulation;
  } else {
    throw new Error(
      `Effect must specify either peoplePerDollar or both probabilityPerDollar and populationPercentAffected`
    );
  }

  // Calculate temporal benefit stream per person
  const benefitPerPerson = calculateBenefitOverTime(effect);

  // Apply population weighting
  const populationWeight = getPopulationWeight(effect.targetPopulation || 'human');

  // Calculate total impact
  const totalImpact = peopleAffected * benefitPerPerson * populationWeight;

  return {
    peopleAffected,
    benefitPerPerson,
    populationWeight,
    totalImpact,
  };
};

export const calculateDonationImpact = (donation, recipient, customEffectivenessData = null) => {
  if (!recipient.effects || recipient.effects.length === 0) {
    throw new Error(`Recipient ${recipient.name} has no effects defined`);
  }

  const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;

  let totalImpact = 0;
  const effectDetails = [];

  for (const recipientEffect of recipient.effects) {
    const category = getCategoryById(recipientEffect.categoryId);
    if (!category || !category.effects) {
      throw new Error(`Category ${recipientEffect.categoryId} not found or has no effects`);
    }

    // Calculate impact for each effect in the category
    for (const categoryEffect of category.effects) {
      // Apply recipient-specific fraction
      const effectAmount = creditedAmount * recipientEffect.fraction;

      // Apply overrides in correct order: base → category overrides → built-in recipient overrides → user recipient overrides
      let modifiedEffect = { ...categoryEffect };

      // Step 1: Apply user category and recipient overrides
      modifiedEffect = applyEffectOverrides(
        modifiedEffect,
        recipientEffect.categoryId,
        categoryEffect.name,
        recipient.name,
        customEffectivenessData
      );

      // Step 2: Apply built-in recipient overrides from markdown (maintains backward compatibility)
      if (recipientEffect.effects && recipientEffect.effects[categoryEffect.name]) {
        const builtInOverrides = recipientEffect.effects[categoryEffect.name];

        // Apply multipliers
        if (builtInOverrides.peoplePerDollarMultiplier) {
          modifiedEffect.peoplePerDollar =
            (modifiedEffect.peoplePerDollar || 0) * builtInOverrides.peoplePerDollarMultiplier;
        }
        if (builtInOverrides.probabilityPerDollarMultiplier) {
          modifiedEffect.probabilityPerDollar =
            (modifiedEffect.probabilityPerDollar || 0) * builtInOverrides.probabilityPerDollarMultiplier;
        }
        if (builtInOverrides.benefitPerYearMultiplier) {
          modifiedEffect.benefitPerYear =
            (modifiedEffect.benefitPerYear || 1) * builtInOverrides.benefitPerYearMultiplier;
        }

        // Apply direct overrides
        Object.keys(builtInOverrides).forEach((key) => {
          if (!key.endsWith('Multiplier')) {
            modifiedEffect[key] = builtInOverrides[key];
          }
        });
      }

      const effectResult = calculateEffectImpact(modifiedEffect, effectAmount);
      totalImpact += effectResult.totalImpact;
      effectDetails.push({
        categoryId: recipientEffect.categoryId,
        effectName: categoryEffect.name,
        fraction: recipientEffect.fraction,
        ...effectResult,
      });
    }
  }

  return {
    totalImpact,
    creditedAmount,
    effectDetails,
  };
};
