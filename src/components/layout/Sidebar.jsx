import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Bot, Pill, Clock,
  HeartPulse, ImageIcon, History, UserCheck,
  Calendar, Sparkles, ShieldAlert, User, ShieldCheck,
  Activity, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'AI Medical Chat', path: '/chat', icon: Bot, badge: 'RAG' },
      ]
    },
    {
      label: 'Medical Data',
      items: [
        { name: 'Medical Reports', path: '/reports', icon: FileText, badge: 'PDF' },
        { name: 'Medical Scans AI', path: '/medical-images', icon: ImageIcon },
        { name: 'Health Summary', path: '/summary', icon: HeartPulse },
      ]
    },
    {
      label: 'Care Plan',
      items: [
        { name: 'Prescription OCR', path: '/prescriptions', icon: Pill },
        { name: 'Medicine Reminders', path: '/reminders', icon: Clock },
        { name: 'Heart Rate & Vitals', path: '/heart-rate', icon: Activity, badge: 'PPG' },
        { name: 'AI Wellness Coach', path: '/wellness', icon: Sparkles },
      ]
    },
    {
      label: 'History & Support',
      items: [
        { name: 'Doctor Copilot', path: '/doctor-copilot', icon: UserCheck },
        { name: 'Health Timeline', path: '/timeline', icon: Calendar },
        { name: 'Chat History', path: '/chat-history', icon: History },
      ]
    },
    {
      label: 'Settings',
      items: [
        { name: 'Emergency Card', path: '/emergency', icon: ShieldAlert },
        { name: 'Profile & Settings', path: '/profile', icon: User },
      ]
    }
  ];

  if (user?.role === 'admin') {
    navGroups[4].items.push({ name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck, badge: 'Admin' });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Floating Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-4 left-0 lg:left-4 z-50 h-screen lg:h-[calc(100vh-32px)] w-[260px] 
        bg-surface-card lg:rounded-20px lg:shadow-card lg:border border-slate-200/60
        flex flex-col overflow-hidden transition-transform duration-300 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex shrink-0 h-20 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Branded SVG Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M16 3L4 8v8c0 6.6 5.1 12.8 12 14.3C22.9 28.8 28 22.6 28 16V8L16 3z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 16h2.5l2-4 3 8 2-5 1.5 3H23" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Brand Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                MediTwin
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">AI</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                {group.label}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100/50'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-gradient-to-br from-brand-50 to-cyan-50 border border-brand-100 rounded-20px relative overflow-hidden group cursor-pointer hover:shadow-sm transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-brand-500/20 transition-all"></div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info">Gemini 2.5 Active</Badge>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">
              AI medical analysis engine running with RAG memory context.
            </p>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="shrink-0 p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Demo User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'demo@meditwin.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
