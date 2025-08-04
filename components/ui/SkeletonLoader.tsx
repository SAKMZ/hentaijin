import React from "react";

interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = "",
}) => {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
};

export const GalleryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <SkeletonLoader className="w-full aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-3 w-2/3" />
        <SkeletonLoader className="h-3 w-1/2" />
      </div>
    </div>
  );
};

export const GalleryGridSkeleton: React.FC<{ count?: number }> = ({
  count = 20,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  );
};
