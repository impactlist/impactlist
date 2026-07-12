import React, { forwardRef, useState, useEffect, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import EffectEditorActionButtons from '../shared/EffectEditorActionButtons';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import RecipientEffectCard from './RecipientEffectCard';
import useRecipientEffectsDraft from '../../hooks/useRecipientEffectsDraft';
import useUnsavedChangesReporter from '../../hooks/useUnsavedChangesReporter';
import { getRecipientEffectsChangeState } from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { resolveCalcYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';
import YearSelector from '../shared/YearSelector';
import FormattedScientificValue from '../shared/FormattedScientificValue';

/**
 * A single category's effect section within the multi-category editor.
 * Manages its own draft state and reports changes to the parent.
 */
const CategoryEffectSection = ({
  recipientId,
  category,
  categoryId,
  globalParameters,
  previewYear,
  onEffectsChange,
  sectionRef,
}) => {
  const { defaultAssumptions, userAssumptions } = useAssumptions();

  const {
    effects,
    errors,
    hasUnsavedChanges,
    effectCostPerLife,
    combinedCostPerLife,
    effectInputSources,
    toggleEffectDisabled,
    updateEffectField,
  } = useRecipientEffectsDraft({
    recipientId,
    categoryId,
    category,
    globalParameters,
    previewYear,
    defaultAssumptions,
    userAssumptions,
  });

  // Report changes to parent whenever effects or errors change. The report
  // carries the year the costs were computed for, so the parent's aggregate
  // can ignore reports from a previous year (they lag one effect-flush
  // behind a year change).
  useEffect(() => {
    onEffectsChange(categoryId, {
      effects,
      errors,
      hasUnsavedChanges,
      combinedCostPerLife,
      calculationYear: previewYear,
    });
  }, [categoryId, effects, errors, hasUnsavedChanges, combinedCostPerLife, previewYear, onEffectsChange]);

  return (
    <div ref={sectionRef} className="effect-card effect-card--flush effect-card--category-group mb-4 overflow-hidden">
      {/* Category header */}
      <div className="effect-card__category-header rounded-t-lg px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-strong">
            <Link to={buildCausePath(categoryId)} className="assumptions-link">
              {category.name}
            </Link>
          </h3>
          {/* Only show combined cost when there are multiple effects */}
          {effects.length > 1 && (
            <div className="effect-card__summary">
              <span>Combined cost per life in {previewYear}: </span>
              <span
                className={
                  combinedCostPerLife === Infinity || combinedCostPerLife < 0
                    ? 'effect-card__summary-value effect-card__summary-value--invalid'
                    : 'effect-card__summary-value'
                }
              >
                {combinedCostPerLife === Infinity ? (
                  '∞'
                ) : (
                  <FormattedScientificValue value={formatCurrency(combinedCostPerLife)} variant="compact" />
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Effects list */}
      <div className="effect-card__category-body p-3 space-y-3">
        {effects.map((effect, index) => (
          <RecipientEffectCard
            key={effect.effectId}
            effect={effect}
            index={index}
            costPerLife={effectCostPerLife[index]}
            sources={effectInputSources[index]}
            errors={errors}
            onChange={updateEffectField}
            onToggleDisabled={() => toggleEffectDisabled(index)}
            globalParameters={globalParameters}
            previewYear={previewYear}
            // Each section's effect indexes restart at 0; the category id
            // keeps input/error ids unique across the whole editor.
            fieldIdPrefix={`${categoryId}-`}
          />
        ))}
      </div>
    </div>
  );
};

CategoryEffectSection.propTypes = {
  recipientId: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onEffectsChange: PropTypes.func.isRequired,
  // Accepts a callback ref (what the parent passes) or a ref object.
  sectionRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

/**
 * Component for editing effects across all categories of a multi-category recipient.
 * Renders a scrollable list of category sections, each containing its own effect editor.
 *
 * Reports draft dirtiness through `onUnsavedChangesChange` and exposes
 * `attemptApply()` on its ref (see EFFECT_EDITOR_HANDLE_CONTRACT in
 * AssumptionsEditor) so the navigation guard can commit or hold the draft.
 */
const MultiCategoryRecipientEditor = forwardRef(
  (
    {
      recipient,
      recipientId,
      categories,
      activeCategory,
      globalParameters,
      previewYear,
      onPreviewYearChange,
      onSave,
      onCancel,
      onUnsavedChangesChange = () => {},
    },
    ref
  ) => {
    // ONE preview year, owned by the editor shell and shared with the list
    // views (see CategoryEffectEditor). Sections and labels get the resolved
    // year, so what's shown is always what was computed.
    const calculationYear = resolveCalcYear(previewYear);
    const [categoryData, setCategoryData] = useState({});
    const sectionRefs = useRef({});
    const scrollContainerRef = useRef(null);

    // Scroll to active category on mount
    useEffect(() => {
      if (activeCategory && sectionRefs.current[activeCategory] && scrollContainerRef.current) {
        // Small delay to ensure refs are set
        setTimeout(() => {
          sectionRefs.current[activeCategory]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }, [activeCategory]);

    // Handle a section's report (effects/errors/dirtiness/cost, tagged with
    // the year the cost was computed for).
    const handleEffectsChange = useCallback((categoryId, report) => {
      setCategoryData((prev) => ({
        ...prev,
        [categoryId]: report,
      }));
    }, []);

    // Check if any category has errors
    const hasErrors = useMemo(() => {
      return Object.values(categoryData).some((data) => Object.keys(data.errors || {}).length > 0);
    }, [categoryData]);

    const hasUnsavedChanges = useMemo(() => {
      return Object.values(categoryData).some((data) => data.hasUnsavedChanges);
    }, [categoryData]);

    useUnsavedChangesReporter(hasUnsavedChanges, onUnsavedChangesChange);

    // Same contract as CategoryEffectEditor.attemptApply: validate and return
    // what a commit would save (a per-category effects map here); the caller
    // owns committing and navigation.
    const attemptApply = useCallback(() => {
      if (!hasUnsavedChanges) {
        return { ok: true, effects: null };
      }
      if (hasErrors) {
        return { ok: false };
      }

      const allCategoryEffects = {};

      Object.entries(categoryData).forEach(([categoryId, data]) => {
        const { effects } = data;
        if (!effects) return;

        const { effectsToSave } = getRecipientEffectsChangeState(effects);

        if (effectsToSave.length > 0) {
          allCategoryEffects[categoryId] = effectsToSave;
        }
      });

      return { ok: true, effects: allCategoryEffects };
    }, [hasUnsavedChanges, hasErrors, categoryData]);

    useImperativeHandle(ref, () => ({ attemptApply }), [attemptApply]);

    const handleSave = () => {
      const result = attemptApply();
      if (result.ok && result.effects) {
        onSave(result.effects);
      }
    };

    const recipientCombinedCostPerLife = useMemo(() => {
      if (categories.length === 0) {
        return undefined;
      }

      let totalWeightedCost = 0;
      let totalWeight = 0;

      for (const { categoryId } of categories) {
        const data = categoryData[categoryId];
        // Section reports lag one effect-flush behind a year change; a report
        // computed for another year must not aggregate under this year's
        // label — the header briefly shows no cost instead of a wrong one.
        if (!data || data.calculationYear !== calculationYear) {
          return undefined;
        }

        const cost = data.combinedCostPerLife;
        if (typeof cost !== 'number') {
          return undefined;
        }

        const fraction = recipient?.categories?.[categoryId]?.fraction ?? 0;
        if (cost !== Infinity && fraction > 0) {
          totalWeightedCost += cost * fraction;
          totalWeight += fraction;
        }
      }

      if (totalWeight === 0) {
        return Infinity;
      }

      return totalWeightedCost / totalWeight;
    }, [calculationYear, categories, categoryData, recipient]);

    const showHeaderActions = categories.length > 1;
    const headerActions = showHeaderActions ? (
      <EffectEditorActionButtons
        onSave={handleSave}
        onCancel={onCancel}
        isSaveDisabled={hasErrors || !hasUnsavedChanges}
        compact={true}
      />
    ) : null;

    return (
      <div className="assumptions-shell assumptions-shell--editor overflow-hidden">
        <EffectEditorHeader
          title={
            <>
              Edit effects for recipient
              <InfoTooltipIcon
                className="effect-editor-help"
                content="See the FAQ to learn how to edit these assumptions, and for a description of what effects are."
              />{' '}
              :{' '}
              <Link to={`/recipient/${recipientId}`} className="assumptions-link">
                {recipient.name}
              </Link>
            </>
          }
          description={
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted">{categories.length} causes</span>
              <YearSelector
                value={previewYear}
                onChange={onPreviewYearChange}
                label="Preview calculations for year:"
                id="multi-category-preview-year"
              />
            </div>
          }
          combinedCostPerLife={showHeaderActions ? recipientCombinedCostPerLife : undefined}
          combinedCostYear={calculationYear}
          showCombinedCost={showHeaderActions}
          headerActions={headerActions}
        />

        {/* Scrollable container for all category sections */}
        <div ref={scrollContainerRef} className="px-3 py-2">
          {categories.map(({ categoryId, category }) => (
            <CategoryEffectSection
              key={categoryId}
              recipientId={recipientId}
              category={category}
              categoryId={categoryId}
              globalParameters={globalParameters}
              previewYear={calculationYear}
              onEffectsChange={handleEffectsChange}
              sectionRef={(el) => {
                sectionRefs.current[categoryId] = el;
              }}
            />
          ))}
        </div>

        <EffectEditorFooter
          onSave={handleSave}
          onCancel={onCancel}
          hasErrors={hasErrors}
          disabled={!hasUnsavedChanges}
        />
      </div>
    );
  }
);

MultiCategoryRecipientEditor.displayName = 'MultiCategoryRecipientEditor';

MultiCategoryRecipientEditor.propTypes = {
  recipient: PropTypes.object.isRequired,
  recipientId: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      category: PropTypes.object.isRequired,
    })
  ).isRequired,
  activeCategory: PropTypes.string,
  globalParameters: PropTypes.object.isRequired,
  previewYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onPreviewYearChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUnsavedChangesChange: PropTypes.func,
};

export default MultiCategoryRecipientEditor;
