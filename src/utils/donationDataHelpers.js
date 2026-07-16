// Helper functions for donation and impact calculations
import { donorsById, recipientsById, donations } from '../data/generatedData';
import { normalizeFormattedDecimalInput } from './numberParsing';

// Helper to get donor by ID
export const getDonorById = (donorId) => {
  if (!donorId || !Object.hasOwn(donorsById, donorId)) return null;
  return donorsById[donorId];
};

// Helper to get all donors as an array
export const getAllDonors = () => Object.entries(donorsById).map(([id, donor]) => ({ ...donor, id }));

// Get primary category for a recipient
export const getPrimaryCategoryForRecipient = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    return { categoryId: null, categoryName: 'Unknown', count: 0 };
  }

  const categories = recipient.categories;
  const categoryCount = Object.keys(categories).length;

  if (categoryCount === 0) {
    return { categoryId: null, categoryName: 'None', count: 0 };
  } else if (categoryCount === 1) {
    // Single category
    const categoryId = Object.keys(categories)[0];
    const category = combinedAssumptions.getCategoryById(categoryId);
    return {
      categoryId,
      categoryName: category?.name || categoryId,
      count: 1,
    };
  } else {
    // Multiple categories - find primary (highest fraction)
    let primaryCategoryId = null;
    let maxWeight = -1;

    for (const [catId, catData] of Object.entries(categories)) {
      if (catData.fraction > maxWeight) {
        maxWeight = catData.fraction;
        primaryCategoryId = catId;
      }
    }

    const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId);
    return {
      categoryId: primaryCategoryId,
      categoryName: primaryCategory?.name || primaryCategoryId,
      count: categoryCount,
    };
  }
};

// Helper to find recipient ID by recipient object
export const getRecipientId = (recipientObj) => {
  return recipientObj?.id;
};

// Helper to find donor ID by donor object
export const getDonorId = (donorObj) => {
  return donorObj?.id;
};

// Get the primary (highest weight) category for a recipient
export const getPrimaryCategoryId = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }

  let maxWeight = -1;
  let primaryCategoryId = null;

  // Find the category with the highest weight
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    const weight = categoryData.fraction;

    if (weight > maxWeight) {
      maxWeight = weight;
      primaryCategoryId = categoryId;
    }
  }

  if (primaryCategoryId === null) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }

  return primaryCategoryId;
};

// Get a breakdown of categories for a recipient
export const getCategoryBreakdown = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }

  // Convert categories object to an array with categoryId included
  const categories = Object.entries(recipient.categories).map(([categoryId, categoryData]) => {
    return {
      categoryId,
      ...categoryData,
    };
  });

  if (categories.length === 0) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }

  // Sort by fraction (weight) in descending order
  return categories.sort((a, b) => b.fraction - a.fraction);
};

// Helper to get donations for a specific donor
export const getDonationsForDonor = (donorId) => {
  if (!Object.hasOwn(donorsById, donorId)) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donations.filter((donation) => donation.donorId === donorId);
};

// Helper to get donations for a specific recipient
export const getDonationsForRecipient = (recipientId) => {
  if (!Object.hasOwn(recipientsById, recipientId)) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return donations.filter((donation) => donation.recipientId === recipientId);
};

/**
 * The portion of a donation's amount credited to the donor on this row.
 * Generated data precomputes `creditedAmount`; rows with only a `credit`
 * fraction are multiplied out; calculator-created donations have neither and
 * count in full.
 */
export const getCreditedAmount = (donation) => {
  if (donation.creditedAmount !== undefined) {
    return donation.creditedAmount;
  }
  if (donation.credit !== undefined) {
    return donation.amount * donation.credit;
  }
  return donation.amount;
};

// Helper to get total amount received by a recipient
export const getTotalAmountForRecipient = (recipientId) => {
  const recipientDonations = getDonationsForRecipient(recipientId);
  return recipientDonations.reduce((total, donation) => total + getCreditedAmount(donation), 0);
};

/**
 * Extract year from donation date string
 * @param {Object} donation - Donation object with date field
 * @returns {number} Year as integer
 */
export const extractYearFromDonation = (donation) => {
  if (!donation || !donation.date) {
    throw new Error(`Donation missing date: ${JSON.stringify(donation)}`);
  }

  // Handle both "YYYY-MM-DD" and "YYYY" formats
  const dateStr = donation.date.toString();
  const year = parseInt(dateStr.substring(0, 4), 10);

  if (isNaN(year)) {
    throw new Error(`Could not extract valid year from donation date "${donation.date}"`);
  }

  return year;
};

/**
 * Get current year for UI calculations
 * @returns {number} Current year
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const MIN_CALCULATOR_DONATION_YEAR = 1900;

/**
 * Normalize a category-donation amount without guessing what malformed money
 * text meant. Plain digits/decimals and conventionally grouped commas are
 * accepted; unsupported text or misplaced commas return null instead of being
 * stripped into a different amount.
 */
export const normalizeCalculatorDonationAmount = (value, { allowLeadingCurrencySign = false } = {}) => {
  return normalizeFormattedDecimalInput(value, {
    allowNegative: false,
    allowLeadingCurrencySign,
  });
};

/**
 * Parse a calculator-entered donation year without parseInt's permissive
 * prefix behavior (for example, "2024oops" must not silently become 2024).
 * Calculator donations are intentionally limited to the same range the UI
 * exposes.
 */
export const parseCalculatorDonationYear = (value) => {
  let year;
  if (typeof value === 'number') {
    year = value;
  } else if (typeof value === 'string' && /^\d{4}$/.test(value)) {
    year = Number(value);
  } else {
    return null;
  }

  const currentYear = getCurrentYear();
  return Number.isInteger(year) && year >= MIN_CALCULATOR_DONATION_YEAR && year <= currentYear ? year : null;
};

/**
 * Resolve a year value coming from a YearSelector-bound input into a concrete
 * integer year for calculations. YearSelector deliberately emits '' (and other
 * partial states) while the field is being edited, so cost/lives helpers — which
 * assert an integer year — must sanitize it first. Falls back to the current
 * year for any value that does not parse to an integer (empty string,
 * whitespace, non-numeric text, etc.).
 * @param {number|string} value - Year value from a YearSelector-bound input
 * @returns {number} A valid integer year
 */
export const resolveCalcYear = (value) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return getCurrentYear();
  }

  // Interpret the complete value. parseInt would silently turn `2024junk`
  // into 2024, `2e3` into 2, and 2024.9 into 2024.
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && Number.isInteger(parsed) ? parsed : getCurrentYear();
};
