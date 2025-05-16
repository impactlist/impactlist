import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './components/Home';
import DonorDetail from './components/DonorDetail';
import RecipientDetail from './components/RecipientDetail';
import Recipients from './components/Recipients';
import DonationCalculator from './components/DonationCalculator';
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
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
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
  children: PropTypes.node.isRequired
};

// Header component that stays visible during navigation
const Header = ({ isHome, isRecipients, isCalculator }) => {
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
              Recipient Organizations
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
      </div>
    </motion.div>
  );
};

Header.propTypes = {
  isHome: PropTypes.bool,
  isRecipients: PropTypes.bool,
  isCalculator: PropTypes.bool
};

Header.defaultProps = {
  isHome: false,
  isRecipients: false,
  isCalculator: false
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
  
  return (
    <>
      <ScrollToTop />
      <Header isHome={isHome} isRecipients={isRecipients} isCalculator={isCalculator} />
      <div className="page-content bg-slate-50 min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home hideHeader={true} />} />
            <Route path="/donor/:donorId" element={<DonorDetail hideHeader={true} />} />
            <Route path="/recipient/:recipientId" element={<RecipientDetail hideHeader={true} />} />
            <Route path="/recipients" element={<Recipients hideHeader={true} />} />
            <Route path="/calculator" element={<DonationCalculator />} />
          </Routes>
        </AnimatePresence>
      </div>
      <motion.div 
        className="w-full py-6 bg-slate-800 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-slate-400">Data compiled from public donations and impact estimates</p>
      </motion.div>
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
}

export default App;