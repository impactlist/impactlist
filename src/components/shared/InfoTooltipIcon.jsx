import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const InfoTooltipIcon = ({ content, className = '', iconClassName = 'h-4 w-4' }) => {
  return (
    <span className={`inline-flex ${className}`.trim()}>
      <Tooltip content={content}>
        <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={true}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Tooltip>
    </span>
  );
};

InfoTooltipIcon.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default InfoTooltipIcon;
