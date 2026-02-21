import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { extractErrorMessage } from '../lib/errorUtils';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Explicitly navigate after successful login
      navigate('/dashboard');
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Authentication failed'));
    }
  };

  return (
    <div className="min-h-screen bg-verdict-bg flex">
      {/* Authority Panel */}
      <div className="w-full lg:w-1/2 xl:w-2/5 border-r border-verdict-border flex flex-col justify-center p-12">
        <div className="max-w-md mx-auto w-full space-section">
          {/* Brand Authority */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-accent-bronze" />
              <h1 className="text-headline font-display text-verdict-text-primary">
                Neeti AI
              </h1>
            </div>
            <p className="text-body text-verdict-text-secondary leading-relaxed">
              Enterprise technical interview evaluation
            </p>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-paragraph">
            <div className="space-section">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                icon={<User className="w-4 h-4" />}
                required
                variant="evidence"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your secure password"
                icon={<Lock className="w-4 h-4" />}
                required
                variant="evidence"
              />
            </div>

            {error && (
              <div className="evidence-block evidence-critical">
                <p className="text-body text-semantic-critical">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-verdict-border">
            <div className="space-paragraph text-micro text-verdict-text-tertiary">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Secure Authentication</span>
              </div>
              <p>All access is logged and monitored for security purposes.</p>
              <p>This system is for authorized personnel only.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-verdict-surface">
        <div className="p-12 space-editorial">
          <div className="space-section">
            <h2 className="text-headline font-display text-verdict-text-primary mb-6">
              Evidence-Based Assessment
            </h2>

            <div className="space-paragraph">
              <div className="evidence-block">
                <h3 className="text-subheadline font-semibold mb-3">Objective Evaluation</h3>
                <p className="text-body text-verdict-text-secondary leading-relaxed">
                  Multi-agent AI analysis provides standardized, bias-free technical assessments
                  based on quantifiable metrics rather than subjective judgment.
                </p>
              </div>

              <div className="evidence-block">
                <h3 className="text-subheadline font-semibold mb-3">Real-Time Monitoring</h3>
                <p className="text-body text-verdict-text-secondary leading-relaxed">
                  Continuous evaluation of coding ability, communication clarity, and engagement
                  levels throughout the interview process.
                </p>
              </div>

              <div className="evidence-block">
                <h3 className="text-subheadline font-semibold mb-3">Defensible Decisions</h3>
                <p className="text-body text-verdict-text-secondary leading-relaxed">
                  Comprehensive evidence trails and AI-powered insights create
                  documented, justifiable hiring recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-verdict-border">
            <div className="space-section">
              <h3 className="text-subheadline font-semibold mb-4">System Capabilities</h3>

              <div className="grid-control">
                <div className="grid-control-6">
                  <div className="metric-display">
                    <div className="text-micro text-verdict-text-tertiary mb-2">5 AI AGENTS</div>
                    <div className="text-lg font-mono text-verdict-text-primary">Autonomous</div>
                  </div>
                </div>

                <div className="grid-control-6">
                  <div className="metric-display">
                    <div className="text-micro text-verdict-text-tertiary mb-2">ANALYSIS</div>
                    <div className="text-lg font-mono text-verdict-text-primary">Multi-Dimensional</div>
                  </div>
                </div>

                <div className="grid-control-6">
                  <div className="metric-display">
                    <div className="text-micro text-verdict-text-tertiary mb-2">EVALUATION</div>
                    <div className="text-lg font-mono text-verdict-text-primary">Real-Time</div>
                  </div>
                </div>

                <div className="grid-control-6">
                  <div className="metric-display">
                    <div className="text-micro text-verdict-text-tertiary mb-2">REPORTING</div>
                    <div className="text-lg font-mono text-verdict-text-primary">Comprehensive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Link */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="text-center text-micro text-verdict-text-tertiary">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-accent-bronze hover:text-accent-bronze-light font-medium"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
