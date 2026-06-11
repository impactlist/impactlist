import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
  useParams,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import NotFound from './pages/NotFound';

// Pages are lazy-loaded so visitors don't download the assumptions editor,
// charts, and KaTeX up front just to view the home list.
const DonorList = lazy(() => import('./pages/DonorList'));
const DonorDetail = lazy(() => import('./pages/DonorDetail'));
const RecipientDetail = lazy(() => import('./pages/RecipientDetail'));
const RecipientList = lazy(() => import('./pages/RecipientList'));
const CategoryList = lazy(() => import('./pages/CategoryList'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const AssumptionDetail = lazy(() => import('./pages/AssumptionDetail'));
const DonationCalculator = lazy(() => import('./pages/DonationCalculator'));
const FAQ = lazy(() => import('./pages/FAQ'));
const AssumptionsPage = lazy(() => import('./pages/AssumptionsPage'));
const ImageCredits = lazy(() => import('./pages/ImageCredits'));
import { AssumptionsProvider } from './contexts/AssumptionsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GlobalSharedAssumptionsImport from './components/shared/GlobalSharedAssumptionsImport';
import GlobalNotificationBanner from './components/shared/GlobalNotificationBanner';
import { CAUSES_PATH, buildCausePath } from './utils/causeRoutes';
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
            <h1 className="text-danger text-2xl font-bold mb-4">Something went wrong</h1>
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

// Scroll to top on forward navigations. POP navigations (back/forward
// buttons) keep the browser's restored scroll position.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

const LegacyCausesListRedirect = () => {
  const location = useLocation();

  return <Navigate to={`${CAUSES_PATH}${location.search}${location.hash}`} replace={true} />;
};

const LegacyCauseDetailRedirect = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const nextPath = categoryId ? buildCausePath(categoryId) : CAUSES_PATH;

  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace={true} />;
};

// Content wrapper with router
const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRecipients = location.pathname === '/recipients';
  const isCategories = location.pathname === CAUSES_PATH || location.pathname.startsWith('/cause/');
  const isCalculator = location.pathname === '/calculator';
  const isFAQ = location.pathname === '/faq';
  const isAssumptions = location.pathname === '/assumptions';

  return (
    <>
      <ScrollToTop />
      <div className="impact-notice-overlay">
        <GlobalNotificationBanner />
        <GlobalSharedAssumptionsImport />
      </div>
      <div className="flex flex-col min-h-screen">
        <Header
          isHome={isHome}
          isRecipients={isRecipients}
          isCategories={isCategories}
          isCalculator={isCalculator}
          isFAQ={isFAQ}
          isAssumptions={isAssumptions}
        />
        <div className={`flex-grow ${isAssumptions ? 'relative' : 'bg-[var(--bg-canvas-strong)]'}`}>
          <Suspense fallback={<div className="impact-loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<DonorList />} />
              <Route path="/donor/:donorId" element={<DonorDetail />} />
              <Route path="/recipient/:recipientId" element={<RecipientDetail />} />
              <Route path="/cause/:categoryId" element={<CategoryDetail />} />
              <Route path="/category/:categoryId" element={<LegacyCauseDetailRedirect />} />
              <Route path="/assumption/:assumptionId" element={<AssumptionDetail />} />
              <Route path={CAUSES_PATH} element={<CategoryList />} />
              <Route path="/categories" element={<LegacyCausesListRedirect />} />
              <Route path="/recipients" element={<RecipientList />} />
              <Route path="/calculator" element={<DonationCalculator />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/assumptions" element={<AssumptionsPage />} />
              <Route path="/image-credits" element={<ImageCredits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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
          <h1 className="text-danger text-2xl font-bold mb-4">Global Error</h1>
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
      <NotificationProvider>
        <AssumptionsProvider>
          <Router>
            <AppContent />
          </Router>
        </AssumptionsProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
