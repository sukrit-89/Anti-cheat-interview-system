import React from 'react';
import { clsx } from 'clsx';

interface StatusIndicatorProps {
  status: 'active' | 'idle' | 'warning' | 'critical' | 'success' | 'info';
  label?: string;
  showPulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showPulse = true,
  size = 'md',
  className,
}) => {
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  const cfg = {
    active:   { dot: 'bg-status-success',  text: 'text-status-success',  fallback: 'Active' },
    success:  { dot: 'bg-status-success',  text: 'text-status-success',  fallback: 'Success' },
    idle:     { dot: 'bg-status-warning',   text: 'text-status-warning',  fallback: 'Idle' },
    info:     { dot: 'bg-status-info',      text: 'text-status-info',     fallback: 'Info' },
    warning:  { dot: 'bg-status-warning',   text: 'text-status-warning',  fallback: 'Warning' },
    critical: { dot: 'bg-status-critical',  text: 'text-status-critical', fallback: 'Critical' },
  }[status];

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <span className={clsx('relative flex', dotSize)}>
        {showPulse && (
          <span
            className={clsx(
              'animate-ping absolute inset-0 rounded-full opacity-75',
              cfg.dot
            )}
          />
        )}
        <span className={clsx('relative inline-flex rounded-full', dotSize, cfg.dot)} />
      </span>

      {label && (
        <span className={clsx('text-xs font-mono uppercase tracking-wider', cfg.text)}>
          {label || cfg.fallback}
        </span>
      )}
    </div>
  );
};
