import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'med-btn-primary',
    secondary: 'med-btn-secondary',
    ghost: 'med-btn-ghost',
    danger: 'med-btn-danger',
    success: 'med-btn-success',
  };

  const sizes = {
    sm: 'med-btn-sm',
    md: '', // base size is included in variant
    lg: 'med-btn-lg',
    icon: 'med-btn-icon',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || '';
  const disabledClass = disabled || loading ? 'opacity-70 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${disabledClass} flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon && size !== 'icon' ? (
        <Icon className="w-4 h-4" />
      ) : null}
      
      {size === 'icon' && !loading && Icon ? <Icon className="w-5 h-5" /> : children}
    </button>
  );
};

export default Button;
