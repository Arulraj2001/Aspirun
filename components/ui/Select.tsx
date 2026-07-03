import React, { useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, hint, id, ...props }, ref) => {
    const defaultId = useId();
    const selectId = id || defaultId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs md:text-sm font-semibold text-surface-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm md:text-base text-surface-900 focus:outline-none transition-all appearance-none cursor-pointer ${
              error
                ? 'border-danger-600 focus:border-danger-600'
                : 'border-surface-200 focus:border-brand-500 shadow-sm'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-surface-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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

Select.displayName = 'Select';
