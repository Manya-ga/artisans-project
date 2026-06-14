import React from 'react';

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClass = "bg-gray-200 animate-pulse";
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';
  
  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};

export const ProductSkeleton = () => (
  <div className="card-premium overflow-hidden p-4 space-y-4">
    <Skeleton className="aspect-square w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8" variant="circle" />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-12 h-12" variant="circle" />
    <Skeleton className="h-3 w-16" />
  </div>
);
