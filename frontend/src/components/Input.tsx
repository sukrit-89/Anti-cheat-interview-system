import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-neural-text-secondary mb-2">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg',
                    'bg-neural-surface border border-neural-border',
                    'text-neural-text-primary placeholder:text-neural-text-tertiary',
                    'focus-ring transition-all duration-200',
                    'hover:border-accent-cyan/30',
                    error && 'border-accent-error',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-accent-error">{error}</p>
            )}
        </div>
    );
};
