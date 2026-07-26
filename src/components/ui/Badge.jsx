import React from 'react';

export const Badge = ({
  children,
  className = '',
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: Icon,
  ...props
}) => {
  const variants = {
    success: 'med-badge-success',
    warning: 'med-badge-warning',
    danger: 'med-badge-danger',
    info: 'med-badge-info',
    neutral: 'med-badge-neutral',
  };

  const variantClass = variants[variant] || variants.neutral;

  return (
    <span className={`${variantClass} ${className}`} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
