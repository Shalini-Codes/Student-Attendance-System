import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs transition-all duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-5 pb-3 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-base font-bold text-[#182443] tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-xs text-slate-500 mt-0.5 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`p-4 bg-slate-50/60 rounded-b-2xl border-t border-slate-100 ${className}`}>{children}</div>;
}
