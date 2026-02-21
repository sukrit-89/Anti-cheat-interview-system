import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity, Scale, Clock } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { useLiveMonitoring } from '../lib/websocket';
import { Button } from '../components/Button';
import { Card, MetricCard, EvidenceCard } from '../components/Card';

interface ActivityEvent {
  timestamp: string;
  type: 'coding' | 'speech' | 'vision' | 'flag';
  message: string;
  severity?: 'info' | 'warning' | 'critical';
}

export default function SessionMonitor() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession, endSession } = useSessionStore();
  const { metrics, flags = [], isConnected } = useLiveMonitoring(
    sessionId ? parseInt(sessionId) : null
  );

  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    if (sessionId) {
      fetchSession(parseInt(sessionId));
    }
  }, [sessionId, fetchSession]);

  useEffect(() => {
    if (metrics) {
      const getMetricMessage = (metric: { type: string; success?: boolean; language?: string; duration?: number; engagement?: number }) => {
        switch (metric.type) {
          case 'coding':
            return `Code execution: ${metric.success ? 'Success' : 'Error'} (${metric.language || 'Unknown'})`;
          case 'speech':
            return `Speech detected: ${metric.duration || 0}s of communication`;
          case 'vision':
            return `Engagement level: ${metric.engagement || 'Unknown'}%`;
          default:
            return 'Activity detected';
        }
      };

      const event: ActivityEvent = {
        timestamp: new Date().toISOString(),
        type: metrics.type as 'coding' | 'speech' | 'vision',
        message: getMetricMessage(metrics),
        severity: 'info',
      };
      setActivityLog((prev) => [event, ...prev].slice(0, 50));
    }
  }, [metrics]);

  useEffect(() => {
    if (flags && flags.length > 0) {
      const newEvents = flags.map((flag) => ({
        timestamp: flag.timestamp || new Date().toISOString(),
        type: 'flag' as const,
        message: flag.message,
        severity: flag.severity as 'info' | 'warning' | 'critical',
      }));
      setActivityLog((prev) => [...newEvents, ...prev].slice(0, 50));
    }
  }, [flags]);

  const handleEndSession = () => {
    if (confirm('Are you sure you want to end this session?')) {
      endSession(parseInt(sessionId!));
      navigate('/dashboard');
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
        <div className="text-verdict-text-secondary">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Verdict Header */}
      <header className="verdict-card border-b border-verdict-border-strong px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Scale className="w-5 h-5 text-accent-bronze" />
              <div>
                <h1 className="text-headline font-display text-verdict-text-primary">
                  Live Evaluation Monitor
                </h1>
                <p className="text-micro text-verdict-text-tertiary">
                  {currentSession.title} · Session {currentSession.join_code}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-semantic-success' : 'bg-semantic-critical'
                }`} />
              <span>{isConnected ? 'MONITORING' : 'CONNECTING'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/sessions/${sessionId}/results`)}
            >
              View Results
            </Button>

            <Button
              variant="critical"
              size="sm"
              onClick={handleEndSession}
            >
              End Session
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Monitoring Panel */}
        <div className="flex-1 flex flex-col">
          {/* Real-time Metrics */}
          <div className="p-6 border-b border-verdict-border">
            <h2 className="text-subheadline mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-accent-bronze" />
              Live Metrics
            </h2>

            <div className="grid-control">
              <div className="grid-control-3">
                <MetricCard
                  title="Code Quality"
                  value={metrics?.codeQuality || 0}
                  unit="/100"
                  status="success"
                  description="Algorithm efficiency"
                />
              </div>

              <div className="grid-control-3">
                <MetricCard
                  title="Communication"
                  value={metrics?.communication || 0}
                  unit="/100"
                  status="warning"
                  description="Speech clarity"
                />
              </div>

              <div className="grid-control-3">
                <MetricCard
                  title="Engagement"
                  value={metrics?.engagement || 0}
                  unit="/100"
                  status="critical"
                  description="Visual attention"
                />
              </div>

              <div className="grid-control-3">
                <MetricCard
                  title="Problem Solving"
                  value={metrics?.problemSolving || 0}
                  unit="/100"
                  status="success"
                  description="Logical reasoning"
                />
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-subheadline flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent-bronze" />
                Activity Timeline
              </h2>

              <div className="flex items-center space-x-4 text-micro text-verdict-text-secondary">
                <span>{activityLog.length} events</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivityLog([])}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="h-[calc(100%-3rem)] overflow-y-auto space-paragraph">
              {activityLog.length === 0 ? (
                <Card variant="evidence" className="text-center py-8">
                  <div className="space-y-3">
                    <Activity className="w-12 h-12 text-verdict-text-tertiary mx-auto" />
                    <p className="text-body text-verdict-text-secondary">
                      No activity detected yet. The evaluation will begin once the candidate starts.
                    </p>
                  </div>
                </Card>
              ) : (
                activityLog.map((event, index) => (
                  <div
                    key={`${event.timestamp}-${index}`}
                    className={`flex items-start space-x-4 p-4 rounded-sm border-l-4 ${event.severity === 'critical' ? 'border-semantic-critical bg-semantic-critical/5' :
                        event.severity === 'warning' ? 'border-semantic-warning bg-semantic-warning/5' :
                          'border-verdict-border bg-verdict-surface'
                      }`}
                  >
                    <div className="flex-shrink-0 w-20">
                      <div className="text-micro text-verdict-text-tertiary">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${event.type === 'coding' ? 'bg-blue-500' :
                            event.type === 'speech' ? 'bg-green-500' :
                              event.type === 'vision' ? 'bg-purple-500' :
                                'bg-red-500'
                          }`} />
                        <span className="text-micro font-medium text-verdict-text-secondary uppercase">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-body text-verdict-text-primary">
                        {event.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Flags Panel */}
        <div className="w-80 border-l border-verdict-border bg-verdict-surface">
          <div className="p-4 border-b border-verdict-border">
            <h3 className="text-subheadline flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-semantic-warning" />
              Active Flags
            </h3>
          </div>

          <div className="p-4 space-paragraph overflow-y-auto h-[calc(100%-4rem)]">
            {flags && flags.length > 0 ? (
              flags.map((flag, index) => (
                <EvidenceCard
                  key={index}
                  title={flag.type || 'System Flag'}
                  evidence={flag.message}
                  severity={flag.severity || 'warning'}
                  timestamp={flag.timestamp}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-verdict-text-tertiary mx-auto mb-3" />
                <p className="text-body text-verdict-text-secondary">
                  No flags detected. The evaluation is proceeding normally.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
