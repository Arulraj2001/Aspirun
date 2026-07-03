import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className = '',
}) => {
  return (
    <Card className={`flex items-start justify-between ${className}`}>
      <div className="flex-1">
        <p className="text-xs md:text-sm font-semibold text-surface-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl md:text-3xl font-extrabold text-surface-900 tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="mt-1.5 text-xs text-surface-550 font-medium">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-success-50 text-success-700'
                  : 'bg-danger-50 text-danger-700'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
            <span className="text-[10px] text-surface-450 font-bold">vs last week</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="p-3 bg-brand-50 rounded-xl text-brand-600 ml-4">
          {icon}
        </div>
      )}
    </Card>
  );
};
