#!/usr/bin/env node

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const categoriesDir = path.join(__dirname, '../content/categories');
const donorsDir = path.join(__dirname, '../content/donors');
const recipientsDir = path.join(__dirname, '../content/recipients');
const donationsDir = path.join(__dirname, '../content/donations');
const globalParametersFile = path.join(__dirname, '../content/globalParameters.md');
const outputFile = path.join(__dirname, '../src/data/generatedData.js');

// Shared text variables for markdown substitution
const MARKDOWN_VARIABLES = {
  CONTRIBUTION_NOTE: `_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._`,
  RECIPIENT_DEFAULT_JUSTIFICATION: `The cost per life of this recipient is assumed to be the same as for the average recipient in each of its categories.
You can see how the cost per life was calculated by going to the page for one of its categories.`,
};

// Replace {{VARIABLE_NAME}} placeholders with actual values
function replaceVariables(content) {
  if (!content) return content;
  let result = content;
  for (const [key, value] of Object.entries(MARKDOWN_VARIABLES)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

// Helper function to format date as YYYY-MM-DD
function formatDateString(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Helper function to extract content excluding "Internal Notes" section
function extractContentExcludingInternalNotes(content) {
  // Split the content into sections based on headers
  const sections = content.split(/(?=^# )/m);

  // Filter out the "Internal Notes" section and join the rest
  const filteredContent = sections
    .filter((section) => !section.trim().startsWith('# Internal Notes'))
    .join('')
    .trim();

  return filteredContent || null;
}

// Load all categories
function loadCategories() {
  const categoryFiles = glob.sync(path.join(categoriesDir, '*.md'));
  const categories = {};

  categoryFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Category file ${path.basename(file)} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Category file ${path.basename(file)} is missing required 'name' field.`);
    }

    // Use ID as the key
    categories[data.id] = {
      name: data.name,
    };

    // Require effects structure - no backwards compatibility
    if (!data.effects || !Array.isArray(data.effects)) {
      throw new Error(
        `Error: Category file ${path.basename(file)} is missing required 'effects' array. All categories must have an effects array in the new format.`
      );
    }

    // Validate each effect has required fields
    data.effects.forEach((effect, index) => {
      if (!effect.effectId || typeof effect.effectId !== 'string') {
        throw new Error(
          `Error: Category file ${path.basename(file)}, effect #${index + 1} is missing required 'effectId' field.`
        );
      }
      if (typeof effect.startTime !== 'number') {
        throw new Error(
          `Error: Category file ${path.basename(file)}, effect #${index + 1} is missing required 'startTime' number field.`
        );
      }
      if (typeof effect.windowLength !== 'number') {
        throw new Error(
          `Error: Category file ${path.basename(file)}, effect #${index + 1} is missing required 'windowLength' number field.`
        );
      }

      // Validate that effect has either costPerQALY or costPerMicroprobability
      const hasCostPerQALY = typeof effect.costPerQALY === 'number';
      const hasCostPerMicroprobability = typeof effect.costPerMicroprobability === 'number';

      if (!hasCostPerQALY && !hasCostPerMicroprobability) {
        throw new Error(
          `Error: Category file ${path.basename(file)}, effect #${index + 1} must have either 'costPerQALY' or 'costPerMicroprobability' field.`
        );
      }

      // If it has costPerMicroprobability, it should also have the required population fields
      if (hasCostPerMicroprobability) {
        if (typeof effect.populationFractionAffected !== 'number') {
          throw new Error(
            `Error: Category file ${path.basename(file)}, effect #${index + 1} with costPerMicroprobability must have 'populationFractionAffected' number field.`
          );
        }
        if (typeof effect.qalyImprovementPerYear !== 'number') {
          throw new Error(
            `Error: Category file ${path.basename(file)}, effect #${index + 1} with costPerMicroprobability must have 'qalyImprovementPerYear' number field.`
          );
        }
      }
    });

    categories[data.id].effects = data.effects;

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);
    if (extractedContent) {
      categories[data.id].content = replaceVariables(extractedContent);
    }
  });

  return categories;
}

