import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ isHome, isRecipients, isCalculator, isCategories, isAbout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center">
          <motion.nav
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Link
              to="/"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isHome ? 'bg-indigo-600 text-white' : ''}`}
            >
              Impact List
            </Link>
            <Link
              to="/calculator"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCalculator ? 'bg-indigo-600 text-white' : ''}`}
            >
              Calculator
            </Link>
            <Link
              to="/categories"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCategories ? 'bg-indigo-600 text-white' : ''}`}
            >
              Categories
            </Link>
            <Link
              to="/recipients"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isRecipients ? 'bg-indigo-600 text-white' : ''}`}
            >
              Recipients
            </Link>
            <Link
              to="/about"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isAbout ? 'bg-indigo-600 text-white' : ''}`}
            >
              About
            </Link>
          </motion.nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          <Link
            to="/"
            className={`text-indigo-100 px-3 py-2 rounded-md text-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isHome ? 'bg-indigo-600 text-white' : ''}`}
            onClick={closeMobileMenu}
          >
            Impact List
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-indigo-100 hover:text-white hover:bg-indigo-600 p-2 rounded-md transition-colors"
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
                <Link
                  to="/calculator"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCalculator ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Calculator
                </Link>
                <Link
                  to="/categories"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isCategories ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Categories
                </Link>
                <Link
                  to="/recipients"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isRecipients ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Recipients
                </Link>
                <Link
                  to="/about"
                  className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isAbout ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={closeMobileMenu}
                >
                  About
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
  isAbout: PropTypes.bool,
};

Header.defaultProps = {
  isHome: false,
  isRecipients: false,
  isCalculator: false,
  isCategories: false,
  isAbout: false,
};

export default Header;
