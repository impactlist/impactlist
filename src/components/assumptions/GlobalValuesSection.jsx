import React from 'react';
import Tooltip from '../shared/Tooltip';
import SectionCard from '../shared/SectionCard';
import CustomValueIndicator from '../shared/CustomValueIndicator';
import NumericInput from '../shared/NumericInput';
import { formatNumberWithCommas } from '../../utils/formatters';

const GlobalValuesSection = ({ defaultGlobalParameters, formValues, errors, onChange }) => {
  // Format display value based on parameter type
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

  const parameters = [
    {
      id: 'discountRate',
      label: 'Discount Rate (%)',
      description:
        'Annual discount rate for future life-years. For instance if the discount rate is 2, then a year of life next year is worth 2% less than a year of life this year.',
      format: 'percentage',
    },
    {
      id: 'populationGrowthRate',
      label: 'Population Growth Rate (%)',
      description:
        'Annual population growth rate starting at the current date and continuing indefinitely or until it hits the population limit (see: Population Limit Factor). For donations in the past we use the historical growth rate until the current year.',
      format: 'percentage',
    },
    {
      id: 'populationLimit',
      label: 'Population Limit Factor',
      description:
        "The population will stop growing or shrinking when it hits this limit. The limit is expressed as a multiple of today's population. If the population growth rate would never cause the population to hit this limit, it is ignored.",
      format: 'number',
    },
    {
      id: 'timeLimit',
      label: 'Time Limit (years)',
      description:
        "Time after which we don't consider effects on the future. For instance a value of 100 means we don't consider effects on the future beyond 100 years.",
      format: 'number',
    },
    {
      id: 'currentPopulation',
      label: 'Current Population',
      description:
        'Current global population. This is the value that the Population Limit Factor is expressed in terms of.',
      format: 'number',
      readonly: true,
    },
    {
      id: 'yearsPerLife',
      label: 'Years Per Life',
      description: 'Number of years of human life that we consider equal to one life saved.',
      format: 'number',
      readonly: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {parameters.map((param) => {
        // For NumericInput, we need to pass the correct value based on format
        // For percentages: use formatted (already in percentage form, e.g., "2" for 2%)
        // For numbers: use formatted (with commas)
        const value = formValues[param.id]?.formatted || '';
        const hasError = errors[param.id];
        const defaultValue = defaultGlobalParameters[param.id];
        const currentValue = formValues[param.id]?.raw;
        // Check if value is custom - handle both undefined/empty and actual value comparison
        const isCustom =
          currentValue !== undefined &&
          currentValue !== '' &&
          currentValue !== null &&
          Math.abs(Number(currentValue) - Number(defaultValue)) > 0.0000001;

        return (
          <SectionCard key={param.id} hasError={hasError} isCustom={isCustom} padding="default">
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
              {!param.readonly && (
                <CustomValueIndicator
                  isCustom={isCustom}
                  hasError={hasError}
                  onReset={() => {
                    const formattedValue = formatDisplayValue(defaultValue, param.format);
                    onChange(param.id, formattedValue);
                  }}
                />
              )}
            </div>
            {param.readonly ? (
              <input
                type="text"
                id={param.id}
                name={param.id}
                value={formatDisplayValue(defaultValue, param.format)}
                readOnly={true}
                disabled={true}
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed"
              />
            ) : (
              <NumericInput
                id={param.id}
                value={value}
                onChange={(newValue) => {
                  // NumericInput returns a number or string
                  // For percentages, newValue is already in percentage form (e.g., 2 for 2%)
                  // For numbers, it's the actual value
                  const formatted =
                    typeof newValue === 'number' ? formatNumberWithCommas(newValue.toString()) : newValue;
                  onChange(param.id, formatted);
                }}
                placeholder={formatDisplayValue(defaultValue, param.format)}
                error={hasError ? errors[param.id] : undefined}
                isCustom={isCustom}
              />
            )}
            {isCustom && !hasError && (
              <p className="text-xs text-gray-500 mt-0.5">Default: {formatDisplayValue(defaultValue, param.format)}</p>
            )}
          </SectionCard>
        );
      })}
    </div>
  );
};

export default GlobalValuesSection;
