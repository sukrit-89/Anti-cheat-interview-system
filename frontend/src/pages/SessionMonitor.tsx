import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity, Clock } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { useLiveMonitoring } from '../lib/websocket';
import { Button } from '../components/Button';
import { Card, MetricCard, EvidenceCard } from '../components/Card';
import { StatusIndicator } from '../components/StatusIndicator';
import { Logo } from '../components/Logo';

interface ActivityEvent {
  timestamp: string;
  type: 'coding' | 'speech' | 'vision' | 'flag';
  message: string;
  severity?: 'info' | 'warning' | 'critical';
}

const TYPE_DOT: Record<string, string> = {
  coding: 'bg-status-info', speech: 'bg-status-success', vision: 'bg-bronze', flag: 'bg-status-critical',
};

export default function SessionMonitor() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession, endSession } = useSessionStore();
  const { metrics, flags = [], isConnected } = useLiveMonitoring(sessionId ? parseInt(sessionId) : null);

  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [showEndDialog, setShowEndDialog] = useState(false);

  useEffect(() => { if (sessionId) fetchSession(parseInt(sessionId)); }, [sessionId, fetchSession]);

  useEffect(() => {
    if (!metrics) return;
    const msg = (() => {
      switch (metrics.type) {
        case 'coding':  return `Code execution: ${metrics.success ? 'Success' : 'Error'} (${metrics.language || 'Unknown'})`;
        case 'speech':  return `Speech detected: ${metrics.duration || 0}s of communication`;
        case 'vision':  return `Engagement level: ${metrics.engagement || 'Unknown'}%`;
        default:        return 'Activity detected';
      }
    })();
    setActivityLog(prev => [{ timestamp: new Date().toISOString(), type: metrics.type as ActivityEvent['type'], message: msg, severity: 'info' as const }, ...prev].slice(0, 50));
  }, [metrics]);

  useEffect(() => {
    if (flags?.length) {
      const events = flags.map(f => ({
        timestamp: f.timestamp || new Date().toISOString(),
        type: 'flag' as const,
        message: f.message,
        severity: f.severity as 'info' | 'warning' | 'critical',
      }));
      setActivityLog(prev => [...events, ...prev].slice(0, 50));
    }
  }, [flags]);

  const confirmEnd = () => { endSession(parseInt(sessionId!)); setShowEndDialog(false); navigate('/dashboard'); };

  if (!currentSession) {
    return <div className="min-h-screen bg-neeti-bg flex items-center justify-center"><p className="text-ink-ghost text-sm">Loading session…</p></div>;
  }

  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      <div className="ambient-orb ambient-orb-bronze w-[450px] h-[450px] top-[-10%] left-[10%] z-0 opacity-50" />
      <div className="ambient-orb ambient-orb-blue w-[350px] h-[350px] bottom-[20%] right-[-3%] z-0 opacity-35" />

      <header className="sticky top-0 z-30 glass-header px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" linkTo="/" />
              <div>
                <h1 className="text-sm font-display font-semibold text-ink-primary">Live Evaluation Monitor</h1>
                <p className="text-[10px] text-ink-ghost">{currentSession.title} · {currentSession.join_code}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <StatusIndicator status={isConnected ? 'success' : 'critical'} size="sm" />
              <span className="text-[10px] uppercase tracking-wider text-ink-ghost">
                {isConnected ? 'Monitoring' : 'Connecting'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/sessions/${sessionId}/results`)}>View Results</Button>
            <Button variant="critical" size="sm" onClick={() => setShowEndDialog(true)}>End Session</Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-neeti-border">
            <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-bronze" /> Live Metrics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard title="Code Quality"    value={metrics?.codeQuality    || 0} unit="/100" status="success" description="Algorithm efficiency" />
              <MetricCard title="Communication"   value={metrics?.communication  || 0} unit="/100" status="warning" description="Speech clarity" />
              <MetricCard title="Engagement"      value={metrics?.engagement     || 0} unit="/100" status="critical" description="Visual attention" />
              <MetricCard title="Problem Solving" value={metrics?.problemSolving || 0} unit="/100" status="success" description="Logical reasoning" />
            </div>
          </div>

          <div className="flex-1 p-5 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-bronze" /> Activity Timeline
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-ink-ghost">
                <span>{activityLog.length} events</span>
                <Button variant="ghost" size="sm" onClick={() => setActivityLog([])}>Clear</Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activityLog.length === 0 ? (
                <Card className="text-center py-10">
                  <Activity className="w-10 h-10 text-ink-ghost mx-auto mb-3" />
                  <p className="text-sm text-ink-secondary">No activity yet. Waiting for candidate…</p>
                </Card>
              ) : (
                activityLog.map((ev, i) => (
                  <div
                    key={`${ev.timestamp}-${i}`}
                    className={`flex items-start gap-3 p-3 rounded-lg border-l-[3px] ${
                      ev.severity === 'critical' ? 'border-status-critical bg-status-critical/5' :
                      ev.severity === 'warning'  ? 'border-status-warning bg-status-warning/5' :
                                                   'border-neeti-border bg-neeti-surface'
                    }`}
                  >
                    <span className="text-[10px] text-ink-ghost font-mono w-16 shrink-0 pt-0.5">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[ev.type] || 'bg-ink-ghost'}`} />
                        <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">{ev.type}</span>
                      </div>
                      <p className="text-sm text-ink-primary">{ev.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-72 border-l border-white/[0.06] bg-neeti-surface/60 backdrop-blur-md flex flex-col">
          <div className="px-4 py-3 border-b border-neeti-border">
            <h3 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-status-warning" /> Active Flags
            </h3>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {flags?.length ? (
              flags.map((flag, i) => (
                <EvidenceCard key={i} title={flag.type || 'System Flag'} evidence={flag.message} severity={flag.severity || 'warning'} timestamp={flag.timestamp} />
              ))
            ) : (
              <div className="text-center py-10">
                <AlertTriangle className="w-8 h-8 text-ink-ghost mx-auto mb-2" />
                <p className="text-xs text-ink-secondary">No flags detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEndDialog && (
        <div className="dialog-overlay">
          <div className="dialog-panel max-w-md w-full mx-4 p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-critical/10">
                <AlertTriangle className="w-5 h-5 text-status-critical" />
              </div>
              <h3 className="text-lg font-display font-semibold text-ink-primary">End Session</h3>
            </div>
            <p className="text-sm text-ink-secondary">
              Are you sure? The candidate will be disconnected and this cannot be undone.
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
}