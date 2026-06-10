import { categoriesById, globalParameters, recipientsById } from '../data/generatedData.js';
import { normalizeUserAssumptions } from '../utils/assumptionsNormalization.js';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors.js';

const createServerDefaultAssumptions = () => {
  return {
    globalParameters: { ...globalParameters },
    categories: JSON.parse(JSON.stringify(categoriesById)),
    recipients: JSON.parse(JSON.stringify(recipientsById)),
  };
};

export const serverDefaultAssumptions = createServerDefaultAssumptions();

const invalidAssumptionsError = (message) => createSharedAssumptionsError(400, 'invalid_assumptions', message);

/**
 * Validate and normalize a shared snapshot's assumptions. Delegates to the
 * shared implementation (the same code the client uses for saved entries and
 * imports), throwing SharedAssumptionsError(400) on schema violations.
 */
export const normalizeSharedUserAssumptions = (userAssumptions, defaultAssumptions) =>
  normalizeUserAssumptions(userAssumptions, defaultAssumptions, invalidAssumptionsError);
