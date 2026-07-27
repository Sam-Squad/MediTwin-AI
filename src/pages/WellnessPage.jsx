import React, { useState, useEffect } from 'react';
import { wellnessApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { Sparkles, Droplet, Footprints, Moon, TrendingUp, CheckCircle } from 'lucide-react';

export const WellnessPage = () => {
  const [wellness, setWellness] = useState({
    water_intake_ml: 1750,
    water_goal_ml: 2500,
    steps_count: 6420,
    steps_goal: 8000,
    sleep_hours: 7.2,
    sleep_goal: 8.0,
    daily_tips: [
      "Drink 250ml water upon waking to kickstart hydration.",
      "Take a short 10-minute walk after meals to assist glucose management.",
      "Maintain consistent sleep hygiene by dimming screens 45 minutes before sleep."
    ]
  });

  useEffect(() => {
    wellnessApi.get().then((res) => setWellness(res.data)).catch(console.error);
  }, []);

  const handleWaterAdd = async (amount) => {
    const newWater = Math.min(wellness.water_goal_ml, (wellness.water_intake_ml || 0) + amount);
    setWellness((prev) => ({ ...prev, water_intake_ml: newWater }));
    await wellnessApi.update({ water_ml: newWater }).catch(() => {});
  };

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" /> AI Wellness Coach & Daily Habits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalized conservative wellness recommendations based on your lab history & physical goals.
          </p>
        </div>
      </div>

      {/* 3 Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Water */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Droplet className="w-6 h-6" />
            </div>
            <button
              onClick={() => handleWaterAdd(250)}
              className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-semibold rounded-xl border border-cyan-200 transition"
            >
              +250 mL
            </button>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Daily Water Target</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {wellness.water_intake_ml} / {wellness.water_goal_ml} mL
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (wellness.water_intake_ml / wellness.water_goal_ml) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Footprints className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Walking Goal</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {wellness.steps_count} / {wellness.steps_goal} steps
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (wellness.steps_count / wellness.steps_goal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Moon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Restful
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Sleep Duration</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {wellness.sleep_hours} / {wellness.sleep_goal} hrs
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (wellness.sleep_hours / wellness.sleep_goal) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Daily Wellness Tips
        </h3>
        <div className="space-y-3">
          {wellness.daily_tips?.map((tip, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;
