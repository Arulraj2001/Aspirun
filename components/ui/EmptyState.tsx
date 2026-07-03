import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-surface-200 rounded-2xl bg-white/50 backdrop-blur-sm ${className}`}
    >
      {icon && <div className="mb-4 text-surface-400">{icon}</div>}
      <h3 className="text-base md:text-lg font-bold text-surface-900 mb-1">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-surface-500 max-w-sm font-medium mb-5">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
