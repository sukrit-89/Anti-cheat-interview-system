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
  const cfg = {
    active:   { dot: 'bg-status-success',  text: 'text-status-success',  fallback: 'Active' },
    idle:     { dot: 'bg-status-warning',   text: 'text-status-warning',  fallback: 'Idle' },
    warning:  { dot: 'bg-status-warning',   text: 'text-status-warning',  fallback: 'Warning' },
    critical: { dot: 'bg-status-critical',  text: 'text-status-critical', fallback: 'Critical' },
  }[status];

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2 w-2">
        {showPulse && (
          <span
            className={clsx(
              'animate-ping absolute inset-0 rounded-full opacity-75',
              cfg.dot
            )}
          />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', cfg.dot)} />
      </span>

      {label && (
        <span className={clsx('text-xs font-mono uppercase tracking-wider', cfg.text)}>
          {label || cfg.fallback}
        </span>
      )}
    </div>
  );
};
