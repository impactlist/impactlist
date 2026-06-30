// Startup validation to ensure data integrity
// This runs when the app starts to catch data structure issues early
import { categoriesById, recipientsById, donorsById, donations, globalParameters } from '../data/generatedData';
import {
  validateCategory,
  validateRecipient,
  assertExists,
  assertPositiveNumber,
  assertNumber,
} from './dataValidation';
import { assertValidGlobalParameters } from './globalParameterRules';

/**
 * Validate all categories in the data
 */
const validateAllCategories = () => {
  assertExists(categoriesById, 'categoriesById');

  const categoryIds = Object.keys(categoriesById);
  if (categoryIds.length === 0) {
    throw new Error('No categories found in categoriesById');
  }

  for (const [categoryId, category] of Object.entries(categoriesById)) {
    try {
      validateCategory(category, categoryId);
    } catch (error) {
      throw new Error(`Category validation failed for "${categoryId}": ${error.message}`);
    }
  }
};

/**
 * Validate all recipients in the data
 */
const validateAllRecipients = () => {
  assertExists(recipientsById, 'recipientsById');

  const recipientIds = Object.keys(recipientsById);
  if (recipientIds.length === 0) {
    throw new Error('No recipients found in recipientsById');
  }
  for (const [recipientId, recipient] of Object.entries(recipientsById)) {
    try {
      validateRecipient(recipient, recipientId);

      // Additional check: ensure all referenced categories exist
      for (const categoryId of Object.keys(recipient.categories)) {
        if (!categoriesById[categoryId]) {
          throw new Error(`Recipient "${recipientId}" references non-existent category "${categoryId}"`);
        }
      }
    } catch (error) {
      throw new Error(`Recipient validation failed for "${recipientId}": ${error.message}`);
    }
  }
};

/**
 * Validate all donors in the data
 */
const validateAllDonors = () => {
  assertExists(donorsById, 'donorsById');

  const donorIds = Object.keys(donorsById);
  if (donorIds.length === 0) {
    throw new Error('No donors found in donorsById');
  }

  for (const [donorId, donor] of Object.entries(donorsById)) {
    try {
      assertExists(donor, 'donor', `with ID "${donorId}"`);
      assertExists(donor.name, 'donor.name', `for donor "${donorId}"`);
      // Net worth is display-only (it feeds no lives-saved / cost-per-life math) and can
      // legitimately be zero or negative for a donor whose debts exceed their assets
      // (e.g. Sam Bankman-Fried, post-forfeiture), so any finite number is allowed.
      assertNumber(donor.netWorth, 'donor.netWorth', `for donor "${donorId}"`);

      // totalDonated is optional, but if present must be positive
      if (donor.totalDonated !== undefined) {
        assertPositiveNumber(donor.totalDonated, 'donor.totalDonated', `for donor "${donorId}"`);
      }
    } catch (error) {
      throw new Error(`Donor validation failed for "${donorId}": ${error.message}`);
    }
  }
};

/**
 * Validate all donations in the data
 */
const validateAllDonations = () => {
  assertExists(donations, 'donations');

  if (!Array.isArray(donations)) {
    throw new Error('donations must be an array');
  }

  if (donations.length === 0) {
    throw new Error('No donations found in donations array');
  }

  for (const [index, donation] of donations.entries()) {
    try {
      assertExists(donation, 'donation', `at index ${index}`);
      assertExists(donation.donorId, 'donation.donorId', `for donation at index ${index}`);
      assertExists(donation.recipientId, 'donation.recipientId', `for donation at index ${index}`);
      assertExists(donation.date, 'donation.date', `for donation at index ${index}`);
      assertPositiveNumber(donation.amount, 'donation.amount', `for donation at index ${index}`);

      // The generator guarantees every donation row carries a credit
      // fraction; treat its absence as the data corruption it would be.
      assertPositiveNumber(donation.credit, 'donation.credit', `for donation at index ${index}`);

      // Ensure referenced donor exists
      if (!donorsById[donation.donorId]) {
        throw new Error(`Donation at index ${index} references non-existent donor "${donation.donorId}"`);
      }

      // Ensure referenced recipient exists
      if (!recipientsById[donation.recipientId]) {
        throw new Error(`Donation at index ${index} references non-existent recipient "${donation.recipientId}"`);
      }
    } catch (error) {
      throw new Error(`Donation validation failed at index ${index}: ${error.message}`);
    }
  }
};

/**
 * Validate global parameters against the shared rules table (all parameters
 * present, no unknown ones, all values within bounds — including
 * yearsPerLife, which an earlier hand-rolled version here forgot).
 */
const validateGlobalParameters = () => {
  assertExists(globalParameters, 'globalParameters');
  assertValidGlobalParameters(globalParameters, 'in generated globalParameters');
};

/**
 * Run complete data validation at app startup
 * This function will throw an error if any data is invalid, causing the app to crash loudly
 */
export const validateDataOnStartup = () => {
  try {
    validateGlobalParameters();
    validateAllCategories();
    validateAllRecipients();
    validateAllDonors();
    validateAllDonations();
  } catch (error) {
    throw new Error(`STARTUP VALIDATION FAILED: ${error.message}`);
  }
};
