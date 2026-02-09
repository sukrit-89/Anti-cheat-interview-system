import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'evidence' | 'control';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'input-authority w-full';
  
  const variantClasses = {
    default: '',
    evidence: 'border-l-4 border-l-accent-bronze rounded-r-sm',
    control: 'bg-verdict-surface font-mono text-sm'
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    {
      'border-semantic-critical focus:border-semantic-critical': error,
      'pl-10': icon
    },
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-caption font-medium text-verdict-text-secondary"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-verdict-text-tertiary">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={classes}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-micro text-semantic-critical font-medium">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-micro text-verdict-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
};

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
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'input-authority w-full resize-vertical min-h-[100px]';
  
  const variantClasses = {
    default: '',
    evidence: 'border-l-4 border-l-accent-bronze rounded-r-sm',
    control: 'bg-verdict-surface font-mono text-sm'
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    {
      'border-semantic-critical focus:border-semantic-critical': error
    },
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-caption font-medium text-verdict-text-secondary"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={classes}
        {...props}
      />
      
      {error && (
        <p className="text-micro text-semantic-critical font-medium">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-micro text-verdict-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
};
