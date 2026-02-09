import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSessionStore } from '../store/useSessionStore';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sessions, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const stats = {
    total: sessions.length,
    live: sessions.filter(s => s.status === 'LIVE').length,
    scheduled: sessions.filter(s => s.status === 'SCHEDULED').length,
    completed: sessions.filter(s => s.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-verdict-text-primary mb-1">
              Evaluation Dashboard
            </h1>
            <p className="text-sm text-verdict-text-tertiary">
              {user?.full_name} · {user?.role}
            </p>
          </div>
          <button
            onClick={() => navigate('/sessions/create')}
            className="px-6 py-2.5 bg-verdict-text-primary text-verdict-bg font-medium hover:bg-verdict-text-secondary transition-colors text-sm"
          >
            Schedule Interview
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-px bg-verdict-border mb-12">
          <StatCard label="Total Sessions" value={stats.total} />
          <StatCard label="Live Now" value={stats.live} status="live" />
          <StatCard label="Scheduled" value={stats.scheduled} />
          <StatCard label="Completed" value={stats.completed} />
        </div>

        {/* Session List */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-verdict-text-primary">
              Interview Sessions
            </h2>
            <p className="text-sm text-verdict-text-tertiary">
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
            </p>
          </div>

          <div className="space-y-px bg-verdict-border">
            {sessions.length === 0 ? (
              <div className="bg-verdict-surface p-12 text-center">
                <p className="text-verdict-text-secondary mb-4">No sessions scheduled</p>
                <button
                  onClick={() => navigate('/sessions/create')}
                  className="inline-block px-6 py-2 border border-verdict-line text-verdict-text-secondary hover:bg-verdict-bg hover:text-verdict-text-primary transition-colors text-sm"
                >
                  Schedule First Interview
                </button>
              </div>
            ) : (
              sessions.map((session) => (
                <SessionRow key={session.id} session={session} onClick={() => navigate(`/sessions/${session.id}`)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, status }: { label: string; value: number; status?: 'live' }) {
  return (
    <div className="bg-verdict-surface p-6">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-medium text-verdict-text-tertiary uppercase tracking-wide">
          {label}
        </span>
        {status === 'live' && value > 0 && (
          <span className="w-1.5 h-1.5 bg-semantic-success rounded-full"></span>
        )}
      </div>
      <p className="font-serif text-3xl font-semibold text-verdict-text-primary">
        {value}
      </p>
    </div>
  );
}

function SessionRow({ session, onClick }: { session: any; onClick: () => void }) {
  const statusColor = {
    SCHEDULED: 'text-verdict-text-tertiary',
    LIVE: 'text-semantic-success',
    COMPLETED: 'text-verdict-text-secondary',
  }[session.status] || 'text-verdict-text-tertiary';

  const statusLabel = {
    SCHEDULED: 'Scheduled',
    LIVE: 'Live',
    COMPLETED: 'Completed',
  }[session.status] || session.status;

  return (
    <button
      onClick={onClick}
      className="w-full bg-verdict-surface hover:bg-verdict-bg transition-colors text-left p-6 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-medium text-verdict-text-primary mb-2 group-hover:text-semantic-emphasis transition-colors">
            {session.title}
          </h3>
          {session.description && (
            <p className="text-sm text-verdict-text-tertiary line-clamp-1 mb-3">
              {session.description}
            </p>
          )}
          <div className="flex items-center gap-6 text-xs text-verdict-text-tertiary">
            <span>Code: {session.session_code}</span>
            <span>·</span>
            <span>{new Date(session.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="ml-6 text-right">
          <span className={`text-sm font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </button>
  );
}


    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            live: 'bg-green-500/20 text-green-400 border-green-500/30',
            completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return badges[status as keyof typeof badges] || badges.scheduled;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'live':
                return <Play className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Calendar className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen neural-bg">
            {/* Header */}
            <header className="glass-card border-b border-neural-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
                                <span className="text-lg font-bold text-neural-bg font-mono">I</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-mono text-gradient-cyan">
                                    Integrity AI
                                </h1>
                                <p className="text-xs text-neural-text-secondary">
                                    Recruiter Dashboard
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-accent-cyan" />
                                <span className="text-neural-text-primary">{user?.full_name}</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <div className="text-neural-text-secondary text-sm mb-2">
                            Total Sessions
                        </div>
                        <div className="text-3xl font-bold text-neural-text-primary">
                            {sessions.length}
                        </div>
                    </div>
                    <div className="glass-card p-6">
                        <div className="text-neural-text-secondary text-sm mb-2">Live Now</div>
                        <div className="text-3xl font-bold text-green-400">
                            {sessions.filter((s) => s.status === 'live').length}
                        </div>
                    </div>
                    <div className="glass-card p-6">
                        <div className="text-neural-text-secondary text-sm mb-2">Scheduled</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {sessions.filter((s) => s.status === 'scheduled').length}
                        </div>
                    </div>
                    <div className="glass-card p-6">
                        <div className="text-neural-text-secondary text-sm mb-2">Completed</div>
                        <div className="text-3xl font-bold text-gray-400">
                            {sessions.filter((s) => s.status === 'completed').length}
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <Button
                            variant={filter === undefined ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter(undefined)}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'scheduled' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('scheduled')}
                        >
                            Scheduled
                        </Button>
                        <Button
                            variant={filter === 'live' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('live')}
                        >
                            Live
                        </Button>
                        <Button
                            variant={filter === 'completed' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => navigate('/sessions/create')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Session
                    </Button>
                </div>

                {/* Sessions List */}
                <div className="glass-card">
                    <div className="p-6 border-b border-neural-border">
                        <h2 className="text-lg font-semibold text-neural-text-primary">
                            Interview Sessions
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-neural-text-secondary">
                            Loading sessions...
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-neural-text-secondary mb-4">
                                No sessions found
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/sessions/create')}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Session
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-neural-border">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/sessions/${session.id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-medium text-neural-text-primary">
                                                    {session.title}
                                                </h3>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                        session.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(session.status)}
                                                    {session.status}
                                                </span>
                                            </div>
                                            {session.description && (
                                                <p className="text-neural-text-secondary text-sm mb-3">
                                                    {session.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-6 text-sm text-neural-text-tertiary">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-medium text-accent-cyan">
                                                        {session.session_code}
                                                    </span>
                                                    <span>Session Code</span>
                                                </div>
                                                <div>
                                                    Created{' '}
                                                    {new Date(session.created_at).toLocaleDateString()}
                                                </div>
                                                {session.scheduled_at && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(
                                                            session.scheduled_at
                                                        ).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="secondary" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
