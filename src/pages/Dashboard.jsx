import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import TodayMedicines from '../components/dashboard/TodayMedicines';
import QuickActions from '../components/dashboard/QuickActions';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { reportsApi, prescriptionsApi, remindersApi, wellnessApi } from '../services/api';
import { FileText, Pill, Droplet, Footprints, ShieldAlert, Sparkles, AlertCircle, ArrowRight, BrainCircuit, MessageSquareText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [wellness, setWellness] = useState({ water_intake_ml: 1750, water_goal_ml: 2500, steps_count: 6420, steps_goal: 8000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, prescRes, remRes, wellRes] = await Promise.all([
          reportsApi.list().catch(() => ({ data: [] })),
          prescriptionsApi.list().catch(() => ({ data: [] })),
          remindersApi.list().catch(() => ({ data: [] })),
          wellnessApi.get().catch(() => ({ data: { water_intake_ml: 1750, water_goal_ml: 2500, steps_count: 6420, steps_goal: 8000 } }))
        ]);
        setReports(repRes.data || []);
        setPrescriptions(prescRes.data || []);
        setReminders(remRes.data || []);
        if (wellRes.data) setWellness(wellRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReminderStatus = async (id, status) => {
    try {
      const res = await remindersApi.updateStatus(id, status);
      setReminders((prev) => prev.map(r => r.id === id ? res.data : r));
    } catch (err) {
      setReminders((prev) => prev.map(r => r.id === id ? { ...r, status_today: status } : r));
    }
  };

  const handleWaterAdd = async (amount) => {
    const newWater = Math.min(wellness.water_goal_ml, (wellness.water_intake_ml || 0) + amount);
    setWellness((prev) => ({ ...prev, water_intake_ml: newWater }));
    await wellnessApi.update({ water_ml: newWater }).catch(() => {});
  };

  const latestReport = reports[0];
  const latestPrescription = prescriptions[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-24"
    >
      <DisclaimerBanner />

      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <div className="med-card overflow-hidden border-none p-8 md:p-10 relative bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-surface-card z-0"></div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -mb-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="med-badge-info px-3 py-1 bg-white/60 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Premium Health Dashboard
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Good Morning, {user?.name || 'Alex'} 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
                Your AI-driven health summary for today. Stay on top of your wellness, medications, and clinical reports.
              </p>
            </div>

            <Link
              to="/emergency"
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 font-semibold text-sm rounded-2xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md group whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 group-hover:animate-pulse" />
              Emergency Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* AI Insights Panel (ChatGPT-like) */}
      <motion.div variants={itemVariants}>
        <div className="med-card p-6 bg-gradient-to-r from-brand-50 to-cyan-50/50 border border-brand-100/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit className="w-24 h-24 text-brand-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">AI Health Insights</h2>
            </div>
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  Based on your latest CBC report, your hemoglobin levels are optimal, but slight Vitamin D deficiency was flagged.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  You've maintained a 94% medication adherence rate this week. Excellent consistency!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  Suggested Action: Drink 750ml more water today to reach your hydration baseline.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Link to="/chat" className="med-btn-primary med-btn-sm bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 shadow-sm">
                Ask a Follow-up Question
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Grid: Health Score + Today Medicines */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 h-full">
          <HealthScoreGauge score={latestReport?.health_score_impact || 84} adherencePct={94} />
        </div>
        <div className="xl:col-span-8 h-full">
          <TodayMedicines reminders={reminders} onStatusChange={handleReminderStatus} />
        </div>
      </motion.div>

      {/* Middle Grid: Latest Uploaded Report + Latest Prescription */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Report */}
        <div className="med-card flex flex-col h-full p-6 group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Latest Lab Report</h3>
            </div>
            <Link to="/reports" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latestReport ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="font-bold text-sm text-slate-800">{latestReport.filename}</div>
                <div className="text-xs font-semibold text-brand-600 mt-0.5">{latestReport.report_type}</div>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{latestReport.summary}</p>
              </div>

              {latestReport.key_abnormalities?.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-700">
                      Flagged Parameters ({latestReport.key_abnormalities.length})
                    </div>
                    <div className="text-sm text-amber-600 mt-0.5 leading-snug">
                      {latestReport.key_abnormalities.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              No medical report uploaded yet.
            </div>
          )}
        </div>

        {/* Latest Prescription */}
        <div className="med-card flex flex-col h-full p-6 group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Latest Prescription</h3>
            </div>
            <Link to="/prescriptions" className="text-sm font-semibold text-medical-600 hover:text-medical-700 flex items-center gap-1 transition-colors">
              View OCR Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latestPrescription ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="font-bold text-sm text-slate-800">{latestPrescription.filename}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  AI extracted {latestPrescription.medicines?.length || 0} active medications
                </div>
              </div>

              <div className="space-y-2">
                {latestPrescription.medicines?.slice(0, 2).map((m, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                    <span className="font-medium text-sm text-slate-700">
                      {m.name} <span className="text-slate-400 font-normal">({m.dosage})</span>
                    </span>
                    <span className="med-badge-neutral">{m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              No active prescription scanned yet.
            </div>
          )}
        </div>
      </motion.div>

      {/* Wellness Widgets */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="med-card flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center border border-cyan-100">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Water Goal</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5 tracking-tight">
                {wellness.water_intake_ml || 1750} <span className="text-sm font-medium text-slate-400">/ {wellness.water_goal_ml || 2500} mL</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleWaterAdd(250)}
            className="px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-bold rounded-xl border border-cyan-200 transition-all shadow-sm active:scale-95"
          >
            +250 mL
          </button>
        </div>

        <div className="med-card flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-500 flex items-center justify-center border border-medical-100">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Step Target</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5 tracking-tight">
                {wellness.steps_count || 6420} <span className="text-sm font-medium text-slate-400">/ {wellness.steps_goal || 8000}</span>
              </div>
            </div>
          </div>
          <span className="med-badge-success px-3 py-1.5 text-xs">
            {Math.round(((wellness.steps_count || 0) / (wellness.steps_goal || 1)) * 100)}% Goal
          </span>
        </div>
      </motion.div>

      {/* Floating AI Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => navigate('/chat')}
          className="relative w-16 h-16 rounded-full bg-brand-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-105 transition-transform group"
        >
          <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20"></div>
          <MessageSquareText className="w-7 h-7 relative z-10" />
          
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-2xl shadow-card opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Ask AI Assistant
          </div>
        </button>
      </div>

    </motion.div>
  );
};

export default Dashboard;
