import React, { useState } from 'react';
import { sessionAPI } from '../services/api';

const IntervieweeDashboard = ({ sessions, onViewSession, onRefresh }) => {
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleJoinSession = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await sessionAPI.joinSession(joinCode.toUpperCase());
            setSuccess(`Successfully joined session for ${result.candidate_id}!`);
            setJoinCode('');
            if (onRefresh) onRefresh();

            // Close modal after 2 seconds
            setTimeout(() => {
                setJoinModalOpen(false);
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to join session. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setJoinModalOpen(false);
        setJoinCode('');
        setError('');
        setSuccess('');
    };

    const myCompletedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
    const myPendingSessions = sessions.filter(s => s.status === 'PENDING').length;

    return (
        <div>
            {/* Header Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
                    👤 Interviewee Dashboard
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Join interview sessions and view your reports
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-value">{sessions.length}</div>
                    <div className="stat-label">My Sessions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{myPendingSessions}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{myCompletedSessions}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Join Session Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setJoinModalOpen(true)}
                    style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    🔗 Join Interview Session
                </button>
            </div>

            {/* My Reports */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                    My Interview Reports
                </h3>

                {sessions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                        <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
                            No reports yet. Join your first interview session!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => session.status === 'COMPLETED' && onViewSession(session.id)}
                                style={{
                                    padding: '1.25rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor: session.status === 'COMPLETED' ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                    opacity: session.status === 'COMPLETED' ? 1 : 0.6
                                }}
                                onMouseEnter={(e) => {
                                    if (session.status === 'COMPLETED') {
                                        e.currentTarget.style.borderColor = '#10b981';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                            Interview Session
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                            Session ID: {session.id}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                            Date: {new Date(session.created_at).toLocaleDateString()}
                                        </div>
                                        {session.risk_score !== null && session.risk_score !== undefined && (
                                            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                                Risk Score: <span style={{
                                                    fontWeight: '700',
                                                    color: session.risk_score > 70 ? '#ef4444' : session.risk_score > 40 ? '#f59e0b' : '#10b981'
                                                }}>
                                                    {session.risk_score.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        background: session.status === 'COMPLETED' ? '#dcfce7' :
                                            session.status === 'PROCESSING' ? '#dbeafe' : '#fef3c7',
                                        color: session.status === 'COMPLETED' ? '#16a34a' :
                                            session.status === 'PROCESSING' ? '#2563eb' : '#ca8a04',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}>
                                        {session.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Join Session Modal */}
            {joinModalOpen && (
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
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                            Join Interview Session
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Enter the 6-character code provided by your interviewer
                        </p>

                        <form onSubmit={handleJoinSession}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                    Join Code
                                </label>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    required
                                    maxLength={6}
                                    placeholder="ABC123"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        letterSpacing: '4px',
                                        textAlign: 'center',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center' }}>
                                    Enter exactly 6 characters
                                </div>
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

                            {success && (
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#d1fae5',
                                    color: '#065f46',
                                    borderRadius: '10px',
                                    marginBottom: '1rem',
                                    fontSize: '0.9rem'
                                }}>
                                    ✅ {success}
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
                                    disabled={loading || joinCode.length !== 6}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: (loading || joinCode.length !== 6) ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        cursor: (loading || joinCode.length !== 6) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Joining...' : 'Join Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntervieweeDashboard;