// Load all donors
function loadDonors() {
  const donorFiles = glob.sync(path.join(donorsDir, '*.md'));
  const donors = {};

  donorFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Donor file ${path.basename(file)} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Donor file ${path.basename(file)} is missing required 'name' field.`);
    }
    if (typeof data.netWorth !== 'number') {
      throw new Error(`Error: Donor file ${path.basename(file)} is missing required 'netWorth' number field.`);
    }

    // Use ID as the key
    donors[data.id] = {
      name: data.name,
      netWorth: data.netWorth,
    };

    if (data.totalDonated) {
      donors[data.id].totalDonated = data.totalDonated;
    }

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);
    if (extractedContent) {
      donors[data.id].content = replaceVariables(extractedContent);
    }
  });

  return donors;
}

// Load all recipients
function loadRecipients() {
  const recipientFiles = glob.sync(path.join(recipientsDir, '*.md'));
  const recipients = {};

  recipientFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Recipient file ${path.basename(file)} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Recipient file ${path.basename(file)} is missing required 'name' field.`);
    }
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error(`Error: Recipient file ${path.basename(file)} is missing required 'categories' array.`);
    }

    const categoriesObj = {};

    data.categories.forEach((category, index) => {
      // Validate category structure
      if (!category.id || typeof category.id !== 'string') {
        throw new Error(
          `Error: Recipient file ${path.basename(file)}, category #${index + 1} is missing required 'id' field.`
        );
      }
      if (typeof category.fraction !== 'number' || category.fraction <= 0 || category.fraction > 1) {
        throw new Error(
          `Error: Recipient file ${path.basename(file)}, category ${category.id} must have 'fraction' field as a number between 0 and 1.`
        );
      }

      const categoryData = { fraction: category.fraction };

      // Handle effects structure with overrides and multipliers (optional for recipients)
      if (category.effects && Array.isArray(category.effects)) {
        // Validate each effect override/multiplier has proper structure
        category.effects.forEach((effect, index) => {
          if (!effect.effectId || typeof effect.effectId !== 'string') {
            throw new Error(
              `Error: Recipient file ${path.basename(file)}, category ${category.id}, effect #${index + 1} is missing required 'effectId' field.`
            );
          }

          // Must have either overrides or multipliers (or both)
          const hasOverrides = effect.overrides && typeof effect.overrides === 'object';
          const hasMultipliers = effect.multipliers && typeof effect.multipliers === 'object';

          if (!hasOverrides && !hasMultipliers) {
            throw new Error(
              `Error: Recipient file ${path.basename(file)}, category ${category.id}, effect #${index + 1} must have either 'overrides' or 'multipliers' object.`
            );
          }
        });

        categoryData.effects = category.effects;
      }

      categoriesObj[category.id] = categoryData;
    });

    // Use ID as the key
    recipients[data.id] = {
      name: data.name,
      categories: categoriesObj,
    };

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);
    if (extractedContent) {
      recipients[data.id].content = replaceVariables(extractedContent);
    }
  });

  return recipients;
}

// Load all donations
function loadDonations() {
  const donationFiles = glob.sync(path.join(donationsDir, '*.md'));
  const donations = [];

  donationFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);

    if (!data.donations || !Array.isArray(data.donations) || data.donations.length === 0) {
      console.warn(
        `Warning: File ${file} has no valid donations array (missing, empty, or not an array). This file will be skipped.`
      );
      return;
    }

    data.donations.forEach((donation) => {
      if (!donation.recipient || !donation.amount || !donation.date) {
        throw new Error(
          `Error: Donation in ${file} is missing required fields:\n` +
            `  recipient: ${donation.recipient || 'MISSING'}\n` +
            `  amount: ${donation.amount || 'MISSING'}\n` +
            `  date: ${donation.date || 'MISSING'}\n` +
            `Full donation object: ${JSON.stringify(donation, null, 2)}`
        );
      }

      // Format the date as YYYY-MM-DD
      const formattedDate = formatDateString(donation.date);

      // Handle both old format (just a donor string) and new format (credit object)
      if (donation.credit) {
        // New format with credit object
        Object.entries(donation.credit).forEach(([donorId, creditAmount]) => {
          donations.push({
            date: formattedDate,
            donorId,
            recipientId: donation.recipient,
            amount: donation.amount,
            credit: creditAmount,
            source: donation.source,
            notes: donation.notes,
          });
        });
      } else {
        // Derive donor ID from filename for backwards compatibility
        const donorId = path.basename(file, '.md');

        donations.push({
          date: formattedDate,
          donorId,
          recipientId: donation.recipient,
          amount: donation.amount,
          credit: 1.0, // Default to full credit
          source: donation.source,
          notes: donation.notes,
        });
      }
    });
  });

  // Sort donations by date (newest first)
  donations.sort((a, b) => new Date(b.date) - new Date(a.date));

  return donations;
}

