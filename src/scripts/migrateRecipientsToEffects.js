/* eslint-env node */
/* global process */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertCategoryToEffect = (categoryData, categoryId) => {
  const effect = {
    categoryId: categoryId,
    fraction: categoryData.fraction,
    effects: {},
  };

  // For now, apply the legacy multiplier to the primary effect of the category
  // Most categories will have a single "primary impact" effect
  if (categoryData.multiplier !== undefined) {
    effect.effects['primary impact'] = {
      peoplePerDollarMultiplier: categoryData.multiplier,
    };
  }

  return effect;
};

const migrateRecipientFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract YAML frontmatter
  const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!yamlMatch) {
    console.warn(`Skipping ${filePath} - no YAML frontmatter found`);
    return;
  }

  const yamlContent = yamlMatch[1];
  const remainingContent = content.substring(yamlMatch[0].length);

  // Parse YAML manually (simple parsing for our use case)
  const lines = yamlContent.split('\n');
  const parsed = {};
  let currentCategories = [];
  let inCategories = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('id:')) {
      parsed.id = trimmed.substring(3).trim().replace(/['"]/g, '');
    } else if (trimmed.startsWith('name:')) {
      parsed.name = trimmed.substring(5).trim().replace(/['"]/g, '');
    } else if (trimmed === 'categories:') {
      inCategories = true;
    } else if (inCategories && trimmed.startsWith('- id:')) {
      const categoryId = trimmed.substring(5).trim().replace(/['"]/g, '');
      currentCategories.push({ id: categoryId, fraction: 1.0 });
    } else if (inCategories && trimmed.startsWith('fraction:')) {
      const fraction = parseFloat(trimmed.substring(9).trim());
      if (currentCategories.length > 0) {
        currentCategories[currentCategories.length - 1].fraction = fraction;
      }
    } else if (inCategories && trimmed.startsWith('multiplier:')) {
      const multiplier = parseFloat(trimmed.substring(11).trim());
      if (currentCategories.length > 0) {
        currentCategories[currentCategories.length - 1].multiplier = multiplier;
      }
    } else if (inCategories && trimmed && !trimmed.startsWith('-') && !trimmed.includes(':')) {
      inCategories = false;
    }
  }

  // Skip if no categories to migrate
  if (currentCategories.length === 0) {
    console.warn(`Skipping ${filePath} - no categories found`);
    return;
  }

  // Convert categories to effects
  const effects = currentCategories.map((cat) => convertCategoryToEffect(cat, cat.id));

  // Generate new YAML
  const newYaml = ['---', `id: ${parsed.id}`, `name: '${parsed.name}'`, 'effects:'];

  for (const effect of effects) {
    newYaml.push(`  - categoryId: ${effect.categoryId}`);
    newYaml.push(`    fraction: ${effect.fraction}`);

    // Add effect-specific overrides if they exist
    if (Object.keys(effect.effects).length > 0) {
      newYaml.push(`    effects:`);
      for (const [effectName, effectOverrides] of Object.entries(effect.effects)) {
        newYaml.push(`      '${effectName}':`);
        for (const [paramName, paramValue] of Object.entries(effectOverrides)) {
          newYaml.push(`        ${paramName}: ${paramValue}`);
        }
      }
    }
  }

  newYaml.push('---');

  const newContent = newYaml.join('\n') + remainingContent;

  // Write back to file
  fs.writeFileSync(filePath, newContent);
  console.warn(`Migrated ${filePath}`);
};

const migrateAllRecipients = () => {
  const recipientsDir = path.join(__dirname, '../../content/recipients');
  const files = fs.readdirSync(recipientsDir);

  for (const file of files) {
    if (file.endsWith('.md') && file !== '_index.md') {
      const filePath = path.join(recipientsDir, file);
      try {
        migrateRecipientFile(filePath);
      } catch (error) {
        console.error(`Error migrating ${file}:`, error.message);
      }
    }
  }

  console.warn('Migration completed!');
};

// Run migration if called directly
if (process.argv[1] === __filename) {
  migrateAllRecipients();
}

export { migrateAllRecipients, migrateRecipientFile };
