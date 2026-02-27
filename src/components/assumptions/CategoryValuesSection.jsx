import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import IconActionButton from '../shared/IconActionButton';
import { formatCurrency } from '../../utils/formatters';
import { calculateCostPerLife } from '../../utils/effectsCalculation';
import { calculateCategoryEffectCostPerLife, mergeGlobalParameters } from '../../utils/assumptionsEditorHelpers';
import { getCurrentYear } from '../../utils/donationDataHelpers';

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
        .map(([key, categoryData]) => {
          const defaultValue = categoryData.defaultCostPerLife;
          const currentValue = categoryData.currentCostPerLife;

          // Check if this category has any custom effect parameters
          const isCustom = categoriesWithCustomValues && categoriesWithCustomValues.has(key);

          // Format values for display (strip $ sign since CurrencyInput adds it)
          const formattedDefault = formatCurrency(defaultValue).replace('$', '');
          const formattedCurrent = formatCurrency(currentValue).replace('$', '');

          return (
            <SectionCard key={key} isCustom={isCustom} padding="sm" className="h-full">
              <div className="assumption-card__top">
                <div className="min-w-0">
                  <label
                    className="block truncate pr-2 text-sm font-semibold text-[var(--text-strong)]"
                    htmlFor={`category-${key}`}
                  >
                    <Link
                      to={`/category/${encodeURIComponent(key)}`}
                      className="assumptions-link"
                      title={categoryData.name}
                    >
                      {categoryData.name}
                    </Link>
                  </label>
                </div>

                <div className="assumption-card__actions">
                  {isCustom && onResetCategory && (
                    <IconActionButton icon="reset" label="Reset" onClick={() => onResetCategory(key)} />
                  )}
                  <IconActionButton
                    icon="edit"
                    label="Edit"
                    onClick={() => {
                      if (!onEditCategory) {
                        throw new Error('onEditCategory prop is required when editing categories');
                      }
                      onEditCategory(key);
                    }}
                  />
                </div>
              </div>

              <div className="mt-2">
                <CurrencyInput
                  id={`category-${key}`}
                  value={formattedCurrent}
                  onChange={() => {}}
                  className="w-full"
                  validateOnBlur={true}
                  placeholder={formattedDefault}
                  disabled={true}
                />
              </div>

              <div className="mt-1 min-h-[1.1rem]">
                <div className="impact-field__helper">{isCustom ? `Default: $${formattedDefault}` : '\u00A0'}</div>
              </div>
            </SectionCard>
          );
        })}
    </div>
  );
};

CategoryValuesSection.propTypes = {
  defaultAssumptions: PropTypes.object.isRequired,
  userAssumptions: PropTypes.object,
  onEditCategory: PropTypes.func,
  onResetCategory: PropTypes.func,
  categoriesWithCustomValues: PropTypes.object,
  previewYear: PropTypes.number,
  className: PropTypes.string,
};

export default React.memo(CategoryValuesSection);
