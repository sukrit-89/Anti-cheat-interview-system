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
  const cfg = {
    success:  { border: 'border-l-status-success',  accent: 'text-status-success' },
    warning:  { border: 'border-l-status-warning',  accent: 'text-status-warning' },
    critical: { border: 'border-l-status-critical', accent: 'text-status-critical' },
    neutral:  { border: 'border-l-bronze',           accent: 'text-ink-primary' },
  }[type];

  return (
    <div
      className={clsx(
        'border border-neeti-border border-l-4 rounded-r-md bg-neeti-surface p-4 flex gap-4',
        cfg.border,
        className
      )}
    >
      {icon && <div className={clsx('pt-0.5 shrink-0', cfg.accent)}>{icon}</div>}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className={clsx('text-sm font-semibold uppercase tracking-wider', cfg.accent)}>
            {title}
          </h4>
          {label && (
            <span className="shrink-0 text-[10px] font-mono text-ink-ghost bg-neeti-bg px-2 py-0.5 border border-neeti-border rounded">
              {label}
            </span>
          )}
        </div>
        <div className="text-sm text-ink-secondary leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
