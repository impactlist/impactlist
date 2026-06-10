import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import EffectEditorActionButtons from '../shared/EffectEditorActionButtons';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import RecipientEffectCard from './RecipientEffectCard';
import useRecipientEffectsDraft from '../../hooks/useRecipientEffectsDraft';
import { getRecipientEffectsChangeState } from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { getCurrentYear } from '../../utils/donationDataHelpers';
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

  // Report changes to parent whenever effects or errors change
  useEffect(() => {
    onEffectsChange(categoryId, effects, errors, hasUnsavedChanges, combinedCostPerLife);
  }, [categoryId, effects, errors, hasUnsavedChanges, combinedCostPerLife, onEffectsChange]);

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
              <span>Combined cost per life: </span>
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
 */
const MultiCategoryRecipientEditor = ({
  recipient,
  recipientId,
  categories,
  activeCategory,
  globalParameters,
  onSave,
  onCancel,
}) => {
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
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

  // Handle effects change from a category section
  const handleEffectsChange = useCallback((categoryId, effects, errors, hasUnsavedChanges, combinedCostPerLife) => {
    setCategoryData((prev) => ({
      ...prev,
      [categoryId]: { effects, errors, hasUnsavedChanges, combinedCostPerLife },
    }));
  }, []);

  // Check if any category has errors
  const hasErrors = useMemo(() => {
    return Object.values(categoryData).some((data) => Object.keys(data.errors || {}).length > 0);
  }, [categoryData]);

  const hasUnsavedChanges = useMemo(() => {
    return Object.values(categoryData).some((data) => data.hasUnsavedChanges);
  }, [categoryData]);

  // Handle save - collect and clean effects from all categories
  const handleSave = () => {
    if (hasErrors || !hasUnsavedChanges) return;

    const allCategoryEffects = {};

    Object.entries(categoryData).forEach(([categoryId, data]) => {
      const { effects } = data;
      if (!effects) return;

      const { effectsToSave } = getRecipientEffectsChangeState(effects);

      if (effectsToSave.length > 0) {
        allCategoryEffects[categoryId] = effectsToSave;
      }
    });

    onSave(allCategoryEffects);
  };

  // Check if any category has time intervals
  const hasTimeIntervals = useMemo(() => {
    return categories.some(({ category }) =>
      category?.effects?.some(
        (effect) =>
          effect?.validTimeInterval && (effect.validTimeInterval[0] !== null || effect.validTimeInterval[1] !== null)
      )
    );
  }, [categories]);

  const recipientCombinedCostPerLife = useMemo(() => {
    if (categories.length === 0) {
      return undefined;
    }

    let totalWeightedCost = 0;
    let totalWeight = 0;

    for (const { categoryId } of categories) {
      const cost = categoryData[categoryId]?.combinedCostPerLife;
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
  }, [categories, categoryData, recipient]);

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
            {hasTimeIntervals && (
              <YearSelector
                value={previewYear}
                onChange={setPreviewYear}
                label="Preview for year:"
                id="multi-category-preview-year"
              />
            )}
          </div>
        }
        combinedCostPerLife={showHeaderActions ? recipientCombinedCostPerLife : undefined}
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
            previewYear={previewYear}
            onEffectsChange={handleEffectsChange}
            sectionRef={(el) => {
              sectionRefs.current[categoryId] = el;
            }}
          />
        ))}
      </div>

      <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} disabled={!hasUnsavedChanges} />
    </div>
  );
};

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
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default MultiCategoryRecipientEditor;
