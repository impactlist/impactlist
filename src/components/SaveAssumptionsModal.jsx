import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const SaveAssumptionsModal = ({ isOpen, onClose, onSubmit, defaultLabel = '', canUpdateExisting = false }) => {
  const [label, setLabel] = useState(defaultLabel);
  const [error, setError] = useState('');

  useEffect(() => {
    setLabel(defaultLabel);
    setError('');
  }, [defaultLabel, isOpen]);

  const validateLabel = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError('Label is required.');
      return null;
    }

    return trimmed;
  };

  const handleSubmit = (mode) => {
    const normalizedLabel = validateLabel();
    if (!normalizedLabel) {
      return;
    }

    onSubmit({ label: normalizedLabel, mode });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Save Assumptions</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <p className="mb-4 text-sm text-slate-600">
                Save the current assumptions to your local Saved Assumptions list.
              </p>

              <label htmlFor="save-assumptions-label" className="mb-1 block text-sm font-semibold text-slate-700">
                Label
              </label>
              <input
                id="save-assumptions-label"
                type="text"
                value={label}
                onChange={(event) => {
                  setLabel(event.target.value);
                  setError('');
                }}
                placeholder="My Current Assumptions"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                {canUpdateExisting && (
                  <button
                    type="button"
                    onClick={() => handleSubmit('update')}
                    className="rounded-md border border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Update Current Saved Assumptions
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSubmit('new')}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {canUpdateExisting ? 'Save as New' : 'Save Assumptions'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SaveAssumptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultLabel: PropTypes.string,
  canUpdateExisting: PropTypes.bool,
};

SaveAssumptionsModal.defaultProps = {
  defaultLabel: '',
  canUpdateExisting: false,
};

export default SaveAssumptionsModal;
