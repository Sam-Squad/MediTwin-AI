import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { ShieldCheck, Users, FileText, Cpu, AlertTriangle, MessageSquare, Star } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading System Analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner />

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" /> Admin Command Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          System telemetry, AI usage metrics, OCR accuracy, and error diagnostics.
        </p>
      </div>

      {/* 4 Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.user_statistics?.total_users}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+{stats.user_statistics?.new_signups_this_week} this week</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lab & Prescription Uploads</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {(stats.upload_analytics?.total_lab_reports || 0) + (stats.upload_analytics?.total_prescriptions || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Lab reports + Scans</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gemini 2.5 Flash Calls</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.ai_usage_statistics?.gemini_2_5_flash_calls}</div>
          <div className="text-[11px] text-purple-400 mt-1">{stats.ai_usage_statistics?.total_ai_tokens_processed} Tokens</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Confidence Rating</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">{stats.ai_usage_statistics?.ai_accuracy_confidence}</div>
          <div className="text-[11px] text-slate-400 mt-1">Avg latency: {stats.ai_usage_statistics?.avg_response_latency_ms}ms</div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> System Diagnostics & Error Logs
        </h3>

        <div className="space-y-2">
          {stats.error_logs?.map((err) => (
            <div key={err.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {err.level}
                </span>
                <span className="font-semibold text-white">[{err.component}]</span>
                <span className="text-slate-300">{err.message}</span>
              </div>
              <span className="text-[10px] text-slate-500">{err.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Feedback */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" /> Recent User Feedback
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.feedback_management?.map((f) => (
            <div key={f.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{f.user}</span>
                <div className="flex items-center text-amber-400 text-xs">
                  {'★'.repeat(f.rating)}
                </div>
              </div>
              <p className="text-slate-300 italic">"{f.comment}"</p>
              <div className="text-[10px] text-slate-500">{f.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
