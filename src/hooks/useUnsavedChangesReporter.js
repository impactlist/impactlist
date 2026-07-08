import { useEffect } from 'react';

/**
 * Reports a boolean unsaved-changes flag to a parent callback, and reports
 * false on unmount so the parent can never be left holding a stale "dirty"
 * flag after the reporting component goes away (e.g. an effect editor closed
 * by a navigation). Callers must pass a stable (useCallback) callback.
 */
const useUnsavedChangesReporter = (hasUnsavedChanges, onUnsavedChangesChange) => {
  useEffect(() => {
    onUnsavedChangesChange(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  useEffect(() => () => onUnsavedChangesChange(false), [onUnsavedChangesChange]);
};

export default useUnsavedChangesReporter;
