import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import CustomValueIndicator from '../shared/CustomValueIndicator';
import { formatNumberWithCommas } from '../../utils/formatters';
import { getFormValue } from '../../utils/formUtils';

/**
 * Component for managing cost per life values for categories.
 */
const CategoryValuesSection = ({
  allCategories,
  defaultCategories,
  formValues,
  errors,
  onChange,
  onEditCategory,
  onResetCategory,
  categoriesWithCustomValues,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {Object.entries(allCategories)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([key, category]) => {
          const defaultValue = defaultCategories[key].costPerLife;
          const hasError = errors[key];

          // Check if this category has any custom effect parameters
          const isCustom = categoriesWithCustomValues && categoriesWithCustomValues.has(key);

          return (
            <SectionCard key={key} hasError={hasError} isCustom={isCustom} padding="sm">
              <div className="flex justify-between items-start mb-2">
                <label className="text-sm font-medium truncate pr-2" htmlFor={`category-${key}`} title={category.name}>
                  <Link
                    to={`/category/${encodeURIComponent(key)}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {category.name}
                  </Link>
                </label>
                <CustomValueIndicator
                  isCustom={isCustom}
                  hasError={hasError}
                  onReset={() => {
                    // Reset both the form display and the actual category data
                    const value = defaultValue;
                    const formattedValue = formatNumberWithCommas(value);
                    onChange(key, formattedValue);
                    if (onResetCategory) {
                      onResetCategory(key);
                    }
                  }}
                />
              </div>
              <div className="relative">
                <CurrencyInput
                  id={`category-${key}`}
                  value={getFormValue(formValues, key, defaultValue)} // Never use default as value
                  onChange={(value) => onChange(key, value)}
                  error={hasError}
                  className="w-full pr-10"
                  validateOnBlur={true} // Only validate on blur, not while typing
                  placeholder={formatNumberWithCommas(defaultValue)} // Use default as placeholder
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
                <div className="text-xs text-gray-500 mt-0.5">Default: ${formatNumberWithCommas(defaultValue)}</div>
              )}
            </SectionCard>
          );
        })}
    </div>
  );
};

CategoryValuesSection.propTypes = {
  allCategories: PropTypes.object.isRequired,
  defaultCategories: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onEditCategory: PropTypes.func,
  className: PropTypes.string,
};

export default React.memo(CategoryValuesSection);
