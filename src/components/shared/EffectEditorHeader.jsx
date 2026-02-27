import React from 'react';
import PropTypes from 'prop-types';
import EffectCostDisplay from './EffectCostDisplay';

/**
 * Shared header component for effect editors
 */
const EffectEditorHeader = ({
  title,
  description,
  combinedCostPerLife,
  showCombinedCost = true,
  headerActions = null,
  onClose,
}) => {
  const hasCombinedCost = showCombinedCost && combinedCostPerLife !== undefined;
  const hasRightContent = Boolean(headerActions) || Boolean(onClose);

  return (
    <div className="rounded-t-lg bg-[var(--bg-surface-alt)] px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-[var(--text-strong)]">{title}</h3>
          {description &&
            (typeof description === 'string' ? (
              <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
            ) : (
              <div className="mt-1 text-sm text-[var(--text-muted)]">{description}</div>
            ))}
          {hasCombinedCost && (
            <EffectCostDisplay
              cost={combinedCostPerLife}
              label="Combined cost per life:"
              showInfinity={true}
              className="mt-1.5 whitespace-nowrap"
            />
          )}
        </div>
        {hasRightContent && (
          <div className="ml-4 flex shrink-0 items-start gap-3">
            {headerActions}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-white/80"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

EffectEditorHeader.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  combinedCostPerLife: PropTypes.number,
  showCombinedCost: PropTypes.bool,
  headerActions: PropTypes.node,
  onClose: PropTypes.func,
};

export default EffectEditorHeader;
