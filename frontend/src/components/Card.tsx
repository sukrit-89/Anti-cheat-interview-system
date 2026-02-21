import React from 'react';
import { clsx } from 'clsx';

/* ── Base Card ─────────────────────────────────────────── */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'evidence' | 'control' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  status?: 'active' | 'critical' | 'warning' | 'neutral';
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  border = true,
  status,
  interactive = false,
  children,
  className,
  ...props
}) => {
  const variants = {
    default:  'bg-neeti-surface/80 backdrop-blur-sm border border-white/[0.06] rounded-lg shadow-card',
    evidence: 'bg-neeti-surface/80 backdrop-blur-sm border border-white/[0.06] border-l-4 border-l-bronze rounded-r-md',
    control:  'bg-neeti-surface/70 backdrop-blur-md border border-white/[0.06] rounded-lg shadow-card',
    elevated: 'bg-neeti-elevated/80 backdrop-blur-lg border border-white/[0.08] rounded-lg shadow-medium',
    glass:    'glass-strong',
  };

  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' };

  const statusMap: Record<string, string> = {
    active:   'status-indicator active',
    critical: 'status-indicator critical',
    warning:  'status-indicator warning',
    neutral:  'status-indicator',
  };

  return (
    <div
      className={clsx(
        'relative',
        variants[variant],
        paddings[padding],
        status && statusMap[status],
        !border && 'border-0',
        interactive && 'interactive-authority cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ── Metric Card ───────────────────────────────────────── */
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'critical' | 'warning' | 'success' | 'neutral';
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  status = 'neutral',
  description,
}) => {
  const statusColors = {
    critical: 'text-status-critical',
    warning:  'text-status-warning',
    success:  'text-status-success',
    neutral:  'text-ink-primary',
  };

  return (
    <Card variant="control" padding="md">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-ink-secondary uppercase tracking-wider">
            {title}
          </h3>
          {trend && (
            <span className={clsx('text-xs font-mono', statusColors[status])}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className={clsx('text-2xl font-mono font-bold', statusColors[status])}>
            {value}
          </span>
          {unit && <span className="text-sm text-ink-tertiary">{unit}</span>}
        </div>

        {description && (
          <p className="text-xs text-ink-tertiary">{description}</p>
        )}
      </div>
    </Card>
  );
};

/* ── Evidence Card ─────────────────────────────────────── */
interface EvidenceCardProps {
  title: string;
  evidence: string;
  severity: 'critical' | 'warning' | 'success' | 'neutral';
  timestamp?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  title,
  evidence,
  severity,
  timestamp,
}) => {
  const sevClasses = {
    critical: 'evidence-critical',
    warning:  'evidence-warning',
    success:  'evidence-success',
    neutral:  '',
  };

  const badgeClasses = {
    critical: 'verdict-badge-critical',
    warning:  'verdict-badge-warning',
    success:  'verdict-badge-success',
    neutral:  'verdict-badge-neutral',
  };

  return (
    <Card variant="evidence" className={sevClasses[severity]}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-primary">
            {title}
          </h3>
          <span className={clsx('verdict-badge', badgeClasses[severity])}>
            {severity.toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-ink-secondary leading-relaxed">
          {evidence}
        </p>

        {timestamp && (
          <p className="text-xs text-ink-tertiary font-mono">{timestamp}</p>
        )}
      </div>
    </Card>
  );
};
