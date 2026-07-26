import React, { useState, useEffect } from 'react';
import { healthSummaryApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { HeartPulse, ShieldCheck, AlertCircle, Pill, Sparkles, HelpCircle, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthSummaryPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    healthSummaryApi.get().then((res) => setSummary(res.data)).catch(console.error);
  }, []);

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <HeartPulse className="w-12 h-12 text-brand-300 animate-pulse" />
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Health Summary...</div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30';
    if (score >= 75) return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
    return 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <DisclaimerBanner />

      <PageHeader 
        title="Personalized Health Summary" 
        subtitle="Synthesized overall health overview based on your lab reports, prescriptions, and daily adherence."
        icon={HeartPulse}
      />

      {/* Top Banner Score */}
      <Card 
        className="bg-gradient-to-br from-brand-50 via-white to-medical-50 dark:from-brand-950/40 dark:via-slate-900 dark:to-medical-950/40 border-brand-100 dark:border-brand-500/20" 
        padding="large"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-sm border ${getScoreBg(summary.overall_health_score)} ${getScoreColor(summary.overall_health_score)}`}>
              {summary.overall_health_score}
            </div>
            <div>
              <div className="text-xs font-bold text-brand-600/80 dark:text-brand-400/80 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Overall Health Score
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                Health Rating: <span className={getScoreColor(summary.overall_health_score)}>Good & Stable</span>
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                Medication adherence is at <strong className="text-slate-800 dark:text-white">{summary.adherence_percentage}%</strong>. {summary.key_abnormalities?.length > 0 ? `${summary.key_abnormalities.length} lab biomarkers flagged for routine doctor check.` : 'All monitored lab biomarkers are within normal ranges.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <Activity className="w-4 h-4 text-emerald-500" /> 
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">RAG Synthesis Engine</span>
          </div>
        </div>
      </Card>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Abnormalities */}
        <Card padding="medium" className="h-full">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Highlighted Lab Parameters</h3>
          </div>
          
          {summary.key_abnormalities?.length > 0 ? (
            <div className="space-y-3">
              {summary.key_abnormalities.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-xl text-sm font-medium text-amber-900 dark:text-amber-200 flex items-start gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Info className="w-4 h-4" /> No flagged parameters
            </div>
          )}
        </Card>

        {/* Active Medicines */}
        <Card padding="medium" className="h-full">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 bg-medical-100 dark:bg-medical-500/20 text-medical-600 dark:text-medical-400 rounded-lg">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Active Prescriptions</h3>
          </div>
          
          <div className="space-y-3">
            {summary.active_medicines?.map((med, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center shrink-0 text-medical-500">
                  <Pill className="w-4 h-4" />
                </div>
                {med}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lifestyle Suggestions */}
      <Card padding="medium">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">AI Lifestyle Guidance</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.lifestyle_suggestions?.map((tip, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed h-full">
              {tip}
            </div>
          ))}
        </div>
      </Card>

      {/* Doctor Questions */}
      <Card padding="medium">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Questions to Prepare for Doctor Visit</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.questions_for_doctor?.map((q, idx) => (
            <li key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 flex items-start gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
              <span className="pt-0.5 leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
};

export default HealthSummaryPage;
