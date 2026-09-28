import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className={`w-full text-left border-collapse text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100 text-slate-700">{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-slate-50/80 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return <th className={`px-4 py-3.5 font-semibold text-slate-600 ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-4 py-3.5 align-middle ${className}`}>{children}</td>;
}
