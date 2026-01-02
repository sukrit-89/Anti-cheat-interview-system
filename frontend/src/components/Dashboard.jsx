import React from 'react';

export default function Dashboard({ sessions, onViewSession }) {
    const totalSessions = sessions.length;
    const highRisk = sessions.filter(s => s.risk_level === 'HIGH').length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const completionRate = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0;

    const recentSessions = sessions.slice(0, 5);

    return (
        <div className="dashboard fade-in">
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Sessions</div>
                    <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {totalSessions.toLocaleString()}
                        <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>📊</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        ↑ 5% Last Week
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Completed</div>
                    <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {completed.toLocaleString()}
                        <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>✓</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        {completionRate}% Rate
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>High Risk</div>
                    <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {highRisk}
                        <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>⚠️</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        Requires Review
                    </div>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#1f2937', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Recent Sessions</h3>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last 5 interviews</span>
                </div>

                {recentSessions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        background: '#f9fafb',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
                        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '0.5rem' }}>No sessions yet</p>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Upload a video to get started</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentSessions.map((session, idx) => (
                            <div
                                key={session.id}
                                style={{
                                    padding: '1.25rem',
                                    border: '2px solid #f3f4f6',
                                    borderRadius: '12px',
                                    display: 'grid',
                                    gridTemplateColumns: '40px 1fr auto',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#6366f1';
                                    e.currentTarget.style.background = '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#f3f4f6';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '1.1rem'
                                }}>
                                    {idx + 1}
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <strong style={{ fontSize: '1rem', color: '#1f2937' }}>{session.candidate_id}</strong>
                                        {session.risk_level && (
                                            <span className={`badge badge-${session.risk_level.toLowerCase()}`}>
                                                {session.risk_level} {session.risk_level === 'HIGH' ? '🔴' : session.risk_level === 'MEDIUM' ? '🟡' : '🟢'}
                                            </span>
                                        )}
                                        {session.status && (
                                            <span className={`status-badge status-${session.status}`}>
                                                {session.status}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', gap: '1.5rem' }}>
                                        <span>📅 {new Date(session.created_at).toLocaleDateString()}</span>
                                        {session.duration_seconds > 0 && (
                                            <span>⏱️ {Math.floor(session.duration_seconds / 60)}:{String(Math.floor(session.duration_seconds % 60)).padStart(2, '0')} min</span>
                                        )}
                                        {session.risk_score !== null && session.risk_score !== undefined && (
                                            <span>📊 Score: {(session.risk_score * 100).toFixed(0)}/100</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="primary-btn"
                                    onClick={() => onViewSession(session.id)}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    View Report →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
