import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable search input component with icon on left side
 */
const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '', size = 'default' }) => {
  const sizeClasses = {
    sm: 'py-1 text-xs',
    default: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const leftPadding = {
    sm: 'pl-7',
    default: 'pl-9',
    lg: 'pl-11',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon on the left */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSizeClasses[size]} text-slate-400`}
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
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${leftPadding[size]} ${value ? 'pr-10' : 'pr-3'} ${sizeClasses[size]} border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none transition-colors duration-150 placeholder:text-slate-400`}
      />
      {/* Clear button on the right */}
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 hover:bg-slate-100 rounded-full"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${iconSizeClasses[size]} text-slate-400 hover:text-slate-600`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
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
