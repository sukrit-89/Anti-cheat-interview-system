import React, { useState } from 'react';
import { sessionAPI } from '../services/api';

export default function VideoUpload({ onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [candidateId, setCandidateId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !candidateId) {
            alert('Please select a file and enter candidate ID');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);
            setResult(null);

            const response = await sessionAPI.uploadVideo(file, candidateId, setProgress);

            setResult(response.data);
            setTimeout(() => {
                onUploadComplete();
            }, 2000);

        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    📹 Video Upload for Interview Analysis
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                    Upload recorded interview videos for comprehensive integrity analysis
                </p>
            </div>

            <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '0.95rem'
                        }}>
                            Candidate ID <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            placeholder="e.g., CAND-2024-001"
                            required
                            disabled={uploading}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '0.95rem'
                        }}>
                            Interview Video <span style={{ color: '#ef4444' }}>*</span>
                        </label>

                        {/* Drag and Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            style={{
                                border: dragActive ? '3px dashed #6366f1' : '3px dashed #d1d5db',
                                borderRadius: '12px',
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                background: dragActive ? '#f0f9ff' : '#f9fafb',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                            onClick={() => !uploading && document.getElementById('fileInput').click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept="video/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />

                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>
                                {dragActive ? '📥' : '☁️'}
                            </div>

                            {file ? (
                                <div>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                                        ✓ {file.name}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            style={{
                                                marginTop: '0.75rem',
                                                padding: '0.5rem 1rem',
                                                background: '#fee2e2',
                                                color: '#991b1b',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Remove File
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                                        Drag & Drop Video File Here
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                                        or browse to upload (MP4, MOV, AVI up to 1GB)
                                    </p>
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        📁 Browse Files
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {uploading && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                                    {progress < 100 ? 'Uploading...' : 'Analyzing video...'}
                                </span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                                    {progress}%
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                {progress < 100
                                    ? 'Please wait while we upload your video...'
                                    : 'Running AI analysis on the interview...'}
                            </p>
                        </div>
                    )}

                    {result && (
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
                            <h3 style={{ color: '#065f46', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>
                                Analysis Complete!
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#065f46', marginBottom: '0.25rem' }}>Risk Score</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#047857' }}>
                                        {result.risk_score?.toFixed(3)}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#065f46', marginBottom: '0.25rem' }}>Risk Level</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#047857' }}>
                                        {result.risk_level}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#065f46', marginBottom: '0.25rem' }}>Flags</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#047857' }}>
                                        {result.total_flags}
                                    </p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#047857', marginTop: '1rem', fontWeight: '500' }}>
                                Redirecting to sessions...
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={uploading || !file || !candidateId}
                        style={{
                            width: '100%',
                            fontSize: '1.125rem',
                            padding: '1rem',
                            fontWeight: '600',
                            background: uploading || !file || !candidateId
                                ? '#d1d5db'
                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    >
                        {uploading ? '⏳ Processing...' : '🚀 Upload & Analyze'}
                    </button>
                </form>
            </div>
        </div>
    );
}
