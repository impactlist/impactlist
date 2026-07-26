import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAUSES_QUERY_PARAM } from '../utils/causeRoutes';
import { setRememberedCauseScope } from '../utils/causeScopeSession';

const getRequestedCategoryIds = (rawValue) =>
  rawValue
    .split(',')
    .map((categoryId) => categoryId.trim())
    .filter(Boolean);

const getValidCategoryIds = (categoryIds, categories) => {
  const requestedIds = new Set(categoryIds);
  return categories.filter(({ id }) => requestedIds.has(id)).map(({ id }) => id);
};

const normalizeValidCategoryIds = (validIds, categoryCount) =>
  validIds.length > 0 && validIds.length < categoryCount ? validIds : null;

const normalizeCauseSelection = (categoryIds, categories) => {
  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  return normalizeValidCategoryIds(getValidCategoryIds(categoryIds, categories), categories.length);
};

/**
 * Convert a query-string value into category ids in canonical display order.
 * Empty, invalid-only, and all-cause selections resolve to null, the compact
 * sentinel for the default unfiltered ranking.
 */
export const parseCauseSelection = (rawValue, categories) => {
  if (!rawValue) {
    return null;
  }

  return normalizeCauseSelection(getRequestedCategoryIds(rawValue), categories);
};

/**
 * URL-backed cause scope for the donor ranking. The active URL is mirrored to
 * sessionStorage so the header can return to the same scope after navigating
 * away, but a parameterless homepage always means the default all-cause view.
 */
const useCauseFilter = (categories) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawSelection = searchParams.get(CAUSES_QUERY_PARAM);

  const requestedCategoryIds = useMemo(
    () => (rawSelection === null ? [] : getRequestedCategoryIds(rawSelection)),
    [rawSelection]
  );
  const validRequestedCategoryIds = useMemo(
    () => getValidCategoryIds(requestedCategoryIds, categories),
    [categories, requestedCategoryIds]
  );
  const selectedCategoryIds = useMemo(
    () => normalizeValidCategoryIds(validRequestedCategoryIds, categories.length),
    [categories.length, validRequestedCategoryIds]
  );
  const hasInvalidCauseSelection =
    rawSelection !== null && requestedCategoryIds.length > 0 && validRequestedCategoryIds.length === 0;

  const selectedCategories = useMemo(() => {
    if (!selectedCategoryIds) {
      return [];
    }

    const selectedIds = new Set(selectedCategoryIds);
    return categories.filter(({ id }) => selectedIds.has(id));
  }, [categories, selectedCategoryIds]);

  const writeCauseSelection = useCallback(
    (normalizedSelection, replace) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new globalThis.URLSearchParams(currentParams);

          if (normalizedSelection) {
            nextParams.set(CAUSES_QUERY_PARAM, normalizedSelection.join(','));
          } else {
            nextParams.delete(CAUSES_QUERY_PARAM);
          }

          return nextParams;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (hasInvalidCauseSelection) {
      return;
    }

    setRememberedCauseScope(selectedCategoryIds);
  }, [hasInvalidCauseSelection, selectedCategoryIds]);

  const applyCauseFilter = useCallback(
    (categoryIds) => {
      writeCauseSelection(normalizeCauseSelection(categoryIds, categories), false);
    },
    [categories, writeCauseSelection]
  );

  const clearInvalidCauseSelection = useCallback(() => {
    const invalidSelectionToClear = rawSelection;
    setSearchParams(
      (currentParams) => {
        if (currentParams.get(CAUSES_QUERY_PARAM) !== invalidSelectionToClear) {
          return currentParams;
        }

        const nextParams = new globalThis.URLSearchParams(currentParams);
        nextParams.delete(CAUSES_QUERY_PARAM);
        return nextParams;
      },
      { replace: true }
    );
  }, [rawSelection, setSearchParams]);

  return {
    selectedCategoryIds,
    selectedCategories,
    isCauseFiltered: selectedCategoryIds !== null,
    hasInvalidCauseSelection,
    rawCauseSelection: rawSelection,
    applyCauseFilter,
    clearInvalidCauseSelection,
  };
};

export default useCauseFilter;
