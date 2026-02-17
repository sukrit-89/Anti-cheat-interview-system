import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Scale, UserPlus, Briefcase, User } from 'lucide-react';

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
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

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

  return (
    <div className="min-h-screen bg-verdict-bg grid lg:grid-cols-12">
      {/* Left Panel - Authority Branding */}
      <div className="hidden lg:flex lg:col-span-5 border-r border-verdict-border p-12 flex-col justify-between relative overflow-hidden">
        {/* Technical grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(146, 64, 14, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(146, 64, 14, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <Scale className="w-8 h-8 text-accent-bronze" strokeWidth={1.5} />
              <div className="absolute -inset-1 bg-accent-bronze/10 blur-sm -z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-semibold text-verdict-text-primary tracking-tight">
                Integrity AI
              </h1>
              <p className="text-xs text-verdict-text-quaternary font-mono tracking-wider">EVALUATION AUTHORITY</p>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <p className="text-verdict-text-secondary leading-relaxed">
              Enterprise-grade technical interview evaluation infrastructure. Create your account to access
              the assessment protocol and begin conducting evidence-based technical evaluations.
            </p>

            <div className="border-l-2 border-accent-bronze/30 pl-4 space-y-2">
              <p className="text-sm text-verdict-text-tertiary">Comprehensive candidate assessment</p>
              <p className="text-sm text-verdict-text-tertiary">Real-time code execution & analysis</p>
              <p className="text-sm text-verdict-text-tertiary">Multi-agent evaluation framework</p>
              <p className="text-sm text-verdict-text-tertiary">Evidence-backed verdict generation</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
            REGISTRATION_PORTAL_v2.0
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-reveal-slow">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <UserPlus className="w-5 h-5 text-accent-bronze" strokeWidth={1.5} />
              <h2 className="text-2xl font-display font-semibold text-verdict-text-primary">
                Account Registration
              </h2>
            </div>
            <p className="text-sm text-verdict-text-tertiary">Initialize your access credentials</p>
          </div>

          {(error || validationError) && (
            <div className="mb-6 p-4 border-l-4 border-semantic-critical bg-semantic-critical/5 text-semantic-critical text-sm">
              {validationError || (typeof error === 'string' ? error : 'An error occurred. Please try again.')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-verdict-text-tertiary mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-quaternary focus:outline-none focus:border-accent-bronze transition-all font-mono text-sm"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-verdict-text-tertiary mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-quaternary focus:outline-none focus:border-accent-bronze transition-all font-mono text-sm"
                placeholder="your@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-verdict-text-tertiary mb-3 font-medium">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === 'recruiter'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'recruiter',
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border transition-all ${formData.role === 'recruiter'
                        ? 'border-accent-bronze bg-accent-bronze/5'
                        : 'border-verdict-border hover:border-verdict-border-strong group-hover:bg-verdict-surface-elevated'
                      }`}
                  >
                    <Briefcase className="w-5 h-5 mb-2 text-accent-bronze" strokeWidth={1.5} />
                    <div className="font-medium text-verdict-text-primary text-sm mb-1">
                      Recruiter
                    </div>
                    <div className="text-xs text-verdict-text-tertiary">
                      Create & manage sessions
                    </div>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === 'candidate'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'candidate',
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border transition-all ${formData.role === 'candidate'
                        ? 'border-accent-bronze bg-accent-bronze/5'
                        : 'border-verdict-border hover:border-verdict-border-strong group-hover:bg-verdict-surface-elevated'
                      }`}
                  >
                    <User className="w-5 h-5 mb-2 text-accent-bronze" strokeWidth={1.5} />
                    <div className="font-medium text-verdict-text-primary text-sm mb-1">
                      Candidate
                    </div>
                    <div className="text-xs text-verdict-text-tertiary">
                      Join interviews
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-verdict-text-tertiary mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-quaternary focus:outline-none focus:border-accent-bronze transition-all font-mono text-sm"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-verdict-text-tertiary mb-2 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-quaternary focus:outline-none focus:border-accent-bronze transition-all font-mono text-sm"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-accent-bronze hover:bg-accent-bronze-light border border-accent-bronze text-white transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Initializing Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-verdict-border text-center">
            <p className="text-sm text-verdict-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent-bronze hover:text-accent-bronze-light font-medium transition-colors"
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
