import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import { formatNumberWithCommas } from '../../utils/formatters';

/**
 * Component for managing default cost per life values for categories.
 */
const DefaultValuesSection = ({ allCategories, formValues, errors, onChange, className = '' }) => {
  // Get form value with formatting
  const getFormValue = (formValues, key, defaultValue) => {
    const formValue = formValues[key];

    // If we have a form value, return its display value
    if (formValue) {
      return formValue.display;
    }

    // Otherwise check if there's a fallback value
    if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
      return formatNumberWithCommas(defaultValue);
    }

    // Return empty string if no value found
    return '';
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {Object.entries(allCategories)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([key, category]) => {
          const defaultValue = category.costPerLife;
          const valueObj = formValues[key] || { raw: '', display: '' };
          const hasError = errors[key];

          // Check if value is custom (different from default)
          // Remove commas before comparing numeric values
          const rawWithoutCommas = valueObj.raw ? valueObj.raw.toString().replace(/,/g, '') : '';
          const isCustom = rawWithoutCommas !== '' && Number(rawWithoutCommas) !== defaultValue;

          return (
            <div
              key={key}
              className={`py-1.5 px-2 rounded border ${
                hasError ? 'border-red-300 bg-red-50' : isCustom ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <label className="text-sm font-medium truncate pr-2" htmlFor={`category-${key}`} title={category.name}>
                  <Link
                    to={`/category/${encodeURIComponent(key)}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {category.name}
                  </Link>
                </label>
                {isCustom && (
                  <button
                    type="button"
                    className={`text-xs ${hasError ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}
                    onClick={() => {
                      const value = defaultValue;
                      const formattedValue = formatNumberWithCommas(value);
                      onChange(key, formattedValue);
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <CurrencyInput
                id={`category-${key}`}
                value={getFormValue(formValues, key, defaultValue)} // Never use default as value
                onChange={(value) => onChange(key, value)}
                error={hasError}
                className="w-full"
                validateOnBlur={true} // Only validate on blur, not while typing
                placeholder={formatNumberWithCommas(defaultValue)} // Use default as placeholder
              />
              {isCustom && !hasError && (
                <div className="text-xs text-gray-500 mt-0.5">Default: ${formatNumberWithCommas(defaultValue)}</div>
              )}
            </div>
          );
        })}
    </div>
  );
};

DefaultValuesSection.propTypes = {
  allCategories: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default React.memo(DefaultValuesSection);
