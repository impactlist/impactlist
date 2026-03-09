import { useCallback, useEffect, useState } from 'react';
import {
  ASSUMPTIONS_SELECTOR_PREFERENCE_CHANGED_EVENT,
  getShowAssumptionsSelectorEveryPage,
  setShowAssumptionsSelectorEveryPage,
} from '../utils/assumptionsSelectorDisplayPreference';

const useAssumptionsSelectorPreference = () => {
  const [showSelectorEveryPage, setShowSelectorEveryPageState] = useState(getShowAssumptionsSelectorEveryPage);

  useEffect(() => {
    const syncPreference = () => {
      setShowSelectorEveryPageState(getShowAssumptionsSelectorEveryPage());
    };

    globalThis.addEventListener(ASSUMPTIONS_SELECTOR_PREFERENCE_CHANGED_EVENT, syncPreference);
    globalThis.addEventListener('storage', syncPreference);

    return () => {
      globalThis.removeEventListener(ASSUMPTIONS_SELECTOR_PREFERENCE_CHANGED_EVENT, syncPreference);
      globalThis.removeEventListener('storage', syncPreference);
    };
  }, []);

  const setShowSelectorEveryPage = useCallback((shouldShow) => {
    setShowAssumptionsSelectorEveryPage(shouldShow);
  }, []);

  return [showSelectorEveryPage, setShowSelectorEveryPage];
};

export default useAssumptionsSelectorPreference;
