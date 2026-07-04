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
            className="text-xs md:text-sm font-black text-surface-800"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-surface-900 focus:outline-none transition-all placeholder:text-surface-350 bg-surface-50 ${
            error
              ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20 bg-danger-50/30'
              : 'border-surface-200 hover:border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:bg-white shadow-sm'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-semibold text-danger-600 mt-0.5 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-surface-450 mt-0.5 font-medium">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
