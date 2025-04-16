import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor/:donorName" element={<DonorDetail />} />
          <Route path="/recipient/:recipientName" element={<RecipientDetail />} />
          <Route path="/recipients" element={<Recipients />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;