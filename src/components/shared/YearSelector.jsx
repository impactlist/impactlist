import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting a year for preview calculations
 */
const YearSelector = ({
  value,
  onChange,
  label = 'Preview year:',
  minYear = 1900,
  maxYear = 2100,
  className = '',
  id = 'year-selector',
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty value during typing
    if (inputValue === '') {
      onChange('');
      return;
    }

    const year = parseInt(inputValue, 10);

    // Validate year is a number and within range
    if (!isNaN(year)) {
      // Clamp to valid range
      const clampedYear = Math.max(minYear, Math.min(maxYear, year));
      onChange(clampedYear);
    }
  };

  const handleBlur = (e) => {
    // On blur, if empty or invalid, reset to current year
    const inputValue = e.target.value;
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      onChange(new Date().getFullYear());
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-600">
          {label}
        </label>
      )}
      <input
        type="number"
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min={minYear}
        max={maxYear}
        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

YearSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default YearSelector;
