import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ children, className, delay = 0, hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={twMerge(
        "bg-white/80 backdrop-blur-xl border border-white/40 shadow-glass rounded-3xl p-6",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-dark hover:border-white/60",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
