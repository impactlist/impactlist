import React, { useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const TOOLTIP_OFFSET = 10;
const VIEWPORT_PADDING = 16;

const Tooltip = ({ children, content, ariaLabel = 'More information' }) => {
  const [position, setPosition] = useState('top');
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipId = useId();
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const placements = ['top', 'right', 'left', 'bottom'];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const fitCheck = {
      top: triggerRect.top - tooltipRect.height - TOOLTIP_OFFSET >= VIEWPORT_PADDING,
      right: triggerRect.right + tooltipRect.width + TOOLTIP_OFFSET <= viewportWidth - VIEWPORT_PADDING,
      left: triggerRect.left - tooltipRect.width - TOOLTIP_OFFSET >= VIEWPORT_PADDING,
      bottom: triggerRect.bottom + tooltipRect.height + TOOLTIP_OFFSET <= viewportHeight - VIEWPORT_PADDING,
    };

    const resolvedPosition = placements.find((placement) => fitCheck[placement]) || 'top';
    let top = 0;
    let left = 0;

    if (resolvedPosition === 'top') {
      top = triggerRect.top - tooltipRect.height - TOOLTIP_OFFSET;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    } else if (resolvedPosition === 'bottom') {
      top = triggerRect.bottom + TOOLTIP_OFFSET;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    } else if (resolvedPosition === 'right') {
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + TOOLTIP_OFFSET;
    } else {
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left - tooltipRect.width - TOOLTIP_OFFSET;
    }

    top = Math.max(VIEWPORT_PADDING, Math.min(top, viewportHeight - tooltipRect.height - VIEWPORT_PADDING));
    left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - tooltipRect.width - VIEWPORT_PADDING));

    setPosition(resolvedPosition);
    setCoords({ top, left });
  };

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      calculatePosition();
    });

    const handleReposition = () => calculatePosition();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isVisible]);

  const tooltipStyle = {
    top: `${coords.top}px`,
    left: `${coords.left}px`,
  };

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      id={tooltipId}
      className="assumptions-tooltip fixed pointer-events-none"
      style={tooltipStyle}
      role="tooltip"
    >
      {content}
      <div
        className={`absolute h-2 w-2 rotate-45 border border-[#6a665f] bg-[#1f2527] ${
          position === 'top'
            ? '-bottom-1 left-1/2 -translate-x-1/2'
            : position === 'bottom'
              ? '-top-1 left-1/2 -translate-x-1/2'
              : position === 'left'
                ? '-right-1 top-1/2 -translate-y-1/2'
                : '-left-1 top-1/2 -translate-y-1/2'
        }`}
        aria-hidden={true}
      ></div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="assumptions-tooltip-trigger cursor-help"
        aria-label={ariaLabel}
        aria-describedby={isVisible ? tooltipId : undefined}
        data-open={isVisible}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            setIsVisible(false);
          }
        }}
      >
        {children}
      </button>
      {typeof document !== 'undefined' && ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
