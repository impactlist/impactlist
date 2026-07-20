import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { getSessionStorage } from '../../utils/safeStorage';
import { isBodyScrollLocked } from '../../utils/bodyScrollLock';
import { beginHistoryEntryScrollRestoration, getHistoryEntryScrollId } from '../../utils/scrollRestorationCoordinator';

// One navigation gets ONE hash-targeting budget: waiting for the lazy route
// chunk to render the target AND pinning it through layout settling share
// this window (they do not stack).
const HASH_TARGET_TOTAL_MS = 2000;
// ...except a slow find still gets a short settle window: charts expand
// right after the target mounts, so pinning must outlive that moment even
// when the chunk ate most of the budget. Worst case is TOTAL + SETTLE_MIN.
const HASH_SETTLE_MIN_MS = 500;
// POP restoration has the same lazy-layout problem as hash targeting: the
// browser can try to restore while the Suspense fallback is still the whole
// page, clamp the position to zero, and never try again once the ranking
// mounts. Keep a short retry/resize window so the saved position wins once
// the destination is tall enough.
const POP_RESTORE_TOTAL_MS = 5000;
const SCROLL_POSITION_WRITE_DELAY_MS = 250;
const SCROLL_POSITION_STORAGE_PREFIX = 'impactlist:scroll-position:';
const RESTORABLE_DOCUMENT_NAVIGATION_TYPES = new Set(['reload', 'back_forward']);

const getDocumentNavigationType = () => {
  const navigationEntry = globalThis.performance?.getEntriesByType?.('navigation')?.[0];
  if (navigationEntry?.type) {
    return navigationEntry.type;
  }

  // Older Safari versions expose only the deprecated numeric API. Keep the
  // fallback isolated here; modern browsers take the Navigation Timing path.
  if (globalThis.performance?.navigation?.type === 1) return 'reload';
  if (globalThis.performance?.navigation?.type === 2) return 'back_forward';
  return 'navigate';
};

const getScrollPositionStorageKey = (entryId) => `${SCROLL_POSITION_STORAGE_PREFIX}${entryId}`;

const readPersistedScrollPosition = (entryId) => {
  try {
    const serialized = getSessionStorage().getItem(getScrollPositionStorageKey(entryId));
    if (!serialized) return null;

    const position = JSON.parse(serialized);
    return Number.isFinite(position?.x) && Number.isFinite(position?.y) ? position : null;
  } catch {
    // Scroll restoration is an enhancement. Corrupt or unavailable storage
    // must never turn ordinary navigation into an application error.
    return null;
  }
};

const writePersistedScrollPosition = (entryId, position) => {
  try {
    getSessionStorage().setItem(getScrollPositionStorageKey(entryId), JSON.stringify(position));
  } catch {
    // Storage can become unavailable after its initial capability probe
    // (quota changes, private-mode restrictions). Keep in-memory restoration
    // working and allow reload persistence to degrade silently.
  }
};

const getActiveBrowserHistoryEntryId = () => {
  const historyState = window.history.state;
  // MemoryRouter does not own window.history. Browser/data routers record an
  // integer index there, which lets us reject late scroll events from the
  // entry React is in the process of unmounting.
  if (!Number.isInteger(historyState?.idx)) {
    return null;
  }

  return getHistoryEntryScrollId({
    key: historyState.key || 'default',
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  });
};

/**
 * Scroll management for navigations.
 *
 * - POP navigations (back/forward buttons) restore the position saved for
 *   that history entry. This is managed here rather than left to the browser
 *   because lazy route fallbacks can be too short for native restoration.
 * - Same-pathname search-param navigations (the assumptions editor's
 *   tab/entity state) must not touch the scroll position. Same-page anchor
 *   clicks scroll natively, while Back/Forward between hash history entries
 *   restores the position saved for each entry.
 * - Navigations WITH a hash land on the hash's target instead of the top
 *   (e.g. the editor's "Why these values?" links target a detail page's
 *   `#full-justification`). There is no single "page finished rendering"
 *   moment to await: the route page is React.lazy (the target doesn't exist
 *   when the navigation commits), and the charts above the target render
 *   ~0-height and expand after their own measure tick, pushing the target
 *   back down AFTER a scroll. So: poll frames only until the target exists,
 *   scroll to it, then re-pin only when the page grows AND the target
 *   actually moved (growth below the anchor leaves it pinned) — measured
 *   only on ResizeObserver notifications, never per frame — until the
 *   budget ends, or until the user interacts, which wins immediately.
 * - The initial load also runs the hash targeting (the browser's native
 *   anchor jump fails for the same lazy-rendering reason), even though the
 *   router reports it as POP.
 */
