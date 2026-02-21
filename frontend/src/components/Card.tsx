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
    default:  'rounded-lg shadow-card',
    evidence: 'rounded-r-md border-l-4 border-l-bronze',
    control:  'rounded-lg shadow-card',
    elevated: 'rounded-lg shadow-medium',
    glass:    'glass-strong',
  };

  // Glass-aware backgrounds via inline styles applied in the element
  const variantStyles: Record<string, React.CSSProperties> = {
    default:  { background: 'linear-gradient(135deg, rgba(21,21,24,0.85) 0%, rgba(21,21,24,0.70) 100%)', backdropFilter: 'blur(12px) saturate(1.2)', WebkitBackdropFilter: 'blur(12px) saturate(1.2)', border: '1px solid rgba(255,255,255,0.08)' },
    evidence: { background: 'linear-gradient(135deg, rgba(21,21,24,0.85) 0%, rgba(21,21,24,0.70) 100%)', backdropFilter: 'blur(12px) saturate(1.2)', WebkitBackdropFilter: 'blur(12px) saturate(1.2)', border: '1px solid rgba(255,255,255,0.08)' },
    control:  { background: 'linear-gradient(135deg, rgba(21,21,24,0.80) 0%, rgba(21,21,24,0.65) 100%)', backdropFilter: 'blur(16px) saturate(1.3)', WebkitBackdropFilter: 'blur(16px) saturate(1.3)', border: '1px solid rgba(255,255,255,0.10)' },
    elevated: { background: 'linear-gradient(135deg, rgba(30,30,35,0.90) 0%, rgba(30,30,35,0.75) 100%)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.12)' },
    glass:    {},  // handled by CSS class
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
      style={{ ...variantStyles[variant], ...props.style }}
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
