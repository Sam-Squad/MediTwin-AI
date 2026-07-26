import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  className = '',
  icon: Icon,
  error,
  label,
  id,
  ...props
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`med-input ${Icon ? 'med-input-with-icon' : ''} ${
            error ? '!border-rose-500 !ring-rose-500/20 focus:!border-rose-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 ml-1 mt-0.5 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
