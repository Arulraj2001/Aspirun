import React, { useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, hint, id, rows = 4, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = id || defaultId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs md:text-sm font-semibold text-surface-800"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm md:text-base text-surface-900 focus:outline-none transition-all placeholder:text-surface-400 ${
            error
              ? 'border-danger-600 focus:border-danger-600'
              : 'border-surface-200 focus:border-brand-500 shadow-sm'
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

Textarea.displayName = 'Textarea';
