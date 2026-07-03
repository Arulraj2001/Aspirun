import React from 'react';
import { Badge } from './Badge';

interface ExamBadgeProps {
  code: string;
  className?: string;
}

export const ExamBadge: React.FC<ExamBadgeProps> = ({ code, className = '' }) => {
  const normCode = code.toUpperCase();

  let colorClass = 'bg-brand-50 text-brand-700 border-brand-100';

  if (normCode.includes('UPSC')) {
    colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-100';
  } else if (normCode.includes('SSC')) {
    colorClass = 'bg-sky-50 text-sky-700 border-sky-100';
  } else if (normCode.includes('RRB')) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-100';
  } else if (normCode.includes('IBPS')) {
    colorClass = 'bg-violet-50 text-violet-700 border-violet-100';
  }

  return (
    <Badge variant="outline" size="sm" className={`${colorClass} ${className}`}>
      {normCode}
    </Badge>
  );
};
