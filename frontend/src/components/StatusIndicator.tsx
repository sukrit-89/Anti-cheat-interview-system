import React from 'react';
import { clsx } from 'clsx';

interface StatusIndicatorProps {
    status: 'active' | 'idle' | 'warning' | 'critical';
    label?: string;
    showPulse?: boolean;
    className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    status,
    label,
    showPulse = true,
    className,
}) => {
    const statusConfig = {
        active: {
            bgColor: 'bg-green-500',
            textColor: 'text-green-500',
            borderColor: 'border-green-500',
            label: label || 'Active',
        },
        idle: {
            bgColor: 'bg-amber-500',
            textColor: 'text-amber-500',
            borderColor: 'border-amber-500',
            label: label || 'Idle',
        },
        warning: {
            bgColor: 'bg-amber-500',
            textColor: 'text-amber-500',
            borderColor: 'border-amber-500',
            label: label || 'Warning',
        },
        critical: {
            bgColor: 'bg-red-500',
            textColor: 'text-red-500',
            borderColor: 'border-red-500',
            label: label || 'Critical',
        },
    };

    const config = statusConfig[status];

    return (
        <div className={clsx('inline-flex items-center gap-2', className)}>
            <span className="relative flex h-2 w-2">
                {showPulse && (
                    <span
                        className={clsx(
                            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                            config.bgColor
                        )}
                    />
                )}
                <span
                    className={clsx(
                        'relative inline-flex rounded-full h-2 w-2',
                        config.bgColor
                    )}
                />
            </span>
            {label && (
                <span className={clsx('text-xs font-mono uppercase tracking-wider', config.textColor)}>
                    {config.label}
                </span>
            )}
        </div>
    );
};
