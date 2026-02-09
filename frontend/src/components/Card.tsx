import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'evidence' | 'control' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  status?: 'active' | 'critical' | 'warning' | 'neutral';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  border = true,
  status,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'relative';
  
  const variantClasses = {
    default: 'verdict-card',
    evidence: 'evidence-block',
    control: 'control-panel',
    elevated: 'verdict-card-elevated'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const statusClasses: Record<string, string> = {
    active: 'status-indicator active',
    critical: 'status-indicator critical',
    warning: 'status-indicator warning',
    neutral: 'status-indicator'
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    statusClasses[status],
    {
      'border-0': !border
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

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
  description
}) => {
  const statusColors = {
    critical: 'text-semantic-critical',
    warning: 'text-semantic-warning',
    success: 'text-semantic-success',
    neutral: 'text-verdict-text-primary'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <Card variant="control" padding="md" className="metric-display">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-micro font-medium text-verdict-text-secondary uppercase tracking-wide">
            {title}
          </h3>
          {trend && (
            <span className={`text-xs ${statusColors[status]}`}>
              {trendIcons[trend]}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline space-x-1">
          <span className={`text-2xl font-mono font-semibold ${statusColors[status]}`}>
            {value}
          </span>
          {unit && (
            <span className="text-sm text-verdict-text-secondary">
              {unit}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-micro text-verdict-text-tertiary">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

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
  timestamp
}) => {
  const severityClasses = {
    critical: 'evidence-critical',
    warning: 'evidence-warning',
    success: 'evidence-success',
    neutral: ''
  };

  const badgeClasses = {
    critical: 'verdict-badge-critical',
    warning: 'verdict-badge-warning',
    success: 'verdict-badge-success',
    neutral: 'verdict-badge-neutral'
  };

  return (
    <Card variant="evidence" className={severityClasses[severity]}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-subheadline font-semibold text-verdict-text-primary">
            {title}
          </h3>
          <span className={`verdict-badge ${badgeClasses[severity]}`}>
            {severity.toUpperCase()}
          </span>
        </div>
        
        <p className="text-body text-verdict-text-secondary leading-relaxed">
          {evidence}
        </p>
        
        {timestamp && (
          <p className="text-micro text-verdict-text-tertiary">
            {timestamp}
          </p>
        )}
      </div>
    </Card>
  );
};
