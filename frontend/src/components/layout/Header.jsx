import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, Search, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

export function Header({ onMenuClick, title = 'Dashboard' }) {
  const { user, role, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out of ATTENDIQ Platform', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg lg:text-xl font-bold text-[#182443] tracking-tight leading-none">
              {title}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#E9E7FF] text-[#7067E8] text-[10px] font-extrabold uppercase">
              Smart Campus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 hidden md:block">
            ATTENDIQ — Automated Student Attendance & Analytics
          </p>
        </div>
      </div>

      {/* Header Search & User Profile Actions */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Global Quick Search (Decorative Demo) */}
        <div className="hidden md:flex items-center relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students or subjects..."
            onClick={() => showToast('Quick search enabled across roster', 'info')}
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-[#7067E8] focus:bg-white transition-all"
          />
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => showToast('No pending shortage alerts', 'info')}
          className="p-2 rounded-xl text-slate-500 hover:text-[#182443] hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7067E8] rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#182443] text-white font-extrabold flex items-center justify-center text-sm shadow-xs border border-[#182443]">
              {user?.first_name ? user.first_name[0] : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#182443] leading-tight">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {role}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Box */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#182443] truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#E9E7FF] text-[#7067E8] border border-[#7067E8]/20">
                    Role: {role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F4F3FF] hover:text-[#7067E8] transition-colors"
                  >
                    <User className="w-4 h-4 mr-2.5 text-slate-400" />
                    Account Settings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F4F3FF] hover:text-[#7067E8] transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2.5 text-slate-400" />
                    System Preferences
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
