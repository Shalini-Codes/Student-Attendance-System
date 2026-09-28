import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  QrCode,
  BarChart3,
  UserCheck,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ isCollapsed, toggleSidebar, isMobileOpen, closeMobile }) {
  const { role, user } = useAuth();
  const isTeacherOrAdmin = role === 'TEACHER' || role === 'ADMIN';

  const teacherNavGroups = [
    {
      group: 'OVERVIEW',
      items: [{ label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'ATTENDANCE WORKSPACE',
      items: [
        { label: 'Student Roster', path: '/students', icon: Users },
        { label: 'Mark Attendance', path: '/attendance', icon: CheckSquare },
        { label: 'Dynamic QR Session', path: '/qr-attendance', icon: QrCode },
      ],
    },
    {
      group: 'ANALYTICS & REPORTS',
      items: [{ label: 'Analytics & Reports', path: '/reports', icon: BarChart3 }],
    },
    {
      group: 'ACCOUNT',
      items: [{ label: 'Profile & Settings', path: '/profile', icon: User }],
    },
  ];

  const studentNavGroups = [
    {
      group: 'STUDENT PORTAL',
      items: [
        { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Attendance Records', path: '/my-attendance', icon: UserCheck },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [{ label: 'Profile & Settings', path: '/profile', icon: Settings }],
    },
  ];

  const navGroups = isTeacherOrAdmin ? teacherNavGroups : studentNavGroups;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-[#182443] text-slate-300 border-r border-[#26355d] transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ATTENDIQ Brand Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-[#26355d] bg-[#141e38]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7067E8] to-[#928BFF] flex items-center justify-center text-white font-extrabold shadow-md shrink-0 ring-2 ring-[#7067E8]/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-black text-white tracking-tight">
                    ATTEND<span className="text-[#7067E8]">IQ</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#7067E8]/20 text-[#928BFF] rounded border border-[#7067E8]/30 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase truncate mt-0.5">
                  Smart Campus Tech
                </span>
              </div>
            )}
          </div>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-[#182443] text-slate-400 hover:text-white hover:bg-[#26355d] transition-colors border border-[#26355d]"
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Account Role Card */}
        {!isCollapsed && user && (
          <div className="mx-4 my-4 p-3 rounded-xl bg-[#1d2a4d] border border-[#2c3d69] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#7067E8] text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user.first_name ? user.first_name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center mt-0.5">
                <ShieldCheck className="w-3 h-3 text-[#39B99B] mr-1 inline" />
                <span className="text-[#928BFF] font-bold">{user.role}</span>
              </p>
            </div>
          </div>
        )}

        {/* Navigation Group Items */}
        <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-[#7067E8] text-white shadow-md font-bold'
                          : 'text-slate-400 hover:bg-[#202f54] hover:text-slate-200'
                      } ${isCollapsed ? 'justify-center' : 'space-x-3'}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-[#26355d] bg-[#141e38] text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              ATTENDIQ Campus v2.4
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
