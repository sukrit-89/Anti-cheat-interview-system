import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';

export const SessionJoin: React.FC = () => {
  const navigate = useNavigate();
  const { joinSession, isLoading, error, clearError } = useSessionStore();

  const [formData, setFormData] = useState({
    session_code: '',
    email: '',
    full_name: '',
  });

  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await joinSession({
        session_code: formData.session_code.toUpperCase(),
        email: formData.email,
        full_name: formData.full_name,
      });
      navigate('/interview');
    } catch (err) {
      console.error('Failed to join session:', err);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setFormData({ ...formData, session_code: value });
  };

  return (
    <div className="min-h-screen bg-verdict-bg grid grid-cols-12">
      {/* Left Panel - Instructions */}
      <div className="col-span-5 border-r border-verdict-border p-12 flex flex-col justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-verdict-text-primary mb-4">
            Integrity AI
          </h1>
          <div className="space-y-6 text-verdict-text-secondary leading-relaxed max-w-md">
            <p>
              You have been invited to participate in a technical interview evaluation session.
            </p>
            <div className="border-l-2 border-verdict-line pl-4">
              <p className="text-sm font-medium text-verdict-text-primary mb-2">
                What to expect:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Technical problem-solving assessment</li>
                <li>• Real-time code evaluation</li>
                <li>• Communication and reasoning analysis</li>
                <li>• AI-assisted interview monitoring</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-xs text-verdict-text-tertiary">
          CANDIDATE PORTAL
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="col-span-7 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="font-serif text-2xl font-medium text-verdict-text-primary mb-2">
            Join Interview Session
          </h2>
          <p className="text-verdict-text-secondary text-sm mb-8">
            Enter the 6-character code provided by your interviewer
          </p>

          {error && (
            <div className="mb-6 p-4 border border-semantic-critical bg-semantic-critical/5 text-semantic-critical text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Code Input */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
                Session Access Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 bg-verdict-surface border-2 border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors font-mono text-3xl text-center tracking-[0.5em] uppercase"
                placeholder="ABC123"
                value={formData.session_code}
                onChange={handleCodeChange}
                maxLength={6}
                required
              />
              <p className="mt-2 text-xs text-verdict-text-tertiary text-center">
                6-character alphanumeric code
              </p>
            </div>

            <div className="h-px bg-verdict-border" />

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || formData.session_code.length !== 6}
            >
              {isLoading ? 'Connecting...' : 'Join Session'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-verdict-border">
            <p className="text-xs text-verdict-text-tertiary text-center">
              By joining, you consent to AI-assisted evaluation and recording
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
