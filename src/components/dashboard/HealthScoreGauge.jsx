import React from 'react';
import { Heart, TrendingUp, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const HealthScoreGauge = ({ score = 84, adherencePct = 95 }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card hover className="h-full flex flex-col justify-between p-5">
      <div className="flex items-start sm:items-center justify-between mb-6 gap-2 flex-col sm:flex-row">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Overall Health Score</h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Based on lab reports & adherence</p>
        </div>
        <Badge variant="success" icon={TrendingUp}>Stable</Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around my-2 flex-1 gap-6">
        {/* Radial SVG Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-900"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-brand-500 dark:text-brand-400 transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{score}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Score</span>
          </div>
        </div>

        <div className="space-y-4 w-full sm:w-auto">
          <div className="bg-surface-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Medicine Adherence</div>
            <div className="text-base font-extrabold text-medical-600 dark:text-medical-400">{adherencePct}% Compliance</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-2xl border border-amber-100 dark:border-amber-500/20">
            <div className="text-[11px] font-semibold text-amber-700/70 dark:text-amber-500/70 uppercase tracking-wider mb-1">Abnormal Flags</div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-400">2 Parameters (Mild)</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1 rounded-md">
          <ShieldCheck className="w-4 h-4" /> AI Dynamic Analysis
        </span>
        <span>Updated today</span>
      </div>
    </Card>
  );
};

export default HealthScoreGauge;
