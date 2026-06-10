#!/usr/bin/env node

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';
// Shared validation modules (pure ES6, also used by app startup validation).
// The pipeline test harness copies these into its temp workspaces.
import { validateCategory, validateRecipient } from '../src/utils/dataValidation.js';
import { GLOBAL_PARAMETER_NAMES, assertValidGlobalParameters } from '../src/utils/globalParameterRules.js';

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

// glob does not guarantee result ordering (it's filesystem-dependent), and
// loader insertion order leaks into the generated output. Sort for
// deterministic builds.
function sortedGlobSync(pattern) {
  return glob.sync(pattern).sort();
}

// Reject unknown frontmatter keys: a typo'd key (e.g. 'effect:' for
// 'effects:') would otherwise be silently ignored and the site would ship
// default values with no error.
function assertOnlyKnownKeys(obj, allowedKeys, context) {
  for (const key of Object.keys(obj)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Error: ${context} has unknown field '${key}'. Allowed fields: ${[...allowedKeys].join(', ')}.`);
    }
  }
}

// Track entity ids across files so two files declaring the same id fail the
// build instead of silently last-write-winning in glob order.
function assertUniqueId(seenIds, id, fileName, entityLabel) {
  const existingFile = seenIds.get(id);
  if (existingFile) {
    throw new Error(
      `Error: Duplicate ${entityLabel} id "${id}" declared in both ${existingFile} and ${fileName}. Ids must be unique.`
    );
  }
  seenIds.set(id, fileName);
}

// Replace {{VARIABLE_NAME}} placeholders with actual values
function replaceVariables(content, context = 'content') {
  if (!content) return content;
  let result = content;
  for (const [key, value] of Object.entries(MARKDOWN_VARIABLES)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  // A leftover {{TOKEN}} means a typo'd or unknown variable that would ship
  // as literal text on the site.
  const leftover = result.match(/\{\{[A-Z0-9_]+\}\}/);
  if (leftover) {
    throw new Error(
      `Error: ${context} contains unreplaced placeholder ${leftover[0]}. Known variables: ${Object.keys(MARKDOWN_VARIABLES).join(', ')}.`
    );
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
function extractContentExcludingInternalNotes(content, context = 'content') {
  // Split the content into sections based on headers
  const sections = content.split(/(?=^# )/m);

  // Filter out the "Internal Notes" section and join the rest
  const filteredContent = sections
    .filter((section) => !section.trim().startsWith('# Internal Notes'))
    .join('')
    .trim();

  // Only the exact level-1 '# Internal Notes' heading is stripped. Any other
  // variant (different level, different casing) would ship editorial notes to
  // the public site — fail instead of publishing them.
  const variantHeading = filteredContent.match(/^#{1,6}\s+internal\s+notes\s*$/im);
  if (variantHeading) {
    throw new Error(
      `Error: ${context} contains an internal-notes heading variant ("${variantHeading[0].trim()}") that would be ` +
        `published. Use exactly '# Internal Notes' (level-1, this casing) so the section is stripped.`
    );
  }

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

const CATEGORY_FIELDS = new Set(['id', 'name', 'effects']);
const CATEGORY_EFFECT_FIELDS = new Set([
  'effectId',
  'startTime',
  'windowLength',
  'costPerQALY',
  'costPerMicroprobability',
  'populationFractionAffected',
  'qalyImprovementPerYear',
  'validTimeInterval',
]);

// Load all categories
function loadCategories() {
  const categoryFiles = sortedGlobSync(path.join(categoriesDir, '*.md'));
  const categories = {};
  const seenIds = new Map();

  categoryFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Category file ${fileName} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Category file ${fileName} is missing required 'name' field.`);
    }
    assertOnlyKnownKeys(data, CATEGORY_FIELDS, `Category file ${fileName}`);
    assertUniqueId(seenIds, data.id, fileName, 'category');

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
      assertOnlyKnownKeys(effect, CATEGORY_EFFECT_FIELDS, `Category file ${fileName}, effect #${index + 1}`);
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
    const extractedContent = extractContentExcludingInternalNotes(content, `Category file ${fileName}`);
    if (extractedContent) {
      categories[data.id].content = replaceVariables(extractedContent, `Category file ${fileName}`);
    }
  });

  return categories;
}

