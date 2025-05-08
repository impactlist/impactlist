import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * A reusable back button component that can either navigate to a specific path
 * or use the browser history to go back.
 * 
 * @param {Object} props
 * @param {string} [props.to] - Optional path to navigate to. If provided, uses Link.
 * @param {string} [props.label="Back"] - The label text for the button
 * @param {string} [props.className] - Additional CSS classes for the button
 * @param {Object} [props.motion] - Motion props for animation
 * @param {Object} [props.containerProps] - Props for the container div
 */
const BackButton = ({ 
  to, 
  label = "Back", 
  className = "", 
  motion: motionProps = {}, 
  containerProps = {} 
}) => {
  const defaultAnimation = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.1, duration: 0.3 }
  };

  const animation = { ...defaultAnimation, ...motionProps };

  // Default styles for the button/link
  const defaultClassName = "text-indigo-600 hover:text-indigo-800 hover:underline flex items-center";
  const buttonClassName = `${defaultClassName} ${className}`;

  // Default container props
  const defaultContainerProps = {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-3 flex justify-start"
  };

  const mergedContainerProps = { ...defaultContainerProps, ...containerProps };

  // Back arrow SVG
  const backArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <motion.div {...mergedContainerProps} {...animation}>
      {to ? (
        <Link to={to} className={buttonClassName}>
          {backArrow}
          {label}
        </Link>
      ) : (
        <button onClick={() => window.history.back()} className={buttonClassName}>
          {backArrow}
          {label}
        </button>
      )}
    </motion.div>
  );
};

export default BackButton;