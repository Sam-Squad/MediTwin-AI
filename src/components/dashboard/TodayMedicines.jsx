import React from 'react';
import { Pill, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const TodayMedicines = ({ reminders = [], onStatusChange }) => {
  const takenCount = reminders.filter(r => r.status_today === 'Taken').length;
  const totalCount = reminders.length;
  
  return (
    <Card hover className="h-full p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-medical-50 dark:bg-medical-500/10 text-medical-600 dark:text-medical-400 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Today's Medicines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily adherence schedule</p>
          </div>
        </div>
        <Badge variant={takenCount === totalCount && totalCount > 0 ? 'success' : 'neutral'}>
          {takenCount}/{totalCount} Taken
        </Badge>
      </div>

      <div className="space-y-3">
        {reminders.map((med) => {
          const isTaken = med.status_today === 'Taken';
          const isSkipped = med.status_today === 'Skipped';

          return (
            <div
              key={med.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                isTaken
                  ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                  : isSkipped
                  ? 'bg-rose-50/50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 opacity-70'
                  : 'bg-surface-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-medical-200 dark:hover:border-medical-500/30 hover:shadow-soft'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl flex items-center justify-center ${
                  isTaken 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : isSkipped
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-bold text-sm ${isTaken ? 'text-emerald-800 dark:text-emerald-300' : isSkipped ? 'text-rose-800 dark:text-rose-300' : 'text-slate-800 dark:text-slate-100'}`}>
                    {med.medicine_name} <span className="font-normal opacity-70 text-xs">({med.dosage})</span>
                  </div>
                  <div className={`text-xs mt-0.5 ${isTaken ? 'text-emerald-600 dark:text-emerald-400/80' : isSkipped ? 'text-rose-600 dark:text-rose-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {med.schedule?.join(', ')} • {med.instructions}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStatusChange(med.id, 'Taken')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isTaken
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30'
                  }`}
                  title="Mark Taken"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Taken</span>
                </button>

                <button
                  onClick={() => onStatusChange(med.id, 'Skipped')}
                  className={`p-2 rounded-xl border transition-all ${
                    isSkipped
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 border-slate-200 dark:border-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30'
                  }`}
                  title="Skip Dose"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {reminders.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            No medicines scheduled for today.
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodayMedicines;
