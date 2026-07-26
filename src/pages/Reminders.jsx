import React, { useState, useEffect } from 'react';
import { remindersApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Clock, Plus, CheckCircle2, XCircle, Bell, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMed, setNewMed] = useState({
    medicine_name: '',
    dosage: '',
    schedule: ['Morning'],
    time_slots: ['08:00 AM'],
    instructions: 'Take after meal'
  });

  const fetchReminders = async () => {
    try {
      const res = await remindersApi.list();
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('MediTwin AI Reminders Active', {
            body: 'You will receive browser notifications for scheduled medicine doses.'
          });
        }
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await remindersApi.updateStatus(id, status);
      setReminders((prev) => prev.map(r => r.id === id ? res.data : r));
    } catch (err) {
      setReminders((prev) => prev.map(r => r.id === id ? { ...r, status_today: status } : r));
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await remindersApi.create(newMed);
      setReminders((prev) => [res.data, ...prev]);
      setShowModal(false);
      setNewMed({ medicine_name: '', dosage: '', schedule: ['Morning'], time_slots: ['08:00 AM'], instructions: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const overallAdherence = reminders.length
    ? Math.round(reminders.reduce((acc, r) => acc + (r.adherence_rate || 90), 0) / reminders.length)
    : 95;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 relative"
    >
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader 
          title="Medicine Schedule" 
          subtitle="Manage daily dosage reminders (Morning, Afternoon, Night) and track medication compliance."
          icon={Clock}
        />

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            onClick={requestNotificationPermission}
            variant="outline"
            icon={Bell}
          >
            Enable Notifications
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            icon={Plus}
          >
            Add Reminder
          </Button>
        </div>
      </div>

      {/* Adherence Card */}
      <Card className="bg-gradient-to-r from-medical-50 to-white dark:from-medical-900/20 dark:to-slate-900 border-medical-100 dark:border-medical-500/20" padding="large">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Weekly Adherence Score</div>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-white flex items-baseline gap-2">
              {overallAdherence}% <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">Compliance</span>
            </div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> High adherence supports your overall wellness score
            </p>
          </div>
          <div className="relative shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-medical-100 dark:text-medical-900/30" />
              <circle 
                cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                className="text-medical-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallAdherence / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-medical-700 dark:text-medical-400">{overallAdherence}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((rem) => {
          const isTaken = rem.status_today === 'Taken';
          const isSkipped = rem.status_today === 'Skipped';

          return (
            <Card hover key={rem.id} className="flex flex-col h-full" padding="medium">
              <div className="flex items-start justify-between mb-4">
                <div className="pr-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1">{rem.medicine_name}</h3>
                  <span className="text-sm font-semibold text-medical-600 dark:text-medical-400 mt-0.5 inline-block">{rem.dosage}</span>
                </div>
                <Badge variant="success" className="shrink-0 font-bold whitespace-nowrap">
                  {rem.adherence_rate || 100}%
                </Badge>
              </div>

              <div className="text-sm space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{rem.time_slots?.join(', ')}</span>
                  <span className="text-slate-400">•</span>
                  <span>{rem.schedule?.join(', ')}</span>
                </div>
                {rem.instructions && (
                  <div className="text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    "{rem.instructions}"
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Status: <span className={`font-bold ${isTaken ? 'text-emerald-600 dark:text-emerald-400' : isSkipped ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{rem.status_today}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(rem.id, 'Taken')}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isTaken 
                          ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/20' 
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                      }`}
                      title="Mark Taken"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Taken</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(rem.id, 'Skipped')}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSkipped 
                          ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-500/20' 
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                      }`}
                      title="Skip Dose"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {reminders.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-16 text-center text-slate-500 min-h-[300px]">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-base font-medium text-slate-600 dark:text-slate-300 mb-2">No reminders scheduled</p>
          <p className="text-sm">Click "Add Reminder" to start tracking your medication.</p>
        </Card>
      )}

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md z-10"
            >
              <Card className="shadow-2xl border-slate-200 dark:border-slate-700" padding="large">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-medical-50 dark:bg-medical-500/10 text-medical-600 dark:text-medical-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Medicine Reminder</h3>
                </div>

                <form onSubmit={handleAddReminder} className="space-y-4">
                  <Input
                    label="Medicine Name"
                    value={newMed.medicine_name}
                    onChange={(e) => setNewMed({ ...newMed, medicine_name: e.target.value })}
                    placeholder="e.g. Amoxicillin"
                    required
                  />

                  <Input
                    label="Dosage"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    placeholder="e.g. 500 mg"
                    required
                  />

                  <Input
                    label="Instructions"
                    value={newMed.instructions}
                    onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                    placeholder="Take after breakfast"
                  />

                  <div className="flex items-center justify-end gap-3 pt-6 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Save Reminder
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reminders;
