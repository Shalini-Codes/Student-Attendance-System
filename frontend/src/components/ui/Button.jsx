import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-xs';

  const variants = {
    primary: 'bg-[#7067E8] hover:bg-[#5C52E0] text-white focus:ring-[#7067E8]/40 active:bg-[#5C52E0]',
    navy: 'bg-[#182443] hover:bg-[#0f172a] text-white focus:ring-[#182443]/40',
    secondary: 'bg-[#E9E7FF] text-[#7067E8] hover:bg-[#d8d4ff] border border-[#7067E8]/20 focus:ring-[#7067E8]/30',
    teal: 'bg-[#39B99B] hover:bg-[#2fa085] text-white focus:ring-[#39B99B]/40',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200 shadow-none',
    danger: 'bg-[#E55353] hover:bg-[#d04343] text-white focus:ring-[#E55353]/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
