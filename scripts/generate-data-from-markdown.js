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
const outputFile = path.join(__dirname, '../src/data/generatedData.js');

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

    // Use ID as the key
    categories[data.id] = {
      name: data.name,
    };

    // Add effects if they exist
    if (data.effects && Array.isArray(data.effects)) {
      categories[data.id].effects = data.effects;
    }

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);
    if (extractedContent) {
      categories[data.id].content = extractedContent;
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
      donors[data.id].content = extractedContent;
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

    // Use ID as the key
    recipients[data.id] = {
      name: data.name,
    };

    // Handle new effects format
    if (data.effects && Array.isArray(data.effects)) {
      recipients[data.id].effects = data.effects;
    }

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content);
    if (extractedContent) {
      recipients[data.id].content = extractedContent;
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

    if (!data.donations || !Array.isArray(data.donations)) {
      throw new Error(
        `Error: File ${file} is missing required 'donations' array property. Each donation file must contain a 'donations' array with donation objects.`
      );
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
        throw new Error(
          `Error: Donation in ${file} is missing required 'credit' field. All donations must use the new credit format with donor IDs and credit amounts.`
        );
      }
    });
  });

  // Sort donations by date (newest first)
  donations.sort((a, b) => new Date(b.date) - new Date(a.date));

  return donations;
}

// Add human-readable fields to donations
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

  // Check all recipients reference valid categories
  Object.entries(recipients).forEach(([recipientId, recipient]) => {
    // Check new effects format
    if (recipient.effects) {
      recipient.effects.forEach((effect, index) => {
        if (effect.categoryId && !categories[effect.categoryId]) {
          errors.push(
            `Error: Recipient "${recipientId}" effect ${index + 1} references non-existent category ID "${effect.categoryId}"`
          );
        }
      });
    }
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

  // Create arrays for convenient iteration
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

// All donations
export const allDonations = ${JSON.stringify(donations, null, 2)};

export const donors = ${JSON.stringify(donorsArray, null, 2)};

export const recipients = ${JSON.stringify(recipientsArray, null, 2)};

export const donations = ${JSON.stringify(donations, null, 2)};
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
    // Handle new effects format
    if (recipient.effects) {
      recipient.effects.forEach((effect) => {
        if (effect.categoryId) {
          usedCategories.add(effect.categoryId);
        }
      });
    }
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
