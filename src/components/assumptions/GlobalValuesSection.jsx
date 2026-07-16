import React from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../shared/SectionCard';
import NumericInput from '../shared/NumericInput';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import IconActionButton from '../shared/IconActionButton';
import { formatNumberWithCommas } from '../../utils/formatters';
import { buildCausePath } from '../../utils/causeRoutes';
import { GLOBAL_PARAMETER_DEFINITIONS } from '../../constants/globalParameterDefinitions';
import GlobalFutureValueGraph from './GlobalFutureValueGraph';

const GlobalValuesSection = ({ globalParameters, defaultGlobalParameters, formValues, errors, onChange }) => {
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GLOBAL_PARAMETER_DEFINITIONS.map((param) => {
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
          const showDefaultMeta = isCustom && !hasError && !param.readonly;
          const formattedDefaultValue = formatDisplayValue(defaultValue, param.format);

          return (
            <SectionCard key={param.id} hasError={hasError} isCustom={isCustom} padding="sm">
              <div className="assumption-card__top">
                <div className="min-w-[220px] flex-1">
                  <div className="assumption-card__title-wrap pr-2">
                    <label htmlFor={param.id} className="assumption-card__title-text">
                      {param.label}
                    </label>
                    <InfoTooltipIcon content={param.description} />
                    {showDefaultMeta && (
                      <span className="assumption-card__default-meta">(Default: {formattedDefaultValue})</span>
                    )}
                  </div>
                </div>

                <div className="assumption-card__actions">
                  {/* Also shown for invalid drafts: malformed input parses to
                      NaN (never "custom") while blocking Apply, so the reset
                      is the escape hatch back to a valid value. */}
                  {!param.readonly && (isCustom || hasError) && (
                    <IconActionButton
                      icon="reset"
                      label={`Reset ${param.label}`}
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
              <div className="mt-2">
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
                    onChange={(newValue) => onChange(param.id, newValue)}
                    placeholder={formatDisplayValue(defaultValue, param.format)}
                    error={hasError ? errors[param.id] : undefined}
                    isCustom={isCustom}
                  />
                )}
              </div>
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
              Adjust the assumptions about the relative value of animal lives vs. human lives inside the{' '}
              {/* Client-side Link: a raw <a> full-page reload would bypass the
                  unapplied-edits navigation guard and drop draft edits. */}
              <Link to={buildCausePath('animal-welfare')} className="assumptions-link">
                Animal Welfare
              </Link>{' '}
              cause settings, or for any specific recipient in that cause.
            </p>
          </div>
        </div>
      </div>

      <GlobalFutureValueGraph
        globalParameters={globalParameters}
        defaultGlobalParameters={defaultGlobalParameters}
        formValues={formValues}
      />
    </>
  );
};

export default GlobalValuesSection;
