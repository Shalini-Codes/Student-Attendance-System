import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export function RoleGuard({ children, allowedRoles = [] }) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
          Your account role (<span className="font-semibold text-slate-700">{role}</span>) does not have permission to access this page. Only authorized teachers or administrators can access attendance management.
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return children;
}
