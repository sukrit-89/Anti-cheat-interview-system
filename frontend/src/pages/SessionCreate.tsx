import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hash, Users, Brain, FileCheck } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';

const WORKFLOW_STEPS = [
  { icon: Hash,      text: 'Unique 6-character access code generated' },
  { icon: Users,     text: 'Candidate joins using the provided code' },
  { icon: Brain,     text: 'AI evaluation agents monitor in real-time' },
  { icon: FileCheck, text: 'Assessment report generated on completion' },
];

export const SessionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createSession, isLoading, error } = useSessionStore();

  const [formData, setFormData] = useState({ title: '', description: '', scheduled_at: '' });
  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await createSession({
        title: formData.title,
        description: formData.description || undefined,
        scheduled_at: formData.scheduled_at || undefined,
      });
      navigate(`/sessions/${session.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      <div className="ambient-orb ambient-orb-bronze w-[450px] h-[450px] top-[-10%] right-[10%] z-0 opacity-50" />
      <div className="ambient-orb ambient-orb-blue w-[350px] h-[350px] bottom-[20%] left-[-5%] z-0 opacity-35" />

      <header className="sticky top-0 z-30 glass-header">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-5">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-xs text-ink-ghost hover:text-ink-secondary transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <h1 className="text-xl font-display font-semibold text-ink-primary tracking-tight">
            Create Interview Session
          </h1>
          <p className="text-sm text-ink-tertiary mt-0.5">Configure a new technical evaluation</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        <div className="glass-medium p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg border border-status-critical/30 bg-status-critical/5 text-status-critical text-sm">
              {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <Input
              label="Session Title"
              placeholder="Senior Backend Developer Interview"
              value={formData.title}
              onChange={set('title')}
              helperText="Clear, descriptive title for organizational purposes"
              required
            />

            <Textarea
              label="Description"
              placeholder="Position requirements, candidate background, evaluation focus areas…"
              value={formData.description}
              onChange={set('description')}
              rows={4}
            />

            <Input
              label="Scheduled Time"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={set('scheduled_at')}
              helperText="Leave empty for immediate availability"
            />

            <div className="pt-6 border-t border-neeti-border">
              <div className="border-l-2 border-bronze/30 pl-5 mb-8">
                <h3 className="text-sm font-semibold text-ink-primary mb-3">Session Workflow</h3>
                <ul className="space-y-2.5">
                  {WORKFLOW_STEPS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                      <Icon className="w-4 h-4 text-bronze shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={isLoading || !formData.title}>
                  {isLoading ? 'Creating Session…' : 'Create Session'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
