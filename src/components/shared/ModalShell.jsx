import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const ModalShellContent = ({ onClose, dismissible, labelledBy, panelClassName, children }) => {
  const panelRef = useRef(null);

  // Move focus into the dialog on open and restore it on close, so keyboard
  // users aren't left tabbing through the obscured page behind the scrim.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (dismissible) {
        event.stopPropagation();
        onClose();
      }
      return;
    }

    if (event.key !== 'Tab' || !panelRef.current) {
      return;
    }

    // Keep Tab cycling inside the dialog.
    const focusable = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <motion.div
          className="impact-modal__scrim"
          onClick={dismissible ? onClose : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={`impact-modal__panel ${panelClassName}`.trim()}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

ModalShellContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  dismissible: PropTypes.bool.isRequired,
  labelledBy: PropTypes.string,
  panelClassName: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Shared dialog shell: animated scrim + panel with dialog semantics, focus
 * trapping/restoration, Escape-to-close, and click-on-scrim-to-close.
 *
 * `labelledBy` should reference the id of the modal's heading element.
 * Set `dismissible={false}` to disable scrim/Escape dismissal (e.g. while a
 * confirm action is busy) — explicit buttons keep working.
 */
const ModalShell = ({ isOpen, onClose, dismissible = true, labelledBy, panelClassName = '', children }) => (
  <AnimatePresence>
    {isOpen && (
      <ModalShellContent
        onClose={onClose}
        dismissible={dismissible}
        labelledBy={labelledBy}
        panelClassName={panelClassName}
      >
        {children}
      </ModalShellContent>
    )}
  </AnimatePresence>
);

ModalShell.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dismissible: PropTypes.bool,
  labelledBy: PropTypes.string,
  panelClassName: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Standard modal header: title plus the "X" close button, matching the
 * layout previously copy-pasted across modals.
 */
export const ModalHeader = ({ title, titleId, onClose }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 id={titleId} className="impact-modal__title">
      {title}
    </h2>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close modal"
      className="impact-modal__close text-sm font-medium"
    >
      X
    </button>
  </div>
);

ModalHeader.propTypes = {
  title: PropTypes.node.isRequired,
  titleId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ModalShell;
