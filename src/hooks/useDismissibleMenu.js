import { useEffect, useRef } from 'react';

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

      onDismiss();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onDismiss();
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
