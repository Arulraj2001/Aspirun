import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full';
  
  const variants = {
    default: 'bg-surface-100 text-surface-800 border border-surface-200',
    success: 'bg-success-50 text-success-700 border border-success-100',
    warning: 'bg-warning-50 text-warning-700 border border-warning-100',
    danger: 'bg-danger-50 text-danger-700 border border-danger-100',
    info: 'bg-brand-50 text-brand-700 border border-brand-100',
    outline: 'bg-transparent text-surface-600 border border-surface-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] md:text-xs',
    md: 'px-3 py-1 text-xs md:text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
