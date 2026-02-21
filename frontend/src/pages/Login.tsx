import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { extractErrorMessage } from '../lib/errorUtils';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Authentication failed'));
    }
  };

  return (
    <div className="min-h-screen bg-neeti-bg flex">
      {/* ── Auth panel ────────────────────────────────── */}
      <div className="w-full lg:w-[44%] border-r border-white/[0.06] flex flex-col justify-center px-8 py-12 lg:px-14">
        <div className="max-w-md mx-auto w-full space-y-10">
          {/* Brand */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-5">
              <Logo size="xl" showWordmark />
            </div>
            <p className="text-sm text-ink-secondary">
              Enterprise technical interview evaluation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {error && (
              <div className="border-l-4 border-status-critical bg-status-critical/5 p-3 rounded-r-md">
                <p className="text-sm text-status-critical">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-6 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-xs text-ink-ghost">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">Secure Authentication</span>
            </div>
            <p className="text-xs text-ink-ghost leading-relaxed">
              All access is logged and monitored. This system is for authorized
              personnel only.
            </p>
          </div>
        </div>
      </div>

      {/* ── Evidence panel ────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-1 bg-white/[0.02] backdrop-blur-sm items-center justify-center p-12">
        <div className="max-w-lg space-y-10">
          <h2 className="text-2xl font-display font-bold text-ink-primary">
            Evidence-Based Assessment
          </h2>

          <div className="space-y-4">
            {[
              {
                title: 'Objective Evaluation',
                text: 'Multi-agent AI analysis provides standardized, bias-free technical assessments based on quantifiable metrics.',
              },
              {
                title: 'Real-Time Monitoring',
                text: 'Continuous evaluation of coding ability, communication clarity, and engagement levels throughout the interview.',
              },
              {
                title: 'Defensible Decisions',
                text: 'Comprehensive evidence trails and AI-powered insights create documented, justifiable hiring recommendations.',
              },
            ].map((block) => (
              <div
                key={block.title}
                className="glass-subtle border-l-4 border-l-bronze/30 rounded-r-md p-5"
              >
                <h3 className="text-sm font-semibold text-ink-primary mb-2">{block.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{block.text}</p>
              </div>
            ))}
          </div>

            <div className="pt-8 border-t border-white/[0.06]">
            <h3 className="text-sm font-semibold text-ink-primary mb-4">System Capabilities</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '5 AI AGENTS', value: 'Autonomous' },
                { label: 'ANALYSIS', value: 'Multi-Dimensional' },
                { label: 'EVALUATION', value: 'Real-Time' },
                { label: 'REPORTING', value: 'Comprehensive' },
              ].map((m) => (
                <div key={m.label} className="glass-subtle p-4">
                  <p className="text-[10px] font-mono text-ink-ghost tracking-wider mb-1">{m.label}</p>
                  <p className="text-sm font-mono text-ink-primary">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile register link */}
      <div className="absolute bottom-6 inset-x-0 text-center lg:hidden">
        <p className="text-xs text-ink-tertiary">
          Don't have an account?{' '}
          <Link to="/register" className="text-bronze hover:text-bronze-light font-medium">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}
