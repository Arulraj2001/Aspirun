import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  color?: 'brand' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  color = 'brand',
  size = 'md',
  className = '',
}) => {
  const percent = Math.min(Math.max(0, value), 100);

  const colors = {
    brand: 'bg-brand-500',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-surface-550">Progress</span>
          <span className="text-xs font-extrabold text-surface-800">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
