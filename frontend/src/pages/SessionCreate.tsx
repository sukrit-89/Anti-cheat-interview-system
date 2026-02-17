import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';

export const SessionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createSession, isLoading, error } = useSessionStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sessionData = {
        title: formData.title,
        description: formData.description || undefined,
        scheduled_at: formData.scheduled_at || undefined,
      };

      const session = await createSession(sessionData);
      navigate(`/sessions/${session.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-verdict-text-secondary hover:text-verdict-text-primary mb-4 transition-colors"
          >
            ← Return to Dashboard
          </button>
          <h1 className="font-serif text-3xl font-semibold text-verdict-text-primary mb-2">
            Create Interview Session
          </h1>
          <p className="text-verdict-text-secondary">
            Configure a new technical evaluation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-verdict-surface border border-verdict-border p-8">
          {error && (
            <div className="mb-8 p-4 border border-semantic-critical bg-semantic-critical/5 text-semantic-critical text-sm">
              {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
                Session Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-verdict-bg border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="Senior Backend Developer Interview"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <p className="mt-2 text-xs text-verdict-text-tertiary">
                Clear, descriptive title for organizational purposes
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-verdict-bg border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors resize-none"
                rows={5}
                placeholder="Position requirements, candidate background, evaluation focus areas..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
                Scheduled Time (Optional)
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 bg-verdict-bg border border-verdict-border text-verdict-text-primary focus:outline-none focus:border-semantic-emphasis transition-colors"
                value={formData.scheduled_at}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_at: e.target.value })
                }
              />
              <p className="mt-2 text-xs text-verdict-text-tertiary">
                Leave empty for immediate availability
              </p>
            </div>

            <div className="pt-8 border-t border-verdict-border">
              <div className="border-l-2 border-verdict-line pl-6 mb-8">
                <h3 className="text-sm font-medium text-verdict-text-primary mb-3">
                  Session Workflow
                </h3>
                <ul className="space-y-2 text-sm text-verdict-text-secondary">
                  <li>• Unique 6-character access code will be generated</li>
                  <li>• Candidate joins using provided code</li>
                  <li>• AI evaluation agents monitor interview in real-time</li>
                  <li>• Comprehensive assessment report generated upon completion</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-6 border border-verdict-border bg-transparent text-verdict-text-primary hover:bg-verdict-surface transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.title}
                  className="flex-1 py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Session...' : 'Create Session'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
