import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CurrencyInput from '../shared/CurrencyInput';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../utils/formatters';

/**
 * Component for managing recipient-specific cost per life values.
 */
const RecipientValuesSection = ({
  filteredRecipients,
  formValues,
  errors,
  allCategories,
  customValues,
  onChange,
  onSearch,
  searchTerm,
}) => {
  // Helper function to get custom value for a recipient's category
  const getCustomRecipientValue = (recipientName, categoryId, type) => {
    try {
      if (customValues?.recipients?.[recipientName]?.[categoryId]?.[type] !== undefined) {
        return customValues.recipients[recipientName][categoryId][type];
      }
    } catch (error) {
      console.error('Error in getCustomRecipientValue:', error);
    }
    return '';
  };

  // Get form value with fallback to default
  const getFormValue = (formValues, key, fallbackValue) => {
    const formValue = formValues[key];

    if (formValue) {
      return formValue.display;
    }

    if (fallbackValue !== undefined && fallbackValue !== null && fallbackValue !== '') {
      return formatNumberWithCommas(fallbackValue);
    }

    return '';
  };

  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-sm text-gray-600 italic">
          {searchTerm === ''
            ? 'Showing only recipients with custom values. Use search to find others.'
            : filteredRecipients.length >= 10
              ? 'Showing first 10 matching recipients.'
              : `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`}
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? 'No recipients found matching your search'
            : 'No recipients with custom values found. Search for a specific recipient.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient, index) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              // Alternate row colors for better readability
              const isEven = index % 2 === 0;
              const bgColorClass = isEven ? 'bg-white' : 'bg-gray-100';

              return (
                <div key={recipient.name} className={`border border-gray-200 rounded-md p-3 ${bgColorClass}`}>
                  <h3 className="font-medium text-gray-800 mb-2">{recipient.name}</h3>
                  <div className="space-y-3">
                    {recipientCategories.map(([categoryId, categoryData]) => {
                      const categoryName = allCategories[categoryId]?.name || categoryId;

                      // Calculate base values
                      const baseCostPerLife =
                        customValues?.[categoryId] !== undefined
                          ? customValues[categoryId]
                          : allCategories[categoryId]?.costPerLife || 0;

                      // Get existing values
                      const defaultMultiplier = categoryData?.multiplier;
                      const defaultCostPerLife = categoryData?.costPerLife;

                      // Get custom values
                      const customMultiplier = getCustomRecipientValue(recipient.name, categoryId, 'multiplier');
                      const customCostPerLife = getCustomRecipientValue(recipient.name, categoryId, 'costPerLife');

                      // Field keys
                      const multiplierKey = `${recipient.name}__${categoryId}__multiplier`;
                      const costPerLifeKey = `${recipient.name}__${categoryId}__costPerLife`;

                      return (
                        <div key={categoryId} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-2 rounded">
                          <div className="text-sm text-gray-700">
                            <Link
                              to={`/category/${encodeURIComponent(categoryId)}`}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              {categoryName}
                            </Link>
                            <div className="text-xs text-gray-500">Category: ${baseCostPerLife.toLocaleString()}</div>
                          </div>

                          {/* Multiplier input */}
                          <div>
                            <label
                              htmlFor={`multiplier-${recipient.name}-${categoryId}`}
                              className="block text-xs font-medium text-gray-500 mb-1"
                            >
                              Multiplier
                            </label>
                            <input
                              id={`multiplier-${recipient.name}-${categoryId}`}
                              type="text"
                              inputMode="text"
                              placeholder={
                                customCostPerLife !== '' || getFormValue(formValues, costPerLifeKey, '') !== ''
                                  ? 'None'
                                  : defaultMultiplier !== undefined
                                    ? defaultMultiplier.toString()
                                    : 'None'
                              }
                              value={getFormValue(formValues, multiplierKey, defaultMultiplier)}
                              onChange={(e) => {
                                // Clear cost per life field if this field has a value
                                if (e.target.value.trim() !== '') {
                                  onChange(costPerLifeKey, '');
                                }

                                // Get the current input element and cursor position
                                const inputElement = e.target;
                                const newValue = e.target.value;
                                const currentPosition = e.target.selectionStart;

                                // Format with commas while preserving cursor position
                                const result = formatWithCursorHandling(newValue, currentPosition, inputElement);

                                // Pass the value to parent
                                onChange(multiplierKey, result.value);
                              }}
                              className={`w-full py-1 px-1.5 text-sm border rounded ${
                                errors[recipient.name]?.[categoryId]?.multiplier
                                  ? 'border-red-300 text-red-700 bg-red-50'
                                  : (customValues?.recipients?.[recipient.name]?.[categoryId]?.multiplier !==
                                        undefined &&
                                        customValues.recipients[recipient.name][categoryId].multiplier !==
                                          defaultMultiplier) ||
                                      (formValues[multiplierKey] &&
                                        formValues[multiplierKey].raw !== '' &&
                                        Number(formValues[multiplierKey].raw) !== defaultMultiplier)
                                    ? 'border-indigo-300 bg-indigo-50'
                                    : 'border-gray-300'
                              }`}
                              aria-invalid={!!errors[recipient.name]?.[categoryId]?.multiplier}
                            />
                            {errors[recipient.name]?.[categoryId]?.multiplier && (
                              <div className="text-xs text-red-600 mt-0.5">
                                {errors[recipient.name][categoryId].multiplier}
                              </div>
                            )}
                            {/* Show default value indicator */}
                            {defaultMultiplier !== undefined &&
                              ((formValues[multiplierKey]?.raw &&
                                Number(formValues[multiplierKey].raw.replace(/,/g, '')) !==
                                  Number(defaultMultiplier)) ||
                                getFormValue(formValues, costPerLifeKey, defaultCostPerLife) !== '') && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Default: {formatNumberWithCommas(defaultMultiplier)}
                                </div>
                              )}
                          </div>

                          {/* Direct cost per life input */}
                          <div>
                            <label
                              htmlFor={`cost-per-life-${recipient.name}-${categoryId}`}
                              className="block text-xs font-medium text-gray-500 mb-1"
                            >
                              Direct Cost Per Life
                            </label>
                            <CurrencyInput
                              id={`cost-per-life-${recipient.name}-${categoryId}`}
                              value={getFormValue(formValues, costPerLifeKey, defaultCostPerLife)}
                              onChange={(value) => {
                                // Clear multiplier field if this field has a value
                                if (value.trim() !== '') {
                                  onChange(multiplierKey, '');
                                }
                                onChange(costPerLifeKey, value);
                              }}
                              placeholder={
                                customMultiplier !== '' || getFormValue(formValues, multiplierKey, '') !== ''
                                  ? 'None'
                                  : defaultCostPerLife !== undefined
                                    ? 'Default'
                                    : 'None'
                              }
                              error={errors[recipient.name]?.[categoryId]?.costPerLife}
                              className="w-full"
                              validateOnBlur={true} // Only validate on blur, not while typing
                            />
                            {/* Show default value indicator */}
                            {defaultCostPerLife !== undefined &&
                              ((formValues[costPerLifeKey]?.raw &&
                                Number(formValues[costPerLifeKey].raw.replace(/,/g, '')) !==
                                  Number(defaultCostPerLife)) ||
                                getFormValue(formValues, multiplierKey, defaultMultiplier) !== '') && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Default: ${formatNumberWithCommas(defaultCostPerLife)}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

RecipientValuesSection.propTypes = {
  filteredRecipients: PropTypes.array.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  allCategories: PropTypes.object.isRequired,
  customValues: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default React.memo(RecipientValuesSection);
