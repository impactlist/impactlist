import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ children, content }) => {
  const [position, setPosition] = useState('right');
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 256; // w-64 = 16rem = 256px
      const tooltipHeight = 100; // Approximate height
      const padding = 24; // Increased padding from viewport edge

      // Check horizontal space
      const spaceOnRight = window.innerWidth - triggerRect.right - padding;
      const spaceOnLeft = triggerRect.left - padding;

      // Check vertical space
      const spaceOnTop = triggerRect.top - padding;
      const spaceOnBottom = window.innerHeight - triggerRect.bottom - padding;

      let newPosition = 'right';
      let top = 0;
      let left = 0;

      // Determine best position and calculate coordinates
      if (spaceOnRight >= tooltipWidth) {
        newPosition = 'right';
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.right + 8;
      } else if (spaceOnLeft >= tooltipWidth) {
        newPosition = 'left';
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.left - tooltipWidth - 8;
      } else if (spaceOnTop >= tooltipHeight) {
        newPosition = 'top';
        // Position directly above the trigger
        top = triggerRect.top - 8; // Will be adjusted by tooltip height
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
      } else if (spaceOnBottom >= tooltipHeight) {
        newPosition = 'bottom';
        top = triggerRect.bottom + 8;
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
      } else {
        // Fallback: show on right with adjusted position
        newPosition = 'right';
        top = Math.min(triggerRect.top + triggerRect.height / 2, window.innerHeight - tooltipHeight - padding);
        left = Math.min(triggerRect.right + 8, window.innerWidth - tooltipWidth - padding);
      }

      // Ensure tooltip stays within viewport bounds
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
      top = Math.max(padding, top);

      setPosition(newPosition);
      setCoords({ top, left });
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      calculatePosition();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const trigger = triggerRef.current;
    if (trigger) {
      trigger.addEventListener('mouseenter', handleMouseEnter);
      trigger.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        trigger.removeEventListener('mouseenter', handleMouseEnter);
        trigger.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Arrow position classes based on tooltip position
  let arrowClasses = '';
  let arrowBorderClasses = '';

  switch (position) {
    case 'right':
      arrowClasses = 'top-1/2 -left-2 -translate-y-1/2';
      arrowBorderClasses = 'border-r-gray-900';
      break;
    case 'left':
      arrowClasses = 'top-1/2 -right-2 -translate-y-1/2';
      arrowBorderClasses = 'border-l-gray-900';
      break;
    case 'top':
      arrowClasses = '-bottom-2 left-1/2 -translate-x-1/2';
      arrowBorderClasses = 'border-t-gray-900';
      break;
    case 'bottom':
      arrowClasses = '-top-2 left-1/2 -translate-x-1/2';
      arrowBorderClasses = 'border-b-gray-900';
      break;
  }

  // Apply transforms based on position
  let tooltipStyle = {
    top: `${coords.top}px`,
    left: `${coords.left}px`,
  };

  if (position === 'top') {
    tooltipStyle.transform = 'translateY(-100%)';
  } else if (position === 'right' || position === 'left') {
    tooltipStyle.transform = 'translateY(-50%)';
  }

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] bg-gray-900 text-white text-sm rounded-md px-3 py-2 
                 w-64 whitespace-normal pointer-events-none
                 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      style={tooltipStyle}
      role="tooltip"
    >
      {content}
      <div className={`absolute ${arrowClasses}`}>
        <div className={`border-4 border-transparent ${arrowBorderClasses}`}></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="inline-flex items-center" ref={triggerRef}>
        <div className="cursor-help">{children}</div>
      </div>
      {typeof document !== 'undefined' && ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
