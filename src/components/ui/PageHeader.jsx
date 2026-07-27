import React from 'react';
import { motion } from 'framer-motion';

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  className = ''
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="p-2.5 rounded-2xl bg-white dark:bg-dark-50 shadow-card border border-slate-100 dark:border-slate-800 text-brand-500 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex shrink-0">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
