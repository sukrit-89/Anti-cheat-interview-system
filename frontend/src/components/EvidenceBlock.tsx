import React from 'react';
import { clsx } from 'clsx';

interface EvidenceBlockProps {
    type?: 'success' | 'warning' | 'critical' | 'neutral';
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    label?: string;
    className?: string;
}

export const EvidenceBlock: React.FC<EvidenceBlockProps> = ({
    type = 'neutral',
    title,
    children,
    icon,
    label,
    className,
}) => {
    const typeConfig = {
        success: {
            borderColor: 'border-l-semantic-success',
            iconColor: 'text-semantic-success',
            titleColor: 'text-semantic-success',
            bgColor: 'bg-verdict-surface',
        },
        warning: {
            borderColor: 'border-l-semantic-warning',
            iconColor: 'text-semantic-warning',
            titleColor: 'text-semantic-warning',
            bgColor: 'bg-verdict-surface',
        },
        critical: {
            borderColor: 'border-l-semantic-critical',
            iconColor: 'text-semantic-critical',
            titleColor: 'text-semantic-critical',
            bgColor: 'bg-verdict-surface',
        },
        neutral: {
            borderColor: 'border-l-accent-bronze',
            iconColor: 'text-verdict-text-secondary',
            titleColor: 'text-verdict-text-primary',
            bgColor: 'bg-verdict-surface',
        },
    };

    const config = typeConfig[type];

    return (
        <div
            className={clsx(
                'border border-verdict-border border-l-4 p-4 flex gap-4 rounded-r-sm',
                config.bgColor,
                config.borderColor,
                className
            )}
        >
            {icon && (
                <div className={clsx('pt-1', config.iconColor)}>
                    {icon}
                </div>
            )}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={clsx('font-bold text-sm uppercase tracking-wide', config.titleColor)}>
                        {title}
                    </h4>
                    {label && (
                        <span className="text-[10px] font-mono text-verdict-text-tertiary bg-verdict-bg px-2 py-1 border border-verdict-border rounded-sm">
                            {label}
                        </span>
                    )}
                </div>
                <div className="text-verdict-text-secondary text-sm leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};
