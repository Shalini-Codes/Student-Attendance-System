import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`block w-full rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 py-2.5 ${
            Icon ? 'pl-9 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
              : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 text-slate-900 bg-white'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
