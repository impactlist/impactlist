import React from 'react';
import { useAssumptions } from '../contexts/AssumptionsContext';
import AssumptionsEditor from './AssumptionsEditor';

const AssumptionsEditorWrapper = () => {
  const { isModalOpen } = useAssumptions();

  // Only render the editor when modal is actually open
  // This prevents expensive calculations from running when not needed
  if (!isModalOpen) {
    return null;
  }

  return <AssumptionsEditor />;
};

export default AssumptionsEditorWrapper;
