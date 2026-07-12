import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// How long a hash target gets to appear before we give up and treat the
// navigation as a normal to-the-top page change. Route chunks are lazy, so
// the target renders one-to-many frames after the navigation commits.
const HASH_TARGET_DEADLINE_MS = 2000;

/**
 * Scroll management for navigations.
 *
 * - POP navigations (back/forward buttons) keep the browser's restored
 *   scroll position.
 * - Same-pathname navigations (search-param changes like the assumptions
 *   editor's tab/entity state) must not touch the scroll position — only a
 *   pathname change counts as arriving on a new page. Same-page anchor
 *   clicks scroll natively without our help.
 * - Navigations WITH a hash land on the hash's target instead of the top
 *   (e.g. the editor's "Why this default?" links target a detail page's
 *   `#full-justification`). Route pages are React.lazy, so the target often
 *   does not exist when the navigation commits — retry each animation frame
 *   until it renders or the deadline passes.
 * - The initial load also runs the hash targeting (the browser's native
 *   anchor jump fails for the same lazy-rendering reason), even though the
 *   router reports it as POP.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  // null marks the very first effect run (the initial load).
  const previousPathnameRef = useRef(null);

  useEffect(() => {
    const isInitialLoad = previousPathnameRef.current === null;
    const pathnameChanged = previousPathnameRef.current !== pathname;
    previousPathnameRef.current = pathname;

    if (navigationType === 'POP' && !isInitialLoad) {
      return undefined;
    }
    if (!pathnameChanged && !isInitialLoad) {
      return undefined;
    }

    if (hash) {
      const targetId = hash.slice(1);
      const deadline = Date.now() + HASH_TARGET_DEADLINE_MS;
      let frameId = null;

      const tryScrollToTarget = () => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView();
          return;
        }
        if (Date.now() > deadline) {
          if (!isInitialLoad) {
            window.scrollTo(0, 0);
          }
          return;
        }
        frameId = window.requestAnimationFrame(tryScrollToTarget);
      };

      tryScrollToTarget();
      return () => {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    if (!isInitialLoad) {
      window.scrollTo(0, 0);
    }
    return undefined;
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
