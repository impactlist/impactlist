/* eslint-env node */
/* global process */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeCostPerLifeFromCategory = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract YAML frontmatter
  const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!yamlMatch) {
    console.warn(`Skipping ${filePath} - no YAML frontmatter found`);
    return;
  }

  const yamlContent = yamlMatch[1];
  const remainingContent = content.substring(yamlMatch[0].length);

  // Parse YAML and remove costPerLife line
  const lines = yamlContent.split('\n');
  const filteredLines = [];
  let foundCostPerLife = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('costPerLife:')) {
      filteredLines.push(line);
    } else {
      foundCostPerLife = true;
    }
  }

  if (!foundCostPerLife) {
    return;
  }

  const newYamlContent = filteredLines.join('\n');
  const newContent = `---\n${newYamlContent}\n---${remainingContent}`;

  // Write back to file
  fs.writeFileSync(filePath, newContent);
  console.warn(`Removed costPerLife from ${filePath}`);
};

const removeFromAllCategories = () => {
  const categoriesDir = path.join(__dirname, '../../content/categories');
  const files = fs.readdirSync(categoriesDir);

  for (const file of files) {
    if (file.endsWith('.md') && file !== '_index.md') {
      const filePath = path.join(categoriesDir, file);
      try {
        removeCostPerLifeFromCategory(filePath);
      } catch (error) {
        console.error(`Error removing costPerLife from ${file}:`, error.message);
      }
    }
  }

  console.warn('costPerLife removal completed!');
};

// Run removal if called directly
if (process.argv[1] === __filename) {
  removeFromAllCategories();
}

export { removeFromAllCategories, removeCostPerLifeFromCategory };
