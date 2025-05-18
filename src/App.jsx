import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DonorList from './components/DonorList';
import DonorDetail from './components/DonorDetail';
import RecipientDetail from './components/RecipientDetail';
import RecipientList from './components/RecipientList';
import DonationCalculator from './components/DonationCalculator';
import About from './components/About';
import { CostPerLifeProvider } from './components/CostPerLifeContext';
import CostPerLifeEditor from './components/CostPerLifeEditor';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
            <h1 className="text-red-600 text-2xl font-bold mb-4">Something went wrong</h1>
            <div className="bg-gray-100 p-3 rounded-md overflow-auto mb-4">
              <pre className="text-sm">{this.state.error && this.state.error.toString()}</pre>
            </div>
            <details className="mb-4">
              <summary className="cursor-pointer text-blue-600">View component stack trace</summary>
              <div className="bg-gray-100 p-3 rounded-md mt-2 overflow-auto">
                <pre className="text-xs">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </div>
            </details>
            <p>Try refreshing the page or check your browser console for more details.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Header component that stays visible during navigation
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
              Learn about about what we're doing and why
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

// Scroll to top component that runs on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Content wrapper with router
const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRecipients = location.pathname === '/recipients';
  const isCalculator = location.pathname === '/calculator';
  const isAbout = location.pathname === '/about';

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header isHome={isHome} isRecipients={isRecipients} isCalculator={isCalculator} isAbout={isAbout} />
        <div className="flex-grow bg-slate-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DonorList />} />
              <Route path="/donor/:donorId" element={<DonorDetail />} />
              <Route path="/recipient/:recipientId" element={<RecipientDetail />} />
              <Route path="/recipients" element={<RecipientList />} />
              <Route path="/calculator" element={<DonationCalculator />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </div>
        <motion.div
          className="w-full py-6 bg-slate-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center items-center space-x-6">
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
              About
            </Link>
            <a
              href="https://github.com/impactlist/impactlist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://discord.gg/6GNre8U2ta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://x.com/impactlist_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const App = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global error:', event.error);
      setError(event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <h1 className="text-red-600 text-2xl font-bold mb-4">Global Error</h1>
          <div className="bg-gray-100 p-3 rounded-md overflow-auto mb-4">
            <pre className="text-sm">{error.toString()}</pre>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">Stack trace</summary>
                <pre className="text-xs mt-2">{error.stack}</pre>
              </details>
            )}
          </div>
          <p>Try refreshing the page or check your browser console for more details.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <CostPerLifeProvider>
        <Router>
          <AppContent />
          <CostPerLifeEditor />
        </Router>
      </CostPerLifeProvider>
    </ErrorBoundary>
  );
};

export default App;
