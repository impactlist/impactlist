import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AssumptionEntityCard from './AssumptionEntityCard';
import { formatCurrency } from '../../utils/formatters';
import { calculateCostPerLife } from '../../utils/effectsCalculation';
import { calculateCategoryEffectCostPerLife, mergeGlobalParameters } from '../../utils/assumptionsEditorHelpers';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';

/**
 * Component for managing cost per life values for categories.
 */
const CategoryValuesSection = ({
  defaultAssumptions,
  userAssumptions,
  onEditCategory,
  onResetCategory,
  categoriesWithCustomValues,
  previewYear,
  className = '',
}) => {
  // Merge global parameters once for consistent calculations
  const mergedGlobalParameters = useMemo(
    () => mergeGlobalParameters(defaultAssumptions?.globalParameters, userAssumptions?.globalParameters),
    [defaultAssumptions?.globalParameters, userAssumptions]
  );

  // Get categories from defaultAssumptions and calculate their costs
  const categoriesData = useMemo(() => {
    const result = {};
    if (!defaultAssumptions?.categories) return result;

    Object.entries(defaultAssumptions.categories).forEach(([categoryId, category]) => {
      // Calculate default cost per life from effects
      const defaultCostPerLife = calculateCostPerLife(
        category.effects,
        mergedGlobalParameters,
        previewYear || getCurrentYear()
      );

      // Calculate current cost per life (with user overrides if any)
      const currentCostPerLife = calculateCategoryEffectCostPerLife(
        categoryId,
        defaultAssumptions,
        userAssumptions,
        mergedGlobalParameters,
        previewYear || getCurrentYear()
      );

      result[categoryId] = {
        name: category.name,
        defaultCostPerLife,
        currentCostPerLife,
      };
    });

    return result;
  }, [defaultAssumptions, userAssumptions, mergedGlobalParameters, previewYear]);
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className}`.trim()}>
      {Object.entries(categoriesData)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([key, categoryData]) => (
          <AssumptionEntityCard
            key={key}
            name={categoryData.name}
            to={buildCausePath(key)}
            isCustom={Boolean(categoriesWithCustomValues && categoriesWithCustomValues.has(key))}
            baselineValue={formatCurrency(categoryData.defaultCostPerLife)}
            currentValue={formatCurrency(categoryData.currentCostPerLife)}
            onEdit={() => onEditCategory(key)}
            onReset={onResetCategory ? () => onResetCategory(key) : null}
          />
        ))}
    </div>
  );
};

CategoryValuesSection.propTypes = {
  defaultAssumptions: PropTypes.object.isRequired,
  userAssumptions: PropTypes.object,
  onEditCategory: PropTypes.func.isRequired,
  onResetCategory: PropTypes.func,
  categoriesWithCustomValues: PropTypes.object,
  previewYear: PropTypes.number,
  className: PropTypes.string,
};

export default React.memo(CategoryValuesSection);
