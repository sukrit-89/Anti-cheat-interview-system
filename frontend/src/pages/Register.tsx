import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus, Briefcase, User } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'recruiter' as 'recruiter' | 'candidate',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const { register, isAuthenticated, error, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => () => clearError(), [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.full_name, formData.role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const set = (key: string, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen bg-neeti-bg grid lg:grid-cols-12">
      {/* ── Left branding panel ──────────────────────── */}
      <div className="hidden lg:flex lg:col-span-5 border-r border-white/[0.06] p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(194,112,42,.3) 1px,transparent 1px), linear-gradient(90deg,rgba(194,112,42,.3) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10">
            <Logo size="lg" showWordmark showTagline linkTo="/" className="mb-10" />

          <div className="space-y-6 max-w-md">
            <p className="text-ink-secondary leading-relaxed">
              Enterprise-grade technical interview evaluation infrastructure.
              Create your account to access the assessment protocol.
            </p>

            <div className="border-l-2 border-bronze/25 pl-4 space-y-2 text-sm text-ink-tertiary">
              <p>Comprehensive candidate assessment</p>
              <p>Real-time code execution & analysis</p>
              <p>Multi-agent evaluation framework</p>
              <p>Evidence-backed verdict generation</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
          REGISTRATION_PORTAL_v2.1
        </p>
      </div>

      {/* ── Right registration form ──────────────────── */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-fadeUp">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-bronze" strokeWidth={1.5} />
              <h2 className="text-2xl font-display font-bold text-ink-primary">
                Account Registration
              </h2>
            </div>
            <p className="text-sm text-ink-tertiary">Initialize your access credentials</p>
          </div>

          {(error || validationError) && (
            <div className="mb-5 p-3 border-l-4 border-status-critical bg-status-critical/5 rounded-r-md text-sm text-status-critical">
              {validationError ||
                (typeof error === 'string' ? error : 'An error occurred. Please try again.')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@company.com"
              value={formData.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />

            {/* Role selector */}
            <div>
              <p className="block text-sm font-medium text-ink-secondary mb-2">Account Type</p>
              <div className="grid grid-cols-2 gap-3">
                {(['recruiter', 'candidate'] as const).map((role) => (
                  <label key={role} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={(e) => set('role', e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border rounded-md transition-all ${
                        formData.role === role
                          ? 'border-bronze bg-bronze-muted shadow-glow'
                          : 'border-neeti-border hover:border-neeti-border-strong bg-neeti-surface/50'
                      }`}
                    >
                      {role === 'recruiter' ? (
                        <Briefcase className="w-5 h-5 mb-2 text-bronze" strokeWidth={1.5} />
                      ) : (
                        <User className="w-5 h-5 mb-2 text-bronze" strokeWidth={1.5} />
                      )}
                      <p className="font-medium text-ink-primary text-sm mb-0.5 capitalize">
                        {role}
                      </p>
                      <p className="text-xs text-ink-tertiary">
                        {role === 'recruiter' ? 'Create & manage sessions' : 'Join interviews'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => set('password', e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={isLoading}
            >
              {isLoading ? 'Initializing Account…' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-sm text-ink-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-bronze hover:text-bronze-light font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
