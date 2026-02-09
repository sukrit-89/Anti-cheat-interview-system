/**
 * Session Create Page - Create a new interview session
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen neural-bg">
            {/* Header */}
            <header className="glass-card border-b border-neural-border">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-neural-text-primary">
                                Create Interview Session
                            </h1>
                            <p className="text-xs text-neural-text-secondary">
                                Set up a new technical interview
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="glass-card p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                type="text"
                                label="Session Title"
                                placeholder="e.g., Senior Backend Developer Interview"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />
                            <p className="mt-2 text-sm text-neural-text-secondary">
                                A clear title helps you organize your interviews
                            </p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-neural-text-primary">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-neural-surface border border-neural-border rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-neural-text-primary placeholder:text-neural-text-tertiary resize-none"
                                rows={4}
                                placeholder="Describe the role, requirements, or any specific instructions for the candidate..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Input
                                type="datetime-local"
                                label="Schedule Date & Time (Optional)"
                                value={formData.scheduled_at}
                                onChange={(e) =>
                                    setFormData({ ...formData, scheduled_at: e.target.value })
                                }
                            />
                            <p className="mt-2 text-sm text-neural-text-secondary">
                                Leave empty for immediate sessions
                            </p>
                        </div>

                        <div className="pt-6 border-t border-neural-border">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                                <h3 className="text-sm font-medium text-blue-400 mb-2">
                                    What happens next?
                                </h3>
                                <ul className="space-y-1 text-sm text-neural-text-secondary">
                                    <li>• A unique 6-character session code will be generated</li>
                                    <li>• Share the code with your candidate to join</li>
                                    <li>• AI agents will evaluate the interview in real-time</li>
                                    <li>• You'll receive a comprehensive report after completion</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading || !formData.title}
                                    className="flex-1"
                                >
                                    {isLoading ? 'Creating...' : 'Create Session'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
