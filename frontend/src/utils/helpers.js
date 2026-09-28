/**
 * Utility functions for date formatting, percentage calculation, and CSV export
 */

export function formatDate(dateInput) {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateInput) {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return 'N/A';
  return `${formatDate(dateInput)} at ${formatTime(dateInput)}`;
}

export function calculatePercentage(part, total) {
  if (!total || total === 0) return 0;
  const pct = (part / total) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

export function exportToCSV(filename, headers, rows) {
  if (!rows || !rows.length) return;
  
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getStatusBadgeStyle(status) {
  switch (String(status).toUpperCase()) {
    case 'PRESENT':
    case 'ACTIVE':
    case 'GOOD':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'ABSENT':
    case 'CANCELLED':
    case 'CRITICAL':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'LATE':
    case 'WARNING':
    case 'SCHEDULED':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'EXCUSED':
    case 'COMPLETED':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
