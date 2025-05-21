import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ isHome, isRecipients, isCalculator, isAbout }) => {
  return (
    <motion.div
      className="w-full bg-indigo-700 py-9 shadow-lg"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
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
              to="/recipients"
              className={`text-indigo-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors ${isRecipients ? 'bg-indigo-600 text-white' : ''}`}
            >
              Recipients
            </Link>
          </motion.nav>
        </div>

        {isHome && (
          <div className="text-center mt-4">
            <motion.h1
              className="text-4xl font-extrabold text-white mb-2 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Impact List
            </motion.h1>
            <motion.p
              className="text-xl text-indigo-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Rankings based on positive impact via donations
            </motion.p>
          </div>
        )}

        {isRecipients && (
          <div className="text-center mt-4">
            <motion.h1
              className="text-4xl font-extrabold text-white mb-2 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Donation Recipients
            </motion.h1>
            <motion.p
              className="text-xl text-indigo-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Ranked by total lives saved through donations
            </motion.p>
          </div>
        )}

        {isCalculator && (
          <div className="text-center mt-4">
            <motion.h1
              className="text-4xl font-extrabold text-white mb-2 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Donation Calculator
            </motion.h1>
            <motion.p
              className="text-xl text-indigo-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Calculate the lives you could save with your donations
            </motion.p>
          </div>
        )}

        {isAbout && (
          <div className="text-center mt-4">
            <motion.h1
              className="text-4xl font-extrabold text-white mb-2 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              About Impact List
            </motion.h1>
            <motion.p
              className="text-xl text-indigo-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Learn about what we're doing and why
            </motion.p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

Header.propTypes = {
  isHome: PropTypes.bool,
  isRecipients: PropTypes.bool,
  isCalculator: PropTypes.bool,
  isAbout: PropTypes.bool,
};

Header.defaultProps = {
  isHome: false,
  isRecipients: false,
  isCalculator: false,
  isAbout: false,
};

export default Header;
