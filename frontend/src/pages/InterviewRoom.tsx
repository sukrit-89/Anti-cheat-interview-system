/**
 * Interview Room - Document-style interview interface with authority
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import { useWebSocket } from '../lib/websocket';
import { CodeEditor } from '../components/CodeEditor';
import { Button } from '../components/Button';
import { LogOut, Code, Maximize2, Minimize2, FileText, Clock, AlertTriangle } from 'lucide-react';

const LIVEKIT_WS_URL = import.meta.env.VITE_LIVEKIT_WS_URL;

export const InterviewRoom: React.FC = () => {
    const navigate = useNavigate();
    const { currentSession, roomToken, fetchRoomToken } = useSessionStore();
    const { user } = useAuthStore();
    const isRecruiter = user?.role === 'recruiter';
    const { isConnected } = useWebSocket(currentSession?.id || null);

    const [isCodeExpanded, setIsCodeExpanded] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const [language, setLanguage] = useState('typescript');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);

    useEffect(() => {
        if (!currentSession) {
            navigate(isRecruiter ? '/dashboard' : '/join');
            return;
        }

        // Fetch room token if we don't have one (e.g., recruiter entering)
        if (!roomToken) {
            fetchRoomToken(currentSession.id).catch((error) => {
                console.error('Failed to fetch room token:', error);
                navigate('/dashboard');
            });
        }
    }, [currentSession, roomToken, navigate, fetchRoomToken]);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLeave = () => {
        setShowLeaveDialog(true);
    };

    const confirmLeave = () => {
        setShowLeaveDialog(false);
        navigate('/dashboard');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentSession || !roomToken) {
        return (
            <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
                <div className="text-verdict-text-secondary">Loading interview room...</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-verdict-bg overflow-hidden">
            {/* Authority Header */}
            <header className="verdict-card border-b border-verdict-border-strong px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-accent-bronze" />
                            <div>
                                <h1 className="text-headline font-display text-verdict-text-primary">
                                    {currentSession.title}
                                </h1>
                                <p className="text-micro text-verdict-text-tertiary">
                                    Session Code: {currentSession.join_code}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono">{formatTime(elapsedTime)}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-semantic-success' : 'bg-semantic-critical'
                                }`} />
                            <span className="text-micro text-verdict-text-secondary">
                                {isConnected ? 'CONNECTED' : 'CONNECTING'}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                            icon={isCodeExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        >
                            {isCodeExpanded ? 'Minimize' : 'Expand'} Editor
                        </Button>

                        <Button
                            variant="critical"
                            size="sm"
                            onClick={handleLeave}
                            icon={<LogOut className="w-4 h-4" />}
                        >
                            Leave Interview
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Conference Panel */}
                <div className={`${isCodeExpanded ? 'w-1/2' : 'w-2/3'} border-r border-verdict-border flex flex-col`}>
                    <div className="flex-1 p-4">
                        <LiveKitRoom
                            token={roomToken}
                            serverUrl={LIVEKIT_WS_URL}
                            connectOptions={{ autoSubscribe: true }}
                        >
                            <VideoConference className="h-full" />
                            <RoomAudioRenderer />
                        </LiveKitRoom>
                    </div>

                    {/* Session Status Bar */}
                    <div className="verdict-card border-t border-verdict-border-strong px-4 py-3">
                        <div className="flex items-center justify-between text-micro">
                            <div className="flex items-center space-x-4">
                                <span className="text-verdict-text-tertiary">Status:</span>
                                <span className={`verdict-badge ${currentSession.status === 'live' ? 'verdict-badge-critical' : 'verdict-badge-neutral'
                                    }`}>
                                    {currentSession.status}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-verdict-text-tertiary">Language:</span>
                                <span className="font-mono text-verdict-text-secondary">{language.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor Panel */}
                <div className={`${isCodeExpanded ? 'w-1/2' : 'w-1/3'} flex flex-col`}>
                    <div className="flex-1 flex flex-col">
                        {/* Editor Header */}
                        <div className="verdict-card border-b border-verdict-border-strong px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Code className="w-4 h-4 text-accent-bronze" />
                                    <span className="text-subheadline font-semibold">Code Editor</span>
                                </div>

                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="input-authority text-sm px-2 py-1 w-24"
                                >
                                    <option value="typescript">TypeScript</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 p-4">
                            <CodeEditor
                                value={currentCode}
                                onChange={setCurrentCode}
                                language={language}
                                sessionId={currentSession?.id || 0}
                            />
                        </div>

                        {/* Editor Footer */}
                        <div className="verdict-card border-t border-verdict-border-strong px-4 py-3">
                            <div className="flex items-center justify-between text-micro">
                                <div className="flex items-center space-x-4">
                                    <span className="text-verdict-text-tertiary">Lines:</span>
                                    <span className="font-mono text-verdict-text-secondary">
                                        {currentCode.split('\n').length}
                                    </span>
                                    <span className="text-verdict-text-tertiary">Lang:</span>
                                    <span className="font-mono text-verdict-text-secondary">{language.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave confirmation dialog */}
            {showLeaveDialog && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-verdict-surface border border-verdict-border max-w-md w-full p-8 space-y-6">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-semantic-warning" />
                            <h2 className="text-xl font-display text-verdict-text-primary">Leave Interview?</h2>
                        </div>
                        <p className="text-verdict-text-secondary">
                            Are you sure you want to leave? Your progress has been saved but the interview session will remain active.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLeaveDialog(false)}
                                className="flex-1 py-3 px-4 border border-verdict-border text-verdict-text-primary hover:bg-verdict-surface-elevated transition-colors font-medium"
                            >
                                Stay
                            </button>
                            <button
                                onClick={confirmLeave}
                                className="flex-1 py-3 px-4 bg-semantic-critical text-white hover:bg-semantic-critical/80 transition-colors font-medium"
                            >
                                Leave Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
