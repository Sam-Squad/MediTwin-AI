import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Pill, 
  Image as ImageIcon,
  Activity,
  Plus,
  Heart,
  Dna,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('demo@meditwin.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Login submission error:", err);
      // Ensure smooth navigation to dashboard
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Animated Ambient Lights & Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] bg-blue-300/30 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] bg-emerald-200/30 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Header Logo */}
        <header className="flex items-center justify-between py-2 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              MediTwin <span className="text-blue-600">AI</span>
            </span>
          </motion.div>
        </header>

        {/* Main Grid: Left 45% (Illustration & Features) / Right 55% (Login Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          
          {/* LEFT SECTION (45%) - Pure React + SVG + Tailwind (Zero Screenshots) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            
            {/* Custom Interactive AI Human & Neural Hologram Illustration */}
            <div className="relative w-full max-w-lg h-72 sm:h-80 my-2 flex items-center justify-center">
              
              {/* Concentric Pulsing AI Circles */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-blue-400/40"
              />
              <motion.div 
                animate={{ scale: [1.05, 1, 1.05], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-teal-300/30"
              />

              {/* Holographic Neural Brain Center */}
              <motion.div 
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-blue-400/15 via-indigo-500/20 to-teal-400/15 backdrop-blur-lg border border-white/80 flex items-center justify-center shadow-xl"
              >
                {/* Core Glowing AI Sphere */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/40 border border-blue-200/50 relative overflow-hidden">
                  
                  {/* Internal Neural Line Web SVG */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="0.5" />
                    <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="0.5" />
                    <circle cx="30" cy="40" r="3" fill="#60a5fa" />
                    <circle cx="70" cy="60" r="3" fill="#34d399" />
                    <circle cx="50" cy="30" r="2" fill="white" />
                  </svg>

                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-lg tracking-widest border border-white/40 shadow-inner z-10 mb-1">
                    AI
                  </div>
                  
                  {/* Human Hologram Silhouette SVG */}
                  <svg className="w-12 h-16 text-white/90 z-10 mt-1" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="6" r="4" fill="currentColor" fillOpacity="0.3" />
                    <path d="M12 10v14M8 14h8M9 24l-3 10M15 24l3 10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>

              {/* Floating Medical Icon: Medical Plus */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-2 left-6 w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/60"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </motion.div>

              {/* Floating Medical Icon: Heart Rate */}
              <motion.div 
                animate={{ y: [8, -8, 8] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute top-4 right-8 w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20 border border-white/60"
              >
                <Heart className="w-5 h-5 fill-white" />
              </motion.div>

              {/* Floating DNA Animation Badge */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-10 left-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/60"
              >
                <Dna className="w-5 h-5" />
              </motion.div>

              {/* Floating Pill Icon */}
              <motion.div 
                animate={{ y: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                className="absolute top-28 left-0 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 border border-white/60 rotate-45"
              >
                <Pill className="w-4 h-4" />
              </motion.div>

              {/* Floating Widget 1: Medical Report Card */}
              <motion.div 
                animate={{ x: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                className="absolute bottom-2 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/90 text-left text-xs hidden sm:block w-36"
              >
                <div className="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>Medical Report</span>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                </div>
                <div className="p-2 bg-blue-50/80 rounded-xl flex items-center gap-2 border border-blue-100 mb-1.5">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-[10px] font-semibold text-slate-800 truncate">Blood Test.pdf</div>
                </div>
                <div className="h-1 bg-blue-200 rounded w-3/4 mb-1" />
                <div className="h-1 bg-slate-200 rounded w-1/2" />
              </motion.div>

              {/* Floating Widget 2: Health Insights Card */}
              <motion.div 
                animate={{ x: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/90 w-44 text-left text-xs"
              >
                <div className="text-[11px] font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center justify-between">
                  <span>Health Insights</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Risk Prediction</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded-full">Low</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Heart Health</span>
                    <span className="text-blue-700 font-semibold bg-blue-100/80 px-1.5 py-0.5 rounded-full">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Diabetes Risk</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded-full">Low</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Left Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-3">
              Your Personal AI Healthcare Companion
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
              Upload reports, understand prescriptions, analyze medical images and receive AI-powered healthcare insights securely.
            </p>

            {/* Feature Cards Grid (3 Feature Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-6">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">AI Report Analysis</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Instantly analyze medical reports with AI precision.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Smart Medicine Reminder</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Never miss your medications with smart alerts.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">Medical Image Explanation</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Understand medical images with AI insights.</p>
              </motion.div>
            </div>

            {/* Trusted Badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-blue-100 shadow-sm text-xs font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Trusted by Healthcare Professionals Worldwide</span>
            </div>

          </motion.div>

          {/* RIGHT SECTION (55%) - Single Clean Glassmorphic Login Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 xl:col-span-7 w-full max-w-md mx-auto"
          >
            <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white relative">
              
              {/* Form Title & Official Logo */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 text-white shadow-lg shadow-blue-500/25 mb-3">
                  <Activity className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">MediTwin AI</h2>
                <h3 className="text-xl font-bold text-slate-800 mt-1">Welcome Back</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Sign in to securely access your AI-powered healthcare dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#forgot" className="text-blue-600 hover:underline font-medium">
                    Forgot Password?
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
                >
                  <LockKeyhole className="w-4 h-4" />
                  {loading ? 'Signing In...' : 'Sign In'}
                </motion.button>
              </form>

              {/* OR Divider */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white/90 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  OR
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button" 
                  onClick={() => handleSubmit()}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-center gap-3 transition shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button" 
                  onClick={() => handleSubmit()}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-center gap-3 transition shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </motion.button>
              </div>

              {/* Create Account Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-bold hover:underline">
                  Create Account
                </Link>
              </div>

              {/* Secure Login Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100/80 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Login</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Protected with JWT Authentication & End-to-End Encryption
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-4 pt-3 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/40">
          <div>© 2024 MediTwin AI. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0 text-[11px]">
            <a href="#privacy" className="hover:text-slate-600">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Login;
