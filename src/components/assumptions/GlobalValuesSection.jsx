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
    <div className="space-y-6">
      {parameters.map((param) => {
        const value = formValues[param.id]?.formatted || '';
        const hasError = errors[param.id];
        const defaultValue = defaultGlobalParameters[param.id];
        const currentValue = formValues[param.id]?.raw || '';
        const showDefault = currentValue !== '' && Number(currentValue) !== defaultValue;

        return (
          <div key={param.id}>
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="relative">
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
                    block w-40 rounded-md shadow-sm
                    ${
                      hasError
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    sm:text-sm px-3 py-2
                  `}
                />
                {hasError && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors[param.id]}
              </p>
            )}
            {showDefault && (
              <p className="text-xs text-gray-500 mt-1">Default: {formatDisplayValue(defaultValue, param.format)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GlobalValuesSection;
