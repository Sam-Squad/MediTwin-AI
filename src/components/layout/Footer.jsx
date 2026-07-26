import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-surface-50 dark:bg-dark-50 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">MediTwin AI</span> 
          <span>© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/50">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Strictly informational. Not intended for diagnosis or emergency treatment.</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