// Load all assumptions
function loadAssumptions() {
  const assumptionsDir = path.join(__dirname, '../content/assumptions');

  // Return empty object if directory doesn't exist
  if (!fs.existsSync(assumptionsDir)) {
    return {};
  }

  const assumptionFiles = glob.sync(path.join(assumptionsDir, '*.md'));
  const assumptions = {};

  assumptionFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Assumption file ${path.basename(file)} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Assumption file ${path.basename(file)} is missing required 'name' field.`);
    }

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);

    assumptions[data.id] = {
      id: data.id,
      name: data.name,
      content: replaceVariables(extractedContent) || '',
    };
  });

  return assumptions;
}

// Load global parameters
function loadGlobalParameters() {
  if (!fs.existsSync(globalParametersFile)) {
    throw new Error(`Global parameters file not found: ${globalParametersFile}`);
  }

  const fileContent = fs.readFileSync(globalParametersFile, 'utf8');
  const parsed = matter(fileContent);
  const data = parsed.data;

  // Validate that all required parameters are present
  const requiredParams = [
    'discountRate',
    'populationGrowthRate',
    'timeLimit',
    'populationLimit',
    'currentPopulation',
    'yearsPerLife',
  ];

  for (const param of requiredParams) {
    if (data[param] === undefined || data[param] === null) {
      throw new Error(`Global parameter '${param}' is missing from globalParameters.md`);
    }
  }

  // Validate that numeric parameters are actually numbers
  for (const param of requiredParams) {
    if (typeof data[param] !== 'number') {
      throw new Error(`Global parameter '${param}' must be a number, got ${typeof data[param]}`);
    }
  }

  return data;
}

// Add human-readable fields for compatibility with old code
function addReadableFields(categories, donors, recipients, donations) {
  // Create maps to quickly look up names from IDs
  const donorNameMap = Object.fromEntries(Object.entries(donors).map(([id, data]) => [id, data.name]));

  const recipientNameMap = Object.fromEntries(Object.entries(recipients).map(([id, data]) => [id, data.name]));

  // Add readable fields to each donation
  return donations.map((donation) => {
    const enhanced = { ...donation };
    enhanced.donor = donorNameMap[donation.donorId] || donation.donorId;
    enhanced.recipient = recipientNameMap[donation.recipientId] || donation.recipientId;

    // Clean up undefined fields
    Object.keys(enhanced).forEach((key) => {
      if (enhanced[key] === undefined) {
        delete enhanced[key];
      }
    });

    return enhanced;
  });
}

// Validate that all referenced entities exist in their respective collections
function validateDataIntegrity(categories, donors, recipients, donations) {
  const errors = [];

  // Check all donations reference valid donors and recipients
  donations.forEach((donation, index) => {
    // Check donor exists
    if (!donors[donation.donorId]) {
      errors.push(`Error: Donation #${index + 1} references non-existent donor ID "${donation.donorId}"`);
    }

    // Check recipient exists
    if (!recipients[donation.recipientId]) {
      errors.push(`Error: Donation #${index + 1} references non-existent recipient ID "${donation.recipientId}"`);
    }
  });

  // Check all recipients reference valid categories and effect IDs
  Object.entries(recipients).forEach(([recipientId, recipient]) => {
    Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
      // Check category exists
      if (!categories[categoryId]) {
        errors.push(`Error: Recipient "${recipientId}" references non-existent category ID "${categoryId}"`);
        return; // Skip effect validation if category doesn't exist
      }

      // Check that effect IDs referenced by recipient exist in the base category
      if (categoryData.effects && Array.isArray(categoryData.effects)) {
        const categoryEffectIds = new Set(categories[categoryId].effects.map((effect) => effect.effectId));

        categoryData.effects.forEach((recipientEffect) => {
          if (!categoryEffectIds.has(recipientEffect.effectId)) {
            errors.push(
              `Error: Recipient "${recipientId}" references effect ID "${recipientEffect.effectId}" in category "${categoryId}" that doesn't exist in the base category. ` +
                `Available effect IDs in category "${categoryId}": ${Array.from(categoryEffectIds).join(', ')}`
            );
          }
        });
      }
    });
  });

  // Report errors if any
  if (errors.length > 0) {
    console.error('\n=== VALIDATION ERRORS ===');
    errors.forEach((error) => console.error(error));
    console.error('\nData validation failed. Please fix the errors above before continuing.');
    process.exit(1);
  }

  console.log('All data references validated successfully.');
}

