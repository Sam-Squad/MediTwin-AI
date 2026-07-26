import React from 'react';

export const Card = ({
  children,
  className = '',
  variant = 'default', // 'default' | 'glass' | 'gradient' | 'stat'
  padding = 'normal', // 'none' | 'small' | 'normal' | 'large'
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'med-card',
    glass: 'med-glass',
    gradient: 'med-card-gradient',
    stat: 'med-stat-card'
  };

  const paddings = {
    none: '',
    small: 'p-3',
    normal: 'p-5',
    large: 'p-7'
  };

  const variantStyle = variants[variant] || variants.default;
  const paddingStyle = paddings[padding] || paddings.normal;

  return (
    <div className={`${baseStyles} ${variantStyle} ${paddingStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
