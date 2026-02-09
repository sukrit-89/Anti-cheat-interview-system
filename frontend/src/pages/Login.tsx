import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

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
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-verdict-bg flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-5/12 border-r border-verdict-border flex-col justify-between p-12">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-verdict-text-primary mb-3 tracking-tight">
            Integrity AI
          </h1>
          <p className="text-verdict-text-secondary text-lg leading-relaxed">
            Enterprise technical interview evaluation system
          </p>
        </div>
        
        <div className="space-y-6 text-sm text-verdict-text-tertiary">
          <div className="border-l-2 border-semantic-emphasis pl-4">
            <p className="font-medium text-verdict-text-secondary mb-1">Evidence-Based Assessment</p>
            <p>Multi-agent AI evaluation providing objective, defensible hiring decisions</p>
          </div>
          <div className="border-l-2 border-verdict-border pl-4">
            <p className="font-medium text-verdict-text-secondary mb-1">Real-Time Analysis</p>
            <p>Continuous monitoring of coding ability, communication, and behavioral integrity</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-semibold text-verdict-text-primary mb-2">
              Sign In
            </h2>
            <p className="text-verdict-text-secondary">
              Access your evaluation dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-semantic-critical/10 border border-semantic-critical/30 text-semantic-critical text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-verdict-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-verdict-text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-verdict-text-primary text-verdict-bg font-medium hover:bg-verdict-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-verdict-text-tertiary">
              New to the platform?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-verdict-text-secondary hover:text-verdict-text-primary underline underline-offset-2 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-verdict-border">
            <p className="text-xs text-verdict-text-tertiary text-center leading-relaxed">
              Protected by enterprise-grade authentication.
              <br />
              All sessions are encrypted and logged for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await login({ email, password });
            // Navigation handled by useEffect
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 neural-bg">
            {/* Animated background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse-soft" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl animate-pulse-soft delay-1000" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8 stagger-1">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet mb-4">
                        <span className="text-3xl font-bold font-mono text-neural-bg">I</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient-cyan mb-2">
                        Integrity AI
                    </h1>
                    <p className="text-neural-text-secondary font-mono text-sm tracking-wider">
                        NEURAL INTERVIEW PLATFORM
                    </p>
                </div>

                {/* Glass Card */}
                <div className="glass-card p-8 stagger-2">
                    <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="stagger-3">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="stagger-4">
                            <Input
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-neural-border bg-neural-surface checked:bg-accent-cyan focus-ring"
                                />
                                <span className="text-neural-text-secondary group-hover:text-neural-text-primary transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <a
                                href="#"
                                className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
    disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-6"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-neural-text-secondary text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-accent-cyan hover:underline font-medium"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Agent Status Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2 text-neural-text-tertiary text-xs font-mono">
                    <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                    <span>5 AGENTS ONLINE</span>
                </div>
            </div>
        </div>
    );
};
