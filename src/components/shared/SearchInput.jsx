import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable search input component with icon
 */
const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '', size = 'default' }) => {
  const sizeClasses = {
    sm: 'py-1.5 text-xs',
    default: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`impact-search ${className}`.trim()}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${sizeClasses[size]} ${value ? 'pr-16' : 'pr-10'}`}
      />
      <div className="impact-search__actions">
        {value && (
          <button type="button" onClick={() => onChange('')} className="impact-search__clear" aria-label="Clear search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${iconSizeClasses[size]}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSizeClasses[size]} text-[var(--text-muted)]`}
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
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
};

export default SearchInput;
