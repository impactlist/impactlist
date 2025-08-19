import React from 'react';
import PropTypes from 'prop-types';
import { checkWindowExceedsTimeLimit } from '../../utils/effectEditorUtils';

/**
 * Component that displays a time limit message when an effect window would be truncated
 */
const TimeLimitMessage = ({ startTime, windowLength, timeLimit }) => {
  if (!checkWindowExceedsTimeLimit(startTime, windowLength, timeLimit)) {
    return null;
  }

  return <p className="text-xs text-gray-500 mt-1 px-3 pb-1">Time limit: {timeLimit.toLocaleString()}</p>;
};

TimeLimitMessage.propTypes = {
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  windowLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timeLimit: PropTypes.number,
};

export default TimeLimitMessage;
