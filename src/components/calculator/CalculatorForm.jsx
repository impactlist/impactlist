import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatLives, formatCurrency, formatNumberWithCommas } from '../../utils/formatters';
import { buildCausePath } from '../../utils/causeRoutes';
import YearSelector from '../shared/YearSelector';
import FormattedScientificValue from '../shared/FormattedScientificValue';
import useFormattedNumberInput from '../../hooks/useFormattedNumberInput';
import { getSanitizedInputCaretPosition, normalizeFormattedNumberEdit } from '../../utils/numberParsing';

/**
 * One cause's amount input. Owns its display state via useFormattedNumberInput
 * (like CurrencyInput) so mid-string edits keep the cursor in place and
 * backspacing a comma works; a fully controlled reformat-on-render input
 * snapped the cursor to the end on every keystroke.
 */
const DonationAmountInput = ({ categoryId, amount, onDonationChange }) => {
  const emitChange = useCallback(
    (formattedValue, rawValue) => onDonationChange(categoryId, rawValue.replace(/,/g, '')),
    [categoryId, onDonationChange]
  );
  const { inputRef, localValue, setLocalValue, handleChange } = useFormattedNumberInput(amount, emitChange);
  const [inputError, setInputError] = useState(false);

  const handleGuardedChange = (event) => {
    const raw = event.target.value;
    // Accept an optional currency symbol when pasting, but reject any other
    // unsupported character as a whole. Removing arbitrary characters is
    // dangerous for money: for example, `1e309` must not become `$1,309`.
    const normalizedAmount = normalizeFormattedNumberEdit(localValue, raw, event.nativeEvent?.inputType, {
      allowNegative: false,
      allowLeadingCurrencySign: true,
    });

    if (!normalizedAmount) {
      // Preserve the invalid draft so it cannot lose a character and become a
      // different valid amount. The parent rejects it, leaving totals based on
      // the last valid value. The error copy makes that visible when the prior
      // value was a positive amount that is still included in the totals.
      setLocalValue(raw);
      onDonationChange(categoryId, raw);
      setInputError(true);
      return;
    }
    setInputError(false);
    const { displayText: sanitized } = normalizedAmount;

    if (sanitized !== raw) {
      const caret = event.target.selectionStart ?? sanitized.length;
      const keptBeforeCaret = getSanitizedInputCaretPosition(raw, sanitized, caret);
      event.target.value = sanitized;
      event.target.setSelectionRange(keptBeforeCaret, keptBeforeCaret);
    }
    handleChange(event);
  };

  const handleBlur = () => {
    if (inputError) {
      setLocalValue(formatNumberWithCommas(amount));
      setInputError(false);
    }
  };

  const errorId = `donation-${categoryId}-error`;
  const previousAmount = Number(amount.replace(/,/g, ''));
  const hasCountedPreviousAmount = Number.isFinite(previousAmount) && previousAmount > 0;

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        id={`donation-${categoryId}`}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleGuardedChange}
        onBlur={handleBlur}
        aria-invalid={inputError}
        aria-errormessage={inputError ? errorId : undefined}
        className="calculator-cause-card__input w-full rounded px-2 py-0.5 text-sm leading-tight"
        placeholder="0"
      />
      {inputError && (
        <p id={errorId} className="impact-field__error mt-1 text-xs" role="alert">
          Enter a positive finite amount using decimal or scientific notation.
          {hasCountedPreviousAmount && ' The previous amount is still included in the totals.'}
        </p>
      )}
    </div>
  );
};

DonationAmountInput.propTypes = {
  categoryId: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onDonationChange: PropTypes.func.isRequired,
};

/**
 * Form component for the donation calculator to input cause-based donations.
 */
const CalculatorForm = ({
  categories,
  donations,
  onDonationChange,
  onReset,
  getLivesSavedForCategory,
  getCostPerLifeForCategory,
  categoryYear,
  onYearChange,
  className = '',
}) => {
  return (
    <div className={`assumptions-shell p-6 ${className}`}>
      {/* Donation inputs header with reset button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-strong">Add Donations by Cause Area</h2>
        <button onClick={onReset} className="impact-btn impact-btn--secondary impact-btn--sm inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805v2.203a1 1 0 01-1.707.707L1.707 8.13a1 1 0 010-1.415l2.586-2.586A1 1 0 015 3.99V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13.5V11a1 1 0 012 0v2a7.002 7.002 0 01-11.601 5.29 1 1 0 01-.61-1.275l.009-.019.354-.707a1 1 0 01.614-.61z"
              clipRule="evenodd"
            />
          </svg>
          Reset All Amounts
        </button>
      </div>

      {/* Year selector */}
      <div className="mb-4">
        <YearSelector
          value={categoryYear}
          onChange={onYearChange}
          label="Assumed year:"
          id="category-year-selector"
          className=""
        />
      </div>

      {/* Donation inputs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {categories.map((category) => {
          const amount = donations[category.id] || '';
          const livesSaved = getLivesSavedForCategory(category.id, amount);
          const costPerLife = getCostPerLifeForCategory(category.id);

          return (
            <div key={category.id} className="calculator-cause-card px-4 py-2">
              <div className="flex justify-between items-start mb-1">
                <label className="text-sm font-medium text-strong" htmlFor={`donation-${category.id}`}>
                  <Link to={buildCausePath(category.id)} className="impact-link">
                    {category.name}
                  </Link>
                </label>
                <span className="text-xs text-muted">
                  <FormattedScientificValue value={formatCurrency(costPerLife)} variant="compact" />
                  /life
                </span>
              </div>
              <div className="flex items-center mb-1">
                <span className="mr-1 text-muted">$</span>
                <DonationAmountInput categoryId={category.id} amount={amount} onDonationChange={onDonationChange} />
              </div>
              {amount && !isNaN(Number(amount)) && (
                <div className={`text-sm ${livesSaved < 0 ? 'text-danger' : 'text-success'}`}>
                  Lives saved: <FormattedScientificValue value={formatLives(livesSaved)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

CalculatorForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  donations: PropTypes.object.isRequired,
  onDonationChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  getLivesSavedForCategory: PropTypes.func.isRequired,
  getCostPerLifeForCategory: PropTypes.func.isRequired,
  categoryYear: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default React.memo(CalculatorForm);
