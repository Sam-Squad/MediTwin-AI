import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  return (
    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3.5 text-amber-700 dark:text-amber-300 text-xs sm:text-sm shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-xl shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div>
        <span className="font-semibold text-amber-900 dark:text-amber-200 block mb-1">Medical AI Informational Disclaimer</span>
        {text || "MediTwin AI provides structured summaries and information for personal awareness. It does not provide medical diagnoses or replace consultations with licensed healthcare providers."}
      </div>
    </div>
  );
};

export default DisclaimerBanner;
