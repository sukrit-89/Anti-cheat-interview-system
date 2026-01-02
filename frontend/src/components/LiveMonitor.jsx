import React, { useState, useEffect, useRef } from 'react';
import { sessionAPI } from '../services/api';

export default function LiveMonitor({ onBack }) {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [flags, setFlags] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [candidateId, setCandidateId] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [showSetup, setShowSetup] = useState(true);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);

    const FLAG_WEIGHTS = {
        'looking_away': 0.10,
        'no_face': 0.15,
        'multi_face': 0.20,
        'gaze_violation': 0.10
    };

    const startMonitoring = async () => {
        if (!candidateId.trim()) {
            alert('Please enter candidate ID');
            return;
        }

        try {
            // Start webcam
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }

            // Create session in backend
            const formData = new FormData();
            formData.append('candidate_id', candidateId);

            const response = await fetch('/api/live/start', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setSessionId(data.session_id);
            setStartTime(Date.now());
            setIsMonitoring(true);
            setShowSetup(false);

            // Start simulated detection
            startDetection(data.session_id);

        } catch (error) {
            alert('Failed to start monitoring: ' + error.message);
        }
    };

    const startDetection = (sid) => {
        // Simulate detection every 3 seconds
        intervalRef.current = setInterval(async () => {
            if (Math.random() > 0.7) { // 30% chance of flag
                const flagTypes = Object.keys(FLAG_WEIGHTS);
                const randomType = flagTypes[Math.floor(Math.random() * flagTypes.length)];
                const severity = FLAG_WEIGHTS[randomType];
                const timestamp = (Date.now() - startTime) / 1000;

                // Send flag to backend
                try {
                    const formData = new FormData();
                    formData.append('flag_type', randomType);
                    formData.append('timestamp', timestamp.toString());
                    formData.append('severity', severity.toString());

                    await fetch(`/api/live/${sid}/flag`, {
                        method: 'POST',
                        body: formData
                    });

                    // Update UI
                    const newFlag = {
                        timestamp: new Date().toLocaleTimeString(),
                        type: randomType,
                        severity: severity.toFixed(2),
                        time: timestamp
                    };

                    setFlags(prev => [newFlag, ...prev].slice(0, 20));
                    setCurrentScore(prev => Math.min(prev + severity, 1));
                } catch (error) {
                    console.error('Failed to add flag:', error);
                }
            }
        }, 3000);
    };

    const stopMonitoring = async () => {
        // Stop webcam
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        // Stop detection
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Finalize session
        if (sessionId && startTime) {
            try {
                const duration = (Date.now() - startTime) / 1000;
                const formData = new FormData();
                formData.append('duration', duration.toString());

                const response = await fetch(`/api/live/${sessionId}/stop`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                alert(`Session completed!\nRisk Score: ${data.risk_score.toFixed(3)}\nRisk Level: ${data.risk_level}\nTotal Flags: ${data.total_flags}`);

                // Reset and go back
                setTimeout(() => {
                    onBack();
                }, 1500);

            } catch (error) {
                console.error('Failed to stop session:', error);
            }
        }

        setIsMonitoring(false);
        setFlags([]);
        setCurrentScore(0);
        setSessionId(null);
        setStartTime(null);
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    if (showSetup) {
        return (
            <div className="fade-in">
                <button onClick={onBack} style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    ← Back to Dashboard
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        🎥 Live Interview Monitoring
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                        Real-time integrity monitoring with instant detection
                    </p>
                </div>

                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Setup Live Session</h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#1f2937' }}>
                            Candidate ID <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            placeholder="e.g., CAND-2024-001"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ background: '#f0f9ff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                            ℹ️ <strong>Note:</strong> Make sure the candidate is ready and properly positioned before starting the session.
                        </p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={startMonitoring}
                        disabled={!candidateId.trim()}
                        style={{
                            width: '100%',
                            fontSize: '1.125rem',
                            padding: '1rem',
                            background: candidateId.trim() ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#d1d5db'
                        }}
                    >
                        🎬 Start Live Monitoring
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <button onClick={onBack} style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                ← Back to Dashboard
            </button>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>Live Monitoring: {candidateId}</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                            Session ID: {sessionId} • {isMonitoring ? '🔴 LIVE' : '⚫ Stopped'}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    {/* Video Feed */}
                    <div>
                        <div style={{
                            background: '#000',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            aspectRatio: '16/9'
                        }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isMonitoring && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }}></div>
                                    RECORDING
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <button
                                className="danger-btn"
                                onClick={stopMonitoring}
                                style={{ width: '100%', fontSize: '1rem', padding: '0.875rem' }}
                            >
                                ⏹️ Stop & Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Stats Panel */}
                    <div>
                        <div className="stat-card" style={{
                            background: currentScore > 0.6
                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                : currentScore > 0.3
                                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Current Risk Score</div>
                            <div className="stat-value">{(currentScore * 100).toFixed(0)}/100</div>
                            <div className="progress-bar" style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.3)' }}>
                                <div className="progress-fill" style={{
                                    width: `${currentScore * 100}%`,
                                    background: 'white'
                                }}></div>
                            </div>
                        </div>

                        <div className="stat-card" style={{ marginBottom: '1rem' }}>
                            <div className="stat-label" style={{ marginBottom: '0.5rem' }}>Total Flags</div>
                            <div className="stat-value" style={{ color: '#1f2937' }}>{flags.length}</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label" style={{ marginBottom: '0.5rem' }}>Status</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: isMonitoring ? '#10b981' : '#6b7280' }}>
                                {isMonitoring ? '🟢 Monitoring' : '⚫ Stopped'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flags Timeline */}
            {flags.length > 0 && (
                <div className="card">
                    <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Recent Flags ({flags.length})</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {flags.map((flag, idx) => (
                            <div key={idx} style={{
                                padding: '0.875rem',
                                background: '#fef3c7',
                                border: '2px solid #fbbf24',
                                borderRadius: '8px',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: '600', color: '#92400e' }}>
                                        {flag.type.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: '#78350f', marginLeft: '0.75rem' }}>
                                        {flag.timestamp}
                                    </span>
                                </div>
                                <span className="badge badge-medium">
                                    Severity: {flag.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
