import React from 'react';
import { sessionAPI } from '../services/api';

export default function SessionDetail({ session, onBack }) {
    const pdfUrl = session.report?.pdf_path ? sessionAPI.getPDFReport(session.id) : null;

    const getRiskColor = (score) => {
        if (score > 0.6) return '#ef4444';
        if (score > 0.3) return '#f59e0b';
        return '#10b981';
    };

    const getRiskIcon = (level) => {
        if (level === 'HIGH') return '🔴';
        if (level === 'MEDIUM') return '🟡';
        return '🟢';
    };

    const getFlagIcon = (type) => {
        const icons = {
            'no_face': '👤',
            'multi_face': '👥',
            'looking_away': '👀',
            'gaze_violation': '👁️',
            'no_blink': '😐',
            'multi_voice': '🔊',
            'no_audio': '🔇'
        };
        return icons[type] || '⚠️';
    };

    return (
        <div className="fade-in">
            <button
                onClick={onBack}
                style={{
                    marginBottom: '1.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(10px)'
                }}
            >
                ← Back to Sessions
            </button>

            {/* Header Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '1.75rem'
                            }}>
                                {session.candidate_id.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ color: '#1f2937', marginBottom: '0.25rem', fontSize: '1.75rem', fontWeight: '700' }}>
                                    {session.candidate_id}
                                </h2>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                    📅 {new Date(session.created_at).toLocaleString('en-IN', {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {session.risk_level && (
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            background: session.risk_level === 'HIGH' ? '#fee2e2' : session.risk_level === 'MEDIUM' ? '#fef3c7' : '#d1fae5',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                                {getRiskIcon(session.risk_level)}
                            </div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: session.risk_level === 'HIGH' ? '#991b1b' : session.risk_level === 'MEDIUM' ? '#92400e' : '#065f46'
                            }}>
                                {session.risk_level} RISK
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Duration</div>
                    <div className="stat-value">
                        {session.duration_seconds
                            ? `${Math.floor(session.duration_seconds / 60)}:${String(Math.floor(session.duration_seconds % 60)).padStart(2, '0')}`
                            : 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>minutes</div>
                </div>

                <div className="stat-card" style={{
                    background: `linear-gradient(135deg, ${getRiskColor(session.risk_score || 0)} 0%, ${getRiskColor(session.risk_score || 0)}dd 100%)`,
                    color: 'white'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Risk Score</div>
                    <div className="stat-value">
                        {session.risk_score ? (session.risk_score * 100).toFixed(0) : 'N/A'}/100
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {session.risk_score
                            ? `${session.risk_score > 0.6 ? 'High' : session.risk_score > 0.3 ? 'Medium' : 'Low'} confidence`
                            : ''}
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Flags</div>
                    <div className="stat-value">{session.total_flags || 0}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>violations detected</div>
                </div>
            </div>

            {/* Flags Timeline */}
            {
                session.flags && session.flags.length > 0 && (
                    <div className="card">
                        <h3 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
                            🚩 Flags Timeline
                        </h3>

                        <div style={{
                            maxHeight: '500px',
                            overflowY: 'auto',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}>
                            <table style={{ width: '100%' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th style={{ padding: '1rem', width: '100px' }}>Timestamp</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Flag Type</th>
                                        <th style={{ padding: '1rem', width: '120px' }}>Risk Level</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {session.flags.map((flag, idx) => {
                                        const severity = flag.severity || 0.05;
                                        const riskLevel = severity > 0.15 ? 'HIGH' : severity > 0.08 ? 'MEDIUM' : 'LOW';

                                        return (
                                            <tr key={idx} style={{ position: 'relative' }}>
                                                {/* Timeline dot */}
                                                {idx === 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '24px',
                                                        top: '0',
                                                        bottom: '0',
                                                        width: '2px',
                                                        background: '#e5e7eb',
                                                        zIndex: 0
                                                    }}></div>
                                                )}

                                                <td style={{ padding: '1rem', position: 'relative', zIndex: 1 }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        <div style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            borderRadius: '50%',
                                                            background: getRiskColor(severity),
                                                            border: '2px solid white',
                                                            boxShadow: '0 0 0 2px ' + getRiskColor(severity)
                                                        }}></div>
                                                        {flag.timestamp.toFixed(1)}s
                                                    </div>
                                                </td>

                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.25rem' }}>{getFlagIcon(flag.flag_type)}</span>
                                                        <code style={{
                                                            padding: '0.35rem 0.75rem',
                                                            background: '#f3f4f6',
                                                            borderRadius: '6px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            color: '#374151'
                                                        }}>
                                                            {flag.flag_type.replace(/_/g, ' ').toUpperCase()}
                                                        </code>
                                                    </div>
                                                </td>

                                                <td style={{ padding: '1rem' }}>
                                                    <span className={`badge badge-${riskLevel.toLowerCase()}`}>
                                                        {riskLevel}
                                                    </span>
                                                </td>

                                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                                    {flag.description || `${flag.flag_type} detected at ${flag.timestamp.toFixed(2)}s`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {/* Report Download */}
            {
                pdfUrl && (
                    <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #3b82f6' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
                        <h3 style={{ color: '#1e40af', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>
                            Detailed Report Available
                        </h3>
                        <p style={{ color: '#1e40af', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Download the comprehensive PDF report with charts and analysis
                        </p>
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <button className="primary-btn" style={{
                                fontSize: '1.05rem',
                                padding: '0.875rem 2rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                ⬇️ Download PDF Report
                            </button>
                        </a>
                    </div>
                )
            }
        </div >
    );
}
