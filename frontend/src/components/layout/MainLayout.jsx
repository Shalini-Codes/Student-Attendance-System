import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout({ children, title = 'Dashboard' }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Header */}
        <Header
          title={title}
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
