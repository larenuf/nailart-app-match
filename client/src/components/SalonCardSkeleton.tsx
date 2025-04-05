import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

interface SalonCardSkeletonProps {
  count?: number;
  className?: string;
}

function SalonCardSkeletonItem() {
  return (
    <Card className="overflow-hidden border-none dark:border-gray-800 h-full shadow-md bg-white/80 dark:bg-gray-900/90">
      {/* Image skeleton */}
      <Skeleton className="h-36 w-full rounded-t-xl" />
      
      <CardContent className="p-3 pt-3 space-y-3">
        {/* Rating and open badge row */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        
        {/* Address */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
        
        {/* Hours */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        
        {/* Phone */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        
        {/* Promotion */}
        <Skeleton className="h-14 w-full rounded-lg" />
        
        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

function SalonCardSkeletonComponent({ count = 3, className = "" }: SalonCardSkeletonProps) {
  // Generate an array of the specified count
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((index) => (
        <div key={index} className="transform transition-all duration-300 h-full">
          <SalonCardSkeletonItem />
        </div>
      ))}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
const SalonCardSkeleton = memo(SalonCardSkeletonComponent);

export default SalonCardSkeleton;