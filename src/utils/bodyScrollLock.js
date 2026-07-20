let bodyScrollLockCount = 0;
let previousBodyOverflow = '';
let scrollPositionBeforeLock = null;

export const isBodyScrollLocked = () => bodyScrollLockCount > 0;

/**
 * Lock page scrolling until the matching release function runs.
 *
 * Stacked callers share the first lock's viewport position: only the last
 * release restores body overflow and the page coordinates from before any
 * modal opened.
 */
export const lockBodyScroll = () => {
  if (bodyScrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    scrollPositionBeforeLock = {
      x: window.scrollX || 0,
      y: window.scrollY || 0,
    };
    document.body.style.overflow = 'hidden';
  }
  bodyScrollLockCount += 1;

  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;

    bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
    if (bodyScrollLockCount !== 0) {
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    if (scrollPositionBeforeLock) {
      const { x, y } = scrollPositionBeforeLock;
      scrollPositionBeforeLock = null;
      if (window.scrollX !== x || window.scrollY !== y) {
        window.scrollTo(x, y);
      }
    }
  };
};