// Generate the JavaScript file
function generateJavaScriptFile() {
  console.log('Loading categories...');
  const categories = loadCategories();

  console.log('Loading donors...');
  const donors = loadDonors();

  console.log('Loading recipients...');
  const recipients = loadRecipients();

  console.log('Loading donations...');
  const rawDonations = loadDonations();

  console.log('Loading global parameters...');
  const globalParameters = loadGlobalParameters();

  console.log('Loading assumptions...');
  const assumptions = loadAssumptions();

  console.log('Validating data integrity...');
  validateDataIntegrity(categories, donors, recipients, rawDonations);

  console.log('Processing donations...');
  const donations = addReadableFields(categories, donors, recipients, rawDonations);

  console.log('Filtering unused entities...');
  const { filteredDonors, filteredRecipients, filteredCategories } = filterUnusedEntities(
    donors,
    recipients,
    categories,
    rawDonations
  );

  // Create compatibility arrays for old code
  const donorsArray = Object.entries(filteredDonors).map(([id, data]) => ({
    id,
    ...data,
  }));

  const recipientsArray = Object.entries(filteredRecipients).map(([id, data]) => ({
    id,
    ...data,
  }));

  let jsContent = `// THIS FILE IS AUTOMATICALLY GENERATED
// DO NOT EDIT DIRECTLY

// Categories by ID
export const categoriesById = ${JSON.stringify(filteredCategories, null, 2)};

// Donors by ID
export const donorsById = ${JSON.stringify(filteredDonors, null, 2)};

// Recipients by ID
export const recipientsById = ${JSON.stringify(filteredRecipients, null, 2)};

// Assumptions by ID
export const assumptionsById = ${JSON.stringify(assumptions, null, 2)};

// All donations
export const allDonations = ${JSON.stringify(donations, null, 2)};

// Backward compatibility exports (arrays instead of objects)
export const effectivenessCategories = ${JSON.stringify(filteredCategories, null, 2)};

export const donors = ${JSON.stringify(donorsArray, null, 2)};

export const recipients = ${JSON.stringify(recipientsArray, null, 2)};

export const donations = ${JSON.stringify(donations, null, 2)};

// Global parameters
export const globalParameters = ${JSON.stringify(globalParameters, null, 2)};
`;

  // Create the direcotry if it doesn't exist
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, jsContent);
  console.log(`Data file generated at ${outputFile}`);

  // Provide some stats
  console.log('');
  console.log('=== STATS ===');
  console.log(`Categories: ${Object.keys(filteredCategories).length} (of ${Object.keys(categories).length} total)`);
  console.log(`Donors: ${Object.keys(filteredDonors).length} (of ${Object.keys(donors).length} total)`);
  console.log(`Recipients: ${Object.keys(filteredRecipients).length} (of ${Object.keys(recipients).length} total)`);
  console.log(`Donations: ${donations.length}`);
}

// Filter out entities that are not used
function filterUnusedEntities(donors, recipients, categories, donations) {
  // Find donors and recipients with donations
  const donorsWithDonations = new Set();
  const recipientsWithDonations = new Set();

  donations.forEach((donation) => {
    donorsWithDonations.add(donation.donorId);
    recipientsWithDonations.add(donation.recipientId);
  });

  // Filter donors and recipients
  const filteredDonors = Object.fromEntries(Object.entries(donors).filter(([id]) => donorsWithDonations.has(id)));

  const filteredRecipients = Object.fromEntries(
    Object.entries(recipients).filter(([id]) => recipientsWithDonations.has(id))
  );

  // Find categories used by recipients who received donations
  const usedCategories = new Set();
  Object.values(filteredRecipients).forEach((recipient) => {
    Object.keys(recipient.categories).forEach((categoryId) => {
      usedCategories.add(categoryId);
    });
  });

  // Filter categories
  const filteredCategories = Object.fromEntries(Object.entries(categories).filter(([id]) => usedCategories.has(id)));

  return {
    filteredDonors,
    filteredRecipients,
    filteredCategories,
  };
}

generateJavaScriptFile();
