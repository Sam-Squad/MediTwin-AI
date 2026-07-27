import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportsApi, prescriptionsApi, remindersApi, wellnessApi } from '../services/api';
import { 
  FileText, Pill, Droplet, Activity, 
  Sparkles, Heart, Clock, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { PremiumButton } from '../components/ui/PremiumButton';

const AnimatedCircle = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 500);
  }, [score, circumference]);

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
        <circle 
          cx="60" cy="60" r={radius} 
          stroke="#10B981" 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-slate-900">{score}</span>
        <span className="text-xs font-semibold text-slate-900">/ 100</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ reports: [], reminders: [], wellness: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, remRes, wellRes] = await Promise.all([
          reportsApi.list().catch(() => ({ data: [] })),
          remindersApi.list().catch(() => ({ data: [] })),
          wellnessApi.get().catch(() => ({ data: { water_intake_ml: 1200, water_goal_ml: 2500 } }))
        ]);
        setData({
          reports: repRes.data || [],
          reminders: remRes.data || [],
          wellness: wellRes.data || { water_intake_ml: 1200, water_goal_ml: 2500 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="pb-24">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Good Morning, {user?.name || 'Alex'}
        </h1>
        <p className="text-slate-900 font-medium mt-1">Here is your daily health intelligence brief.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Health Score Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="h-full flex flex-col md:flex-row items-center justify-between p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
            
            <div className="flex-1 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles size={14} />
                  AI Analysis Active
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Optimal Health Status</h2>
                <p className="text-sm text-slate-900 leading-relaxed max-w-md">
                  Your recent blood reports show excellent cholesterol levels. Keep maintaining your current medication schedule.
                </p>
              </div>

              <div className="flex gap-4">
                <Link to="/chat">
                  <PremiumButton icon={Sparkles}>Ask AI Assistant</PremiumButton>
                </Link>
                <Link to="/reports">
                  <PremiumButton variant="secondary" icon={FileText}>View Reports</PremiumButton>
                </Link>
              </div>
            </div>

            <div className="mt-8 md:mt-0 flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Health Score</h3>
              <AnimatedCircle score={92} />
              <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-medical-50 rounded-full border border-medical-100">
                <Heart size={14} className="text-medical-600" />
                <span className="text-xs font-bold text-medical-700">Excellent</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Daily Wellness Mini Cards */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <GlassCard className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Droplet size={20} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hydration</h3>
                <p className="text-xs text-slate-900 font-medium">Daily Goal</p>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-extrabold text-slate-900">1.2</span>
              <span className="text-sm font-semibold text-slate-900 mb-1">/ 2.5 L</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '48%' }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-cyan-500 rounded-full" 
              />
            </div>
          </GlassCard>

          <GlassCard className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Activity size={20} className="text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Heart Rate</h3>
                <p className="text-xs text-slate-900 font-medium">Latest Scan</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-slate-900">72</span>
              <span className="text-sm font-semibold text-slate-500 mb-1">BPM</span>
            </div>
            <p className="text-xs font-semibold text-medical-600 mt-2 flex items-center gap-1">
              <Heart size={12} fill="currentColor" /> Normal resting rate
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Medications */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pill className="text-brand-500" /> Today's Medicine
              </h3>
              <Link to="/reminders" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                      <Clock size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Amoxicillin 500mg</h4>
                      <p className="text-xs text-slate-900 font-medium mt-0.5">08:00 AM • After food</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full border-2 border-slate-200 hover:border-medical-500 hover:bg-medical-50 transition-colors" />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Reports */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-cyan-500" /> Recent Reports
              </h3>
              <Link to="/reports" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-brand-100 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">Complete Blood Count</h4>
                    <p className="text-xs text-slate-900 font-medium mt-0.5">Uploaded today</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-brand-500" />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
