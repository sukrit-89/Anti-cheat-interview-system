import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, LogIn, BarChart3, Radio, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Card, MetricCard } from '../components/Card';
import { Logo } from '../components/Logo';
// StatusIndicator available if needed for future enhancements

/* ── stat card config ─────────────────────────────────── */
const STATUS_CFG = {
  live:      { color: 'text-status-critical', icon: Radio },
  scheduled: { color: 'text-status-warning',  icon: CalendarClock },
  completed: { color: 'text-status-success',  icon: CheckCircle2 },
  total:     { color: 'text-bronze',           icon: BarChart3 },
} as const;

function StatCard({ label, value, status = 'total' }: {
  label: string; value: number; status?: keyof typeof STATUS_CFG;
}) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <div className="glass-subtle p-6 hover:bg-white/[0.06] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-ink-tertiary uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${cfg.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      </div>
      <div className={`text-3xl font-mono font-bold ${cfg.color}`}>
        {value.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

/* ── badge helper ─────────────────────────────────────── */
const badgeClass = (s: string) =>
  s === 'live'      ? 'bg-status-critical/10 text-status-critical border-status-critical/20' :
  s === 'completed' ? 'bg-status-success/10 text-status-success border-status-success/20' :
                      'bg-neeti-elevated text-ink-secondary border-neeti-border';

/* ═══════════════════════════════════════════════════════ */
export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sessions, fetchSessions } = useSessionStore();

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const stats = {
    total:     sessions.length,
    live:      sessions.filter(s => s.status === 'live').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
  };

  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="min-h-screen bg-neeti-bg">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" linkTo="/" />
            <div>
              <h1 className="text-xl font-display font-semibold text-ink-primary tracking-tight">
                Control Room
              </h1>
              <p className="text-xs text-ink-ghost mt-0.5">
                {user?.full_name} · <span className="uppercase">{user?.role}</span>
              </p>
            </div>
          </div>
          {user?.role === 'recruiter' && (
            <Button variant="primary" onClick={() => navigate('/sessions/create')} icon={<Plus className="w-4 h-4" />}>
              Schedule Interview
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-12">
        {/* ── Stats Grid ───────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">
            Session Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total"     value={stats.total}     status="total" />
            <StatCard label="Live Now"  value={stats.live}      status="live" />
            <StatCard label="Scheduled" value={stats.scheduled} status="scheduled" />
            <StatCard label="Completed" value={stats.completed} status="completed" />
          </div>
        </section>

        {/* ── Recent Sessions ──────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider">
              Recent Sessions
            </h2>
          </div>

          <div className="space-y-3">
            {recentSessions.length === 0 ? (
              <Card className="text-center py-14">
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-full bg-neeti-elevated mx-auto flex items-center justify-center">
                    <Clock className="w-7 h-7 text-ink-ghost" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-primary mb-1">No Sessions Yet</h3>
                    <p className="text-sm text-ink-secondary max-w-xs mx-auto">
                      {user?.role === 'recruiter'
                        ? 'Begin by scheduling your first technical interview session.'
                        : 'Join an interview session using the code provided by your recruiter.'}
                    </p>
                  </div>
                  {user?.role === 'recruiter' ? (
                    <Button variant="primary" onClick={() => navigate('/sessions/create')} icon={<Plus className="w-4 h-4" />}>
                      Schedule First Interview
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => navigate('/sessions/join')} icon={<LogIn className="w-4 h-4" />}>
                      Join Session
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              recentSessions.map((session) => (
                <Card
                  key={session.id}
                  interactive
                  className="cursor-pointer"
                  onClick={() => navigate(`/sessions/${session.id}`)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="text-base font-semibold text-ink-primary truncate">
                        {session.title}
                      </h3>
                      {session.description && (
                        <p className="text-sm text-ink-secondary line-clamp-1">{session.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-ink-ghost">
                        <span className="font-mono">Code: {session.join_code}</span>
                        <span className="text-neeti-border">·</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeClass(session.status)}`}>
                        {session.status}
                      </span>
                      {session.status === 'live' && (
                        <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/sessions/${session.id}/monitor`); }}>
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

        {/* ── Quick Metrics ────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-5">
            Quick Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Active Evaluations"
              value={stats.live}
              unit="sessions"
              status="critical"
              description="Currently in progress"
            />
            <MetricCard
              title="Pending Reviews"
              value={sessions.filter(s => s.status === 'completed' && !s.evaluation_completed).length}
              unit="sessions"
              status="warning"
              description="Awaiting final review"
            />
            <MetricCard
              title="Completion Rate"
              value={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
              unit="%"
              status="success"
              description="This month"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
