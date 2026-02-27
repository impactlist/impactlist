import React from 'react';
import PropTypes from 'prop-types';

const iconDefinitions = {
  edit: {
    viewBox: '0 0 20 20',
    fill: 'currentColor',
    paths: [
      'M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z',
    ],
  },
  reset: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    paths: ['M3 2v6h6', 'M3 13a9 9 0 1 0 3-7.7L3 8'],
  },
  delete: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    paths: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 11v6', 'M14 11v6'],
  },
  'copy-link': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.25,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    paths: ['M10 7H7a5 5 0 1 0 0 10h3', 'M14 17h3a5 5 0 0 0 0-10h-3', 'M8 12h8'],
  },
};

const IconActionButton = ({ icon, label, onClick, className = '', tone = 'default' }) => {
  const definition = iconDefinitions[icon];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`impact-icon-btn ${className}`.trim()}
      data-icon={icon}
      data-tone={tone}
      aria-label={label}
      title={label}
    >
      <svg
        viewBox={definition.viewBox}
        fill={definition.fill}
        stroke={definition.stroke}
        strokeWidth={definition.strokeWidth}
        strokeLinecap={definition.strokeLinecap}
        strokeLinejoin={definition.strokeLinejoin}
        aria-hidden="true"
      >
        {definition.paths.map((path) => (
          <path key={path} d={path} />
        ))}
      </svg>
    </button>
  );
};

IconActionButton.propTypes = {
  icon: PropTypes.oneOf(['edit', 'reset', 'delete', 'copy-link']).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  tone: PropTypes.oneOf(['default', 'danger']),
};

export default IconActionButton;
