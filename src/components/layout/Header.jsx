import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssumptions } from '../../contexts/AssumptionsContext';

const Header = ({ isHome, isRecipients, isCalculator, isCategories, isFAQ, isAssumptions }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isUsingCustomValues } = useAssumptions();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      className="w-full bg-orange-700 py-4 shadow-lg relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <motion.nav
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Impact List - always visible */}
            <Link
              to="/"
              className={`text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isHome ? 'bg-orange-600 text-white' : ''}`}
              onClick={closeMobileMenu}
            >
              Impact List
            </Link>
            {/* Assumptions - high priority, visible on sm+ */}
            <Link
              to="/assumptions"
              className={`hidden sm:inline-flex items-center text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isAssumptions ? 'bg-orange-600 text-white' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Assumptions
              {isUsingCustomValues && (
                <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full" title="Using custom values" />
              )}
            </Link>
            {/* Calculator - visible on sm+ */}
            <Link
              to="/calculator"
              className={`hidden sm:inline-block text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isCalculator ? 'bg-orange-600 text-white' : ''}`}
            >
              Calculator
            </Link>
            {/* Categories, Recipients, FAQ - visible on md+ */}
            <Link
              to="/categories"
              className={`hidden md:inline-block text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isCategories ? 'bg-orange-600 text-white' : ''}`}
            >
              Categories
            </Link>
            <Link
              to="/recipients"
              className={`hidden md:inline-block text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isRecipients ? 'bg-orange-600 text-white' : ''}`}
            >
              Recipients
            </Link>
            <Link
              to="/faq"
              className={`hidden md:inline-block text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isFAQ ? 'bg-orange-600 text-white' : ''}`}
            >
              FAQ
            </Link>
            {/* Hamburger Menu Button - visible below md */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-orange-100 hover:text-white hover:bg-orange-600 p-2 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </motion.svg>
            </button>
          </motion.nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-orange-700 shadow-lg border-t border-orange-600 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-2">
                {/* Assumptions - shown only on mobile (hidden on sm+ where it's in main nav) */}
                <Link
                  to="/assumptions"
                  className={`sm:hidden flex items-center text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isAssumptions ? 'bg-orange-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Assumptions
                  {isUsingCustomValues && (
                    <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full" title="Using custom values" />
                  )}
                </Link>
                {/* Calculator - shown only on mobile (hidden on sm+ where it's in main nav) */}
                <Link
                  to="/calculator"
                  className={`sm:hidden text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isCalculator ? 'bg-orange-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Calculator
                </Link>
                {/* Categories, Recipients, FAQ - shown on mobile and tablet (hidden on md+ where they're in main nav) */}
                <Link
                  to="/categories"
                  className={`text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isCategories ? 'bg-orange-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Categories
                </Link>
                <Link
                  to="/recipients"
                  className={`text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isRecipients ? 'bg-orange-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Recipients
                </Link>
                <Link
                  to="/faq"
                  className={`text-orange-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors ${isFAQ ? 'bg-orange-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  FAQ
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

Header.propTypes = {
  isHome: PropTypes.bool,
  isRecipients: PropTypes.bool,
  isCalculator: PropTypes.bool,
  isCategories: PropTypes.bool,
  isFAQ: PropTypes.bool,
  isAssumptions: PropTypes.bool,
};

Header.defaultProps = {
  isHome: false,
  isRecipients: false,
  isCalculator: false,
  isCategories: false,
  isFAQ: false,
  isAssumptions: false,
};

export default Header;
