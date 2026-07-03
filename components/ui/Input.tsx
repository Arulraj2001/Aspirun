import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, type = 'text', ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs md:text-sm font-semibold text-surface-800"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm md:text-base text-surface-900 focus:outline-none transition-all placeholder:text-surface-400 ${
            error
              ? 'border-danger-600 focus:border-danger-600 focus:ring-1 focus:ring-danger-600'
              : 'border-surface-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-danger-700 mt-0.5">{error}</p>
        )}
        {!error && hint && (
          <p className="text-xs text-surface-500 mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
