import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MotionConfig } from 'framer-motion';
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router-dom';
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
import ScrollToTop from './components/shared/ScrollToTop';
import { CAUSES_PATH, buildCausePath } from './utils/causeRoutes';
import { validateDataOnStartup } from './utils/startupValidation';

const toError = (value, fallbackMessage) => {
  if (value instanceof Error) {
    return value;
  }
  const error = new Error(typeof value === 'string' && value ? value : fallbackMessage);
  if (value !== undefined && typeof value !== 'string') {
    error.cause = value;
  }
  return error;
};

const formatUnknownErrorValue = (value) => {
  if (value === undefined) return '';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    try {
      return String(value);
    } catch {
      return 'Unserializable error value';
    }
  }
};

const getErrorDetails = (error, errorInfo) => {
  const sections = [];

  if (error instanceof Error) {
    sections.push(error.stack || `${error.name}: ${error.message}`);
    if (error.cause !== undefined) {
      const causeDetails =
        error.cause instanceof Error
          ? error.cause.stack || `${error.cause.name}: ${error.cause.message}`
          : formatUnknownErrorValue(error.cause);
      if (causeDetails) {
        sections.push(`Cause:\n${causeDetails}`);
      }
    }
  } else if (error?.data instanceof Error) {
    sections.push(error.data.stack || `${error.data.name}: ${error.data.message}`);
  } else {
    const rawDetails = formatUnknownErrorValue(error);
    if (rawDetails) {
      sections.push(rawDetails);
    }
  }

  if (errorInfo?.componentStack) {
    sections.push(`React component stack:${errorInfo.componentStack}`);
  }

  return sections.join('\n\n');
};

