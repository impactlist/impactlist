import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import CustomValueIndicator from '../shared/CustomValueIndicator';
import { formatCurrency } from '../../utils/formatters';
import { calculateCostPerLife } from '../../utils/effectsCalculation';
import { calculateCategoryEffectCostPerLife, mergeGlobalParameters } from '../../utils/assumptionsEditorHelpers';

/**
 * Component for managing cost per life values for categories.
 */
const CategoryValuesSection = ({
  defaultAssumptions,
  userAssumptions,
  errors,
  onChange,
  onEditCategory,
  onResetCategory,
  categoriesWithCustomValues,
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
      const defaultCostPerLife = calculateCostPerLife(category.effects, mergedGlobalParameters, categoryId);

      // Calculate current cost per life (with user overrides if any)
      const currentCostPerLife = calculateCategoryEffectCostPerLife(
        categoryId,
        defaultAssumptions,
        userAssumptions,
        mergedGlobalParameters
      );

      result[categoryId] = {
        name: category.name,
        defaultCostPerLife,
        currentCostPerLife,
      };
    });

    return result;
  }, [defaultAssumptions, userAssumptions, mergedGlobalParameters]);
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {Object.entries(categoriesData)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([key, categoryData]) => {
          const defaultValue = categoryData.defaultCostPerLife;
          const currentValue = categoryData.currentCostPerLife;
          const hasError = errors[key];

          // Check if this category has any custom effect parameters
          const isCustom = categoriesWithCustomValues && categoriesWithCustomValues.has(key);

          // Format values for display (strip $ sign since CurrencyInput adds it)
          const formattedDefault = formatCurrency(defaultValue).replace('$', '');
          const formattedCurrent = formatCurrency(currentValue).replace('$', '');

          return (
            <SectionCard key={key} hasError={hasError} isCustom={isCustom} padding="sm">
              <div className="flex justify-between items-start mb-2">
                <label
                  className="text-sm font-medium truncate pr-2"
                  htmlFor={`category-${key}`}
                  title={categoryData.name}
                >
                  <Link
                    to={`/category/${encodeURIComponent(key)}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {categoryData.name}
                  </Link>
                </label>
                <CustomValueIndicator
                  isCustom={isCustom}
                  hasError={hasError}
                  onReset={() => {
                    // Reset both the form display and the actual category data
                    onChange(key, formattedDefault);
                    if (onResetCategory) {
                      onResetCategory(key);
                    }
                  }}
                />
              </div>
              <div className="relative">
                <CurrencyInput
                  id={`category-${key}`}
                  value={formattedCurrent} // Use calculated value directly (no form state needed for read-only)
                  onChange={(value) => onChange(key, value)}
                  error={hasError}
                  className="w-full pr-10"
                  validateOnBlur={true} // Only validate on blur, not while typing
                  placeholder={formattedDefault} // Use formatted default as placeholder
                  disabled={true} // Make read-only
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!onEditCategory) {
                      throw new Error('onEditCategory prop is required when editing categories');
                    }
                    onEditCategory(key);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
              </div>
              {isCustom && !hasError && (
                <div className="text-xs text-gray-500 mt-0.5">Default: ${formattedDefault}</div>
              )}
            </SectionCard>
          );
        })}
    </div>
  );
};

CategoryValuesSection.propTypes = {
  defaultAssumptions: PropTypes.object.isRequired,
  userAssumptions: PropTypes.object,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onEditCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
  categoriesWithCustomValues: PropTypes.object,
  className: PropTypes.string,
};

export default React.memo(CategoryValuesSection);
