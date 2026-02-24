import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidSlug, saveSharedAssumptions, slugify } from '../utils/shareAssumptions';

const ShareAssumptionsModal = ({
  isOpen,
  onClose,
  assumptions,
  onSaved,
  autoCloseOnSave = false,
  title = 'Share Assumptions',
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState('');
  const [savedResult, setSavedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSlug('');
      setSlugTouched(false);
      setIsSaving(false);
      setIsCopying(false);
      setError('');
      setSavedResult(null);
      setCopied(false);
    }
  }, [isOpen]);

  const previewSlug = useMemo(() => {
    if (slugTouched) {
      return slug;
    }
    return slugify(name);
  }, [name, slug, slugTouched]);

  const handleSlugChange = (event) => {
    setSlugTouched(true);
    setSlug(event.target.value.toLowerCase());
    setError('');
  };

  const handleNameChange = (event) => {
    const nextName = event.target.value;
    setName(nextName);
    setError('');
    if (!slugTouched) {
      setSlug(slugify(nextName));
    }
  };

  const handleSave = async () => {
    if (!assumptions) {
      setError('No custom assumptions to share.');
      return;
    }

    const normalizedSlug = slug.trim().toLowerCase();
    if (normalizedSlug && !isValidSlug(normalizedSlug)) {
      setError('Slug must use lowercase letters, numbers, and dashes (3-40 chars).');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const result = await saveSharedAssumptions({
        assumptions,
        name: name.trim() || null,
        slug: normalizedSlug || null,
      });

      if (autoCloseOnSave) {
        onSaved(result);
        onClose();
        return;
      }

      setSavedResult(result);
      onSaved(result);
    } catch (apiError) {
      if (apiError.status === 409) {
        setError('That slug is already taken. Try a different slug.');
      } else {
        setError(apiError.message || 'Unable to create shared assumptions link.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!savedResult?.shareUrl) return;

    setIsCopying(true);
    setCopied(false);
    try {
      await globalThis.navigator.clipboard.writeText(savedResult.shareUrl);
      setCopied(true);
    } catch {
      setError('Could not copy link automatically. Please copy it manually.');
    } finally {
      setIsCopying(false);
    }
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
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              {!savedResult ? (
                <>
                  <p className="mb-4 text-sm text-slate-600">
                    Save your current custom assumptions and create a shareable URL.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="share-name" className="mb-1 block text-sm font-semibold text-slate-700">
                        Name (optional)
                      </label>
                      <input
                        id="share-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="My assumptions scenario"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="share-slug" className="mb-1 block text-sm font-semibold text-slate-700">
                        Custom URL slug (optional)
                      </label>
                      <input
                        id="share-slug"
                        type="text"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="my-ai-risk-model"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm lowercase focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Preview: <span className="font-mono">{previewSlug || '(auto-generated id)'}</span>
                      </p>
                    </div>
                  </div>
                  {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`rounded-md px-3 py-2 text-sm font-medium text-white ${
                        isSaving ? 'cursor-not-allowed bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isSaving ? 'Saving...' : autoCloseOnSave ? 'Save & Continue' : 'Create Link'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-3 text-sm text-emerald-700">Share link created.</p>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="break-all text-sm text-slate-800">{savedResult.shareUrl}</p>
                  </div>
                  {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                  {copied && <p className="mt-3 text-sm text-emerald-700">Copied link to clipboard.</p>}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      disabled={isCopying}
                      className={`rounded-md px-3 py-2 text-sm font-medium text-white ${
                        isCopying ? 'cursor-not-allowed bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isCopying ? 'Copying...' : 'Copy Link'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ShareAssumptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  assumptions: PropTypes.object,
  onSaved: PropTypes.func,
  autoCloseOnSave: PropTypes.bool,
  title: PropTypes.string,
};

ShareAssumptionsModal.defaultProps = {
  assumptions: null,
  onSaved: () => {},
  autoCloseOnSave: false,
  title: 'Share Assumptions',
};

export default ShareAssumptionsModal;
