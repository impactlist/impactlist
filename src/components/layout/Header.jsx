import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import AdjustAssumptionsButton from '../shared/AdjustAssumptionsButton';

const Header = ({ isHome, isRecipients, isCalculator, isCategories, isFAQ }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal, isUsingCustomValues } = useAssumptions();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      className="w-full bg-indigo-700 py-4 shadow-lg relative"
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
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isHome ? 'bg-indigo-600 text-white' : ''}`}
              onClick={closeMobileMenu}
            >
              Impact List
            </Link>
            {/* Calculator, Categories - hidden on mobile, visible on sm+ */}
            <Link
              to="/calculator"
              className={`hidden sm:inline-block text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCalculator ? 'bg-indigo-600 text-white' : ''}`}
            >
              Calculator
            </Link>
            <Link
              to="/categories"
              className={`hidden sm:inline-block text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCategories ? 'bg-indigo-600 text-white' : ''}`}
            >
              Categories
            </Link>
            {/* Recipients, FAQ - hidden on mobile/tablet, visible on md+ */}
            <Link
              to="/recipients"
              className={`hidden md:inline-block text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isRecipients ? 'bg-indigo-600 text-white' : ''}`}
            >
              Recipients
            </Link>
            <Link
              to="/faq"
              className={`hidden md:inline-block text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isFAQ ? 'bg-indigo-600 text-white' : ''}`}
            >
              FAQ
            </Link>
            {/* Adjust Assumptions button - always visible, same spacing as nav items */}
            <AdjustAssumptionsButton onClick={openModal} isUsingCustomValues={isUsingCustomValues} />
            {/* Hamburger Menu Button - visible below md */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-indigo-100 hover:text-white hover:bg-indigo-600 p-2 rounded-md transition-colors"
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
            className="md:hidden absolute top-full left-0 right-0 bg-indigo-700 shadow-lg border-t border-indigo-600 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-2">
                {/* Show Calculator and Categories only on mobile (below sm) */}
                <Link
                  to="/calculator"
                  className={`sm:hidden text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCalculator ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Calculator
                </Link>
                <Link
                  to="/categories"
                  className={`sm:hidden text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCategories ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Categories
                </Link>
                {/* Show Recipients and FAQ on both mobile and tablet */}
                <Link
                  to="/recipients"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isRecipients ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Recipients
                </Link>
                <Link
                  to="/faq"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isFAQ ? 'bg-indigo-600 text-white' : ''}`}
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
};

Header.defaultProps = {
  isHome: false,
  isRecipients: false,
  isCalculator: false,
  isCategories: false,
  isFAQ: false,
};

export default Header;
