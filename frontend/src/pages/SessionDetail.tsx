import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';

export const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession, startSession, endSession, isLoading } = useSessionStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSession(Number(id));
    }
  }, [id, fetchSession]);

  const copySessionCode = () => {
    if (currentSession) {
      navigator.clipboard.writeText(currentSession.session_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartSession = async () => {
    if (currentSession) {
      try {
        await startSession(currentSession.id);
      } catch (err) {
        console.error('Failed to start session:', err);
      }
    }
  };

  const handleEndSession = async () => {
    if (currentSession && confirm('Terminate this session?')) {
      try {
        await endSession(currentSession.id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to end session:', err);
      }
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
        <div className="text-verdict-text-tertiary">Loading session...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-semantic-success';
      case 'completed':
        return 'bg-verdict-line';
      case 'cancelled':
        return 'bg-semantic-critical';
      default:
        return 'bg-semantic-warning';
    }
  };

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-verdict-text-secondary hover:text-verdict-text-primary mb-4 transition-colors"
          >
            ← Return to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-verdict-text-primary mb-2">
                {currentSession.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(currentSession.status)}`} />
                <span className="text-sm text-verdict-text-secondary uppercase tracking-wide">
                  {currentSession.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-8">
            {/* Access Code */}
            <section className="border border-verdict-border bg-verdict-surface p-8">
              <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6">
                Session Access Code
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-verdict-bg border-2 border-verdict-line p-8 text-center">
                  <div className="text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3">
                    Candidate Join Code
                  </div>
                  <div className="font-mono text-5xl text-verdict-text-primary tracking-[0.3em]">
                    {currentSession.session_code}
                  </div>
                </div>
                <button
                  onClick={copySessionCode}
                  className="px-6 py-3 border border-verdict-border hover:bg-verdict-surface transition-colors text-sm font-medium"
                >
                  {copied ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>
              <div className="mt-4 border-l-2 border-verdict-line pl-4 text-xs text-verdict-text-tertiary">
                Join URL: {window.location.origin}/join
              </div>
            </section>

            {/* Description */}
            {currentSession.description && (
              <section className="border border-verdict-border bg-verdict-surface p-8">
                <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-4">
                  Session Details
                </h2>
                <p className="text-verdict-text-secondary leading-relaxed">
                  {currentSession.description}
                </p>
              </section>
            )}

            {/* Timeline */}
            <section className="border border-verdict-border bg-verdict-surface p-8">
              <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6">
                Session Timeline
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-xs">
                  <div className="text-verdict-text-tertiary uppercase tracking-wide">Event</div>
                  <div className="col-span-2 text-verdict-text-tertiary uppercase tracking-wide">Timestamp</div>
                </div>
                <div className="h-px bg-verdict-border" />
                <div className="grid grid-cols-3 text-sm">
                  <div className="text-verdict-text-secondary">Created</div>
                  <div className="col-span-2 font-mono text-verdict-text-primary">
                    {new Date(currentSession.created_at).toLocaleString()}
                  </div>
                </div>
                {currentSession.scheduled_at && (
                  <div className="grid grid-cols-3 text-sm">
                    <div className="text-verdict-text-secondary">Scheduled</div>
                    <div className="col-span-2 font-mono text-verdict-text-primary">
                      {new Date(currentSession.scheduled_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentSession.started_at && (
                  <div className="grid grid-cols-3 text-sm">
                    <div className="text-verdict-text-secondary">Started</div>
                    <div className="col-span-2 font-mono text-verdict-text-primary">
                      {new Date(currentSession.started_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentSession.ended_at && (
                  <div className="grid grid-cols-3 text-sm">
                    <div className="text-verdict-text-secondary">Ended</div>
                    <div className="col-span-2 font-mono text-verdict-text-primary">
                      {new Date(currentSession.ended_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="space-y-8">
            {/* Actions */}
            <section className="border border-verdict-border bg-verdict-surface p-6">
              <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6">
                Controls
              </h2>
              <div className="space-y-3">
                {currentSession.status === 'scheduled' && (
                  <button
                    className="w-full py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium disabled:opacity-50"
                    onClick={handleStartSession}
                    disabled={isLoading}
                  >
                    Start Session
                  </button>
                )}
                {currentSession.status === 'live' && (
                  <>
                    <button
                      className="w-full py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium"
                      onClick={() => navigate(`/sessions/${currentSession.id}/interview`)}
                    >
                      Enter Interview Room
                    </button>
                    <button
                      className="w-full py-3 px-6 border border-verdict-border hover:bg-verdict-bg transition-colors font-medium text-verdict-text-primary"
                      onClick={() => navigate(`/sessions/${currentSession.id}/monitor`)}
                    >
                      Live Monitor
                    </button>
                    <button
                      className="w-full py-3 px-6 border border-semantic-critical text-semantic-critical hover:bg-semantic-critical hover:text-white transition-colors font-medium disabled:opacity-50"
                      onClick={handleEndSession}
                      disabled={isLoading}
                    >
                      End Session
                    </button>
                  </>
                )}
                {currentSession.status === 'completed' && (
                  <button
                    className="w-full py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium"
                    onClick={() => navigate(`/sessions/${currentSession.id}/results`)}
                  >
                    View Evaluation Report
                  </button>
                )}
              </div>
            </section>

            {/* AI Agents */}
            <section className="border border-verdict-border bg-verdict-surface p-6">
              <h2 className="font-serif text-lg font-medium text-verdict-text-primary mb-6">
                AI Evaluation Agents
              </h2>
              <div className="space-y-3">
                {[
                  'Code Execution',
                  'Speech Analysis',
                  'Vision Detection',
                  'Reasoning Assessment',
                  'Final Evaluation',
                ].map((agent) => (
                  <div key={agent} className="flex items-center justify-between text-sm">
                    <span className="text-verdict-text-secondary">{agent}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                      <span className="text-xs text-verdict-text-tertiary uppercase tracking-wide">
                        Ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
