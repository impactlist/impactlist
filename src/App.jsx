import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DonorList from './pages/DonorList';
import DonorDetail from './pages/DonorDetail';
import RecipientDetail from './pages/RecipientDetail';
import RecipientList from './pages/RecipientList';
import CategoryList from './pages/CategoryList';
import CategoryDetail from './pages/CategoryDetail';
import AssumptionDetail from './pages/AssumptionDetail';
import DonationCalculator from './pages/DonationCalculator';
import FAQ from './pages/FAQ';
import AssumptionsPage from './pages/AssumptionsPage';
import { AssumptionsProvider } from './contexts/AssumptionsContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { validateDataOnStartup } from './utils/startupValidation';

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
  const isCategories = location.pathname === '/categories';
  const isCalculator = location.pathname === '/calculator';
  const isFAQ = location.pathname === '/faq';
  const isAssumptions = location.pathname === '/assumptions';

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header
          isHome={isHome}
          isRecipients={isRecipients}
          isCategories={isCategories}
          isCalculator={isCalculator}
          isFAQ={isFAQ}
          isAssumptions={isAssumptions}
        />
        <div className="flex-grow bg-slate-50">
          <Routes>
            <Route path="/" element={<DonorList />} />
            <Route path="/donor/:donorId" element={<DonorDetail />} />
            <Route path="/recipient/:recipientId" element={<RecipientDetail />} />
            <Route path="/category/:categoryId" element={<CategoryDetail />} />
            <Route path="/assumption/:assumptionId" element={<AssumptionDetail />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/recipients" element={<RecipientList />} />
            <Route path="/calculator" element={<DonationCalculator />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/assumptions" element={<AssumptionsPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Run startup validation to catch data structure issues early
    try {
      validateDataOnStartup();
    } catch (error) {
      console.error('Startup validation failed:', error);
      setError(error);
      return;
    }

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
      <AssumptionsProvider>
        <Router>
          <AppContent />
        </Router>
      </AssumptionsProvider>
    </ErrorBoundary>
  );
};

export default App;
