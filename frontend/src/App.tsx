import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SessionCreate } from './pages/SessionCreate';
import { SessionDetail } from './pages/SessionDetail';
import { SessionJoin } from './pages/SessionJoin';
import { InterviewRoom } from './pages/InterviewRoom';
import SessionMonitor from './pages/SessionMonitor';
import SessionResults from './pages/SessionResults';
import { EvaluationReport } from './pages/EvaluationReport';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Troubleshooting } from './pages/Troubleshooting';
import { useAuthStore } from './store/useAuthStore';
import './index.css';

// Error Boundary
import { Component, type ErrorInfo } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neeti-bg flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl font-mono text-status-critical">!</div>
            <h1 className="text-2xl font-display text-ink-primary">Something went wrong</h1>
            <p className="text-ink-secondary">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              className="px-6 py-3 bg-bronze text-white rounded-lg font-medium hover:bg-bronze-light transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Route guards using reactive hook selectors
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function RecruiterRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const role = useAuthStore(s => s.user?.role);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== 'recruiter') return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen bg-neeti-bg flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="text-8xl font-mono text-bronze/40">404</div>
        <h1 className="text-2xl font-display text-ink-primary">Page Not Found</h1>
        <p className="text-ink-secondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-bronze text-white rounded-lg font-medium hover:bg-bronze-light transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
          <Route path="/privacy" element={<About />} />
          <Route path="/terms" element={<About />} />
          <Route path="/cookies" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join" element={<SessionJoin />} />
          <Route
            path="/sessions/join"
            element={<ProtectedRoute><SessionJoin /></ProtectedRoute>}
          />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/sessions/:id/interview" element={<InterviewRoom />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/sessions/create"
            element={<RecruiterRoute><SessionCreate /></RecruiterRoute>}
          />
          <Route
            path="/sessions/:id"
            element={<ProtectedRoute><SessionDetail /></ProtectedRoute>}
          />
          <Route
            path="/sessions/:sessionId/monitor"
            element={<RecruiterRoute><SessionMonitor /></RecruiterRoute>}
          />
          <Route
            path="/sessions/:sessionId/results"
            element={<ProtectedRoute><SessionResults /></ProtectedRoute>}
          />
          <Route
            path="/evaluation/:id"
            element={<ProtectedRoute><EvaluationReport /></ProtectedRoute>}
          />
          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
