/* eslint-disable no-console */
// Unit test for the discounted sum calculation logic

// Simulate the calculateDiscountedSum function
const calculateDiscountedSum = (discountRate, start, end) => {
  if (start >= end) return 0;

  const discountFactor = 1 / (1 + discountRate);
  const startDiscount = Math.pow(discountFactor, start);
  const periodDiscount = 1 - Math.pow(discountFactor, end - start);

  // Handle the case where discount rate is effectively zero
  if (Math.abs(discountRate) < 1e-10) {
    return end - start;
  }

  return (startDiscount * periodDiscount) / (discountRate / (1 + discountRate));
};

// Test cases
console.log('Testing calculateDiscountedSum function:\n');

// Test 1: No discounting (rate = 0)
const sum1 = calculateDiscountedSum(0, 0, 10);
console.log('Test 1 - No discounting (0% rate, years 0-10):');
console.log(`  Result: ${sum1}`);
console.log(`  Expected: 10 (simple sum)\n`);

// Test 2: 2% discount rate, years 0-10
const sum2 = calculateDiscountedSum(0.02, 0, 10);
console.log('Test 2 - 2% discount rate, years 0-10:');
console.log(`  Result: ${sum2.toFixed(4)}`);
console.log(`  Expected: ~8.9826 (manual calculation)\n`);

// Test 3: 2% discount rate, years 10-20 (should be less due to later start)
const sum3 = calculateDiscountedSum(0.02, 10, 20);
console.log('Test 3 - 2% discount rate, years 10-20:');
console.log(`  Result: ${sum3.toFixed(4)}`);
console.log(`  Expected: ~7.3601 (manual calculation)\n`);

// Test 4: Very high discount rate (50%)
const sum4 = calculateDiscountedSum(0.5, 0, 10);
console.log('Test 4 - High discount rate (50%), years 0-10:');
console.log(`  Result: ${sum4.toFixed(4)}`);
console.log(`  Expected: ~2.0000 (converges quickly)\n`);

// Test 5: Edge case - zero length window
const sum5 = calculateDiscountedSum(0.02, 5, 5);
console.log('Test 5 - Zero length window:');
console.log(`  Result: ${sum5}`);
console.log(`  Expected: 0\n`);

// Test multi-effect scenario
console.log('Multi-effect scenario simulation:');
console.log('Effect 1: Years 0-10, $1/year, saves 0.025 lives/year (costPerLife = $40)');
console.log('Effect 2: Years 10-30, $1/year, saves 0.0125 lives/year (costPerLife = $80)');

const discountRate = 0.02;
const effect1Cost = calculateDiscountedSum(discountRate, 0, 10);
const effect1Lives = 0.025 * effect1Cost;
const effect2Cost = calculateDiscountedSum(discountRate, 10, 30);
const effect2Lives = 0.0125 * effect2Cost;

const totalCost = effect1Cost + effect2Cost;
const totalLives = effect1Lives + effect2Lives;
const averageCostPerLife = totalCost / totalLives;

console.log(`  Effect 1 - Discounted cost: $${effect1Cost.toFixed(2)}, Lives: ${effect1Lives.toFixed(4)}`);
console.log(`  Effect 2 - Discounted cost: $${effect2Cost.toFixed(2)}, Lives: ${effect2Lives.toFixed(4)}`);
console.log(`  Total discounted cost: $${totalCost.toFixed(2)}`);
console.log(`  Total discounted lives: ${totalLives.toFixed(4)}`);
console.log(`  Weighted average cost per life: $${averageCostPerLife.toFixed(2)}`);
