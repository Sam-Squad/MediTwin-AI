import React from 'react';

export const LoadingSkeleton = ({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular'
  width,
  height,
  ...props
}) => {
  const variants = {
    text: 'h-4 w-3/4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`med-skeleton ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="med-card p-5 w-full flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <LoadingSkeleton variant="circular" className="w-10 h-10" />
      <div className="flex flex-col gap-2 flex-1">
        <LoadingSkeleton variant="text" className="w-1/3" />
        <LoadingSkeleton variant="text" className="w-1/4 h-3" />
      </div>
    </div>
    <div className="space-y-2 mt-2">
      <LoadingSkeleton variant="text" className="w-full" />
      <LoadingSkeleton variant="text" className="w-5/6" />
      <LoadingSkeleton variant="text" className="w-4/5" />
    </div>
  </div>
);

export default LoadingSkeleton;
