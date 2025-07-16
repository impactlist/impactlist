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
const recipientsDir = path.join(__dirname, '../content/recipients');

// Helper function to format numbers with underscores for large values
function formatNumberWithUnderscores(num) {
  // Always return the actual number - YAML serialization will handle proper formatting
  return num;
}

// Helper function to convert costPerLife to QALY-based effect
function costPerLifeToEffect(costPerLife) {
  // Assume average life expectancy remaining is 40 years
  // Assume 1 QALY per year of life
  const avgLifeYears = 40;
  const qalyPerLife = avgLifeYears * 1.0; // 1 QALY per year

  return {
    effectId: 'standard',
    startTime: 0,
    windowLength: 1, // Immediate effect
    costPerQALY: formatNumberWithUnderscores(costPerLife / qalyPerLife),
  };
}

// Migrate a single category file
function migrateCategoryFile(filePath) {
  console.log(`Migrating category: ${path.basename(filePath)}`);

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Skip if already has effects
  if (data.effects) {
    console.log(`  - Already has effects, skipping`);
    return;
  }

  // Skip if no costPerLife
  if (!data.costPerLife) {
    console.log(`  - No costPerLife found, skipping`);
    return;
  }

  // Convert costPerLife to effect
  const effect = costPerLifeToEffect(data.costPerLife);

  // Update the data while preserving name quoting
  const newData = {
    ...data,
    effects: [effect],
  };

  // Remove the old costPerLife field
  delete newData.costPerLife;

  // Reconstruct the file without migration comments
  let newFrontMatter = matter.stringify(content, newData);

  // Preserve single quotes around the name field if it was originally quoted
  if (data.name && typeof data.name === 'string') {
    // Escape special regex characters in the name
    const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp(`^name: ${escapedName}$`, 'm');
    newFrontMatter = newFrontMatter.replace(namePattern, `name: '${data.name}'`);
  }

  // Add underscores to large numbers for readability ONLY in the YAML frontmatter section
  const frontMatterEnd = newFrontMatter.indexOf('---', 3); // Find the ending ---
  if (frontMatterEnd !== -1) {
    const yamlSection = newFrontMatter.substring(0, frontMatterEnd);
    const contentSection = newFrontMatter.substring(frontMatterEnd);

    const formattedYaml = yamlSection.replace(/(\b\d{4,}\b)/g, (match) => {
      const num = parseInt(match);
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
    });

    newFrontMatter = formattedYaml + contentSection;
  }

  // Write the file
  fs.writeFileSync(filePath, newFrontMatter);
  console.log(`  - Converted costPerLife ${data.costPerLife} to effect with costPerQALY ${effect.costPerQALY}`);
}

// Migrate a single recipient file
function migrateRecipientFile(filePath) {
  console.log(`Migrating recipient: ${path.basename(filePath)}`);

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  let hasChanges = false;

  // Update categories
  if (data.categories && Array.isArray(data.categories)) {
    data.categories = data.categories.map((category) => {
      const newCategory = { ...category };

      // Skip if already has effects
      if (category.effects) {
        return newCategory;
      }

      // Handle costPerLife override
      if (category.costPerLife !== undefined) {
        const effect = costPerLifeToEffect(category.costPerLife);
        newCategory.effects = [
          {
            effectId: effect.effectId,
            overrides: {
              costPerQALY: effect.costPerQALY,
            },
          },
        ];
        delete newCategory.costPerLife;
        hasChanges = true;
        console.log(`  - Converted category ${category.id} costPerLife ${category.costPerLife} to effect override`);
      }

      // Handle multiplier
      if (category.multiplier !== undefined) {
        if (!newCategory.effects) {
          newCategory.effects = [
            {
              effectId: 'standard', // Default effect ID for QALY-based effects
              multipliers: {
                costPerQALY: category.multiplier,
              },
            },
          ];
        } else if (newCategory.effects[0]) {
          if (!newCategory.effects[0].multipliers) {
            newCategory.effects[0].multipliers = {};
          }
          newCategory.effects[0].multipliers.costPerQALY = category.multiplier;
        }
        delete newCategory.multiplier;
        hasChanges = true;
        console.log(`  - Converted category ${category.id} multiplier ${category.multiplier} to effect multiplier`);
      }

      return newCategory;
    });
  }

  if (!hasChanges) {
    console.log(`  - No changes needed`);
    return;
  }

  // Reconstruct the file
  let newFrontMatter = matter.stringify(content, data);

  // Preserve single quotes around the name field if it exists
  if (data.name && typeof data.name === 'string') {
    // Escape special regex characters in the name
    const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp(`^name: ${escapedName}$`, 'm');
    newFrontMatter = newFrontMatter.replace(namePattern, `name: '${data.name}'`);
  }

  // Add underscores to large numbers for readability ONLY in the YAML frontmatter section
  const frontMatterEnd = newFrontMatter.indexOf('---', 3); // Find the ending ---
  if (frontMatterEnd !== -1) {
    const yamlSection = newFrontMatter.substring(0, frontMatterEnd);
    const contentSection = newFrontMatter.substring(frontMatterEnd);

    const formattedYaml = yamlSection.replace(/(\b\d{4,}\b)/g, (match) => {
      const num = parseInt(match);
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
    });

    newFrontMatter = formattedYaml + contentSection;
  }

  // Write the file
  fs.writeFileSync(filePath, newFrontMatter);
  console.log(`  - Migration completed`);
}

// Main migration function
function runMigration() {
  console.log('Starting migration to effects-based format...\n');

  // Migrate categories
  console.log('=== MIGRATING CATEGORIES ===');
  const categoryFiles = glob.sync(path.join(categoriesDir, '*.md'));
  categoryFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;
    migrateCategoryFile(file);
  });

  console.log('\n=== MIGRATING RECIPIENTS ===');
  const recipientFiles = glob.sync(path.join(recipientsDir, '*.md'));
  recipientFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;
    migrateRecipientFile(file);
  });

  console.log('\nMigration completed!');
  console.log('\nNext steps:');
  console.log('1. Review the migrated files');
  console.log('2. Update any categories to use more sophisticated effects models');
  console.log('3. Run the data generation script to test');
  console.log('4. Update the impact calculation functions');
}

// Run the migration
runMigration();
