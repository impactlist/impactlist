import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import useDismissibleMenu from '../../hooks/useDismissibleMenu';
import useMediaQuery from '../../hooks/useMediaQuery';
import ModalShell from './ModalShell';
import SearchInput from './SearchInput';

const MOBILE_CAUSE_FILTER_QUERY = '(max-width: 639px)';
const MAX_VISIBLE_SCOPE_CHIPS = 4;
const categoryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

const selectionsMatch = (first, second) =>
  first.size === second.size && Array.from(first).every((categoryId) => second.has(categoryId));

const CauseFilterContents = ({
  categories,
  filteredCategories,
  draftCategoryIds,
  searchTerm,
  titleId,
  descriptionId,
  searchInputRef,
  onSearchChange,
  onToggleCategory,
  onSelectAll,
  onClearAll,
  onCancel,
  onApply,
  hasChanges,
}) => {
  const selectionCount = draftCategoryIds.size;
  const hasSelection = selectionCount > 0;

  return (
    <>
      <div className="cause-filter-panel__header">
        <div>
          <p className="cause-filter-panel__eyebrow">Ranking scope</p>
          <h2 id={titleId} className="cause-filter-panel__title">
            Choose causes
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="cause-filter-panel__close"
          aria-label="Close cause selector"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden={true}>
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" strokeWidth="1.7" />
          </svg>
        </button>
      </div>

      <p id={descriptionId} className="cause-filter-panel__description">
        Recalculate every donor&apos;s impact using only the causes you select.
      </p>

      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search causes..."
        ariaLabel="Search causes"
        size="sm"
        inputRef={searchInputRef}
      />

      <div className="cause-filter-panel__actions">
        <span className="cause-filter-panel__selection-count" aria-live="polite">
          {selectionCount} of {categories.length} selected
        </span>
        <div className="cause-filter-panel__action-buttons">
          <button type="button" onClick={onSelectAll} disabled={selectionCount === categories.length}>
            Select all
          </button>
          <span aria-hidden={true}>·</span>
          <button type="button" onClick={onClearAll} disabled={!hasSelection}>
            Clear
          </button>
        </div>
      </div>

      <fieldset className="cause-filter-panel__options">
        <legend className="sr-only">Causes included in the ranking</legend>
        {filteredCategories.length > 0 ? (
          <div className="cause-filter-panel__option-grid">
            {filteredCategories.map((category) => {
              const isSelected = draftCategoryIds.has(category.id);
              return (
                <label key={category.id} className="cause-filter-panel__option" data-selected={isSelected}>
                  <input type="checkbox" checked={isSelected} onChange={() => onToggleCategory(category.id)} />
                  <span>{category.name}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="cause-filter-panel__empty">No causes match your search.</p>
        )}
      </fieldset>

      <div className="cause-filter-panel__footer">
        <p className="cause-filter-panel__validation" data-visible={!hasSelection} aria-live="polite">
          {hasSelection ? 'Selections are ready to apply.' : 'Choose at least one cause.'}
        </p>
        <div className="cause-filter-panel__footer-actions">
          <button type="button" onClick={onCancel} className="impact-btn impact-btn--secondary impact-btn--sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={!hasSelection || !hasChanges}
            className="impact-btn impact-btn--primary impact-btn--sm"
          >
            Apply scope
          </button>
        </div>
      </div>
    </>
  );
};

CauseFilterContents.propTypes = {
  categories: PropTypes.arrayOf(categoryShape).isRequired,
  filteredCategories: PropTypes.arrayOf(categoryShape).isRequired,
  draftCategoryIds: PropTypes.instanceOf(Set).isRequired,
  searchTerm: PropTypes.string.isRequired,
  titleId: PropTypes.string.isRequired,
  descriptionId: PropTypes.string.isRequired,
  searchInputRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onToggleCategory: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  hasChanges: PropTypes.bool.isRequired,
};

const CauseFilter = ({ categories, selectedCategoryIds, onApply }) => {
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftCategoryIds, setDraftCategoryIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(MOBILE_CAUSE_FILTER_QUERY);
  const componentId = useId();
  const popoverTitleId = `${componentId}-popover-title`;
  const popoverDescriptionId = `${componentId}-popover-description`;
  const modalTitleId = `${componentId}-modal-title`;
  const modalDescriptionId = `${componentId}-modal-description`;
  const allCategoryIds = useMemo(() => categories.map(({ id }) => id), [categories]);
  const appliedCategoryIds = useMemo(
    () => new Set(selectedCategoryIds || allCategoryIds),
    [allCategoryIds, selectedCategoryIds]
  );

  const closePopover = useCallback((reason) => {
    setIsOpen(false);
    if (reason === 'escape') {
      triggerRef.current?.focus();
    }
  }, []);
  const popoverRef = useDismissibleMenu(isOpen && !isMobile, closePopover);

  useEffect(() => {
    if (!isOpen || isMobile) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isMobile, isOpen]);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query ? categories.filter(({ name }) => name.toLowerCase().includes(query)) : categories;
  }, [categories, searchTerm]);

  const hasChanges = !selectionsMatch(appliedCategoryIds, draftCategoryIds);
  const isFiltered = selectedCategoryIds !== null;
  const triggerLabel =
    selectedCategoryIds === null
      ? 'All causes'
      : selectedCategoryIds.length === 1
        ? categories.find(({ id }) => id === selectedCategoryIds[0])?.name || '1 cause'
        : `${selectedCategoryIds.length} causes`;

  const handleOpen = () => {
    setDraftCategoryIds(new Set(appliedCategoryIds));
    setSearchTerm('');
    setIsOpen(true);
  };

  const handleTriggerClick = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    handleOpen();
  };

  const handleFocusLeave = (event) => {
    if (!isMobile && isOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleToggleCategory = (categoryId) => {
    setDraftCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(categoryId)) {
        nextIds.delete(categoryId);
      } else {
        nextIds.add(categoryId);
      }
      return nextIds;
    });
  };

  const handlePanelClose = () => {
    setIsOpen(false);
    if (!isMobile) {
      triggerRef.current?.focus();
    }
  };

  const handleApply = () => {
    if (draftCategoryIds.size === 0 || !hasChanges) {
      return;
    }

    const orderedCategoryIds = categories.filter(({ id }) => draftCategoryIds.has(id)).map(({ id }) => id);
    onApply(orderedCategoryIds.length === categories.length ? null : orderedCategoryIds);
    handlePanelClose();
  };

  const contentsProps = {
    categories,
    filteredCategories,
    draftCategoryIds,
    searchTerm,
    onSearchChange: setSearchTerm,
    onToggleCategory: handleToggleCategory,
    onSelectAll: () => setDraftCategoryIds(new Set(allCategoryIds)),
    onClearAll: () => setDraftCategoryIds(new Set()),
    onCancel: handlePanelClose,
    onApply: handleApply,
    hasChanges,
    searchInputRef,
  };

  return (
    <div className="cause-filter" ref={popoverRef} onBlur={handleFocusLeave}>
      <div className="cause-filter__label">Cause scope</div>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className="cause-filter__trigger"
        data-filtered={isFiltered}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? (isMobile ? `${componentId}-modal` : `${componentId}-popover`) : undefined}
        aria-label={`Cause scope. Current selection: ${triggerLabel}`}
      >
        <span className="cause-filter__trigger-icon" aria-hidden={true}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="7.5" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" />
            <path d="M12 2.5v3M21.5 12h-3M12 21.5v-3M2.5 12h3" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </span>
        <span className="cause-filter__trigger-copy">
          <span className="cause-filter__trigger-value">{triggerLabel}</span>
          <span className="cause-filter__trigger-detail">
            {isFiltered ? 'Custom ranking scope' : `${categories.length} cause areas`}
          </span>
        </span>
        {isFiltered && <span className="cause-filter__active-dot" aria-hidden={true} />}
        <span className="cause-filter__chevron" data-open={isOpen} aria-hidden={true}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {!isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={`${componentId}-popover`}
              role="dialog"
              aria-labelledby={popoverTitleId}
              aria-describedby={popoverDescriptionId}
              className="cause-filter__popover"
              initial={{ opacity: 0, y: -6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <CauseFilterContents {...contentsProps} titleId={popoverTitleId} descriptionId={popoverDescriptionId} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {isMobile && (
        <ModalShell
          isOpen={isOpen}
          onClose={handlePanelClose}
          labelledBy={modalTitleId}
          describedBy={modalDescriptionId}
          panelClassName="cause-filter-modal__panel"
        >
          <div id={`${componentId}-modal`}>
            <CauseFilterContents {...contentsProps} titleId={modalTitleId} descriptionId={modalDescriptionId} />
          </div>
        </ModalShell>
      )}
    </div>
  );
};

CauseFilter.propTypes = {
  categories: PropTypes.arrayOf(categoryShape).isRequired,
  selectedCategoryIds: PropTypes.arrayOf(PropTypes.string),
  onApply: PropTypes.func.isRequired,
};

export const CauseScopeSummary = ({ selectedCategories, donorCount, onReset }) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  const visibleCategories = selectedCategories.slice(0, MAX_VISIBLE_SCOPE_CHIPS);
  const hiddenCategoryCount = selectedCategories.length - visibleCategories.length;

  return (
    <motion.div
      role="region"
      className="cause-scope-summary"
      aria-label="Active cause scope"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="cause-scope-summary__mark" aria-hidden={true}>
        <span />
        <span />
        <span />
      </div>
      <div className="cause-scope-summary__body">
        <p className="cause-scope-summary__eyebrow">Ranking within</p>
        <div className="cause-scope-summary__chips">
          {visibleCategories.map((category) => (
            <span key={category.id} className="cause-scope-summary__chip">
              {category.name}
            </span>
          ))}
          {hiddenCategoryCount > 0 && (
            <span className="cause-scope-summary__chip cause-scope-summary__chip--more">
              +{hiddenCategoryCount} more
            </span>
          )}
        </div>
      </div>
      <div className="cause-scope-summary__meta">
        <span aria-live="polite">
          {donorCount} {donorCount === 1 ? 'donor' : 'donors'}
        </span>
        <button type="button" onClick={onReset} className="impact-btn impact-btn--ghost impact-btn--xs">
          Switch to all causes
        </button>
      </div>
    </motion.div>
  );
};

CauseScopeSummary.propTypes = {
  selectedCategories: PropTypes.arrayOf(categoryShape).isRequired,
  donorCount: PropTypes.number.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default CauseFilter;
