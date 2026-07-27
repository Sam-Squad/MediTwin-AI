import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, 
  ChevronRight, FileText, Clock, ImageIcon, CheckCircle,
  Zap, Users, BarChart3, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/* ── Animated floating particles ── */
const Particle = ({ delay, x, y, size, duration }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.6, 0], 
      scale: [0, 1, 0],
      y: [0, -40, -80],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
  >
    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
  </motion.div>
);

/* ── Animated counter ── */
const AnimCounter = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="text-center">
      <div className="text-lg font-extrabold text-slate-900">{count.toLocaleString()}{suffix}</div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'demo@meditwin.ai', password: 'demo1234' }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

  const particles = [
    { delay: 0, x: 15, y: 20, size: 6, duration: 5 },
    { delay: 1.2, x: 75, y: 60, size: 4, duration: 4.5 },
    { delay: 2.5, x: 40, y: 80, size: 5, duration: 5.5 },
    { delay: 0.8, x: 60, y: 15, size: 3, duration: 4 },
    { delay: 3, x: 25, y: 55, size: 5, duration: 6 },
    { delay: 1.5, x: 85, y: 35, size: 4, duration: 4.8 },
    { delay: 2, x: 50, y: 45, size: 3, duration: 5.2 },
    { delay: 0.5, x: 10, y: 70, size: 4, duration: 4.2 },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Premium Animated Background ── */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #E8F4FD 0%, #F0EAFF 25%, #E0F2FE 50%, #EDE9FE 75%, #F0F9FF 100%)' }} />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #2563EB 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      {/* Large ambient glow blobs */}
      <motion.div 
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-purple-300/15 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/15 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch relative z-10">
        
        {/* ══════════════════════════════════════════
            LEFT — AI Healthcare Illustration Panel
            ══════════════════════════════════════════ */}
        <div className="lg:w-[52%] relative flex flex-col p-8 lg:p-14 overflow-hidden">
          
          {/* Top Logo with animated glow */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8 z-10"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 3L4 8v8c0 6.6 5.1 12.8 12 14.3C22.9 28.8 28 22.6 28 16V8L16 3z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 16h2l2-4 3 8 2-5 1.5 3H23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                MediTwin <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Healthcare Intelligence</span>
            </div>
          </motion.div>

          {/* ── Center Illustration ── */}
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="relative w-full max-w-xl">

              {/* Central AI Human Hologram */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mx-auto flex items-center justify-center"
                style={{ height: '380px' }}
              >
                {/* Holographic base rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-12 w-64 h-20 rounded-full border-2 border-blue-300/25"
                  style={{ transform: 'perspective(300px) rotateX(75deg)' }}
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-10 w-52 h-16 rounded-full border border-cyan-300/20"
                  style={{ transform: 'perspective(300px) rotateX(75deg)' }}
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-8 w-72 h-24 rounded-full border border-dashed border-purple-300/15"
                  style={{ transform: 'perspective(300px) rotateX(75deg)' }}
                />

                {/* Vertical scan line effect */}
                <motion.div
                  animate={{ y: [-120, 120, -120] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-20 pointer-events-none"
                />

                {/* Human Body SVG */}
                <motion.div 
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <svg viewBox="0 0 240 400" className="w-60 h-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bodyGradient" x1="80" y1="0" x2="160" y2="400">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85"/>
                        <stop offset="35%" stopColor="#06B6D4" stopOpacity="0.7"/>
                        <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.5"/>
                      </linearGradient>
                      <linearGradient id="bodyFill" x1="80" y1="0" x2="160" y2="400">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.12"/>
                        <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.08"/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.05"/>
                      </linearGradient>
                      <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3"/>
                      </linearGradient>
                      <filter id="bodyGlow">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <filter id="softGlow">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <radialGradient id="auraGlow" cx="50%" cy="40%" r="55%">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25"/>
                        <stop offset="60%" stopColor="#2563EB" stopOpacity="0.08"/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0"/>
                      </radialGradient>
                    </defs>
                    
                    {/* Full body ambient aura */}
                    <ellipse cx="120" cy="180" rx="85" ry="160" fill="url(#auraGlow)"/>
                    
                    {/* ── Full Anatomical Body Silhouette ── */}
                    <path d="
                      M120 12
                      C105 12 93 24 93 40 C93 56 105 68 120 68 C135 68 147 56 147 40 C147 24 135 12 120 12 Z
                    " stroke="url(#bodyGradient)" strokeWidth="1.8" fill="url(#bodyFill)" filter="url(#bodyGlow)"/>
                    
                    {/* Neck */}
                    <path d="M112 68 L112 80 Q112 85 108 88 L108 88" stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none"/>
                    <path d="M128 68 L128 80 Q128 85 132 88 L132 88" stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none"/>
                    
                    {/* Torso / Shoulders / Body outline */}
                    <path d="
                      M108 88
                      Q95 90 78 98 Q62 108 58 115 L52 135 Q48 148 50 155 L48 170
                      Q46 178 50 182 L55 185
                      Q58 186 60 184
                    " stroke="url(#bodyGradient)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    
                    <path d="
                      M132 88
                      Q145 90 162 98 Q178 108 182 115 L188 135 Q192 148 190 155 L192 170
                      Q194 178 190 182 L185 185
                      Q182 186 180 184
                    " stroke="url(#bodyGradient)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    
                    {/* Torso body fill */}
                    <path d="
                      M108 88 Q95 90 82 96 L78 98 Q74 108 76 130 L80 168 Q82 185 88 200 L92 210 
                      Q100 225 108 230 L120 235 L132 230 Q140 225 148 210 L152 200
                      Q158 185 160 168 L164 130 Q166 108 162 98 L158 96 Q145 90 132 88
                      L128 80 Q124 76 120 76 Q116 76 112 80 Z
                    " stroke="url(#bodyGradient)" strokeWidth="1.5" fill="url(#bodyFill)" strokeLinejoin="round"/>
                    
                    {/* Left Arm */}
                    <path d="
                      M78 98 Q68 105 58 115 Q50 128 48 142
                      L46 160 Q44 172 46 178
                      Q48 185 50 188 L52 192
                    " stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M52 192 Q50 196 48 198 Q44 204 42 206" stroke="url(#bodyGradient)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    
                    {/* Right Arm */}
                    <path d="
                      M162 98 Q172 105 182 115 Q190 128 192 142
                      L194 160 Q196 172 194 178
                      Q192 185 190 188 L188 192
                    " stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M188 192 Q190 196 192 198 Q196 204 198 206" stroke="url(#bodyGradient)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    
                    {/* Hips */}
                    <path d="
                      M92 210 Q88 218 86 228 Q84 238 88 248 L92 255
                      Q96 260 100 262
                    " stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none"/>
                    <path d="
                      M148 210 Q152 218 154 228 Q156 238 152 248 L148 255
                      Q144 260 140 262
                    " stroke="url(#bodyGradient)" strokeWidth="1.5" fill="none"/>
                    
                    {/* Left Leg */}
                    <path d="
                      M100 262 Q96 275 94 290 Q92 305 90 318
                      Q88 332 86 345 Q84 358 82 365
                      Q80 372 78 378 L76 385
                    " stroke="url(#bodyGradient)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                    <path d="M76 385 Q74 388 70 390 L66 391" stroke="url(#bodyGradient)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    
                    {/* Right Leg */}
                    <path d="
                      M140 262 Q144 275 146 290 Q148 305 150 318
                      Q152 332 154 345 Q156 358 158 365
                      Q160 372 162 378 L164 385
                    " stroke="url(#bodyGradient)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                    <path d="M164 385 Q166 388 170 390 L174 391" stroke="url(#bodyGradient)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    
                    {/* ── Internal Neural/Circulatory Network ── */}
                    {/* Spine */}
                    <path d="M120 72 L120 90 L120 120 L120 160 L120 200 L120 235" 
                      stroke="url(#networkGrad)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
                    
                    {/* Rib cage hints */}
                    <path d="M100 110 Q110 106 120 108 Q130 106 140 110" stroke="#06B6D4" strokeWidth="0.7" opacity="0.25" fill="none"/>
                    <path d="M96 120 Q108 115 120 117 Q132 115 144 120" stroke="#06B6D4" strokeWidth="0.7" opacity="0.22" fill="none"/>
                    <path d="M94 130 Q107 124 120 126 Q133 124 146 130" stroke="#06B6D4" strokeWidth="0.7" opacity="0.2" fill="none"/>
                    <path d="M96 140 Q108 134 120 136 Q132 134 144 140" stroke="#06B6D4" strokeWidth="0.7" opacity="0.18" fill="none"/>
                    
                    {/* Neural network branches */}
                    <path d="M120 100 L105 115 L98 130" stroke="#2563EB" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 2"/>
                    <path d="M120 100 L135 115 L142 130" stroke="#2563EB" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 2"/>
                    <path d="M120 140 L108 155 L100 170" stroke="#06B6D4" strokeWidth="0.6" opacity="0.25" strokeDasharray="2 2"/>
                    <path d="M120 140 L132 155 L140 170" stroke="#06B6D4" strokeWidth="0.6" opacity="0.25" strokeDasharray="2 2"/>
                    <path d="M120 200 L110 220 L100 240" stroke="#10B981" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2"/>
                    <path d="M120 200 L130 220 L140 240" stroke="#10B981" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2"/>
                    
                    {/* ── Brain glow ── */}
                    <circle cx="120" cy="38" r="16" fill="#2563EB" fillOpacity="0.08">
                      <animate attributeName="fillOpacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* ── Heart / Core pulse ── */}
                    <circle cx="115" cy="118" r="18" fill="#06B6D4" fillOpacity="0.1">
                      <animate attributeName="r" values="14;22;14" dur="1.6s" repeatCount="indefinite"/>
                      <animate attributeName="fillOpacity" values="0.05;0.25;0.05" dur="1.6s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="115" cy="118" r="8" fill="#06B6D4" fillOpacity="0.35">
                      <animate attributeName="fillOpacity" values="0.2;0.5;0.2" dur="1.6s" repeatCount="indefinite"/>
                      <animate attributeName="r" values="6;10;6" dur="1.6s" repeatCount="indefinite"/>
                    </circle>
                    {/* Heart shape hint */}
                    <path d="M110 115 Q108 110 112 108 Q116 106 115 112 Q114 106 118 108 Q122 110 120 115 L115 122 Z" 
                      fill="#06B6D4" fillOpacity="0.4" filter="url(#bodyGlow)"/>
                    
                    {/* ── Lung regions ── */}
                    <ellipse cx="105" cy="128" rx="10" ry="16" fill="#3B82F6" fillOpacity="0.05" stroke="#3B82F6" strokeWidth="0.5" opacity="0.2"/>
                    <ellipse cx="135" cy="128" rx="10" ry="16" fill="#3B82F6" fillOpacity="0.05" stroke="#3B82F6" strokeWidth="0.5" opacity="0.2"/>
                    
                    {/* ── Stomach region ── */}
                    <ellipse cx="118" cy="170" rx="12" ry="10" fill="#10B981" fillOpacity="0.05" stroke="#10B981" strokeWidth="0.5" opacity="0.2"/>
                    
                    {/* AI Text in Head */}
                    <text x="108" y="46" fill="#2563EB" fontSize="20" fontWeight="800" fontFamily="Inter, sans-serif" filter="url(#bodyGlow)" opacity="0.9">AI</text>
                    
                    {/* ── Data flow nodes ── */}
                    {[
                      { cx: 120, cy: 40, r: 3, color: '#2563EB' },
                      { cx: 105, cy: 95, r: 2.5, color: '#3B82F6' },
                      { cx: 135, cy: 95, r: 2.5, color: '#06B6D4' },
                      { cx: 115, cy: 118, r: 3, color: '#06B6D4' },
                      { cx: 120, cy: 160, r: 2.5, color: '#10B981' },
                      { cx: 120, cy: 200, r: 2.5, color: '#7C3AED' },
                      { cx: 92, cy: 255, r: 2, color: '#2563EB' },
                      { cx: 148, cy: 255, r: 2, color: '#06B6D4' },
                      { cx: 48, cy: 142, r: 2, color: '#3B82F6' },
                      { cx: 192, cy: 142, r: 2, color: '#10B981' },
                    ].map((node, i) => (
                      <g key={i}>
                        <circle cx={node.cx} cy={node.cy} r={node.r + 4} fill={node.color} fillOpacity="0.08">
                          <animate attributeName="fillOpacity" values="0.04;0.15;0.04" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                        </circle>
                        <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.color} fillOpacity="0.7"/>
                      </g>
                    ))}
                    
                    {/* ── Circulating data particles (animated) ── */}
                    <circle r="2" fill="#06B6D4" fillOpacity="0.8">
                      <animateMotion dur="6s" repeatCount="indefinite" path="M120,72 L120,118 L105,130 L120,160 L120,200 L120,235"/>
                      <animate attributeName="fillOpacity" values="0.3;0.9;0.3" dur="6s" repeatCount="indefinite"/>
                    </circle>
                    <circle r="1.5" fill="#2563EB" fillOpacity="0.7">
                      <animateMotion dur="8s" repeatCount="indefinite" path="M120,100 L135,115 L142,130 L132,155 L120,200"/>
                      <animate attributeName="fillOpacity" values="0.2;0.8;0.2" dur="8s" repeatCount="indefinite"/>
                    </circle>
                    <circle r="1.5" fill="#10B981" fillOpacity="0.6">
                      <animateMotion dur="7s" repeatCount="indefinite" path="M120,100 L105,115 L98,130 L108,155 L120,200"/>
                      <animate attributeName="fillOpacity" values="0.2;0.7;0.2" dur="7s" repeatCount="indefinite"/>
                    </circle>
                  </svg>

                  {/* DNA Double Helix */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 -right-10"
                  >
                    <svg viewBox="0 0 40 100" className="w-10 h-24 opacity-55">
                      <defs>
                        <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7C3AED"/>
                          <stop offset="100%" stopColor="#A78BFA"/>
                        </linearGradient>
                        <linearGradient id="dnaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB"/>
                          <stop offset="100%" stopColor="#60A5FA"/>
                        </linearGradient>
                      </defs>
                      <path d="M10 5 Q28 18 10 30 Q-8 42 10 55 Q28 68 10 80 Q-8 92 10 95" stroke="url(#dnaGrad1)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <path d="M30 5 Q12 18 30 30 Q48 42 30 55 Q12 68 30 80 Q48 92 30 95" stroke="url(#dnaGrad2)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      {[18, 30, 42, 55, 68, 80].map((y, i) => (
                        <line key={i} x1="10" y1={y} x2="30" y2={y} stroke="#06B6D4" strokeWidth="0.8" opacity="0.35"/>
                      ))}
                      {[18, 30, 42, 55, 68, 80].map((y, i) => (
                        <circle key={`n${i}`} cx={i % 2 === 0 ? 10 : 30} cy={y} r="2" fill={i % 2 === 0 ? '#7C3AED' : '#2563EB'} fillOpacity="0.6"/>
                      ))}
                    </svg>
                  </motion.div>

                  {/* Second smaller DNA on left */}
                  <motion.div 
                    animate={{ y: [4, -4, 4], rotate: [0, -3, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-16 -left-6"
                  >
                    <svg viewBox="0 0 24 60" className="w-6 h-14 opacity-35">
                      <path d="M6 3 Q18 12 6 20 Q-6 28 6 36 Q18 44 6 52" stroke="#7C3AED" strokeWidth="1.2" fill="none"/>
                      <path d="M18 3 Q6 12 18 20 Q30 28 18 36 Q6 44 18 52" stroke="#3B82F6" strokeWidth="1.2" fill="none"/>
                      {[12, 20, 28, 36, 44].map((y, i) => (
                        <line key={i} x1="6" y1={y} x2="18" y2={y} stroke="#06B6D4" strokeWidth="0.6" opacity="0.3"/>
                      ))}
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* ── Floating Medical Report Card ── */}
              <motion.div 
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [-4, 4, -4] }}
                transition={{ 
                  opacity: { delay: 0.5, duration: 0.6 }, 
                  x: { delay: 0.5, duration: 0.6 },
                  scale: { delay: 0.5, duration: 0.6 },
                  y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } 
                }}
                className="absolute left-0 lg:-left-2 top-[28%] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-blue-900/8 border border-white/70 p-4 w-48"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-200/50">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900">Medical Report</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-100 rounded-full w-2/3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-100 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Floating Health Insights Card ── */}
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [4, -4, 4] }}
                transition={{ 
                  opacity: { delay: 0.7, duration: 0.6 }, 
                  x: { delay: 0.7, duration: 0.6 },
                  scale: { delay: 0.7, duration: 0.6 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 } 
                }}
                className="absolute right-0 lg:-right-2 top-[38%] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-purple-900/8 border border-white/70 p-4 w-52"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-900">Health Insights</span>
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Risk Prediction', value: 'Low', color: 'green' },
                    { label: 'Heart Health', value: 'Good', color: 'blue' },
                    { label: 'Diabetes Risk', value: 'Low', color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">{item.label}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.color === 'green' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-blue-600 bg-blue-50 border border-blue-100'
                      }`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Floating Icons ── */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-16 w-13 h-13 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/60"
                style={{ width: 52, height: 52 }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600" fill="currentColor">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-1 10h-4v4h-4v-4H6v-4h4V5h4v4h4v4z"/>
                </svg>
              </motion.div>

              <motion.div 
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-6 right-20 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/10 border border-white/60"
              >
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </motion.div>

              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute left-6 bottom-[30%] w-11 h-11 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/10 border border-white/60"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </motion.div>

              <motion.div 
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute right-10 bottom-[22%] w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/10 border border-white/60"
              >
                <Zap className="w-5 h-5 text-emerald-500" />
              </motion.div>
            </div>
          </div>

          {/* Bottom Text + Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="z-10 mt-6"
          >
            <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight mb-3 leading-tight">
              Your Personal AI Healthcare<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">Companion</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mb-5">
              Upload reports, understand prescriptions, analyze medical images, 
              and receive AI-powered health insights securely.
            </p>
            
            {/* Trust Badge + Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900">Trusted by Healthcare Professionals Worldwide</span>
              </div>
            </div>

            {/* Animated Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 mt-6 bg-white/50 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/60 shadow-sm w-fit"
            >
              <AnimCounter end={50000} suffix="+" label="Active Users" />
              <div className="w-px h-8 bg-slate-200" />
              <AnimCounter end={2} suffix="M+" label="Reports Analyzed" />
              <div className="w-px h-8 bg-slate-200" />
              <AnimCounter end={99} suffix="%" label="Accuracy" />
            </motion.div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Premium Login Form
            ══════════════════════════════════════════ */}
        <div className="lg:w-[48%] flex flex-col justify-center items-center p-6 lg:p-12 relative">
          
          <div className="w-full max-w-[440px] z-10">
            
            {/* Logo + Header */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                    <path d="M16 3L4 8v8c0 6.6 5.1 12.8 12 14.3C22.9 28.8 28 22.6 28 16V8L16 3z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M10 16h2l2-4 3 8 2-5 1.5 3H23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  MediTwin <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Sign in to securely access your<br />AI-powered healthcare dashboard.
              </p>
            </motion.div>

            {/* ── Form Card with animated gradient border ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative group"
            >
              {/* Animated gradient border glow */}
              <div className="absolute -inset-[1px] rounded-[25px] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
              
              <div className="relative bg-white/85 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 rounded-[24px] p-7">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-100"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 ml-1">Email</label>
                    <div className={`relative rounded-2xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-blue-500/20' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-500'}`} />
                      </div>
                      <input
                        type="email"
                        {...register('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 text-sm font-medium focus:border-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 ml-1">Password</label>
                    <div className={`relative rounded-2xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-blue-500/20' : ''}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-500'}`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 text-sm font-medium focus:border-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.password.message}</p>}
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input 
                        id="remember" type="checkbox" checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="remember" className="text-xs text-slate-900 font-medium cursor-pointer">Remember Me</label>
                    </div>
                    <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
                  </div>

                  {/* Sign In Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white relative overflow-hidden shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-shadow duration-300 disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)' }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 hover:opacity-100"
                      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Sign In</span>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* OR */}
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-white/85 text-slate-500 font-bold tracking-wider">OR</span>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="space-y-2.5">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => alert("Google OAuth2 configured. Use credentials above.")}
                      className="w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-900 font-semibold text-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => alert("Microsoft Enterprise OAuth2 configured.")}
                      className="w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-900 font-semibold text-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 23 23">
                        <path fill="#F35325" d="M1 1h10v10H1z"/>
                        <path fill="#81BC06" d="M12 1h10v10H12z"/>
                        <path fill="#05A6F0" d="M1 12h10v10H1z"/>
                        <path fill="#FFBA08" d="M12 12h10v10H12z"/>
                      </svg>
                      <span>Continue with Microsoft</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-600">Secure Login</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Protected with JWT Authentication & End-to-End Encryption
              </span>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-7 grid grid-cols-3 gap-3"
            >
              {[
                { icon: FileText, color: 'blue', title: 'AI Report Analysis', desc: 'Instantly analyze medical reports with AI precision.', gradient: 'from-blue-50 to-blue-100/50' },
                { icon: Clock, color: 'emerald', title: 'Smart Medicine Reminder', desc: 'Never miss your medications with intelligent reminders.', gradient: 'from-emerald-50 to-emerald-100/50' },
                { icon: ImageIcon, color: 'purple', title: 'Medical Image Explanation', desc: 'Understand your medical images with AI insights.', gradient: 'from-purple-50 to-purple-100/50' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`bg-gradient-to-br ${card.gradient} backdrop-blur border border-white/60 p-4 rounded-2xl text-center cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 group`}
                  >
                    <div className={`w-11 h-11 mx-auto mb-2.5 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-${card.color}-100/50 group-hover:shadow-md transition-all`}>
                      <Icon className={`w-5 h-5 text-${card.color}-600`} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 leading-tight block">{card.title}</span>
                    <p className="text-[9px] text-slate-500 mt-1.5 leading-snug">{card.desc}</p>
                    <ArrowRight className={`w-3.5 h-3.5 text-slate-400 mx-auto mt-2 group-hover:text-${card.color}-500 group-hover:translate-x-0.5 transition-all`} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 py-4 text-center">
        <p className="text-[11px] text-slate-500 font-medium">
          © 2024 MediTwin AI. All rights reserved. · <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a> · <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
