import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-slate-900 text-white border-slate-700';
          let Icon = Info;
          
          if (toast.type === 'success') {
            bgColor = 'bg-emerald-900/95 text-emerald-50 border-emerald-700';
            Icon = CheckCircle2;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-900/95 text-rose-50 border-rose-700';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-900/95 text-amber-50 border-amber-700';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${bgColor}`}
            >
              <Icon className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 shrink-0 text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