const DONOR_FIELDS = new Set(['id', 'name', 'birthDate', 'netWorth', 'about', 'totalDonated']);

// Load all donors
function loadDonors() {
  const donorFiles = sortedGlobSync(path.join(donorsDir, '*.md'));
  const donors = {};
  const seenIds = new Map();

  donorFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Donor file ${fileName} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Donor file ${fileName} is missing required 'name' field.`);
    }
    if (typeof data.netWorth !== 'number') {
      throw new Error(`Error: Donor file ${fileName} is missing required 'netWorth' number field.`);
    }
    if (!data.about || typeof data.about !== 'string' || data.about.trim().length === 0) {
      throw new Error(`Error: Donor file ${fileName} is missing required 'about' string field.`);
    }
    if (data.totalDonated !== undefined && (typeof data.totalDonated !== 'number' || data.totalDonated <= 0)) {
      throw new Error(`Error: Donor file ${fileName} must use a positive number for 'totalDonated'.`);
    }
    assertOnlyKnownKeys(data, DONOR_FIELDS, `Donor file ${fileName}`);
    assertUniqueId(seenIds, data.id, fileName, 'donor');

    // Use ID as the key
    donors[data.id] = {
      name: data.name,
      netWorth: data.netWorth,
      about: data.about.trim(),
    };

    const rawBirthDate = getRawFrontmatterScalar(fileContent, 'birthDate');
    if (rawBirthDate !== null) {
      donors[data.id].birthDate = normalizeBirthDate(rawBirthDate, fileName);
    }

    if (data.totalDonated) {
      donors[data.id].totalDonated = data.totalDonated;
    }

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content, `Donor file ${fileName}`);
    if (extractedContent) {
      donors[data.id].content = replaceVariables(extractedContent, `Donor file ${fileName}`);
    }
  });

  return donors;
}

const RECIPIENT_FIELDS = new Set(['id', 'name', 'categories']);
const RECIPIENT_CATEGORY_FIELDS = new Set(['id', 'fraction', 'effects']);
const RECIPIENT_EFFECT_FIELDS = new Set(['effectId', 'overrides', 'multipliers']);

// Load all recipients
function loadRecipients() {
  const recipientFiles = sortedGlobSync(path.join(recipientsDir, '*.md'));
  const recipients = {};
  const seenIds = new Map();

  recipientFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Recipient file ${fileName} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Recipient file ${fileName} is missing required 'name' field.`);
    }
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error(`Error: Recipient file ${fileName} is missing required 'categories' array.`);
    }
    assertOnlyKnownKeys(data, RECIPIENT_FIELDS, `Recipient file ${fileName}`);
    assertUniqueId(seenIds, data.id, fileName, 'recipient');

    const categoriesObj = {};

    data.categories.forEach((category, index) => {
      // Validate category structure
      if (!category.id || typeof category.id !== 'string') {
        throw new Error(`Error: Recipient file ${fileName}, category #${index + 1} is missing required 'id' field.`);
      }
      if (typeof category.fraction !== 'number' || category.fraction <= 0 || category.fraction > 1) {
        throw new Error(
          `Error: Recipient file ${fileName}, category ${category.id} must have 'fraction' field as a number between 0 and 1.`
        );
      }
      assertOnlyKnownKeys(category, RECIPIENT_CATEGORY_FIELDS, `Recipient file ${fileName}, category ${category.id}`);

      const categoryData = { fraction: category.fraction };

      // Handle effects structure with overrides and multipliers (optional for recipients)
      if (category.effects && Array.isArray(category.effects)) {
        // Validate each effect override/multiplier has proper structure
        category.effects.forEach((effect, index) => {
          if (!effect.effectId || typeof effect.effectId !== 'string') {
            throw new Error(
              `Error: Recipient file ${fileName}, category ${category.id}, effect #${index + 1} is missing required 'effectId' field.`
            );
          }
          assertOnlyKnownKeys(
            effect,
            RECIPIENT_EFFECT_FIELDS,
            `Recipient file ${fileName}, category ${category.id}, effect #${index + 1}`
          );

          // Must have either overrides or multipliers (or both)
          const hasOverrides = effect.overrides && typeof effect.overrides === 'object';
          const hasMultipliers = effect.multipliers && typeof effect.multipliers === 'object';

          if (!hasOverrides && !hasMultipliers) {
            throw new Error(
              `Error: Recipient file ${fileName}, category ${category.id}, effect #${index + 1} must have either 'overrides' or 'multipliers' object.`
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
    const extractedContent = extractContentExcludingInternalNotes(content, `Recipient file ${fileName}`);
    if (extractedContent) {
      recipients[data.id].content = replaceVariables(extractedContent, `Recipient file ${fileName}`);
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
  const donationFiles = sortedGlobSync(path.join(donationsDir, '*.md'));
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

const ASSUMPTION_FIELDS = new Set(['id', 'name']);

// Load all assumptions
function loadAssumptions() {
  const assumptionsDir = path.join(__dirname, '../content/assumptions');

  // Return empty object if directory doesn't exist
  if (!fs.existsSync(assumptionsDir)) {
    return {};
  }

  const assumptionFiles = sortedGlobSync(path.join(assumptionsDir, '*.md'));
  const assumptions = {};
  const seenIds = new Map();

  assumptionFiles.forEach((file) => {
    if (path.basename(file) === '_index.md') return;

    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      throw new Error(`Error: Assumption file ${fileName} is missing required 'id' field.`);
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new Error(`Error: Assumption file ${fileName} is missing required 'name' field.`);
    }
    assertOnlyKnownKeys(data, ASSUMPTION_FIELDS, `Assumption file ${fileName}`);
    assertUniqueId(seenIds, data.id, fileName, 'assumption');

    // Extract content excluding "Internal Notes" section
    const extractedContent = extractContentExcludingInternalNotes(content, `Assumption file ${fileName}`);

    assumptions[data.id] = {
      id: data.id,
      name: data.name,
      content: replaceVariables(extractedContent, `Assumption file ${fileName}`) || '',
    };
  });

  return assumptions;
}

function getCategoryDefaultEffect(defaultAssumptions, categoryId, effectId) {
  return defaultAssumptions.categories?.[categoryId]?.effects?.find((effect) => effect.effectId === effectId) || null;
}

// A recipient's own default effect entry is a WRAPPER ({effectId, overrides,
// multipliers, disabled?}), not a raw effect — it must never be used for
// field-name legality checks (the base category effect defines the fields),
// only for default-value comparisons.
function getRecipientDefaultWrapper(defaultAssumptions, recipientId, categoryId, effectId) {
  return (
    defaultAssumptions.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.find(
      (effect) => effect.effectId === effectId
    ) || null
  );
}

function assertCuratedEffectArray(effects, fileName, scopeLabel) {
  if (!Array.isArray(effects)) {
    throw new Error(`Error: Curated assumptions profile ${fileName} ${scopeLabel} must have an 'effects' array.`);
  }
}

function assertCuratedDisabledBoolean(value, fileName, scopeLabel, effectId) {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Error: Curated assumptions profile ${fileName} ${scopeLabel} effect "${effectId}" must use a boolean for 'disabled'.`
    );
  }
}

function normalizeCategoryEffectField(normalizedEffect, defaultEffect, fieldName, value, fileName, scopeLabel) {
  if (fieldName === 'disabled') {
    assertCuratedDisabledBoolean(value, fileName, scopeLabel, normalizedEffect.effectId);
    if (value !== Boolean(defaultEffect.disabled)) {
      normalizedEffect.disabled = value;
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
    // Field legality always comes from the base category effect; the
    // recipient's own wrapper only supplies default values to diff against.
    getDefaultEffect: (effectId) => getCategoryDefaultEffect(defaultAssumptions, categoryId, effectId),
    normalizeEffectFields: ({
      effect,
      normalizedEffect,
      defaultEffect: baseEffect,
      fileName: effectFileName,
      scopeLabel,
    }) => {
      const recipientDefault = getRecipientDefaultWrapper(defaultAssumptions, recipientId, categoryId, effect.effectId);

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
            if (!Object.hasOwn(baseEffect, overrideFieldName)) {
              throw new Error(
                `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" override references unknown field "${overrideFieldName}".`
              );
            }

            // The effective default for this field is the recipient's own
            // override when one exists, otherwise the category base value.
            const defaultValue = recipientDefault?.overrides?.[overrideFieldName] ?? baseEffect[overrideFieldName];
            if (!areComparableFieldValuesEqual(overrideValue, defaultValue)) {
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
            if (!Object.hasOwn(baseEffect, multiplierFieldName)) {
              throw new Error(
                `Error: Curated assumptions profile ${effectFileName} ${scopeLabel} effect "${effect.effectId}" multiplier references unknown field "${multiplierFieldName}".`
              );
            }

            // Diff against the recipient's default multiplier (1 when none),
            // so a profile that resets a customized recipient back to the
            // category baseline is preserved instead of dropped as a no-op.
            const defaultMultiplier = recipientDefault?.multipliers?.[multiplierFieldName] ?? 1;
            if (multiplierValue !== defaultMultiplier) {
              normalizedMultipliers[multiplierFieldName] = multiplierValue;
            }
          });

          if (Object.keys(normalizedMultipliers).length > 0) {
            normalizedEffect.multipliers = normalizedMultipliers;
          }
          return;
        }

        if (fieldName === 'disabled') {
          assertCuratedDisabledBoolean(value, effectFileName, scopeLabel, effect.effectId);
          if (value !== Boolean(recipientDefault?.disabled ?? baseEffect.disabled)) {
            normalizedEffect.disabled = value;
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

const PROFILE_FIELDS = new Set(['id', 'name', 'description', 'sortOrder', 'assumptions']);
const PROFILE_CATEGORY_ENTRY_FIELDS = new Set(['effects']);
const PROFILE_RECIPIENT_ENTRY_FIELDS = new Set(['categories']);

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
      assertOnlyKnownKeys(
        categoryData,
        PROFILE_CATEGORY_ENTRY_FIELDS,
        `Curated assumptions profile ${fileName} category "${categoryId}"`
      );

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
      assertOnlyKnownKeys(
        recipientData,
        PROFILE_RECIPIENT_ENTRY_FIELDS,
        `Curated assumptions profile ${fileName} recipient "${recipientId}"`
      );

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
        assertOnlyKnownKeys(
          categoryData,
          PROFILE_CATEGORY_ENTRY_FIELDS,
          `Curated assumptions profile ${fileName} recipient "${recipientId}" category "${categoryId}"`
        );

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

  const profileFiles = sortedGlobSync(path.join(assumptionProfilesDir, '*.md'));
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
    assertOnlyKnownKeys(data, PROFILE_FIELDS, `Curated assumptions profile ${fileName}`);
    if (profiles[data.id]) {
      throw new Error(`Error: Duplicate curated assumptions profile id "${data.id}".`);
    }

    const normalizedAssumptions = normalizeCuratedAssumptions(data.assumptions, defaultAssumptions, fileName);
    const extractedContent = extractContentExcludingInternalNotes(content, `Curated assumptions profile ${fileName}`);

    profiles[data.id] = {
      id: data.id,
      name: data.name,
      description: typeof data.description === 'string' ? data.description.trim() : '',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
      assumptions: normalizedAssumptions,
      content: replaceVariables(extractedContent, `Curated assumptions profile ${fileName}`) || '',
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

  // The shared rules table enforces presence, numeric type, value bounds,
  // and rejects unknown parameter names.
  assertOnlyKnownKeys(data, new Set(GLOBAL_PARAMETER_NAMES), 'globalParameters.md');
  assertValidGlobalParameters(data, 'in globalParameters.md');

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

  // Report errors if any (throw like every other validation failure here —
  // the top-level handler decides the exit).
  if (errors.length > 0) {
    throw new Error(
      `=== VALIDATION ERRORS ===\n${errors.join('\n')}\n\nData validation failed. Please fix the errors above before continuing.`
    );
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

  // Enforce the same structural rules the app asserts at startup
  // (fraction sums, positive windows, non-zero costs, NaN rejection) so bad
  // content fails the BUILD instead of crashing the deployed site.
  console.log('Validating categories and recipients against shared rules...');
  Object.entries(categories).forEach(([categoryId, category]) => validateCategory(category, categoryId));
  Object.entries(recipients).forEach(([recipientId, recipient]) => validateRecipient(recipient, recipientId));

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

  // Profiles are validated against the FILTERED sets — the data that actually
  // ships — so a profile referencing a donation-less (filtered-out) recipient
  // fails the build instead of dangling at runtime.
  console.log('Loading curated assumptions profiles...');
  const curatedAssumptionProfiles = loadCuratedAssumptionProfiles(
    buildDefaultAssumptions(globalParameters, filteredCategories, filteredRecipients)
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

  console.log('Writing sitemap.xml and robots.txt...');
  writeSeoFiles(filteredDonors, filteredRecipients, filteredCategories, assumptions);

  // Provide some stats
  console.log('');
  console.log('=== STATS ===');
  console.log(`Categories: ${Object.keys(filteredCategories).length} (of ${Object.keys(categories).length} total)`);
  console.log(`Donors: ${Object.keys(filteredDonors).length} (of ${Object.keys(donors).length} total)`);
  console.log(`Recipients: ${Object.keys(filteredRecipients).length} (of ${Object.keys(recipients).length} total)`);
  console.log(`Donations: ${donations.length}`);
}

// Absolute origin for sitemap/robots URLs. Vercel provides the production
// URL automatically during builds; SITE_ORIGIN overrides it (e.g. for a
// custom domain — see .env.example); local builds fall back to the preview
// origin. Both files are gitignored build output, so no guessed domain is
// ever committed.
function resolveSiteOrigin() {
  if (process.env.SITE_ORIGIN) {
    return process.env.SITE_ORIGIN.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:4173';
}

// Emit sitemap.xml and robots.txt into public/ so Vite copies them into the
// deploy. URLs mirror the app's routes (and its encodeURIComponent hrefs).
// No <lastmod>: it's optional, and stamping build time would break the
// pipeline's deterministic-output guarantee.
function writeSeoFiles(filteredDonors, filteredRecipients, filteredCategories, assumptions) {
  const origin = resolveSiteOrigin();
  const paths = [
    '/',
    '/causes',
    '/recipients',
    '/calculator',
    '/faq',
    '/assumptions',
    ...Object.keys(filteredDonors).map((id) => `/donor/${encodeURIComponent(id)}`),
    ...Object.keys(filteredRecipients).map((id) => `/recipient/${encodeURIComponent(id)}`),
    ...Object.keys(filteredCategories).map((id) => `/cause/${encodeURIComponent(id)}`),
    ...Object.keys(assumptions).map((id) => `/assumption/${encodeURIComponent(id)}`),
  ];

  const urlEntries = paths.map((urlPath) => `  <url><loc>${origin}${urlPath}</loc></url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

  const publicDir = path.join(__dirname, '../public');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
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
