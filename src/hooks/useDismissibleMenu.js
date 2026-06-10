import { useEffect, useRef } from 'react';

/**
 * Outside-click + Escape dismissal for popovers/menus. Attach the returned
 * ref to the element containing both the trigger and the popover.
 *
 * `onDismiss` receives the reason — `'outside'` or `'escape'` — so callers
 * can restore focus to the trigger on Escape (the keyboard convention)
 * without stealing focus from whatever an outside click landed on.
 */
const useDismissibleMenu = (isOpen, onDismiss) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current?.contains(event.target)) {
        return;
      }

      onDismiss('outside');
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onDismiss('escape');
      }
    };

    globalThis.addEventListener('pointerdown', handlePointerDown);
    globalThis.addEventListener('keydown', handleEscape);
    return () => {
      globalThis.removeEventListener('pointerdown', handlePointerDown);
      globalThis.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onDismiss]);

  return menuRef;
};

export default useDismissibleMenu;
