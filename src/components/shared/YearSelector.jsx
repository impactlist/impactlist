import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting a year for preview calculations.
 *
 * Semi-controlled: the field's text is local state while typing, and only
 * valid in-range years are committed to the parent. Consumers therefore
 * always hold a usable year — nothing downstream recomputes for the
 * transient values ('', 2, 20, 201…) that typing "2010" passes through.
 */
const YearSelector = ({
  value,
  onChange,
  label = 'Assumed year:',
  ariaLabel,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  className = '',
  id = 'year-selector',
}) => {
  const [draft, setDraft] = useState(() => String(value));
  // Re-sync the draft when the committed year changes underneath us — e.g.
  // another YearSelector bound to the same shared year committed a change.
  // (The render-time state-adjustment pattern, not an effect.)
  const [lastSyncedValue, setLastSyncedValue] = useState(value);
  if (value !== lastSyncedValue) {
    setLastSyncedValue(value);
    setDraft(String(value));
  }

  const parseYear = (text) => {
    const year = parseInt(text, 10);
    return Number.isInteger(year) ? year : null;
  };

  const commit = (year) => {
    setDraft(String(year));
    if (year !== value) {
      onChange(year);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setDraft(inputValue);

    // Commit as soon as the text is a valid in-range year; partial or
    // out-of-range input stays local until blur resolves it.
    const year = parseYear(inputValue);
    if (year !== null && year >= minYear && year <= maxYear && year !== value) {
      onChange(year);
    }
  };

  const handleBlur = () => {
    const year = parseYear(draft);

    // Empty or not a number: restore the committed year — never a silent
    // jump to some other year than the one the costs were showing.
    if (year === null) {
      setDraft(String(value));
      return;
    }

    // Out-of-range input clamps to the nearest allowed year — the closest
    // interpretation of what the user typed. In-range input was already
    // committed while typing; commit() just normalizes the display.
    if (year < minYear) {
      commit(minYear);
    } else if (year > maxYear) {
      commit(maxYear);
    } else {
      commit(year);
    }
  };

  return (
    <div className={`impact-year-selector ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <input
        type="number"
        id={id}
        value={draft}
        onChange={handleChange}
        onBlur={handleBlur}
        min={minYear}
        max={maxYear}
        // A visible label wins over ariaLabel; the fallback keeps the input
        // named when callers embed it mid-sentence with label="".
        aria-label={!label ? ariaLabel : undefined}
        title={`Year from ${minYear} to ${maxYear}`}
        className="text-sm"
      />
    </div>
  );
};

YearSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default YearSelector;
