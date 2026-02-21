import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Card, MetricCard } from '../components/Card';

function StatCard({ label, value, status }: {
  label: string;
  value: number;
  status?: 'live' | 'scheduled' | 'completed' | 'total'
}) {
  const statusConfig = {
    live: { color: 'text-semantic-critical', bg: 'bg-semantic-critical/10' },
    scheduled: { color: 'text-semantic-warning', bg: 'bg-semantic-warning/10' },
    completed: { color: 'text-semantic-success', bg: 'bg-semantic-success/10' },
    total: { color: 'text-accent-bronze', bg: 'bg-accent-bronze/10' }
  };

  const config = statusConfig[status || 'total'];

  return (
    <div className="bg-verdict-surface border border-verdict-border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-micro font-medium text-verdict-text-secondary uppercase tracking-wide">
            {label}
          </span>
          {status && (
            <div className={`w-2 h-2 rounded-full ${config.bg} ${config.color}`} />
          )}
        </div>
        <div className={`text-3xl font-mono font-semibold ${config.color}`}>
          {value.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sessions, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const stats = {
    total: sessions.length,
    live: sessions.filter(s => s.status === 'live').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
  };

  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-headline font-display text-verdict-text-primary mb-1">
              Evaluation Control Room
            </h1>
            <p className="text-caption text-verdict-text-tertiary">
              {user?.full_name} · {user?.role?.toUpperCase()}
            </p>
          </div>
          {user?.role === 'recruiter' && (
            <Button
              variant="primary"
              onClick={() => navigate('/sessions/create')}
              icon={<Plus className="w-4 h-4" />}
            >
              Schedule Interview
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12 space-editorial">
        {/* Control Panel Stats */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Session Overview</h2>
          <div className="grid-control">
            <div className="grid-control-3">
              <StatCard label="Total Sessions" value={stats.total} status="total" />
            </div>
            <div className="grid-control-3">
              <StatCard label="Live Now" value={stats.live} status="live" />
            </div>
            <div className="grid-control-3">
              <StatCard label="Scheduled" value={stats.scheduled} status="scheduled" />
            </div>
            <div className="grid-control-3">
              <StatCard label="Completed" value={stats.completed} status="completed" />
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="editorial-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-subheadline">Recent Sessions</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              View All
            </Button>
          </div>

          <div className="space-paragraph">
            {recentSessions.length === 0 ? (
              <Card variant="evidence" className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-verdict-border rounded-full mx-auto flex items-center justify-center">
                    <Clock className="w-8 h-8 text-verdict-text-tertiary" />
                  </div>
                  <div>
                    <h3 className="text-subheadline mb-2">No Sessions Yet</h3>
                    <p className="text-body text-verdict-text-secondary">
                      {user?.role === 'recruiter' 
                        ? 'Begin by scheduling your first technical interview session.'
                        : 'Join an interview session using the code provided by your recruiter.'}
                    </p>
                  </div>
                  {user?.role === 'recruiter' ? (
                    <Button
                      variant="primary"
                      onClick={() => navigate('/sessions/create')}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Schedule First Interview
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => navigate('/sessions/join')}
                      icon={<LogIn className="w-4 h-4" />}
                    >
                      Join Session
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              recentSessions.map((session) => (
                <Card
                  key={session.id}
                  variant="evidence"
                  className="interactive-authority cursor-pointer"
                  onClick={() => navigate(`/sessions/${session.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-subheadline font-semibold text-verdict-text-primary">
                        {session.title}
                      </h3>
                      <p className="text-body text-verdict-text-secondary">
                        {session.description}
                      </p>
                      <div className="flex items-center space-x-4 text-micro text-verdict-text-tertiary">
                        <span>Code: {session.join_code}</span>
                        <span>•</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`verdict-badge ${session.status === 'live' ? 'verdict-badge-critical' :
                        session.status === 'completed' ? 'verdict-badge-success' :
                          'verdict-badge-neutral'
                        }`}>
                        {session.status}
                      </span>
                      {session.status === 'live' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sessions/${session.id}/monitor`);
                          }}
                        >
                          Monitor
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Quick Actions</h2>
          <div className="grid-control">
            <div className="grid-control-4">
              <MetricCard
                title="Active Evaluations"
                value={stats.live}
                unit="sessions"
                status="critical"
                description="Currently in progress"
              />
            </div>
            <div className="grid-control-4">
              <MetricCard
                title="Pending Reviews"
                value={sessions.filter(s => s.status === 'completed' && !s.evaluation_completed).length}
                unit="sessions"
                status="warning"
                description="Awaiting final review"
              />
            </div>
            <div className="grid-control-4">
              <MetricCard
                title="Completion Rate"
                value={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
                unit="%"
                status="success"
                description="This month"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
