import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { PremiumButton } from '../components/ui/PremiumButton';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const [error, setError] = useState('');
  
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-medical-500/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[100px]"
      />

      <div className="w-full max-w-md z-10 my-8">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-medical-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-glow-green mb-6"
          >
            <Sparkles className="text-white w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Create Account
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium mt-2"
          >
            Join MediTwin AI for personalized healthcare
          </motion.p>
        </div>

        <GlassCard delay={0.3} className="!p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  {...registerField('name')}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  {...registerField('email')}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  {...registerField('password')}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.password.message}</p>}
            </div>

            <PremiumButton 
              type="submit" 
              loading={isSubmitting}
              className="w-full mt-8"
              variant="medical"
            >
              Create Account
            </PremiumButton>
          </form>
        </GlassCard>

        <p className="text-center text-sm text-slate-900 mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
