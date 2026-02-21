import React, { useId } from 'react';
import { clsx } from 'clsx';

/* ── Input ─────────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** @deprecated use `hint` instead */
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'evidence' | 'control';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  helperText,
  icon,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const resolvedHint = hint || helperText;
  const autoId = useId();
  const inputId = id || autoId;

  const variants = {
    default:  '',
    evidence: 'border-l-4 border-l-bronze rounded-r-md',
    control:  'bg-neeti-surface font-mono text-sm',
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'input-authority w-full',
            variants[variant],
            error && 'border-status-critical focus:border-status-critical focus:ring-status-critical/20',
            icon && 'pl-10',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-status-critical font-medium">{error}</p>}
      {resolvedHint && !error && <p className="text-xs text-ink-tertiary">{resolvedHint}</p>}
    </div>
  );
};

/* ── Textarea ──────────────────────────────────────────── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'evidence' | 'control';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const autoId = useId();
  const textareaId = id || autoId;

  const variants = {
    default:  '',
    evidence: 'border-l-4 border-l-bronze rounded-r-md',
    control:  'bg-neeti-surface font-mono text-sm',
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={clsx(
          'input-authority w-full resize-vertical min-h-[100px]',
          variants[variant],
          error && 'border-status-critical focus:border-status-critical focus:ring-status-critical/20',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />

      {error && <p className="text-xs text-status-critical font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-tertiary">{hint}</p>}
    </div>
  );
};
