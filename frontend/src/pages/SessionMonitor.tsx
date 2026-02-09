import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { useLiveMonitoring } from '../lib/websocket';

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
  const { metrics, flags, isConnected } = useLiveMonitoring(
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

  const getMetricMessage = (metric: any): string => {
    switch (metric.type) {
      case 'coding':
        return `Code modified (${metric.language || 'Unknown'})`;
      case 'speech':
        return metric.text?.substring(0, 60) || 'Speech detected';
      case 'vision':
        return 'Visual analysis update';
      default:
        return 'Activity detected';
    }
  };

  const handleEndSession = async () => {
    if (sessionId && confirm('Terminate this evaluation session?')) {
      await endSession(parseInt(sessionId));
      navigate('/dashboard');
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
        <div className="text-verdict-text-tertiary">Loading session data...</div>
      </div>
    );
  }

  const metricValue = (key: string) => {
    return metrics?.[key] ?? '—';
  };

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-verdict-text-primary mb-2">
                Live Evaluation Monitor
              </h1>
              <div className="flex items-center gap-4 text-sm text-verdict-text-tertiary">
                <span className="font-mono">{currentSession.title}</span>
                <span>·</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-semantic-success' : 'bg-semantic-critical'}`}></span>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEndSession}
              className="px-5 py-2 border border-semantic-critical text-semantic-critical hover:bg-semantic-critical hover:text-white transition-colors text-sm font-medium"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-px bg-verdict-border mb-8">
          <MetricCard label="Code Quality" value={metricValue('coding_score')} />
          <MetricCard label="Communication" value={metricValue('speech_clarity')} />
          <MetricCard label="Engagement" value={metricValue('engagement_score')} />
          <MetricCard label="Integrity" value={metricValue('ai_confidence')} />
        </div>

        {/* Main Panel */}
        <div className="grid grid-cols-3 gap-px bg-verdict-border">
          {/* Flags */}
          <div className="bg-verdict-surface p-6">
            <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6 border-b border-verdict-border pb-3">
              Active Flags
            </h2>
            <div className="space-y-3">
              {!flags || flags.length === 0 ? (
                <div className="text-sm text-verdict-text-tertiary italic">
                  No flags raised
                </div>
              ) : (
                flags.map((flag, index) => (
                  <FlagAlert key={index} flag={flag} />
                ))
              )}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="col-span-2 bg-verdict-surface p-6">
            <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6 border-b border-verdict-border pb-3">
              Event Timeline
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {activityLog.length === 0 ? (
                <div className="text-sm text-verdict-text-tertiary italic py-12 text-center">
                  Awaiting activity...
                </div>
              ) : (
                activityLog.map((event, index) => (
                  <ActivityRow key={index} event={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: any }) {
  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
  
  return (
    <div className="bg-verdict-surface p-6">
      <div className="text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
        {label}
      </div>
      <div className="font-mono text-2xl text-verdict-text-primary">
        {displayValue}
      </div>
    </div>
  );
}

function FlagAlert({ flag }: { flag: any }) {
  const severityColor = {
    critical: 'border-semantic-critical text-semantic-critical',
    warning: 'border-semantic-warning text-semantic-warning',
    info: 'border-verdict-line text-verdict-text-secondary',
  }[flag.severity] || 'border-verdict-line text-verdict-text-secondary';

  return (
    <div className={`border-l-2 pl-3 py-2 ${severityColor}`}>
      <p className="text-xs font-medium mb-1">{flag.type}</p>
      <p className="text-xs opacity-90">{flag.message}</p>
      <p className="text-xs opacity-60 mt-1 font-mono">
        {flag.timestamp ? new Date(flag.timestamp).toLocaleTimeString() : 'Now'}
      </p>
    </div>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const severityStyle = {
    critical: 'border-semantic-critical/30 bg-semantic-critical/5',
    warning: 'border-semantic-warning/30 bg-semantic-warning/5',
    info: 'border-verdict-border bg-verdict-bg/50',
  }[event.severity || 'info'];

  const typeLabel = {
    coding: 'CODE',
    speech: 'SPEECH',
    vision: 'VISION',
    flag: 'FLAG',
  }[event.type];

  return (
    <div className={`border ${severityStyle} p-3 text-xs`}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-mono text-verdict-text-tertiary">{typeLabel}</span>
        <span className="font-mono text-verdict-text-tertiary opacity-60">
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-verdict-text-secondary">{event.message}</p>
    </div>
  );
}


interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

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
  const { metrics, flags, isConnected } = useLiveMonitoring(
    sessionId ? parseInt(sessionId) : null
  );

  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    if (sessionId) {
      fetchSession(parseInt(sessionId));
    }
  }, [sessionId, fetchSession]);

  // Update activity log when new metrics or flags arrive
  useEffect(() => {
    if (metrics) {
      const event: ActivityEvent = {
        timestamp: new Date().toISOString(),
        type: metrics.type as 'coding' | 'speech' | 'vision',
        message: getMetricMessage(metrics),
        severity: 'info',
      };
      setActivityLog((prev) => [event, ...prev].slice(0, 50)); // Keep last 50 events
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

  const getMetricMessage = (metric: any): string => {
    switch (metric.type) {
      case 'coding':
        return `Code changed: ${metric.language || 'Unknown'} (${
          metric.lines_changed || 0
        } lines)`;
      case 'speech':
        return `Speech detected: "${metric.text?.substring(0, 50) || ''}${
          metric.text?.length > 50 ? '...' : ''
        }"`;
      case 'vision':
        return `Vision metric: ${metric.metric_type || 'engagement'}`;
      default:
        return 'Activity detected';
    }
  };

  const handleEndSession = async () => {
    if (sessionId && confirm('Are you sure you want to end this session?')) {
      await endSession(parseInt(sessionId));
      navigate('/dashboard');
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  // Compute metric cards from latest metrics
  const metricCards: MetricCard[] = [
    {
      title: 'Coding Quality',
      value: metrics?.coding_score || 'N/A',
      icon: <Code className="w-6 h-6" />,
      trend: 'neutral',
      color: 'blue',
    },
    {
      title: 'Speech Clarity',
      value: metrics?.speech_clarity || 'N/A',
      icon: <Mic className="w-6 h-6" />,
      trend: 'neutral',
      color: 'green',
    },
    {
      title: 'Engagement',
      value: metrics?.engagement_score || 'N/A',
      icon: <Eye className="w-6 h-6" />,
      trend: 'neutral',
      color: 'purple',
    },
    {
      title: 'AI Analysis',
      value: metrics?.ai_confidence || 'N/A',
      icon: <Brain className="w-6 h-6" />,
      trend: 'neutral',
      color: 'indigo',
    },
  ];

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getSeverityColor = (severity?: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return <Code className="w-4 h-4" />;
      case 'speech':
        return <Mic className="w-4 h-4" />;
      case 'vision':
        return <Video className="w-4 h-4" />;
      case 'flag':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Live Monitoring: {currentSession.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Started:{' '}
                  {currentSession.started_at
                    ? new Date(currentSession.started_at).toLocaleTimeString()
                    : 'Not started'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleEndSession}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100 text-${card.color}-600`}>
                  {card.icon}
                </div>
                {getTrendIcon(card.trend)}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Flags + Activity Log */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Flags */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">Active Flags</h2>
          </div>
          <div className="space-y-3">
            {!flags || flags.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">No flags detected</span>
              </div>
            ) : (
              flags.map((flag, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getSeverityColor(
                    flag.severity as 'info' | 'warning' | 'critical'
                  )}`}
                >
                  <p className="font-medium text-sm mb-1">{flag.type}</p>
                  <p className="text-xs">{flag.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {flag.timestamp
                      ? new Date(flag.timestamp).toLocaleTimeString()
                      : 'Just now'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Waiting for activity...
              </p>
            ) : (
              activityLog.map((event, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(
                    event.severity
                  )}`}
                >
                  <div className="mt-0.5">{getActivityIcon(event.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
