import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidSlug, normalizeSlugInput, saveSharedAssumptions, slugify } from '../utils/shareAssumptions';

const ShareAssumptionsModal = ({
  isOpen,
  onClose,
  assumptions,
  onSaved,
  title = 'Share Assumptions',
  initialSavedResult = null,
}) => {
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState('');
  const [savedResult, setSavedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [startedWithExistingLink, setStartedWithExistingLink] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSlug('');
      setIsSaving(false);
      setIsCopying(false);
      setError('');
      setSavedResult(null);
      setCopied(false);
      setStartedWithExistingLink(false);
      return;
    }

    setSlug('');
    setSavedResult(initialSavedResult);
    setStartedWithExistingLink(Boolean(initialSavedResult));
    setIsSaving(false);
    setIsCopying(false);
    setError('');
    setCopied(false);
  }, [initialSavedResult, isOpen]);

  const handleSlugChange = (event) => {
    setSlug(normalizeSlugInput(event.target.value));
    setError('');
  };

  const handleSave = async () => {
    if (!assumptions) {
      setError('No custom assumptions to share.');
      return;
    }

    const normalizedSlug = slugify(slug);
    if (normalizedSlug && !isValidSlug(normalizedSlug)) {
      setError('Custom link text must use lowercase letters, numbers, and dashes (3-40 chars).');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const result = await saveSharedAssumptions({
        assumptions,
        slug: normalizedSlug || null,
      });

      setSavedResult(result);
      onSaved(result);
    } catch (apiError) {
      if (apiError.status === 409) {
        setError('That custom link text is already taken. Try a different one.');
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
        <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="impact-modal__scrim"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="impact-modal__panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="impact-modal__title">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="impact-modal__close text-sm font-medium"
                >
                  X
                </button>
              </div>

              {!savedResult ? (
                <>
                  <p className="impact-modal__copy mb-4">
                    Save your current custom assumptions and create a shareable URL.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="share-slug" className="impact-modal__label mb-1 block">
                        Custom link text (optional)
                      </label>
                      <input
                        id="share-slug"
                        type="text"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="bobs-longtermist-model"
                        className="impact-modal__input lowercase"
                      />
                      <p className="mt-1 text-xs text-muted">
                        This sets the readable part of your link (letters, numbers, and dashes). Leave blank for an
                        auto-generated link.
                      </p>
                    </div>
                  </div>
                  {error && <p className="impact-modal__error mt-4">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="impact-btn impact-btn--custom-accent"
                    >
                      {isSaving ? 'Saving...' : 'Create Link'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {!startedWithExistingLink && <p className="mb-3 text-sm text-success">Share link created.</p>}
                  <div className="impact-modal__well">
                    <p className="break-all text-sm text-strong">{savedResult.shareUrl}</p>
                  </div>
                  {error && <p className="impact-modal__error">{error}</p>}
                  {copied && <p className="impact-modal__success">Copied link to clipboard.</p>}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      disabled={isCopying}
                      className="impact-btn impact-btn--custom-accent"
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
  title: PropTypes.string,
  initialSavedResult: PropTypes.shape({
    id: PropTypes.string,
    reference: PropTypes.string,
    shareUrl: PropTypes.string,
  }),
};

ShareAssumptionsModal.defaultProps = {
  assumptions: null,
  onSaved: () => {},
  title: 'Share Assumptions',
  initialSavedResult: null,
};

export default ShareAssumptionsModal;
