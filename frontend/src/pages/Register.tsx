import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

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
      await register(formData);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-verdict-bg grid grid-cols-12">
      {/* Left Panel - Branding */}
      <div className="col-span-5 border-r border-verdict-border p-12 flex flex-col justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-verdict-text-primary mb-4">
            Integrity AI
          </h1>
          <p className="text-verdict-text-secondary leading-relaxed max-w-md">
            Enterprise-grade technical interview evaluation platform.
            Create your account to begin assessing candidates with AI-powered analysis.
          </p>
        </div>
        <div className="text-xs text-verdict-text-tertiary">
          REGISTRATION PORTAL
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="col-span-7 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="font-serif text-2xl font-medium text-verdict-text-primary mb-8">
            Create Account
          </h2>

          {(error || validationError) && (
            <div className="mb-6 p-4 border border-semantic-critical bg-semantic-critical/5 text-semantic-critical text-sm">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="your@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-3 font-medium">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
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
                    className={`p-4 border transition-colors ${
                      formData.role === 'recruiter'
                        ? 'border-semantic-emphasis bg-semantic-emphasis/5'
                        : 'border-verdict-border hover:border-verdict-line'
                    }`}
                  >
                    <div className="font-medium text-verdict-text-primary text-sm mb-1">
                      Recruiter
                    </div>
                    <div className="text-xs text-verdict-text-tertiary">
                      Create & manage sessions
                    </div>
                  </div>
                </label>
                <label className="cursor-pointer">
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
                    className={`p-4 border transition-colors ${
                      formData.role === 'candidate'
                        ? 'border-semantic-emphasis bg-semantic-emphasis/5'
                        : 'border-verdict-border hover:border-verdict-line'
                    }`}
                  >
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
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-verdict-text-tertiary mb-2 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-verdict-surface border border-verdict-border text-verdict-text-primary placeholder:text-verdict-text-tertiary focus:outline-none focus:border-semantic-emphasis transition-colors"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-verdict-text-primary text-verdict-bg border border-verdict-text-primary hover:bg-transparent hover:text-verdict-text-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-verdict-border text-center">
            <p className="text-sm text-verdict-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-semantic-emphasis hover:underline font-medium"
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
