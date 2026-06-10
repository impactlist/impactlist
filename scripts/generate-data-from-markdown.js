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
const assumptionProfilesDir = path.join(__dirname, '../content/assumptions/profiles');
const outputFile = path.join(__dirname, '../src/data/generatedData.js');

// Shared text variables for markdown substitution
const MARKDOWN_VARIABLES = {
  CONTRIBUTION_NOTE: `_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._`,
  RECIPIENT_DEFAULT_JUSTIFICATION: `The cost per life of this recipient is assumed to be the same as for the baseline for each of its cause areas.
You can see how these cost per life values were calculated by going to the pages of its associated cause areas (see above).`,
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

function getRawFrontmatterScalar(fileContent, key) {
  const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const fieldMatch = frontmatterMatch[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return fieldMatch ? fieldMatch[1].trim() : null;
}

// Validate a date written as YYYY-MM-DD and confirm it's a real calendar date.
// Content dates must always be validated from the raw frontmatter text, never
// from parsed YAML values: YAML silently rolls invalid dates over
// (2021-02-30 becomes 2021-03-02) and parses non-ISO formats in the build
// machine's local timezone.
function normalizeStrictDateString(rawValue, errorPrefix) {
  const normalized = String(rawValue)
    .trim()
    .replace(/^['"]|['"]$/g, '');

  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`${errorPrefix} Expected YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalizedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    normalizedDate.getUTCFullYear() !== year ||
    normalizedDate.getUTCMonth() !== month - 1 ||
    normalizedDate.getUTCDate() !== day
  ) {
    throw new Error(`${errorPrefix} Expected a real calendar date.`);
  }

  return normalized;
}

function normalizeBirthDate(rawBirthDate, filename) {
  return normalizeStrictDateString(rawBirthDate, `Error: Donor file ${filename} has invalid 'birthDate'.`);
}

// Pull the raw text of every (uncommented) `date:` line out of a donations
// file's frontmatter, in document order. See normalizeStrictDateString for why
// we can't use the YAML-parsed date values.
function extractRawDonationDates(fileContent, fileName) {
  // Like gray-matter, accept frontmatter terminated by either a closing
  // delimiter or the end of the file.
  const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)(?:\n---|$)/);
  if (!frontmatterMatch) {
    throw new Error(`Error: Donations file ${fileName} has no frontmatter block.`);
  }

  return frontmatterMatch[1]
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .map((line) => line.match(/^\s*(?:-\s+)?date:\s*(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1]);
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

// Curated assumption overrides only compare scalar fields plus scalar arrays, never nested objects.
function areComparableFieldValuesEqual(valueA, valueB) {
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    if (valueA.length !== valueB.length) {
      return false;
    }

    return valueA.every((item, index) => areComparableFieldValuesEqual(item, valueB[index]));
  }

  if (Array.isArray(valueA) || Array.isArray(valueB)) {
    return false;
  }

  return valueA === valueB;
}

function buildDefaultAssumptions(globalParameters, categories, recipients) {
  return {
    globalParameters: JSON.parse(JSON.stringify(globalParameters)),
    categories: JSON.parse(JSON.stringify(categories)),
    recipients: JSON.parse(JSON.stringify(recipients)),
  };
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
    if (!data.about || typeof data.about !== 'string' || data.about.trim().length === 0) {
      throw new Error(`Error: Donor file ${path.basename(file)} is missing required 'about' string field.`);
    }

    // Use ID as the key
    donors[data.id] = {
      name: data.name,
      netWorth: data.netWorth,
      about: data.about.trim(),
    };

    const rawBirthDate = getRawFrontmatterScalar(fileContent, 'birthDate');
    if (rawBirthDate !== null) {
      donors[data.id].birthDate = normalizeBirthDate(rawBirthDate, path.basename(file));
    }

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

const DONATION_FIELDS = new Set(['date', 'recipient', 'amount', 'credit', 'source', 'notes']);
const CREDIT_SUM_TOLERANCE = 0.001;
const DONATION_YEAR_MIN = 1900;
const DONATION_YEAR_MAX = 2100;

// Identities of a donation event, used to reject duplicates (the same event
// recorded twice double-counts the donor and/or the recipient):
// - exactKey catches byte-for-byte re-records (credit included).
// - eventKey additionally catches the same event attributed to different
//   donors in different files (e.g. two research passes each crediting "their"
//   donor with 1.0) by excluding credit.
// 'notes' is part of both identities so genuinely separate-but-identical
// donations can be disambiguated with distinct notes. 'source' is part of
// neither: the same event cited from two sources is still the same event.
function buildDonationKeys(donation, date) {
  const creditKey = Object.entries(donation.credit)
    .map(([donorId, creditAmount]) => `${donorId}:${creditAmount}`)
    .sort()
    .join(',');
  const eventIdentity = [donation.recipient, date, donation.amount, donation.notes ?? null];
  return {
    exactKey: JSON.stringify([...eventIdentity, creditKey]),
    eventKey: JSON.stringify(eventIdentity),
  };
}

function validateDonationFields(donation, context) {
  Object.keys(donation).forEach((key) => {
    if (!DONATION_FIELDS.has(key)) {
      throw new Error(`${context} has unknown field '${key}'. Allowed fields: ${[...DONATION_FIELDS].join(', ')}.`);
    }
  });

  if (typeof donation.recipient !== 'string' || donation.recipient.trim() === '') {
    throw new Error(`${context} is missing a valid 'recipient'. Got: ${JSON.stringify(donation.recipient)}`);
  }
}

function validateDonationAmountAndCredit(donation, context) {
  if (typeof donation.amount !== 'number' || !Number.isFinite(donation.amount) || donation.amount <= 0) {
    throw new Error(`${context} must have a positive numeric 'amount'. Got: ${JSON.stringify(donation.amount)}`);
  }

  if (!isPlainObject(donation.credit) || Object.keys(donation.credit).length === 0) {
    throw new Error(
      `${context} must have a non-empty 'credit' object mapping donor IDs to credit fractions. ` +
        `Got: ${JSON.stringify(donation.credit)}`
    );
  }

  let creditSum = 0;
  Object.entries(donation.credit).forEach(([donorId, creditAmount]) => {
    if (typeof creditAmount !== 'number' || !Number.isFinite(creditAmount) || creditAmount <= 0 || creditAmount > 1) {
      throw new Error(
        `${context} has invalid credit for donor "${donorId}". ` +
          `Credit must be a number in (0, 1]. Got: ${JSON.stringify(creditAmount)}`
      );
    }
    creditSum += creditAmount;
  });

  if (Math.abs(creditSum - 1) > CREDIT_SUM_TOLERANCE) {
    throw new Error(
      `${context} has credit values that sum to ${creditSum} instead of 1. ` +
        `Credit must describe how 100% of the donation is attributed across donors.`
    );
  }

  ['source', 'notes'].forEach((field) => {
    if (donation[field] !== undefined && (typeof donation[field] !== 'string' || donation[field].trim() === '')) {
      throw new Error(`${context} has invalid '${field}'. Got: ${JSON.stringify(donation[field])}`);
    }
  });
}

// Load all donations
function loadDonations() {
  const donationFiles = glob.sync(path.join(donationsDir, '*.md'));
  const donations = [];
  // Map each donation's identities (see buildDonationKeys) to the file that
  // first declared them, so duplicates fail the build instead of silently
  // inflating totals.
  const seenDonations = new Map();
  const seenDonationEvents = new Map();

  donationFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data } = matter(fileContent);

    if (!Array.isArray(data.donations)) {
      throw new Error(
        `Error: Donations file ${fileName} must contain a 'donations' array in its frontmatter. ` +
          `Use 'donations: []' if the file intentionally has no donations yet.`
      );
    }

    const rawDates = extractRawDonationDates(fileContent, fileName);
    if (rawDates.length !== data.donations.length) {
      throw new Error(
        `Error: Donations file ${fileName} has ${rawDates.length} uncommented 'date:' lines but ` +
          `${data.donations.length} donations. Every donation must have exactly one 'date:' line and no other ` +
          `frontmatter key may be named 'date'.`
      );
    }

    data.donations.forEach((donation, index) => {
      validateDonationFields(donation, `Error: Donation #${index + 1} in ${fileName}`);

      const date = normalizeStrictDateString(
        rawDates[index],
        `Error: Donation #${index + 1} in ${fileName} (recipient: ${donation.recipient}) has invalid date ` +
          `"${rawDates[index]}".`
      );
      const context = `Error: Donation #${index + 1} in ${fileName} (recipient: ${donation.recipient}, date: ${date})`;

      const year = Number(date.slice(0, 4));
      if (year < DONATION_YEAR_MIN || year > DONATION_YEAR_MAX) {
        throw new Error(
          `${context} has a year outside the plausible range ${DONATION_YEAR_MIN}-${DONATION_YEAR_MAX}. ` +
            `Fix the date or widen the bounds in this script.`
        );
      }

      validateDonationAmountAndCredit(donation, context);

      const { exactKey, eventKey } = buildDonationKeys(donation, date);
      const exactDuplicateFile = seenDonations.get(exactKey);
      if (exactDuplicateFile) {
        throw new Error(
          `${context} is an exact duplicate of a donation in ${exactDuplicateFile}. Every donation event must be ` +
            `recorded exactly once across all files; use the 'credit' map to attribute joint donations. ` +
            `If these are genuinely separate donations, give each a distinct 'notes' field explaining the difference.`
        );
      }

      const sameEventFile = seenDonationEvents.get(eventKey);
      if (sameEventFile) {
        throw new Error(
          `${context} matches a donation in ${sameEventFile} on recipient, date, and amount but with different ` +
            `credit — this usually means the same donation event was recorded once per donor. If so, merge them ` +
            `into a single entry (in one file) whose 'credit' map covers all donors. If these are genuinely ` +
            `separate donations, give each a distinct 'notes' field explaining the difference.`
        );
      }

      seenDonations.set(exactKey, fileName);
      seenDonationEvents.set(eventKey, fileName);

      Object.entries(donation.credit).forEach(([donorId, creditAmount]) => {
        donations.push({
          date,
          donorId,
          recipientId: donation.recipient,
          amount: donation.amount,
          credit: creditAmount,
          creditedAmount: donation.amount * creditAmount,
          source: donation.source,
          notes: donation.notes,
          // Build-time-only context for error messages; stripped before output.
          sourceFile: fileName,
        });
      });
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

function getCategoryDefaultEffect(defaultAssumptions, categoryId, effectId) {
  return defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId) || null;
}

function getRecipientDefaultEffect(defaultAssumptions, recipientId, categoryId, effectId) {
  const recipientEffect =
    defaultAssumptions.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.find(
      (effect) => effect.effectId === effectId
    ) || null;

  if (recipientEffect) {
    return recipientEffect;
  }

  return getCategoryDefaultEffect(defaultAssumptions, categoryId, effectId);
}

function assertCuratedEffectArray(effects, fileName, scopeLabel) {
  if (!Array.isArray(effects)) {
    throw new Error(`Error: Curated assumptions profile ${fileName} ${scopeLabel} must have an 'effects' array.`);
  }
}

function normalizeCategoryEffectField(normalizedEffect, defaultEffect, fieldName, value, fileName, scopeLabel) {
  if (fieldName === 'disabled') {
    const normalizedDisabled = Boolean(value);
    const defaultDisabled = Boolean(defaultEffect.disabled);
    if (normalizedDisabled !== defaultDisabled) {
      normalizedEffect.disabled = normalizedDisabled;
    }
    return;
  }

  if (!Object.hasOwn(defaultEffect, fieldName)) {
    throw new Error(
      `Error: Curated assumptions profile ${fileName} ${scopeLabel} effect "${normalizedEffect.effectId}" references unknown field "${fieldName}".`
    );
  }

  if (!areComparableFieldValuesEqual(value, defaultEffect[fieldName])) {
    normalizedEffect[fieldName] = value;
  }
}

function normalizeCuratedEffects(effects, { fileName, scopeLabel, getDefaultEffect, normalizeEffectFields }) {
  assertCuratedEffectArray(effects, fileName, scopeLabel);

  const normalizedEffects = [];

  effects.forEach((effect, effectIndex) => {
    if (!isPlainObject(effect)) {
      throw new Error(
        `Error: Curated assumptions profile ${fileName} ${scopeLabel} effect #${effectIndex + 1} must be an object.`
      );
    }

    if (!effect.effectId || typeof effect.effectId !== 'string') {
      throw new Error(
        `Error: Curated assumptions profile ${fileName} ${scopeLabel} effect #${effectIndex + 1} is missing required 'effectId'.`
      );
    }

    const defaultEffect = getDefaultEffect(effect.effectId);
    if (!defaultEffect) {
      throw new Error(
        `Error: Curated assumptions profile ${fileName} references unknown effect "${effect.effectId}" in ${scopeLabel}.`
      );
    }

    const normalizedEffect = { effectId: effect.effectId };
    normalizeEffectFields({ effect, normalizedEffect, defaultEffect, fileName, scopeLabel });

    if (Object.keys(normalizedEffect).length > 1) {
      normalizedEffects.push(normalizedEffect);
    }
  });

  return normalizedEffects;
}

function normalizeCuratedCategoryEffects(effects, defaultAssumptions, categoryId, fileName) {
  const scopeLabel = `category "${categoryId}"`;

  return normalizeCuratedEffects(effects, {
    fileName,
    scopeLabel,
    getDefaultEffect: (effectId) => getCategoryDefaultEffect(defaultAssumptions, categoryId, effectId),
    normalizeEffectFields: ({ effect, normalizedEffect, defaultEffect, fileName: effectFileName, scopeLabel }) => {
      Object.entries(effect).forEach(([fieldName, value]) => {
        if (fieldName === 'effectId' || fieldName.startsWith('_')) {
          return;
        }

        normalizeCategoryEffectField(normalizedEffect, defaultEffect, fieldName, value, effectFileName, scopeLabel);
      });
    },
  });
}

function normalizeCuratedRecipientEffects(effects, defaultAssumptions, recipientId, categoryId, fileName) {
  const scopeLabel = `recipient "${recipientId}" category "${categoryId}"`;

  return normalizeCuratedEffects(effects, {
    fileName,
    scopeLabel,
    getDefaultEffect: (effectId) => getRecipientDefaultEffect(defaultAssumptions, recipientId, categoryId, effectId),
    normalizeEffectFields: ({ effect, normalizedEffect, defaultEffect, fileName: effectFileName, scopeLabel }) => {
      Object.entries(effect).forEach(([fieldName, value]) => {
        if (fieldName === 'effectId' || fieldName.startsWith('_')) {
          return;
        }

        if (fieldName === 'overrides') {
          if (!isPlainObject(value)) {
            throw new Error(
              `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" must use an object for 'overrides'.`
            );
          }

          const normalizedOverrides = {};
          Object.entries(value).forEach(([overrideFieldName, overrideValue]) => {
            if (!Object.hasOwn(defaultEffect, overrideFieldName)) {
              throw new Error(
                `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" override references unknown field "${overrideFieldName}".`
              );
            }

            if (!areComparableFieldValuesEqual(overrideValue, defaultEffect[overrideFieldName])) {
              normalizedOverrides[overrideFieldName] = overrideValue;
            }
          });

          if (Object.keys(normalizedOverrides).length > 0) {
            normalizedEffect.overrides = normalizedOverrides;
          }
          return;
        }

        if (fieldName === 'multipliers') {
          if (!isPlainObject(value)) {
            throw new Error(
              `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" must use an object for 'multipliers'.`
            );
          }

          const normalizedMultipliers = {};
          Object.entries(value).forEach(([multiplierFieldName, multiplierValue]) => {
            if (!Object.hasOwn(defaultEffect, multiplierFieldName)) {
              throw new Error(
                `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" multiplier references unknown field "${multiplierFieldName}".`
              );
            }

            if (multiplierValue !== 1) {
              normalizedMultipliers[multiplierFieldName] = multiplierValue;
            }
          });

          if (Object.keys(normalizedMultipliers).length > 0) {
            normalizedEffect.multipliers = normalizedMultipliers;
          }
          return;
        }

        if (fieldName === 'disabled') {
          const normalizedDisabled = Boolean(value);
          const defaultDisabled = Boolean(defaultEffect.disabled);
          if (normalizedDisabled !== defaultDisabled) {
            normalizedEffect.disabled = normalizedDisabled;
          }
          return;
        }

        throw new Error(
          `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" has unsupported field "${fieldName}".`
        );
      });
    },
  });
}

function normalizeCuratedAssumptions(assumptions, defaultAssumptions, fileName) {
  if (!isPlainObject(assumptions)) {
    throw new Error(`Error: Curated assumptions profile ${fileName} must define 'assumptions' as an object.`);
  }

  const normalized = {};
  const allowedTopLevelKeys = new Set(['globalParameters', 'categories', 'recipients']);

  Object.keys(assumptions).forEach((key) => {
    if (!allowedTopLevelKeys.has(key)) {
      throw new Error(`Error: Curated assumptions profile ${fileName} has unknown top-level assumptions key "${key}".`);
    }
  });

  if (assumptions.globalParameters !== undefined) {
    if (!isPlainObject(assumptions.globalParameters)) {
      throw new Error(`Error: Curated assumptions profile ${fileName} must use an object for 'globalParameters'.`);
    }

    const normalizedGlobalParameters = {};
    Object.entries(assumptions.globalParameters).forEach(([parameterName, value]) => {
      if (!Object.hasOwn(defaultAssumptions.globalParameters, parameterName)) {
        throw new Error(
          `Error: Curated assumptions profile ${fileName} references unknown global parameter "${parameterName}".`
        );
      }

      if (!areComparableFieldValuesEqual(value, defaultAssumptions.globalParameters[parameterName])) {
        normalizedGlobalParameters[parameterName] = value;
      }
    });

    if (Object.keys(normalizedGlobalParameters).length > 0) {
      normalized.globalParameters = normalizedGlobalParameters;
    }
  }

  if (assumptions.categories !== undefined) {
    if (!isPlainObject(assumptions.categories)) {
      throw new Error(`Error: Curated assumptions profile ${fileName} must use an object for 'categories'.`);
    }

    const normalizedCategories = {};
    Object.entries(assumptions.categories).forEach(([categoryId, categoryData]) => {
      if (!defaultAssumptions.categories[categoryId]) {
        throw new Error(`Error: Curated assumptions profile ${fileName} references unknown category "${categoryId}".`);
      }

      if (!isPlainObject(categoryData)) {
        throw new Error(`Error: Curated assumptions profile ${fileName} category "${categoryId}" must be an object.`);
      }

      const normalizedEffects = normalizeCuratedCategoryEffects(
        categoryData.effects,
        defaultAssumptions,
        categoryId,
        fileName
      );

      if (normalizedEffects.length > 0) {
        normalizedCategories[categoryId] = { effects: normalizedEffects };
      }
    });

    if (Object.keys(normalizedCategories).length > 0) {
      normalized.categories = normalizedCategories;
    }
  }

  if (assumptions.recipients !== undefined) {
    if (!isPlainObject(assumptions.recipients)) {
      throw new Error(`Error: Curated assumptions profile ${fileName} must use an object for 'recipients'.`);
    }

    const normalizedRecipients = {};
    Object.entries(assumptions.recipients).forEach(([recipientId, recipientData]) => {
      if (!defaultAssumptions.recipients[recipientId]) {
        throw new Error(
          `Error: Curated assumptions profile ${fileName} references unknown recipient "${recipientId}".`
        );
      }

      if (!isPlainObject(recipientData) || !isPlainObject(recipientData.categories)) {
        throw new Error(
          `Error: Curated assumptions profile ${fileName} recipient "${recipientId}" must define a 'categories' object.`
        );
      }

      const normalizedRecipientCategories = {};
      Object.entries(recipientData.categories).forEach(([categoryId, categoryData]) => {
        if (!defaultAssumptions.recipients[recipientId].categories?.[categoryId]) {
          throw new Error(
            `Error: Curated assumptions profile ${fileName} recipient "${recipientId}" references unknown category "${categoryId}".`
          );
        }

        if (!isPlainObject(categoryData)) {
          throw new Error(
            `Error: Curated assumptions profile ${fileName} recipient "${recipientId}" category "${categoryId}" must be an object.`
          );
        }

        const normalizedEffects = normalizeCuratedRecipientEffects(
          categoryData.effects,
          defaultAssumptions,
          recipientId,
          categoryId,
          fileName
        );

        if (normalizedEffects.length > 0) {
          normalizedRecipientCategories[categoryId] = { effects: normalizedEffects };
        }
      });

      if (Object.keys(normalizedRecipientCategories).length > 0) {
        normalizedRecipients[recipientId] = { categories: normalizedRecipientCategories };
      }
    });

    if (Object.keys(normalizedRecipients).length > 0) {
      normalized.recipients = normalizedRecipients;
    }
  }

  if (Object.keys(normalized).length === 0) {
    throw new Error(`Error: Curated assumptions profile ${fileName} has no effect after normalization.`);
  }

  return normalized;
}

function loadCuratedAssumptionProfiles(defaultAssumptions) {
  if (!fs.existsSync(assumptionProfilesDir)) {
    return {};
  }

  const profileFiles = glob.sync(path.join(assumptionProfilesDir, '*.md'));
  const profiles = {};

  profileFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Curated assumptions profile ${fileName} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Curated assumptions profile ${fileName} is missing required 'name' field.`);
    }
    if (data.assumptions === undefined) {
      throw new Error(`Error: Curated assumptions profile ${fileName} is missing required 'assumptions' field.`);
    }
    if (data.description !== undefined && typeof data.description !== 'string') {
      throw new Error(`Error: Curated assumptions profile ${fileName} must use a string for 'description'.`);
    }
    if (data.sortOrder !== undefined && typeof data.sortOrder !== 'number') {
      throw new Error(`Error: Curated assumptions profile ${fileName} must use a number for 'sortOrder'.`);
    }
    if (profiles[data.id]) {
      throw new Error(`Error: Duplicate curated assumptions profile id "${data.id}".`);
    }

    const normalizedAssumptions = normalizeCuratedAssumptions(data.assumptions, defaultAssumptions, fileName);
    const extractedContent = extractContentExcludingInternalNotes(content);

    profiles[data.id] = {
      id: data.id,
      name: data.name,
      description: typeof data.description === 'string' ? data.description.trim() : '',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
      assumptions: normalizedAssumptions,
      content: replaceVariables(extractedContent) || '',
    };
  });

  return profiles;
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
    // sourceFile is build-time-only context for error messages.
    delete enhanced.sourceFile;
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
  donations.forEach((donation) => {
    const label = `Error: Donation in ${donation.sourceFile} (recipient "${donation.recipientId}", date ${donation.date}, amount ${donation.amount})`;

    // Check donor exists
    if (!donors[donation.donorId]) {
      errors.push(`${label} references non-existent donor ID "${donation.donorId}"`);
    }

    // Check recipient exists
    if (!recipients[donation.recipientId]) {
      errors.push(`${label} references non-existent recipient ID "${donation.recipientId}"`);
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

  console.log('Loading curated assumptions profiles...');
  const curatedAssumptionProfiles = loadCuratedAssumptionProfiles(
    buildDefaultAssumptions(globalParameters, categories, recipients)
  );

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

// Curated assumptions profiles by ID
export const curatedAssumptionProfilesById = ${JSON.stringify(curatedAssumptionProfiles, null, 2)};

// All donations, expanded to one row per credited donor, newest first
export const donations = ${JSON.stringify(donations, null, 2)};

// Global parameters
export const globalParameters = ${JSON.stringify(globalParameters, null, 2)};
`;

  // Create the directory if it doesn't exist
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
