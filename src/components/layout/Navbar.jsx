import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogOut, Bell, Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-slate-200/50 px-4 lg:px-8 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Display */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5">
              <path d="M16 3L4 8v8c0 6.6 5.1 12.8 12 14.3C22.9 28.8 28 22.6 28 16V8L16 3z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 16h2.5l2-4 3 8 2-5 1.5 3H23" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            MediTwin <span className="text-slate-400 font-semibold">AI</span>
          </span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients, reports, or ask AI..."
            className="w-80 bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Emergency Profile Trigger */}
        <Link
          to="/emergency"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow"
        >
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>Emergency QR</span>
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Notifications */}
        <button className="p-2 relative text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-surface"></span>
        </button>

        {/* Profile */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <Link to="/profile" className="group flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-glow-sm transition-all border-2 border-white">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </Link>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="med-btn-primary med-btn-sm rounded-full">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
