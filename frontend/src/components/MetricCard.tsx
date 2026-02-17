import React from 'react';
import { clsx } from 'clsx';

interface MetricCardProps {
    label: string;
    value: string | number;
    change?: {
        value: string | number;
        direction: 'up' | 'down' | 'neutral';
    };
    icon?: React.ReactNode;
    className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    change,
    icon,
    className,
}) => {
    const changeConfig = {
        up: {
            color: 'text-green-500',
            icon: '↑',
        },
        down: {
            color: 'text-rose-500',
            icon: '↓',
        },
        neutral: {
            color: 'text-verdict-text-tertiary',
            icon: '',
        },
    };

    return (
        <div
            className={clsx(
                'bg-surface-dark border border-border-dark p-5 rounded-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/50 transition-colors',
                className
            )}
        >
            <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    {label}
                </p>
                {icon && (
                    <div className="text-text-muted text-[20px]">
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-white">
                    {value}
                </span>
                {change && (
                    <span className={clsx('text-xs font-mono flex items-center gap-1', changeConfig[change.direction].color)}>
                        {changeConfig[change.direction].icon && (
                            <span>{changeConfig[change.direction].icon}</span>
                        )}
                        {change.value}
                    </span>
                )}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
    );
};
