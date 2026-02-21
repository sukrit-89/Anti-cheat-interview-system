import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Mic, Eye, Brain } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';

const EXPECT_ITEMS = [
  { icon: Code2, text: 'Technical problem-solving assessment' },
  { icon: Mic,   text: 'Real-time communication analysis' },
  { icon: Eye,   text: 'Visual engagement monitoring' },
  { icon: Brain, text: 'AI-assisted reasoning evaluation' },
];

export const SessionJoin: React.FC = () => {
  const navigate = useNavigate();
  const { joinSession, isLoading, error, clearError } = useSessionStore();
  const [formData, setFormData] = useState({ session_code: '', email: '', full_name: '' });

  React.useEffect(() => () => clearError(), [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinSession({ session_code: formData.session_code.toUpperCase(), email: formData.email, full_name: formData.full_name });
      navigate('/interview');
    } catch {}
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, session_code: value }));
  };

  return (
    <div className="min-h-screen bg-neeti-bg grid grid-cols-1 lg:grid-cols-12">
      {/* ── Left panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:col-span-5 border-r border-white/[0.06] p-10 xl:p-14 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <Logo size="md" showWordmark />
          </div>

          <div className="space-y-5 max-w-sm">
            <p className="text-sm text-ink-secondary leading-relaxed">
              You've been invited to participate in a technical interview evaluation session.
            </p>

            <div className="border-l-2 border-bronze/30 pl-4">
              <p className="text-xs font-semibold text-ink-primary uppercase tracking-wider mb-3">What to expect</p>
              <ul className="space-y-2.5">
                {EXPECT_ITEMS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                    <Icon className="w-4 h-4 text-bronze shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-ghost">Candidate Portal</span>
      </div>

      {/* ── Right panel — form ─────────────────────── */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fadeUp">
          <h2 className="text-xl font-display font-semibold text-ink-primary tracking-tight mb-1">
            Join Interview Session
          </h2>
          <p className="text-sm text-ink-tertiary mb-8">
            Enter the 6-character code provided by your interviewer
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg border border-status-critical/30 bg-status-critical/5 text-status-critical text-sm">
              {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code input — special styling */}
            <div>
              <label className="block text-xs font-medium text-ink-ghost uppercase tracking-wider mb-2">
                Session Access Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 bg-neeti-surface border-2 border-neeti-border rounded-lg text-ink-primary placeholder:text-ink-ghost focus:outline-none focus:border-bronze transition-colors font-mono text-3xl text-center tracking-[0.5em] uppercase"
                placeholder="ABC123"
                value={formData.session_code}
                onChange={handleCodeChange}
                maxLength={6}
                required
              />
              <p className="mt-2 text-xs text-ink-ghost text-center">6-character alphanumeric code</p>
            </div>

            <div className="h-px bg-neeti-border" />

            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading || formData.session_code.length !== 6}>
              {isLoading ? 'Connecting…' : 'Join Session'}
            </Button>
          </form>

          <p className="mt-8 pt-6 border-t border-white/[0.06] text-[11px] text-ink-ghost text-center">
            By joining, you consent to AI-assisted evaluation and recording
          </p>
        </div>
      </div>
    </div>
  );
};
