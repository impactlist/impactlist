import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Reusable container for charts with responsive behavior and consistent styling.
 */
const ChartContainer = ({
  title,
  description,
  children,
  view,
  onViewChange,
  toggleComponent,
  isTransitioning = false,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Handle responsive sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <motion.div
      className={`impact-surface mb-8 ${className}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="impact-surface__header px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-strong">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>

          {/* View toggle */}
          {toggleComponent &&
            React.cloneElement(toggleComponent, {
              chartView: view,
              onToggle: onViewChange,
              disabled: isTransitioning,
            })}
        </div>
      </div>

      <div
        className={`py-4 px-2 relative ${containerWidth < 500 ? 'overflow-x-auto' : 'overflow-hidden'}`}
        ref={containerRef}
      >
        {children}
      </div>
    </motion.div>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  view: PropTypes.string,
  onViewChange: PropTypes.func,
  toggleComponent: PropTypes.element,
  isTransitioning: PropTypes.bool,
  className: PropTypes.string,
};

export default React.memo(ChartContainer);
