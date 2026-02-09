/**
 * Session Detail Page - View session info and manage interview
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import {
    ArrowLeft,
    Copy,
    Play,
    StopCircle,
    Calendar,
    Clock,
    CheckCircle,
} from 'lucide-react';

export const SessionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentSession, setCurrentSession, startSession, endSession, isLoading } =
        useSessionStore();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // In a real app, fetch session details by ID
        // For now, we'll assume it's in the store
        if (!currentSession || currentSession.id !== Number(id)) {
            // navigate('/dashboard');
        }
    }, [id, currentSession, navigate]);

    const copySessionCode = () => {
        if (currentSession) {
            navigator.clipboard.writeText(currentSession.session_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartSession = async () => {
        if (currentSession) {
            try {
                await startSession(currentSession.id);
            } catch (err) {
                console.error('Failed to start session:', err);
            }
        }
    };

    const handleEndSession = async () => {
        if (currentSession && confirm('Are you sure you want to end this session?')) {
            try {
                await endSession(currentSession.id);
            } catch (err) {
                console.error('Failed to end session:', err);
            }
        }
    };

    if (!currentSession) {
        return (
            <div className="min-h-screen neural-bg flex items-center justify-center">
                <div className="text-neural-text-secondary">Loading session...</div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live':
                return 'bg-green-500';
            case 'completed':
                return 'bg-gray-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div className="min-h-screen neural-bg">
            {/* Header */}
            <header className="glass-card border-b border-neural-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-neural-text-primary">
                                    {currentSession.title}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(currentSession.status)}`} />
                                    <span className="text-sm text-neural-text-secondary capitalize">
                                        {currentSession.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Session Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Join Code Card */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-neural-text-primary mb-4">
                                Session Join Code
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-neural-surface border-2 border-accent-cyan/30 rounded-lg p-6 text-center">
                                    <div className="text-sm text-neural-text-secondary mb-2">
                                        Share this code with candidate
                                    </div>
                                    <div className="text-4xl font-mono font-bold text-accent-cyan tracking-wider">
                                        {currentSession.session_code}
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={copySessionCode}
                                    className="flex items-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400">
                                Candidate can join at: {window.location.origin}/join
                            </div>
                        </div>

                        {/* Description */}
                        {currentSession.description && (
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-neural-text-primary mb-3">
                                    Description
                                </h2>
                                <p className="text-neural-text-secondary">
                                    {currentSession.description}
                                </p>
                            </div>
                        )}

                        {/* Session Info */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-neural-text-primary mb-4">
                                Session Information
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-accent-cyan" />
                                    <span className="text-neural-text-secondary">Created:</span>
                                    <span className="text-neural-text-primary">
                                        {new Date(currentSession.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {currentSession.scheduled_at && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-accent-cyan" />
                                        <span className="text-neural-text-secondary">
                                            Scheduled:
                                        </span>
                                        <span className="text-neural-text-primary">
                                            {new Date(currentSession.scheduled_at).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {currentSession.started_at && (
                                    <div className="flex items-center gap-3">
                                        <Play className="w-4 h-4 text-green-400" />
                                        <span className="text-neural-text-secondary">Started:</span>
                                        <span className="text-neural-text-primary">
                                            {new Date(currentSession.started_at).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {currentSession.ended_at && (
                                    <div className="flex items-center gap-3">
                                        <StopCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-neural-text-secondary">Ended:</span>
                                        <span className="text-neural-text-primary">
                                            {new Date(currentSession.ended_at).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-neural-text-primary mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                {currentSession.status === 'scheduled' && (
                                    <Button
                                        variant="primary"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={handleStartSession}
                                        disabled={isLoading}
                                    >
                                        <Play className="w-4 h-4" />
                                        Start Interview
                                    </Button>
                                )}
                                {currentSession.status === 'live' && (
                                    <>
                                        <Button
                                            variant="primary"
                                            className="w-full"
                                            onClick={() =>
                                                navigate(`/sessions/${currentSession.id}/monitor`)
                                            }
                                        >
                                            Join Interview Room
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={handleEndSession}
                                            disabled={isLoading}
                                        >
                                            <StopCircle className="w-4 h-4" />
                                            End Interview
                                        </Button>
                                    </>
                                )}
                                {currentSession.status === 'completed' && (
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={() =>
                                            navigate(`/sessions/${currentSession.id}/results`)
                                        }
                                    >
                                        View AI Evaluation
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* AI Agents Status */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-neural-text-primary mb-4">
                                AI Agents
                            </h2>
                            <div className="space-y-3">
                                {[
                                    'CodingAgent',
                                    'SpeechAgent',
                                    'VisionAgent',
                                    'ReasoningAgent',
                                    'EvaluationAgent',
                                ].map((agent) => (
                                    <div
                                        key={agent}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-neural-text-secondary">{agent}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-green-400 text-xs">Ready</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
