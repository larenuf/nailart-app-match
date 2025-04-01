import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface SalonCardSkeletonProps {
  index?: number;
}

const SalonCardSkeleton: React.FC<SalonCardSkeletonProps> = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-64 mb-4">
        <div className="relative h-32">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
        <CardContent className="pt-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex justify-between items-center mt-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const SalonCardSkeletonGroup: React.FC<{ count: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count).fill(0).map((_, index) => (
        <SalonCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};

export default SalonCardSkeleton;