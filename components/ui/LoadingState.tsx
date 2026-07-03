import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading content...',
  size = 'md',
  className = '',
}) => {
  const spinnerSizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 min-h-[200px] w-full ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-brand-100 border-t-brand-500 ${spinnerSizes[size]}`}
      />
      {message && (
        <p className="mt-3 text-xs md:text-sm font-semibold text-surface-500">
          {message}
        </p>
      )}
    </div>
  );
};
