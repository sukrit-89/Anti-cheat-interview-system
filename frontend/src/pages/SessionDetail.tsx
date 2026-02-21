import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Play, MonitorPlay, BarChart3, XCircle, Cpu } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusIndicator } from '../components/StatusIndicator';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'critical' | 'info'> = {
  live: 'success', completed: 'info', cancelled: 'critical', scheduled: 'warning',
};

const AI_AGENTS = [
  'Code Execution', 'Speech Analysis', 'Vision Detection', 'Reasoning Assessment', 'Final Evaluation',
];

export const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession, startSession, endSession, isLoading } = useSessionStore();
  const [copied, setCopied] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);

  useEffect(() => { if (id) fetchSession(Number(id)); }, [id, fetchSession]);

  const copyCode = () => {
    if (!currentSession) return;
    navigator.clipboard.writeText(currentSession.session_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => { if (currentSession) try { await startSession(currentSession.id); } catch {} };

  const confirmEnd = async () => {
    if (currentSession) try { await endSession(currentSession.id); setShowEndDialog(false); navigate('/dashboard'); } catch {}
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-neeti-bg flex items-center justify-center">
        <p className="text-ink-ghost text-sm">Loading session…</p>
      </div>
    );
  }

  const s = currentSession;
  const statusColor = STATUS_MAP[s.status] ?? 'warning';

  /* timeline rows */
  const timeline = [
    { label: 'Created',   ts: s.created_at },
    { label: 'Scheduled', ts: s.scheduled_at },
    { label: 'Started',   ts: s.started_at },
    { label: 'Ended',     ts: s.ended_at },
  ].filter(r => r.ts);

  return (
    <div className="min-h-screen bg-neeti-bg">
      {/* ── Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-xs text-ink-ghost hover:text-ink-secondary transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-semibold text-ink-primary tracking-tight">{s.title}</h1>
              <div className="flex items-center gap-2.5 mt-1">
                <StatusIndicator status={statusColor} size="sm" />
                <span className="text-xs text-ink-tertiary uppercase tracking-wider">{s.status}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: 2 col ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Access Code */}
            <Card>
              <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">
                Session Access Code
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex-1 bg-neeti-bg border-2 border-neeti-border rounded-lg p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-ink-ghost mb-2">Candidate Join Code</p>
                  <p className="font-mono text-4xl md:text-5xl text-ink-primary tracking-[0.3em] select-all">
                    {s.session_code}
                  </p>
                </div>
                <Button variant="secondary" onClick={copyCode} icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} className="sm:self-center">
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="mt-3 text-xs text-ink-ghost border-l-2 border-neeti-border pl-3">
                Join URL: {window.location.origin}/join
              </p>
            </Card>

            {/* Description */}
            {s.description && (
              <Card>
                <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-3">Details</h2>
                <p className="text-sm text-ink-secondary leading-relaxed">{s.description}</p>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">Timeline</h2>
              <div className="divide-y divide-neeti-border">
                {timeline.map(({ label, ts }) => (
                  <div key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-sm text-ink-tertiary">{label}</span>
                    <span className="font-mono text-sm text-ink-primary">{new Date(ts!).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Right sidebar ────────────────────────── */}
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">Controls</h2>
              <div className="space-y-3">
                {s.status === 'scheduled' && (
                  <Button variant="primary" className="w-full" onClick={handleStart} disabled={isLoading} icon={<Play className="w-4 h-4" />}>
                    Start Session
                  </Button>
                )}
                {s.status === 'live' && (
                  <>
                    <Button variant="primary" className="w-full" onClick={() => navigate(`/sessions/${s.id}/interview`)} icon={<MonitorPlay className="w-4 h-4" />}>
                      Enter Interview Room
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={() => navigate(`/sessions/${s.id}/monitor`)} icon={<BarChart3 className="w-4 h-4" />}>
                      Live Monitor
                    </Button>
                    <Button variant="critical" className="w-full" onClick={() => setShowEndDialog(true)} disabled={isLoading} icon={<XCircle className="w-4 h-4" />}>
                      End Session
                    </Button>
                  </>
                )}
                {s.status === 'completed' && (
                  <Button variant="primary" className="w-full" onClick={() => navigate(`/sessions/${s.id}/results`)}>
                    View Evaluation Report
                  </Button>
                )}
              </div>
            </Card>

            {/* AI Agents */}
            <Card>
              <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">AI Agents</h2>
              <div className="space-y-3">
                {AI_AGENTS.map(agent => (
                  <div key={agent} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-ink-ghost" />
                      <span className="text-sm text-ink-secondary">{agent}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusIndicator status="success" size="sm" />
                      <span className="text-[10px] text-ink-ghost uppercase tracking-wider">Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* ── End-session dialog ─────────────────────── */}
      {showEndDialog && (
        <div className="dialog-overlay">
          <div className="dialog-panel max-w-md w-full mx-4 p-7 space-y-5">
            <h2 className="text-lg font-display font-semibold text-ink-primary">End Session?</h2>
            <p className="text-sm text-ink-secondary">
              This will terminate the interview and trigger AI evaluation. This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setShowEndDialog(false)}>Cancel</Button>
              <Button variant="critical" className="flex-1" onClick={confirmEnd}>End Session</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
