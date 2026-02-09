/**
 * Register Page - User Registration
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
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

        // Validation
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
            // Navigation handled by useEffect
        } catch (err) {
            console.error('Registration error:', err);
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

            {/* Register Card */}
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
                        CREATE YOUR ACCOUNT
                    </p>
                </div>

                {/* Glass Card */}
                <div className="glass-card p-8 stagger-2">
                    <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

                    {(error || validationError) && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {validationError || error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="stagger-3">
                            <Input
                                type="text"
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.full_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, full_name: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="stagger-4">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="stagger-5">
                            <label className="block mb-2 text-sm font-medium text-neural-text-primary">
                                Role
                            </label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
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
                                        className={`p-3 rounded-lg border-2 transition-all ${
                                            formData.role === 'recruiter'
                                                ? 'border-accent-cyan bg-accent-cyan/10'
                                                : 'border-neural-border hover:border-accent-cyan/50'
                                        }`}
                                    >
                                        <div className="font-medium">Recruiter</div>
                                        <div className="text-xs text-neural-text-secondary mt-1">
                                            Create & manage interviews
                                        </div>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
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
                                        className={`p-3 rounded-lg border-2 transition-all ${
                                            formData.role === 'candidate'
                                                ? 'border-accent-cyan bg-accent-cyan/10'
                                                : 'border-neural-border hover:border-accent-cyan/50'
                                        }`}
                                    >
                                        <div className="font-medium">Candidate</div>
                                        <div className="text-xs text-neural-text-secondary mt-1">
                                            Join interviews
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="stagger-6">
                            <Input
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="stagger-7">
                            <Input
                                type="password"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-neural-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-accent-cyan hover:underline font-medium"
                            >
                                Sign in
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
