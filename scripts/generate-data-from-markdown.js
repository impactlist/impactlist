#!/usr/bin/env node

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

// Load all categories
function loadCategories() {
  const categoryFiles = glob.sync(path.join(categoriesDir, '*.md'));
  const categories = {};
  
  categoryFiles.forEach(file => {
    if (path.basename(file) === '_index.md') return;
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);
    
    // Use ID as the key
    categories[data.id] = {
      name: data.name,
      costPerLife: data.costPerLife
    };
  });
  
  return categories;
}

// Load all donors
function loadDonors() {
  const donorFiles = glob.sync(path.join(donorsDir, '*.md'));
  const donors = {};
  
  donorFiles.forEach(file => {
    if (path.basename(file) === '_index.md') return;
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);
    
    // Use ID as the key
    donors[data.id] = {
      name: data.name,
      netWorth: data.netWorth
    };
    
    if (data.totalDonated) {
      donors[data.id].totalDonated = data.totalDonated;
    }
  });
  
  return donors;
}

// Load all recipients
function loadRecipients() {
  const recipientFiles = glob.sync(path.join(recipientsDir, '*.md'));
  const recipients = {};
  
  recipientFiles.forEach(file => {
    if (path.basename(file) === '_index.md') return;
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);
    
    const categoriesObj = {};
    
    data.categories.forEach(category => {
      const categoryData = { fraction: category.fraction };
      if (category.costPerLife !== undefined) {
        categoryData.costPerLife = category.costPerLife;
      }
      if (category.multiplier !== undefined) {
        categoryData.multiplier = category.multiplier;
      }
      categoriesObj[category.id] = categoryData;
    });
    
    // Use ID as the key
    recipients[data.id] = {
      name: data.name,
      categories: categoriesObj
    };
  });
  
  return recipients;
}

// Load all donations
function loadDonations() {
  const donationFiles = glob.sync(path.join(donationsDir, '*.md'));
  const donations = [];
  
  donationFiles.forEach(file => {
    if (path.basename(file) === '_index.md') return;
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);
    
    if (!data.donations || !Array.isArray(data.donations)) {
      throw new Error(`Error: File ${file} is missing required 'donations' array property. Each donation file must contain a 'donations' array with donation objects.`);
    }
    
    data.donations.forEach(donation => {
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
            notes: donation.notes
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
          notes: donation.notes
        });
      }
    });
  });
  
  // Sort donations by date (newest first)
  donations.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return donations;
}

// Add human-readable fields for compatibility with old code
function addReadableFields(categories, donors, recipients, donations) {
  // Create maps to quickly look up names from IDs
  const donorNameMap = Object.fromEntries(
    Object.entries(donors).map(([id, data]) => [id, data.name])
  );
  
  const recipientNameMap = Object.fromEntries(
    Object.entries(recipients).map(([id, data]) => [id, data.name])
  );
  
  // Add readable fields to each donation
  return donations.map(donation => {
    const enhanced = { ...donation };
    enhanced.donor = donorNameMap[donation.donorId] || donation.donorId;
    enhanced.recipient = recipientNameMap[donation.recipientId] || donation.recipientId;
    
    // Clean up undefined fields
    Object.keys(enhanced).forEach(key => {
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
    Object.keys(recipient.categories).forEach(categoryId => {
      if (!categories[categoryId]) {
        errors.push(`Error: Recipient "${recipientId}" references non-existent category ID "${categoryId}"`);
      }
    });
  });

  // Report errors if any
  if (errors.length > 0) {
    console.error('\n=== VALIDATION ERRORS ===');
    errors.forEach(error => console.error(error));
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
  
  // Create compatibility arrays for old code
  const donorsArray = Object.entries(donors).map(([id, data]) => ({
    id,
    ...data
  }));
  
  const recipientsArray = Object.entries(recipients).map(([id, data]) => ({
    id,
    ...data
  }));
  
  let jsContent = `// THIS FILE IS AUTOMATICALLY GENERATED
// DO NOT EDIT DIRECTLY

// Categories by ID
export const categoriesById = ${JSON.stringify(categories, null, 2)};

// Donors by ID
export const donorsById = ${JSON.stringify(donors, null, 2)};

// Recipients by ID
export const recipientsById = ${JSON.stringify(recipients, null, 2)};

// All donations
export const allDonations = ${JSON.stringify(donations, null, 2)};

// Backward compatibility exports (arrays instead of objects)
export const effectivenessCategories = ${JSON.stringify(categories, null, 2)};

export const donors = ${JSON.stringify(donorsArray, null, 2)};

export const recipients = ${JSON.stringify(recipientsArray, null, 2)};

export const donations = ${JSON.stringify(donations, null, 2)};
`;
  
  fs.writeFileSync(outputFile, jsContent);
  console.log(`Data file generated at ${outputFile}`);
  
  // Provide some stats
  console.log('');
  console.log('=== STATS ===');
  console.log(`Categories: ${Object.keys(categories).length}`);
  console.log(`Donors: ${Object.keys(donors).length}`);
  console.log(`Recipients: ${Object.keys(recipients).length}`);
  console.log(`Donations: ${donations.length}`);
}

generateJavaScriptFile(); 