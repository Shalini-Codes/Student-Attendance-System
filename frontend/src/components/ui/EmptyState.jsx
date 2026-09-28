import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 ${className}`}>
      <div className="p-3 bg-indigo-50 rounded-full text-indigo-900 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
