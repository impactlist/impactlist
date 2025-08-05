import React from 'react';
import Tooltip from '../shared/Tooltip';
import { formatWithCursorHandling, formatNumberWithCommas } from '../../utils/formatters';

const GlobalValuesSection = ({ defaultGlobalParameters, formValues, errors, onChange }) => {
  const parameters = [
    {
      id: 'discountRate',
      label: 'Discount Rate (%)',
      description: 'Annual discount rate for future effects',
      format: 'percentage',
    },
    {
      id: 'populationGrowthRate',
      label: 'Population Growth Rate (%)',
      description: 'Annual population growth rate',
      format: 'percentage',
    },
    {
      id: 'timeLimit',
      label: 'Time Limit (years)',
      description: "Time after which we don't consider effects on the future",
      format: 'number',
    },
    {
      id: 'populationLimit',
      label: 'Population Limit Factor',
      description: "Maximum or minimum population as a multiple of today's population",
      format: 'number',
    },
    {
      id: 'currentPopulation',
      label: 'Current Population',
      description: 'Current global population',
      format: 'number',
    },
    {
      id: 'yearsPerLife',
      label: 'Years Per Life',
      description: 'Number of years of human life that we consider equal to one life saved',
      format: 'number',
    },
  ];

  const formatDisplayValue = (value, format) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (format === 'percentage') {
      // For percentage, multiply by 100 and format with commas
      const percentValue = parseFloat(value) * 100;
      return formatNumberWithCommas(percentValue.toString());
    }

    if (format === 'number') {
      // Format numbers with commas
      return formatNumberWithCommas(value.toString());
    }

    return value;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {parameters.map((param) => {
        const value = formValues[param.id]?.formatted || '';
        const hasError = errors[param.id];
        const defaultValue = defaultGlobalParameters[param.id];
        const currentValue = formValues[param.id]?.raw || '';
        const isCustom = currentValue !== '' && Number(currentValue) !== defaultValue;

        return (
          <div
            key={param.id}
            className={`py-2 px-3 rounded border ${
              hasError ? 'border-red-300 bg-red-50' : isCustom ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <label htmlFor={param.id} className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {param.label}
                <Tooltip content={param.description}>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
              </label>
              {isCustom && (
                <button
                  type="button"
                  className={`text-xs ${hasError ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}
                  onClick={() => {
                    const formattedValue = formatDisplayValue(defaultValue, param.format);
                    onChange(param.id, formattedValue);
                  }}
                >
                  Reset
                </button>
              )}
            </div>
            <input
              type="text"
              id={param.id}
              name={param.id}
              value={value}
              onChange={(e) => {
                // Get the current input element and cursor position
                const inputElement = e.target;
                const newValue = e.target.value;
                const currentPosition = e.target.selectionStart;

                // Format with commas while preserving cursor position
                const result = formatWithCursorHandling(newValue, currentPosition, inputElement);

                // Pass the formatted value to parent
                onChange(param.id, result.value);
              }}
              placeholder={formatDisplayValue(defaultValue, param.format)}
              className={`
                w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none
                ${
                  hasError
                    ? 'border-red-300 text-red-700 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }
              `}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors[param.id]}
              </p>
            )}
            {isCustom && !hasError && (
              <p className="text-xs text-gray-500 mt-0.5">Default: {formatDisplayValue(defaultValue, param.format)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GlobalValuesSection;
