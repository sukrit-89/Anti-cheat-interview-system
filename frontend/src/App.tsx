import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SessionCreate } from './pages/SessionCreate';
import { SessionDetail } from './pages/SessionDetail';
import { SessionJoin } from './pages/SessionJoin';
import { InterviewRoom } from './pages/InterviewRoom';
import SessionMonitor from './pages/SessionMonitor';
import SessionResults from './pages/SessionResults';
import { useAuthStore } from './store/useAuthStore';
import './index.css';

function App() {
  const { fetchCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Try to restore session from localStorage
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<SessionJoin />} />
        <Route path="/interview" element={<InterviewRoom />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/sessions/create"
          element={isAuthenticated ? <SessionCreate /> : <Navigate to="/login" />}
        />
        <Route
          path="/sessions/:id"
          element={isAuthenticated ? <SessionDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/sessions/:sessionId/monitor"
          element={isAuthenticated ? <SessionMonitor /> : <Navigate to="/login" />}
        />
        <Route
          path="/sessions/:sessionId/results"
          element={isAuthenticated ? <SessionResults /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
