import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { sessionAPI } from './services/api';

// Components
import Dashboard from './components/Dashboard';
import SessionList from './components/SessionList';
import VideoUpload from './components/VideoUpload';
import SessionDetail from './components/SessionDetail';
import LiveMonitor from './components/LiveMonitor';
import Login from './components/Login';
import Register from './components/Register';

import './App.css';

function App() {
    const [authState, setAuthState] = useState('loading');
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [view, setView] = useState('dashboard');
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const response = await fetch('http://localhost:8000/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCurrentUser(user);
                        setUserData(data);
                        setAuthState('authenticated');
                    } else {
                        setAuthState('login');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setAuthState('login');
                }
            } else {
                setCurrentUser(null);
                setUserData(null);
                setAuthState('login');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (authState === 'authenticated' && (view === 'sessions' || view === 'dashboard')) {
            loadSessions();
        }
    }, [view, authState]);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await sessionAPI.getSessions();
            setSessions(data.sessions || []);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSession = async (sessionId) => {
        try {
            const data = await sessionAPI.getSession(sessionId);
            setSelectedSession(data);
            setView('detail');
        } catch (error) {
            console.error('Failed to load session:', error);
        }
    };

    const handleUploadComplete = () => {
        setView('sessions');
        loadSessions();
    };

    const handleLoginSuccess = ({ user, token, userData: data }) => {
        setCurrentUser(user);
        setUserData(data);
        setAuthState('authenticated');
    };

    const handleRegisterSuccess = ({ user, token, userData: data }) => {
        setCurrentUser(user);
        setUserData(data);
        setAuthState('authenticated');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setUserData(null);
            setAuthState('login');
            setView('dashboard');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Loading state
    if (authState === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    // Show login screen
    if (authState === 'login') {
        return <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthState('register')} />;
    }

    // Show register screen
    if (authState === 'register') {
        return <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setAuthState('login')} />;
    }

    // Authenticated - show main app
    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        {/* Left: Logo & Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <img
                                src="/logo-icon.png"
                                alt="Satya Guard"
                                style={{
                                    height: '50px',
                                    width: '50px',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                                }}
                            />
                            <div>
                                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Satya Guard</h1>
                                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.95 }}>Interview Integrity Platform</p>
                            </div>
                        </div>

                        {/* Right: Quick Stats & Profile */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            {/* Quick Stats */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{sessions.length}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase' }}>Sessions</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                        {sessions.filter(s => s.status === 'COMPLETED').length}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase' }}>Analyzed</div>
                                </div>
                            </div>

                            {/* Profile Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderRadius: '50px',
                                        padding: '0.5rem 1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '700',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }}>
                                        {userData?.role === 'INTERVIEWER' ? '👨‍💼' : '👤'}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{userData?.full_name || 'User'}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{userData?.role || 'Role'}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem' }}>{showProfileMenu ? '▲' : '▼'}</div>
                                </button>

                                {showProfileMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 0.5rem)',
                                        right: 0,
                                        background: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                        minWidth: '220px',
                                        overflow: 'hidden',
                                        zIndex: 1000
                                    }}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                                                {userData?.full_name}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                                {userData?.email}
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid #e5e7eb', padding: '0.5rem 0' }}>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1.25rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    color: '#ef4444',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                            >
                                                <span>🚪</span> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="app-nav">
                <div className="container">
                    <button
                        className={view === 'dashboard' ? 'active' : ''}
                        onClick={() => setView('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        className={view === 'sessions' ? 'active' : ''}
                        onClick={() => setView('sessions')}
                    >
                        📁 Sessions
                    </button>
                    {userData?.role === 'INTERVIEWER' && (
                        <>
                            <button
                                className={view === 'upload' ? 'active' : ''}
                                onClick={() => setView('upload')}
                            >
                                📤 Upload Video
                            </button>
                            <button
                                className={view === 'live' ? 'active' : ''}
                                onClick={() => setView('live')}
                            >
                                🎥 Live Monitor
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <main className="app-main">
                <div className="container">
                    {view === 'dashboard' && (
                        <Dashboard
                            sessions={sessions}
                            onViewSession={handleViewSession}
                            userRole={userData?.role}
                        />
                    )}
                    {view === 'sessions' && (
                        <SessionList
                            sessions={sessions}
                            onViewSession={handleViewSession}
                            onRefresh={loadSessions}
                        />
                    )}
                    {view === 'upload' && userData?.role === 'INTERVIEWER' && (
                        <VideoUpload onUploadComplete={handleUploadComplete} />
                    )}
                    {view === 'detail' && selectedSession && (
                        <SessionDetail
                            session={selectedSession}
                            onBack={() => setView('sessions')}
                        />
                    )}
                    {view === 'live' && userData?.role === 'INTERVIEWER' && (
                        <LiveMonitor onComplete={() => setView('sessions')} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
