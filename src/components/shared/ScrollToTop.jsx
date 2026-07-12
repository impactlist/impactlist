import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// One navigation gets ONE hash-targeting budget: waiting for the lazy route
// chunk to render the target AND pinning it through layout settling share
// this window (they do not stack).
const HASH_TARGET_TOTAL_MS = 2000;
// ...except a slow find still gets a short settle window: charts expand
// right after the target mounts, so pinning must outlive that moment even
// when the chunk ate most of the budget. Worst case is TOTAL + SETTLE_MIN.
const HASH_SETTLE_MIN_MS = 500;

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

    if (!hash) {
      if (!isInitialLoad) {
        window.scrollTo(0, 0);
      }
      return undefined;
    }

    const targetId = hash.slice(1);
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
      deadlineId = setTimeout(stop, Math.max(HASH_SETTLE_MIN_MS, deadline - Date.now()));
    };

    findTarget();
    return stop;
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
