import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, description, children }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      // Only restore if we're the ones who set it (still 'hidden')
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] max-h-[90dvh] overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {description && <p className="text-gray-600 mt-2">{description}</p>}
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
