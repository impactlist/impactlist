import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './components/Home';
import DonorDetail from './components/DonorDetail';
import RecipientDetail from './components/RecipientDetail';
import Recipients from './components/Recipients';

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

// Header component that stays visible during navigation
const Header = ({ isHome, isRecipients }) => {
  return (
    <motion.div
      className={`w-full bg-indigo-700 ${isHome ? 'py-10' : 'py-8'} shadow-lg`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isHome && !isRecipients && (
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a href="/" className="text-indigo-100 hover:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Impact List
              </a>
            </motion.div>
          </div>
        )}
        
        {isHome && (
          <div className="text-center">
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
          <div className="text-center">
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
      </div>
    </motion.div>
  );
};

// Content wrapper with router
const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRecipients = location.pathname === '/recipients';
  
  return (
    <>
      <Header isHome={isHome} isRecipients={isRecipients} />
      <div className="page-content bg-slate-50 min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home hideHeader={true} />} />
            <Route path="/donor/:donorName" element={<DonorDetail hideHeader={true} />} />
            <Route path="/recipient/:recipientName" element={<RecipientDetail hideHeader={true} />} />
            <Route path="/recipients" element={<Recipients hideHeader={true} />} />
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

function App() {
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
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;