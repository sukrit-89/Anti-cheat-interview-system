import React, { useState, useEffect } from 'react';
import { sessionAPI } from './services/api';
import Dashboard from './components/Dashboard';
import SessionList from './components/SessionList';
import VideoUpload from './components/VideoUpload';
import SessionDetail from './components/SessionDetail';
import LiveMonitor from './components/LiveMonitor';
import './App.css';

function App() {
    const [view, setView] = useState('dashboard'); // dashboard, sessions, upload, detail, live
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (view === 'sessions' || view === 'dashboard') {
            loadSessions();
        }
    }, [view]);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const response = await sessionAPI.getSessions();
            setSessions(response.data.sessions);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSession = async (sessionId) => {
        try {
            const response = await sessionAPI.getSession(sessionId);
            setSelectedSession(response.data);
            setView('detail');
        } catch (error) {
            console.error('Failed to load session details:', error);
        }
    };

    const handleUploadComplete = () => {
        setView('sessions');
        loadSessions();
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                            src="/logo-icon.png"
                            alt="Satya Guard"
                            style={{
                                height: '50px',
                                width: '50px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}
                        />
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Satya Guard</h1>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Interview Integrity Platform</p>
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
                        Dashboard
                    </button>
                    <button
                        className={view === 'sessions' ? 'active' : ''}
                        onClick={() => setView('sessions')}
                    >
                        Sessions
                    </button>
                    <button
                        className={view === 'live' ? 'active' : ''}
                        onClick={() => setView('live')}
                    >
                        Live Monitor
                    </button>
                    <button
                        className={view === 'upload' ? 'active' : ''}
                        onClick={() => setView('upload')}
                    >
                        Upload Video
                    </button>
                </div>
            </nav>

            <main className="container">
                {view === 'dashboard' && (
                    <Dashboard sessions={sessions} onViewSession={handleViewSession} />
                )}

                {view === 'sessions' && (
                    <SessionList
                        sessions={sessions}
                        onViewSession={handleViewSession}
                        onRefresh={loadSessions}
                        loading={loading}
                    />
                )}

                {view === 'live' && (
                    <LiveMonitor onBack={() => setView('dashboard')} />
                )}

                {view === 'upload' && (
                    <VideoUpload onUploadComplete={handleUploadComplete} />
                )}

                {view === 'detail' && selectedSession && (
                    <SessionDetail
                        session={selectedSession}
                        onBack={() => setView('sessions')}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
