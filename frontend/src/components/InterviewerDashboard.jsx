import React, { useState } from 'react';
import { sessionAPI } from '../services/api';

const InterviewerDashboard = ({ sessions, onViewSession, onRefresh }) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [candidateId, setCandidateId] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await sessionAPI.createSession(candidateId);
            setJoinCode(result.join_code);
            setCandidateId('');

            // Refresh session list in background
            if (onRefresh) {
                setTimeout(() => {
                    onRefresh();
                }, 1000); // Refresh after showing join code
            }
        } catch (err) {
            setError(err.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setCreateModalOpen(false);
        setJoinCode('');
        setCandidateId('');
        setError('');

        // Final refresh when modal closes
        if (onRefresh) {
            onRefresh();
        }
    };

    const copyJoinCode = () => {
        navigator.clipboard.writeText(joinCode);
        alert('Join code copied to clipboard!');
    };

    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
    const pendingSessions = sessions.filter(s => s.status === 'PENDING').length;

    return (
        <div>
            {/* Header Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
                    👨‍💼 Interviewer Dashboard
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Create interview sessions and monitor candidate integrity
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-value">{sessions.length}</div>
                    <div className="stat-label">Total Sessions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{pendingSessions}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{completedSessions}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Create Session Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    ➕ Create New Session
                </button>
            </div>

            {/* Sessions List */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                    All Sessions
                </h3>

                {sessions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                        No sessions yet. Create your first session to get started!
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => onViewSession(session.id)}
                                style={{
                                    padding: '1.25rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                        {session.candidate_id}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                        Join Code: <span style={{ fontWeight: '700', color: '#667eea' }}>{session.join_code}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                        Created: {new Date(session.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    background: session.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                                    color: session.status === 'COMPLETED' ? '#16a34a' : '#ca8a04',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.85rem'
                                }}>
                                    {session.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Session Modal */}
            {createModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        {!joinCode ? (
                            <>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                                    Create Interview Session
                                </h3>
                                <form onSubmit={handleCreateSession}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                            Candidate ID / Name
                                        </label>
                                        <input
                                            type="text"
                                            value={candidateId}
                                            onChange={(e) => setCandidateId(e.target.value)}
                                            required
                                            placeholder="e.g., CAND-001 or John Doe"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '2px solid #e5e7eb',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    {error && (
                                        <div style={{
                                            padding: '0.75rem',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            borderRadius: '10px',
                                            marginBottom: '1rem',
                                            fontSize: '0.9rem'
                                        }}>
                                            {error}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: '#f3f4f6',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: '700',
                                                cursor: loading ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {loading ? 'Creating...' : 'Create Session'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                                        Session Created!
                                    </h3>
                                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                                        Share this join code with the interviewee
                                    </p>

                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                                            Join Code
                                        </div>
                                        <div style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '8px' }}>
                                            {joinCode}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={copyJoinCode}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: '#f3f4f6',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📋 Copy Code
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewerDashboard;
