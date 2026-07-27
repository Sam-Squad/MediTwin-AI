import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Activity, Pill, Shield, Dna, FileText } from 'lucide-react';

const FloatIcon = ({ children, delay = 0, yOffset = 10, xOffset = 0, duration = 3, className = '' }) => (
  <motion.div
    animate={{
      y: [0, yOffset, 0],
      x: [0, xOffset, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className={`absolute ${className}`}
  >
    {children}
  </motion.div>
);

const PulseDot = ({ x, y, delay = 0 }) => (
  <motion.circle
    cx={x}
    cy={y}
    r="3"
    fill="#06B6D4"
    animate={{ opacity: [0.2, 1, 0.2], r: [2, 4, 2] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

export const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-sm mx-auto h-[380px] flex items-center justify-center -mt-6 z-0 pointer-events-none select-none">
      
      {/* Background Soft Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[60px]" />
        <div className="absolute w-[200px] h-[200px] bg-cyan-500/15 rounded-full blur-[40px]" />
      </div>

      {/* Main SVG Composition */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full absolute inset-0 drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bodyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neural Connections (Background lines) */}
        <g stroke="#06B6D4" strokeOpacity="0.3" strokeWidth="1">
          <path d="M100 150 Q 200 100, 300 150" />
          <path d="M150 100 Q 200 50, 250 100" />
          <path d="M80 200 Q 200 150, 320 200" />
          <path d="M120 250 Q 200 200, 280 250" />
        </g>
        
        <PulseDot x={100} y={150} delay={0} />
        <PulseDot x={300} y={150} delay={0.5} />
        <PulseDot x={150} y={100} delay={1} />
        <PulseDot x={250} y={100} delay={1.5} />
        <PulseDot x={120} y={250} delay={2} />
        <PulseDot x={280} y={250} delay={0.8} />

        {/* AI Brain Outline */}
        <circle cx="200" cy="140" r="70" fill="url(#brainGlow)" />
        <path
          d="M200 70 C 150 70, 130 110, 130 140 C 130 170, 160 210, 200 210 C 240 210, 270 170, 270 140 C 270 110, 250 70, 200 70 Z"
          stroke="#06B6D4"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          filter="url(#neonGlow)"
        />
        <path
          d="M200 70 C 200 70, 200 210, 200 210"
          stroke="#06B6D4"
          strokeWidth="2"
          fill="none"
          strokeDasharray="2 4"
        />

        {/* Human Hologram Outline */}
        <path
          d="M190 200 C 190 190, 210 190, 210 200 C 215 220, 225 230, 225 250 L 215 350 L 205 280 L 195 280 L 185 350 L 175 250 C 175 230, 185 220, 190 200 Z"
          fill="url(#bodyGradient)"
          stroke="#2563EB"
          strokeWidth="1.5"
          filter="url(#neonGlow)"
        />
        
        {/* Hologram Base Rings */}
        <ellipse cx="200" cy="350" rx="60" ry="15" fill="none" stroke="#2563EB" strokeWidth="2" strokeOpacity="0.4" />
        <ellipse cx="200" cy="350" rx="80" ry="20" fill="none" stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.2" />

        {/* Glowing Core */}
        <circle cx="200" cy="235" r="5" fill="#FFFFFF" filter="url(#neonGlow)" />
        
      </svg>

      {/* Floating Elements / UI Cards */}
      <FloatIcon delay={0} yOffset={-12} className="top-10 left-10">
        <div className="w-12 h-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/80 flex items-center justify-center text-blue-600">
          <Plus className="w-6 h-6" strokeWidth={3} />
        </div>
      </FloatIcon>

      <FloatIcon delay={1} yOffset={10} className="top-40 left-4">
        <div className="w-10 h-10 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/80 flex items-center justify-center text-blue-500">
          <Pill className="w-5 h-5" />
        </div>
      </FloatIcon>

      <FloatIcon delay={2} yOffset={-15} className="top-16 right-12">
        <div className="w-14 h-14 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/80 flex items-center justify-center text-cyan-500">
          <Activity className="w-7 h-7" />
        </div>
      </FloatIcon>

      <FloatIcon delay={0.5} yOffset={15} className="bottom-12 right-24">
        <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-600/20 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
      </FloatIcon>

      <FloatIcon delay={1.2} yOffset={-8} className="bottom-40 right-4">
        <Dna className="w-12 h-12 text-blue-400 opacity-60" />
      </FloatIcon>

      {/* Mini Report Card */}
      <FloatIcon delay={1.5} yOffset={8} xOffset={5} className="top-52 left-0">
        <div className="w-32 bg-white/80 backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-2">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="w-3 h-3 text-blue-600" />
            <span className="text-[9px] font-bold text-slate-900">Medical Report</span>
          </div>
          <div className="w-full h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden relative">
             <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
             {/* Fake X-Ray lines */}
             <div className="w-4 h-8 bg-slate-300 rounded-full mx-1 opacity-50" />
             <div className="w-4 h-10 bg-slate-300 rounded-full mx-1 opacity-50" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full bg-slate-200 rounded-full" />
            <div className="h-1 w-2/3 bg-slate-200 rounded-full" />
          </div>
        </div>
      </FloatIcon>

      {/* Health Insights Card */}
      <FloatIcon delay={2.5} yOffset={-8} xOffset={-5} className="top-48 right-0">
        <div className="w-36 bg-white/80 backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-3">
          <span className="text-[10px] font-bold text-slate-900 block mb-2">Health Insights</span>
          
          <div className="space-y-2 text-[8px] font-medium text-slate-500">
            <div className="flex justify-between items-center">
              <span>Risk Prediction</span>
              <span className="text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Heart Health</span>
              <span className="text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">Good</span>
            </div>
          </div>
          
          <svg className="w-full h-6 mt-2" viewBox="0 0 100 20" preserveAspectRatio="none">
             <path d="M0 15 Q 15 5, 25 10 T 50 15 T 75 5 T 100 10" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
          </svg>
        </div>
      </FloatIcon>
      
      {/* Central "AI" Badge */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30 border-2 border-white/20">
          AI
        </div>
      </div>

    </div>
  );
};