const ErrorScreen = ({ title = 'Something went wrong', error = null, errorInfo = null }) => {
  const headingRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const errorDetails = getErrorDetails(error, errorInfo);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="impact-page flex min-h-screen items-center justify-center p-4">
      <div className="impact-surface w-full max-w-2xl p-6 text-center">
        <div role="alert">
          <h1 ref={headingRef} tabIndex={-1} className="impact-page__title mb-4 text-danger">
            {title}
          </h1>
          <p className="mb-6 text-muted">
            Impact List hit an unexpected problem. Your saved browser data has not been deleted.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="impact-btn impact-btn--custom-accent"
          >
            Try again
          </button>
          <a href="/" className="impact-btn impact-btn--secondary">
            Back to Impact List
          </a>
        </div>
        {errorDetails && (
          <div className="error-screen__details">
            <button
              type="button"
              className="error-screen__details-toggle"
              aria-expanded={showDetails}
              aria-controls="error-screen-details-panel"
              onClick={() => setShowDetails((isOpen) => !isOpen)}
            >
              <span aria-hidden="true" className="error-screen__details-chevron">
                {showDetails ? '−' : '+'}
              </span>
              {showDetails ? 'Hide error details' : 'Show error details'}
            </button>
            {showDetails && (
              <section
                id="error-screen-details-panel"
                className="error-screen__details-panel"
                aria-label="Error details"
              >
                <div className="error-screen__details-intro">
                  <h2>Technical details</h2>
                  <p>Share this information with a developer when reporting the problem.</p>
                </div>
                <pre className="error-screen__details-code">{errorDetails}</pre>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

ErrorScreen.propTypes = {
  title: PropTypes.string,
  error: PropTypes.any,
  errorInfo: PropTypes.shape({
    componentStack: PropTypes.string,
  }),
};

// Data routers catch descendant render/lazy-load errors before an outer
// React error boundary can see them. Supplying a route error element keeps a
// failed chunk or page render on the site's friendly recovery screen instead
// of React Router's development-oriented default page and stack trace.
export const RouteErrorFallback = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return <ErrorScreen error={error} />;
};

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
      return <ErrorScreen error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
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

const RouteContent = ({ mainRef }) => {
  const location = useLocation();
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return undefined;
    }
    previousPathnameRef.current = location.pathname;

    // This component sits inside the Suspense boundary, so the effect commits
    // only after a lazy destination is ready instead of focusing a landmark
    // whose contents are still the loading placeholder.
    const frameId = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname, mainRef]);

  return (
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
  );
};

RouteContent.propTypes = {
  mainRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
};

// Content wrapper with router
const AppContent = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const normalizedPathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '').toLowerCase();
  const isHome = normalizedPathname === '/' || normalizedPathname.startsWith('/donor/');
  const isRecipients = normalizedPathname === '/recipients' || normalizedPathname.startsWith('/recipient/');
  const isCategories = normalizedPathname === CAUSES_PATH || normalizedPathname.startsWith('/cause/');
  const isCalculator = normalizedPathname === '/calculator';
  const isFAQ = normalizedPathname === '/faq';
  const isAssumptions = normalizedPathname === '/assumptions' || normalizedPathname.startsWith('/assumption/');

  return (
    <>
      <ScrollToTop />
      <div className="impact-notice-overlay">
        <GlobalNotificationBanner />
        <GlobalSharedAssumptionsImport />
      </div>
      <div className="flex flex-col min-h-screen">
        <a
          href="#main-content"
          className="impact-btn impact-btn--custom-accent sr-only fixed left-4 top-4 z-[100] focus:not-sr-only"
        >
          Skip to main content
        </a>
        <Header
          isHome={isHome}
          isRecipients={isRecipients}
          isCategories={isCategories}
          isCalculator={isCalculator}
          isFAQ={isFAQ}
          isAssumptions={isAssumptions}
        />
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className={`flex-grow ${isAssumptions ? 'relative' : 'bg-[var(--bg-canvas-strong)]'}`}
        >
          <Suspense
            fallback={
              <div className="impact-loading" role="status" aria-live="polite">
                Loading...
              </div>
            }
          >
            <RouteContent mainRef={mainRef} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

// A data router with a single splat route hosting the existing descendant
// <Routes>. The data-router layer exists so `useBlocker` works (the
// assumptions editor's unapplied-edits navigation guard); route definitions
// stay in AppContent.
const router = createBrowserRouter([{ path: '*', element: <AppContent />, errorElement: <RouteErrorFallback /> }]);

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
      // Browsers also emit message-only error events for benign platform
      // warnings and opaque failures in cross-origin scripts. There is no app
      // exception to recover from in those cases, so leave the UI running.
      if (!event.error) {
        return;
      }
      // Errors attributed to another origin's script (browser extensions,
      // injected third-party code) are not app bugs either — fail-hard stays
      // reserved for our own code. App errors report our origin's chunk URL
      // or no filename at all (inline handlers, some async stacks).
      if (event.filename) {
        try {
          if (new globalThis.URL(event.filename, window.location.href).origin !== window.location.origin) {
            return;
          }
        } catch {
          // An unparseable filename gives no origin signal; treat as ours.
        }
      }
      console.error('Global error:', event.error);
      setError(toError(event.error, 'Unknown global error'));
      event.preventDefault();
    };

    const handleUnhandledRejection = (event) => {
      // AbortError is the normal result of canceling stale navigations and
      // requests. Every other unhandled rejection is an unexpected async
      // failure that React error boundaries cannot catch.
      if (event.reason?.name === 'AbortError') {
        return;
      }
      console.error('Unhandled promise rejection:', event.reason);
      setError(toError(event.reason, 'Unhandled promise rejection'));
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <ErrorBoundary>
      {/* reducedMotion="user" makes every motion.* component respect
          prefers-reduced-motion: transforms are skipped while opacity fades
          (safe for vestibular disorders) still run. */}
      <MotionConfig reducedMotion="user">
        <NotificationProvider>
          <AssumptionsProvider>
            <RouterProvider router={router} />
          </AssumptionsProvider>
        </NotificationProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
};

export default App;
