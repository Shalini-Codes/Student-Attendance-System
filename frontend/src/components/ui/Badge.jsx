import React from 'react';

export function getStatusBadgeStyle(status) {
  switch (String(status).toUpperCase()) {
    case 'PRESENT':
    case 'ACTIVE':
    case 'GOOD':
    case 'ELIGIBLE':
      return 'bg-[#EBF8F5] text-[#2fa085] border-[#39B99B]/30';
    case 'ABSENT':
    case 'CANCELLED':
    case 'CRITICAL':
    case 'SHORTAGE':
      return 'bg-[#FDF2F2] text-[#d04343] border-[#E55353]/30';
    case 'LATE':
    case 'WARNING':
    case 'SCHEDULED':
      return 'bg-[#FFF8EC] text-[#d98205] border-[#F5A623]/30';
    case 'EXCUSED':
    case 'COMPLETED':
      return 'bg-[#F4F3FF] text-[#7067E8] border-[#7067E8]/30';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function Badge({ children, status, variant, className = '' }) {
  const badgeStyle = status ? getStatusBadgeStyle(status) : variant || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle} ${className}`}
    >
      {children}
    </span>
  );
}
