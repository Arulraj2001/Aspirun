import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 ${
        align === 'center' ? 'text-center items-center' : 'items-start'
      } ${className}`}
    >
      <div className="flex-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-surface-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs md:text-sm text-surface-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 self-stretch md:self-auto">{action}</div>}
    </div>
  );
};
