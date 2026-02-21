import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import { useWebSocket } from '../lib/websocket';
import { CodeEditor } from '../components/CodeEditor';
import { Button } from '../components/Button';
import { StatusIndicator } from '../components/StatusIndicator';
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
    if (!currentSession) { navigate(isRecruiter ? '/dashboard' : '/join'); return; }
    if (!roomToken) {
      fetchRoomToken(currentSession.id).catch(() => navigate('/dashboard'));
    }
  }, [currentSession, roomToken, navigate, fetchRoomToken]);

  useEffect(() => {
    const t = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!currentSession || !roomToken) {
    return (
      <div className="min-h-screen bg-neeti-bg flex items-center justify-center">
        <p className="text-ink-ghost text-sm">Loading interview room…</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neeti-bg overflow-hidden relative">
      <div className="ambient-orb ambient-orb-bronze w-[400px] h-[400px] top-[-15%] right-[5%] z-0 opacity-40" />
      <div className="ambient-orb ambient-orb-blue w-[300px] h-[300px] bottom-[10%] left-[-5%] z-0 opacity-30" />

      <header className="glass-header px-5 py-3 shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-bronze" />
              <div>
                <h1 className="text-sm font-display font-semibold text-ink-primary leading-tight">
                  {currentSession.title}
                </h1>
                <p className="text-[10px] text-ink-ghost font-mono">
                  Code: {currentSession.join_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{fmt(elapsedTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <StatusIndicator status={isConnected ? 'success' : 'critical'} size="sm" />
              <span className="text-[10px] uppercase tracking-wider text-ink-ghost">
                {isConnected ? 'Connected' : 'Connecting'}
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setIsCodeExpanded(!isCodeExpanded)}
              icon={isCodeExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}>
              {isCodeExpanded ? 'Minimize' : 'Expand'}
            </Button>

            <Button variant="critical" size="sm" onClick={() => setShowLeaveDialog(true)} icon={<LogOut className="w-4 h-4" />}>
              Leave
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${isCodeExpanded ? 'w-1/2' : 'w-2/3'} border-r border-neeti-border flex flex-col transition-all`}>
          <div className="flex-1 p-3">
            <LiveKitRoom token={roomToken} serverUrl={LIVEKIT_WS_URL} connectOptions={{ autoSubscribe: true }}>
              <VideoConference className="h-full" />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>

          <div className="border-t border-neeti-border bg-neeti-surface/60 px-4 py-2">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-ink-ghost">Status:</span>
                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${
                  currentSession.status === 'live'
                    ? 'bg-status-critical/10 text-status-critical border-status-critical/20'
                    : 'bg-neeti-elevated text-ink-secondary border-neeti-border'
                }`}>{currentSession.status}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-ghost">
                <span>Language:</span>
                <span className="font-mono text-ink-secondary">{language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${isCodeExpanded ? 'w-1/2' : 'w-1/3'} flex flex-col transition-all`}>
          <div className="border-b border-neeti-border bg-neeti-surface/60 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-bronze" />
                <span className="text-xs font-semibold text-ink-primary">Code Editor</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs bg-neeti-bg border border-neeti-border rounded-md px-2 py-1 text-ink-secondary focus:outline-none focus:border-bronze transition-colors"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div className="flex-1 p-3">
            <CodeEditor value={currentCode} onChange={setCurrentCode} language={language} sessionId={currentSession?.id || 0} />
          </div>

          <div className="border-t border-neeti-border bg-neeti-surface/60 px-4 py-2">
            <div className="flex items-center gap-4 text-[10px] text-ink-ghost">
              <span>Lines: <span className="font-mono text-ink-secondary">{currentCode.split('\n').length}</span></span>
              <span>Lang: <span className="font-mono text-ink-secondary">{language.toUpperCase()}</span></span>
            </div>
          </div>
        </div>
      </div>

      {showLeaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-panel max-w-md w-full mx-4 p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <AlertTriangle className="w-5 h-5 text-status-warning" />
              </div>
              <h2 className="text-lg font-display font-semibold text-ink-primary">Leave Interview?</h2>
            </div>
            <p className="text-sm text-ink-secondary">
              Your progress has been saved but the interview session will remain active.
            </p>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setShowLeaveDialog(false)}>Stay</Button>
              <Button variant="critical" className="flex-1" onClick={() => { setShowLeaveDialog(false); navigate('/dashboard'); }}>
                Leave Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