const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, hash } = location;
  // Browser-router direct entries use the shared key "default". Include the
  // URL so two separately loaded routes in one tab cannot reuse each other's
  // persisted position; random router keys still distinguish duplicate URLs.
  const historyEntryId = getHistoryEntryScrollId(location);
  const navigationType = useNavigationType();
  // Initialize these to the first render so React StrictMode's mount-effect
  // replay still counts as the initial entry. Only rendering a different
  // history entry flips hasNavigatedRef permanently.
  const previousPathnameRef = useRef(pathname);
  const previousHashRef = useRef(hash);
  const previousHistoryEntryRef = useRef(historyEntryId);
  const hasNavigatedRef = useRef(false);
  const documentNavigationTypeRef = useRef(getDocumentNavigationType());
  const scrollPositionsRef = useRef(new Map());
  const persistedHistoryEntriesRef = useRef(new Set());
  const restoringHistoryEntryRef = useRef(null);
  const newHistoryEntryRef = useRef(null);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return undefined;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    let persistenceTimeoutId = null;

    const persistLatestPosition = () => {
      if (persistenceTimeoutId !== null) {
        clearTimeout(persistenceTimeoutId);
        persistenceTimeoutId = null;
      }

      const position = scrollPositionsRef.current.get(historyEntryId);
      if (position) {
        writePersistedScrollPosition(historyEntryId, position);
      }
    };

    const schedulePositionPersistence = () => {
      if (persistenceTimeoutId !== null) {
        clearTimeout(persistenceTimeoutId);
      }
      persistenceTimeoutId = setTimeout(persistLatestPosition, SCROLL_POSITION_WRITE_DELAY_MS);
    };

    const savePosition = () => {
      const activeBrowserHistoryEntryId = getActiveBrowserHistoryEntryId();
      if (activeBrowserHistoryEntryId && activeBrowserHistoryEntryId !== historyEntryId) {
        return;
      }

      // Some mobile browsers temporarily collapse window.scrollY when body
      // overflow is locked for a modal. That is not a user position and must
      // not replace the history entry's last real viewport coordinates.
      if (isBodyScrollLocked()) {
        return;
      }

      // Programmatic POP restoration can fire scroll events for intermediate,
      // clamped positions while a lazy destination is still growing. Do not
      // let those transient values replace the destination's saved position.
      if (restoringHistoryEntryRef.current === historyEntryId) {
        return;
      }

      const position = {
        x: window.scrollX || 0,
        y: window.scrollY || 0,
      };
      scrollPositionsRef.current.set(historyEntryId, position);
      schedulePositionPersistence();
    };

    // After a reload the in-memory map is empty, but session storage still
    // carries positions keyed by the browser-history entry's router key.
    if (!scrollPositionsRef.current.has(historyEntryId)) {
      const isInitialHistoryEntry = !hasNavigatedRef.current && previousHistoryEntryRef.current === historyEntryId;
      // Persisted positions survive a whole-document navigation. Reuse them
      // for reloads and browser history traversal, but not for a genuinely
      // fresh visit to the same URL in this tab.
      const canRestorePersistedPosition =
        !isInitialHistoryEntry || RESTORABLE_DOCUMENT_NAVIGATION_TYPES.has(documentNavigationTypeRef.current);
      const persistedPosition = canRestorePersistedPosition ? readPersistedScrollPosition(historyEntryId) : null;
      if (persistedPosition) {
        scrollPositionsRef.current.set(historyEntryId, persistedPosition);
        persistedHistoryEntriesRef.current.add(historyEntryId);
      } else {
        newHistoryEntryRef.current = historyEntryId;
        savePosition();
      }
    }

    window.addEventListener('scroll', savePosition, { passive: true });
    window.addEventListener('pagehide', persistLatestPosition);
    return () => {
      window.removeEventListener('scroll', savePosition);
      window.removeEventListener('pagehide', persistLatestPosition);
      // Route changes may happen before the trailing debounce fires. Flush
      // the source entry synchronously so Back can restore it immediately.
      persistLatestPosition();
    };
  }, [historyEntryId]);

  useEffect(() => {
    const pathnameChanged = previousPathnameRef.current !== pathname;
    const hashChanged = previousHashRef.current !== hash;
    const historyEntryChanged = previousHistoryEntryRef.current !== historyEntryId;
    const isNewHistoryEntry = newHistoryEntryRef.current === historyEntryId;
    if (isNewHistoryEntry) {
      newHistoryEntryRef.current = null;
    }
    if (historyEntryChanged) {
      hasNavigatedRef.current = true;
      previousHistoryEntryRef.current = historyEntryId;
    }
    previousPathnameRef.current = pathname;
    previousHashRef.current = hash;
    const isInitialLoad = !hasNavigatedRef.current;

    const shouldRestoreSavedPosition =
      (navigationType === 'POP' && !isInitialLoad && (pathnameChanged || (hashChanged && !isNewHistoryEntry))) ||
      (isInitialLoad && !hash && persistedHistoryEntriesRef.current.has(historyEntryId));

    if (shouldRestoreSavedPosition) {
      const savedPosition = scrollPositionsRef.current.get(historyEntryId);
      if (!savedPosition) {
        if (!isInitialLoad) return undefined;
      } else {
        const finishCoordinatedRestoration = beginHistoryEntryScrollRestoration(historyEntryId);
        restoringHistoryEntryRef.current = historyEntryId;

        const deadline = Date.now() + POP_RESTORE_TOTAL_MS;
        const userInputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
        let done = false;
        let frameId = null;
        let resizeObserver = null;
        let deadlineId = null;

        const stop = () => {
          if (done) return;
          done = true;
          if (restoringHistoryEntryRef.current === historyEntryId) {
            restoringHistoryEntryRef.current = null;
          }
          finishCoordinatedRestoration();
          userInputEvents.forEach((eventName) => {
            window.removeEventListener(eventName, stop, { capture: true });
          });
          if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
          }
          resizeObserver?.disconnect();
          if (deadlineId !== null) {
            clearTimeout(deadlineId);
          }
        };

        const restorePosition = () => {
          if (done) return;
          frameId = null;
          window.scrollTo(savedPosition.x, savedPosition.y);

          // A short Suspense fallback cannot reach a deep saved Y yet. Keep
          // trying frames until the real route makes that position available.
          if (Math.abs(window.scrollY - savedPosition.y) > 1 && Date.now() <= deadline) {
            frameId = window.requestAnimationFrame(restorePosition);
          }
        };

        userInputEvents.forEach((eventName) => {
          window.addEventListener(eventName, stop, { passive: true, capture: true });
        });

        if (typeof window.ResizeObserver !== 'undefined') {
          resizeObserver = new window.ResizeObserver(() => {
            if (!done && frameId === null && Math.abs(window.scrollY - savedPosition.y) > 1) {
              frameId = window.requestAnimationFrame(restorePosition);
            }
          });
          resizeObserver.observe(document.body);
        }

        deadlineId = setTimeout(stop, POP_RESTORE_TOTAL_MS);
        frameId = window.requestAnimationFrame(restorePosition);
        return stop;
      }
    }
    if (navigationType === 'POP' && !isInitialLoad) {
      return undefined;
    }
    if (!pathnameChanged && !isInitialLoad) {
      return undefined;
    }

    if (!hash) {
      if (!isInitialLoad) {
        window.scrollTo(0, 0);
      }
      return undefined;
    }

    let targetId = hash.slice(1);
    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      // A malformed percent escape is user-controlled URL input. Keep the
      // literal fragment and let the normal not-found timeout handle it.
    }

    // Do not leave a newly-rendered page sitting at the previous route's
    // scroll position while a lazy hash target is still mounting. If it
    // appears, pinTarget below will move to it; if it never does, the visitor
    // is already at the sensible fallback position.
    if (!isInitialLoad) {
      window.scrollTo(0, 0);
    }
    const deadline = Date.now() + HASH_TARGET_TOTAL_MS;
    // pointerdown included so grabbing the scrollbar (or any click) also
    // cancels — wheel/touch/keys alone would miss it.
    const userInputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    let done = false;
    let frameId = null;
    let resizeObserver = null;
    let deadlineId = null;
    let pinnedTop = null;

    const stop = () => {
      if (done) {
        return;
      }
      done = true;
      userInputEvents.forEach((eventName) => {
        window.removeEventListener(eventName, stop, { capture: true });
      });
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeObserver !== null) {
        resizeObserver.disconnect();
      }
      if (deadlineId !== null) {
        clearTimeout(deadlineId);
      }
    };

    // The user taking over wins immediately — never fight them.
    userInputEvents.forEach((eventName) => {
      window.addEventListener(eventName, stop, { passive: true, capture: true });
    });

    const pinTarget = (target) => {
      target.scrollIntoView();
      pinnedTop = target.getBoundingClientRect().top;
    };

    const findTarget = () => {
      if (done) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) {
        if (Date.now() > deadline) {
          // Never appeared: treat as a normal page change (a bogus hash
          // must not strand the user mid-page on forward navigations).
          if (!isInitialLoad) {
            window.scrollTo(0, 0);
          }
          stop();
          return;
        }
        frameId = window.requestAnimationFrame(findTarget);
        return;
      }

      pinTarget(target);

      if (typeof window.ResizeObserver !== 'undefined') {
        resizeObserver = new window.ResizeObserver(() => {
          if (done) {
            return;
          }
          const current = document.getElementById(targetId);
          if (!current) {
            return;
          }
          // Only growth ABOVE the anchor moves it; growth below (donation
          // tables, further content) leaves it pinned — don't re-scroll.
          if (Math.abs(current.getBoundingClientRect().top - pinnedTop) > 1) {
            pinTarget(current);
          }
        });
        resizeObserver.observe(document.body);
      }
      deadlineId = setTimeout(stop, Math.max(HASH_SETTLE_MIN_MS, deadline - Date.now()));
    };

    findTarget();
    return stop;
  }, [pathname, hash, historyEntryId, navigationType]);

  return null;
};

export default ScrollToTop;
