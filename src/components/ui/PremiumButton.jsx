import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PremiumButton({ 
  children, 
  variant = 'primary', 
  className, 
  icon: Icon,
  loading = false,
  ...props 
}) {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-brand-500 text-white shadow-glow hover:shadow-glow-sm hover:bg-brand-600",
    secondary: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-brand-300 hover:text-brand-600",
    medical: "bg-medical-500 text-white shadow-glow-green hover:bg-medical-600",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(baseStyles, variants[variant], className)}
      disabled={loading}
      {...props}
    >
      {/* Inner glow effect for primary/medical */}
      {(variant === 'primary' || variant === 'medical') && (
        <div className="absolute inset-0 shadow-inner-glow rounded-2xl pointer-events-none" />
      )}
      
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} className={variant === 'primary' || variant === 'medical' ? 'text-white/90' : 'text-current'} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
