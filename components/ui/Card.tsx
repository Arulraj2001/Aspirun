import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  variant?: 'default' | 'raised' | 'flat' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  elevated = false,
  variant = 'default',
  ...props
}) => {
  const base = 'rounded-2xl p-5 md:p-6 transition-all duration-200';

  const variants: Record<string, string> = {
    default: 'bg-white border border-surface-200 shadow-sm',
    raised:  'bg-white border border-surface-200 shadow-[0_2px_8px_0_rgba(10,30,60,0.08),0_8px_32px_-8px_rgba(10,30,60,0.10)]',
    flat:    'bg-surface-75 border border-surface-150',
    glass:   'glass-card',
    gradient:'bg-gradient-to-br from-brand-50 to-white border border-brand-100 shadow-sm',
  };

  const hoverClass = hoverable
    ? 'hover:shadow-[0_4px_16px_0_rgba(10,30,60,0.12),0_12px_40px_-8px_rgba(13,148,136,0.12)] hover:-translate-y-0.5 cursor-pointer'
    : '';

  const elevatedClass = elevated
    ? 'shadow-[0_4px_24px_-4px_rgba(10,30,60,0.14)]'
    : '';

  return (
    <div
      className={`${base} ${variants[variant]} ${hoverClass} ${elevatedClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
