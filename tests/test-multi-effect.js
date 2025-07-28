/* eslint-disable no-console */
// Test script for multi-effect calculation
import { calculateCategoryBaseCostPerLife } from '../src/utils/effectsCalculation.js';

// Test 1: Single effect (should work as before)
const singleEffectCategory = {
  effects: [
    {
      effectId: 'test1',
      startTime: 0,
      windowLength: 1,
      costPerQALY: 100,
    },
  ],
};

console.log('Test 1 - Single effect:');
try {
  const result = calculateCategoryBaseCostPerLife(singleEffectCategory, 'test-category-1');
  console.log(`  Cost per life: $${result.toLocaleString()}`);
  console.log(`  Expected: $${(100 * 80).toLocaleString()} (costPerQALY * yearsPerLife)`);
} catch (error) {
  console.error('  Error:', error.message);
}

// Test 2: Multiple effects with different time windows
const multiEffectCategory = {
  effects: [
    {
      effectId: 'early',
      startTime: 0,
      windowLength: 10,
      costPerQALY: 50,
    },
    {
      effectId: 'late',
      startTime: 10,
      windowLength: 20,
      costPerQALY: 100,
    },
  ],
};

console.log('\nTest 2 - Multiple effects:');
try {
  const result = calculateCategoryBaseCostPerLife(multiEffectCategory, 'test-category-2');
  console.log(`  Cost per life: $${result.toLocaleString()}`);
  console.log('  (Should be between $4,000 and $8,000 with discounting)');
} catch (error) {
  console.error('  Error:', error.message);
}

// Test 3: Overlapping effects
const overlappingEffectCategory = {
  effects: [
    {
      effectId: 'base',
      startTime: 0,
      windowLength: 30,
      costPerQALY: 100,
    },
    {
      effectId: 'boost',
      startTime: 5,
      windowLength: 10,
      costPerQALY: 50,
    },
  ],
};

console.log('\nTest 3 - Overlapping effects:');
try {
  const result = calculateCategoryBaseCostPerLife(overlappingEffectCategory, 'test-category-3');
  console.log(`  Cost per life: $${result.toLocaleString()}`);
  console.log('  (Should account for both effects during overlap period)');
} catch (error) {
  console.error('  Error:', error.message);
}
