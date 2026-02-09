/**
 * Interview Room - Main interview interface with video + code editor
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { useSessionStore } from '../store/useSessionStore';
import { useWebSocket } from '../lib/websocket';
import { CodeEditor } from '../components/CodeEditor';
import { Button } from '../components/Button';
import { LogOut, Code, Video, Maximize2, Minimize2 } from 'lucide-react';

const LIVEKIT_WS_URL = import.meta.env.VITE_LIVEKIT_WS_URL;

export const InterviewRoom: React.FC = () => {
    const navigate = useNavigate();
    const { currentSession, roomToken } = useSessionStore();
    const { isConnected, lastMessage } = useWebSocket(currentSession?.id || null);

    const [isCodeExpanded, setIsCodeExpanded] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const [language, setLanguage] = useState('typescript');

    useEffect(() => {
        if (!currentSession || !roomToken) {
            navigate('/join');
        }
    }, [currentSession, roomToken, navigate]);

    const handleLeave = () => {
        if (confirm('Are you sure you want to leave the interview?')) {
            navigate('/join');
        }
    };

    if (!currentSession || !roomToken) {
        return (
            <div className="min-h-screen neural-bg flex items-center justify-center">
                <div className="text-neural-text-secondary">Loading interview room...</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col neural-bg overflow-hidden">
            {/* Header */}
            <header className="glass-card border-b border-neural-border px-6 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
                            <span className="text-sm font-bold text-neural-bg font-mono">I</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-neural-text-primary">
                                {currentSession.title}
                            </h1>
                            <p className="text-xs text-neural-text-secondary">
                                Session: {currentSession.session_code}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                }`}
                            />
                            <span className="text-neural-text-secondary">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleLeave}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Leave
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Video */}
                <div
                    className={`${
                        isCodeExpanded ? 'w-1/4' : 'w-1/2'
                    } transition-all duration-300 border-r border-neural-border bg-black/20`}
                >
                    <LiveKitRoom
                        serverUrl={LIVEKIT_WS_URL}
                        token={roomToken}
                        connect={true}
                        audio={true}
                        video={true}
                        onDisconnected={() => {
                            console.log('Disconnected from LiveKit');
                        }}
                        className="h-full"
                    >
                        <VideoConference />
                        <RoomAudioRenderer />
                    </LiveKitRoom>
                </div>

                {/* Right Panel - Code Editor */}
                <div className={`${isCodeExpanded ? 'w-3/4' : 'w-1/2'} transition-all duration-300 flex flex-col`}>
                    <div className="flex-shrink-0 glass-card border-b border-neural-border px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-accent-cyan" />
                                <span className="text-sm font-medium text-neural-text-primary">
                                    Code Editor
                                </span>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-3 py-1 bg-neural-surface border border-neural-border rounded text-sm text-neural-text-primary focus:outline-none focus:border-accent-cyan"
                            >
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                            className="p-1.5 hover:bg-white/5 rounded transition-colors"
                            title={isCodeExpanded ? 'Minimize' : 'Maximize'}
                        >
                            {isCodeExpanded ? (
                                <Minimize2 className="w-4 h-4 text-neural-text-secondary" />
                            ) : (
                                <Maximize2 className="w-4 h-4 text-neural-text-secondary" />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <CodeEditor
                            sessionId={currentSession.id}
                            language={language}
                            value={currentCode}
                            onChange={setCurrentCode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
