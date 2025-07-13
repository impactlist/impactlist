/* eslint-env node */
/* global process */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTargetPopulation = (categoryId) => {
  if (categoryId === 'animal-welfare') {
    return 'mediumAnimal'; // Default assumption for animal welfare
  }
  return 'human';
};

const addEffectParametersToCategory = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract YAML frontmatter
  const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!yamlMatch) {
    console.warn(`Skipping ${filePath} - no YAML frontmatter found`);
    return;
  }

  const yamlContent = yamlMatch[1];
  const remainingContent = content.substring(yamlMatch[0].length);

  // Parse YAML manually
  const lines = yamlContent.split('\n');
  let categoryId = null;
  let categoryName = null;
  let costPerLife = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('id:')) {
      categoryId = trimmed.substring(3).trim().replace(/['"]/g, '');
    } else if (trimmed.startsWith('name:')) {
      categoryName = trimmed.substring(5).trim().replace(/['"]/g, '');
    } else if (trimmed.startsWith('costPerLife:')) {
      const costStr = trimmed.substring(12).trim().replace(/['"_]/g, '');
      costPerLife = parseFloat(costStr);
    }
  }

  if (!categoryId || !categoryName || costPerLife === null) {
    console.warn(`Skipping ${filePath} - missing required fields`);
    return;
  }

  // Define effects for each category
  let effects = [];

  if (categoryId === 'ai-capabilities') {
    // AI capabilities has both harmful (xrisk) and beneficial (science) effects
    effects = [
      {
        name: 'existential risk increase',
        startTime: 10,
        windowLength: 50,
        peoplePerDollar: 1 / 25, // Based on cost per life of 25
        benefitPerYear: -1,
        targetPopulation: 'human',
      },
      {
        name: 'scientific advancement',
        startTime: 0,
        windowLength: 20,
        peoplePerDollar: 1 / 160000, // Use science-tech cost per life
        benefitPerYear: 1,
        targetPopulation: 'human',
      },
    ];
  } else {
    // Most categories have a single effect
    const targetPopulation = getTargetPopulation(categoryId);
    const peoplePerDollar = 1 / Math.abs(costPerLife);
    const benefitPerYear = costPerLife < 0 ? -1 : 1;

    effects = [
      {
        name: 'primary impact',
        startTime: 0,
        windowLength: 1,
        peoplePerDollar: peoplePerDollar,
        benefitPerYear: benefitPerYear,
        targetPopulation: targetPopulation,
      },
    ];
  }

  // Generate new YAML with effects
  const newYaml = [
    '---',
    `id: ${categoryId}`,
    `name: '${categoryName}'`,
    `costPerLife: ${costPerLife}`,
    '',
    '# Effects produced by interventions in this category',
    'effects:',
  ];

  for (const effect of effects) {
    newYaml.push(`  - name: '${effect.name}'`);
    newYaml.push(`    startTime: ${effect.startTime}`);
    newYaml.push(`    windowLength: ${effect.windowLength}`);
    newYaml.push(`    peoplePerDollar: ${effect.peoplePerDollar}`);
    newYaml.push(`    benefitPerYear: ${effect.benefitPerYear}`);
    newYaml.push(`    targetPopulation: '${effect.targetPopulation}'`);
  }

  newYaml.push('---');

  const newContent = newYaml.join('\n') + remainingContent;

  // Write back to file
  fs.writeFileSync(filePath, newContent);
  console.warn(`Updated ${filePath} with default effect parameters`);
};

const updateAllCategories = () => {
  const categoriesDir = path.join(__dirname, '../../content/categories');
  const files = fs.readdirSync(categoriesDir);

  for (const file of files) {
    if (file.endsWith('.md') && file !== '_index.md') {
      const filePath = path.join(categoriesDir, file);
      try {
        addEffectParametersToCategory(filePath);
      } catch (error) {
        console.error(`Error updating ${file}:`, error.message);
      }
    }
  }

  console.warn('Category update completed!');
};

// Run update if called directly
if (process.argv[1] === __filename) {
  updateAllCategories();
}

export { updateAllCategories, addEffectParametersToCategory };
