import React from 'react';
import SectionCard from '../shared/SectionCard';
import NumericInput from '../shared/NumericInput';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import IconActionButton from '../shared/IconActionButton';
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
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {parameters.map((param) => {
          // For NumericInput, we need to pass the correct value based on format
          // For percentages: use formatted (already in percentage form, e.g., "2" for 2%)
          // For numbers: use formatted (with commas)
          const value = formValues[param.id]?.formatted || '';
          const hasError = Boolean(errors[param.id]);
          const defaultValue = defaultGlobalParameters[param.id];
          const currentValue = formValues[param.id]?.raw;
          // Check if value is custom - handle both undefined/empty and actual value comparison
          const isCustom =
            currentValue !== undefined &&
            currentValue !== '' &&
            currentValue !== null &&
            Math.abs(Number(currentValue) - Number(defaultValue)) > 0.0000001;
          const showDefaultHelper = isCustom && !hasError && !param.readonly;

          return (
            <SectionCard key={param.id} hasError={hasError} isCustom={isCustom} padding="default">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-[220px] flex-1">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={param.id} className="text-sm font-semibold text-[var(--text-strong)]">
                      {param.label}
                    </label>
                    <InfoTooltipIcon content={param.description} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!param.readonly && isCustom && (
                    <IconActionButton
                      icon="reset"
                      label="Reset"
                      tone={hasError ? 'danger' : 'default'}
                      onClick={() => {
                        const formattedValue = formatDisplayValue(defaultValue, param.format);
                        onChange(param.id, formattedValue);
                      }}
                    />
                  )}
                  {param.readonly && <span className="impact-muted-pill">Fixed</span>}
                  {hasError && (
                    <span className="assumption-state-pill" data-state="error">
                      Error
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3">
                {param.readonly ? (
                  <div className="impact-field">
                    <div className="impact-field__control">
                      <input
                        type="text"
                        id={param.id}
                        name={param.id}
                        value={formatDisplayValue(defaultValue, param.format)}
                        readOnly={true}
                        disabled={true}
                        className="impact-field__input"
                      />
                    </div>
                  </div>
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
              </div>
              {!param.readonly && (
                <p className="impact-field__helper mt-2 min-h-[1rem]">
                  {showDefaultHelper ? `Default: ${formatDisplayValue(defaultValue, param.format)}` : '\u00A0'}
                </p>
              )}
            </SectionCard>
          );
        })}
      </div>

      <div className="assumptions-info-block mt-5 p-4">
        <div className="flex items-start gap-2">
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden={true}>
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm">
            <p className="mb-1 font-semibold">Note: Animal lives vs. human lives</p>
            <p>
              Adjust relative value assumptions inside{' '}
              <a href="/category/animal-welfare" className="assumptions-link">
                Animal Welfare
              </a>{' '}
              category settings, or for any specific recipient in that category.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalValuesSection;
