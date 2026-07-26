import { getSessionStorage } from './safeStorage';

export const CAUSE_SCOPE_SESSION_KEY = 'donorCauseScope:v1';

/**
 * This is deliberately tab-scoped session state, not a durable preference.
 * It lets return links preserve the current ranking context while the homepage
 * URL remains authoritative for Back/Forward, bookmarks, and fresh visits.
 */
export const getRememberedCauseScope = () => getSessionStorage().getItem(CAUSE_SCOPE_SESSION_KEY);

export const setRememberedCauseScope = (categoryIds) => {
  if (categoryIds?.length) {
    getSessionStorage().setItem(CAUSE_SCOPE_SESSION_KEY, categoryIds.join(','));
  } else {
    getSessionStorage().removeItem(CAUSE_SCOPE_SESSION_KEY);
  }
};
