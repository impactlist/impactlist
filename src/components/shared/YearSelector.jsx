import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting a year for preview calculations
 */
const YearSelector = ({
  value,
  onChange,
  label = 'Assumed year:',
  minYear = 1900,
  maxYear = new Date().getFullYear(),
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

    // Just pass the value through if it's a valid number
    // Don't clamp during typing to allow natural input
    if (!isNaN(year)) {
      onChange(year);
    }
  };

  const handleBlur = (e) => {
    const inputValue = e.target.value;
    const currentYear = new Date().getFullYear();

    // If empty or not a number, reset to current year
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      onChange(currentYear);
      return;
    }

    const year = parseInt(inputValue, 10);

    // If outside valid range, reset to current year
    if (year < minYear || year > maxYear) {
      onChange(currentYear);
    }
    // If within range, leave it as is (onChange already called in handleChange)
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
