import React from 'react';
import { sessionAPI } from '../services/api';

export default function SessionList({ sessions, onViewSession, onRefresh, loading }) {
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this session?')) return;

        try {
            await sessionAPI.deleteSession(id);
            onRefresh();
        } catch (error) {
            alert('Failed to delete session');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '0 0.5rem'
            }}>
                <div>
                    <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        Sessions
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                        Manage and review all interview sessions
                    </p>
                </div>
                <button className="primary-btn" onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔄 Refresh
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📂</div>
                    <p style={{ fontSize: '1.25rem', color: '#1f2937', fontWeight: '600', marginBottom: '0.5rem' }}>
                        No sessions found
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        Upload a video to get started
                    </p>
                </div>
            ) : (
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem' }}>Candidate ID</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Duration</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Risk Score</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr
                                    key={session.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onViewSession(session.id)}
                                >
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                                                fontSize: '0.9rem'
                                            }}>
                                                {session.candidate_id.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1f2937' }}>{session.candidate_id}</div>
                                                {session.risk_level && (
                                                    <span className={`badge badge-${session.risk_level.toLowerCase()}`} style={{ marginTop: '0.25rem' }}>
                                                        {session.risk_level}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: '#6b7280' }}>
                                        {new Date(session.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: '#6b7280' }}>
                                        {session.duration_seconds > 0
                                            ? `${Math.floor(session.duration_seconds / 60)}:${String(Math.floor(session.duration_seconds % 60)).padStart(2, '0')}`
                                            : 'N/A'}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        {session.risk_score !== null && session.risk_score !== undefined ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '8px',
                                                    background: '#e5e7eb',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${session.risk_score * 100}%`,
                                                        height: '100%',
                                                        background: session.risk_score > 0.6 ? '#ef4444' : session.risk_score > 0.3 ? '#f59e0b' : '#10b981',
                                                        borderRadius: '4px'
                                                    }}></div>
                                                </div>
                                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                                    {(session.risk_score * 100).toFixed(0)}/100
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#9ca3af' }}>N/A</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span className={`status-badge status-${session.status}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="primary-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewSession(session.id);
                                                }}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                className="danger-btn"
                                                onClick={(e) => handleDelete(session.id, e)}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sessions.length > 10 && (
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#f9fafb'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Showing 1-{Math.min(sessions.length, 10)} of {sessions.length}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    ← Previous
                                </button>
                                <button className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
