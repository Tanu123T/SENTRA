import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#91A0B3] tracking-wider uppercase">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            'w-full bg-[#0D151E] border border-[#243342] text-[#E8EEF5] text-sm rounded-md px-3.5 py-2 transition-all',
            'focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30',
            'disabled:opacity-50 disabled:bg-[#080D13] disabled:cursor-not-allowed',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#5A6E85] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
