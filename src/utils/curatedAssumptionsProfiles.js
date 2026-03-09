import { curatedAssumptionProfilesById } from '../data/generatedData';
import { createComparableAssumptionsFingerprint } from './savedAssumptionsStore';

export const CURATED_ASSUMPTIONS_SOURCE = 'curated';
export const CURATED_ASSUMPTIONS_ID_PREFIX = 'curated:';
export const CURATED_ASSUMPTIONS_QUERY_PARAM = 'curated';

const buildCuratedAssumptionsPath = (profileId) =>
  `/?${CURATED_ASSUMPTIONS_QUERY_PARAM}=${encodeURIComponent(profileId)}`;

export const buildCuratedAssumptionsUrl = (profileId) => {
  const path = buildCuratedAssumptionsPath(profileId);
  const origin = globalThis.location?.origin;

  if (!origin) {
    return path;
  }

  return new globalThis.URL(path, origin).toString();
};

const curatedAssumptionsEntries = Object.values(curatedAssumptionProfilesById)
  .sort((profileA, profileB) => {
    const sortOrderDifference = (profileA.sortOrder || 0) - (profileB.sortOrder || 0);
    if (sortOrderDifference !== 0) {
      return sortOrderDifference;
    }

    return profileA.name.localeCompare(profileB.name);
  })
  .map((profile) => ({
    id: `${CURATED_ASSUMPTIONS_ID_PREFIX}${profile.id}`,
    profileId: profile.id,
    label: profile.name,
    description: profile.description || null,
    content: profile.content || '',
    source: CURATED_ASSUMPTIONS_SOURCE,
    reference: null,
    shareUrl: buildCuratedAssumptionsUrl(profile.id),
    assumptions: profile.assumptions,
    fingerprint: createComparableAssumptionsFingerprint(profile.assumptions),
    sortOrder: profile.sortOrder || 0,
  }));

const curatedAssumptionsEntryIds = new Set(curatedAssumptionsEntries.map((entry) => entry.id));
const curatedAssumptionsEntriesByProfileId = new Map(
  curatedAssumptionsEntries.map((entry) => [entry.profileId, entry])
);
const curatedAssumptionsLabelKeys = new Set(
  curatedAssumptionsEntries.map((entry) => (typeof entry.label === 'string' ? entry.label.trim().toLowerCase() : ''))
);

export const getCuratedAssumptionsEntries = () => curatedAssumptionsEntries;

export const isCuratedAssumptionsEntryId = (entryId) => curatedAssumptionsEntryIds.has(entryId);

export const getCuratedAssumptionsEntryByProfileId = (profileId) => {
  if (typeof profileId !== 'string' || !profileId.trim()) {
    return null;
  }

  return curatedAssumptionsEntriesByProfileId.get(profileId.trim()) || null;
};

export const hasCuratedAssumptionsLabel = (label) => {
  if (typeof label !== 'string') {
    return false;
  }

  return curatedAssumptionsLabelKeys.has(label.trim().toLowerCase());
};
