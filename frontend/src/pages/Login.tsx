import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login, isAuthenticated, error, clearError } = useAuthStore();

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
