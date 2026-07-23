import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query without duplicating viewport state in React.
 * The server snapshot is deliberately false: the app is client-rendered, and
 * this keeps the non-matching layout as the deterministic fallback.
 */
const useMediaQuery = (query) => {
  const mediaQueryList = useMemo(
    () => (typeof window === 'undefined' || typeof window.matchMedia !== 'function' ? null : window.matchMedia(query)),
    [query]
  );

  const subscribe = useCallback(
    (onStoreChange) => {
      if (!mediaQueryList) {
        return () => {};
      }

      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [mediaQueryList]
  );

  const getSnapshot = useCallback(() => mediaQueryList?.matches ?? false, [mediaQueryList]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
