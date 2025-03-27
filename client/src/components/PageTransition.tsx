import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ReactNode, useEffect, useState } from 'react';

type TransitionType = 'fade' | 'slide' | 'scale' | 'flip' | 'rotate';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  location?: string; // If provided, will only animate when this location matches current
}

export function PageTransition({
  children,
  type = 'fade',
  duration = 0.3,
  location: propLocation
}: PageTransitionProps) {
  const [location] = useLocation();
  const [key, setKey] = useState(location);
  
  // If propLocation is provided, only animate when the location matches
  const shouldAnimate = !propLocation || propLocation === location;
  
  // Update key when location changes, to trigger animation
  useEffect(() => {
    if (shouldAnimate) {
      setKey(location);
    }
  }, [location, shouldAnimate]);
  
  // Define animation variants based on type
  const getVariants = () => {
    switch (type) {
      case 'slide':
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 }
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      case 'flip':
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 }
        };
      case 'rotate':
        return {
          initial: { rotate: 10, opacity: 0, scale: 0.95 },
          animate: { rotate: 0, opacity: 1, scale: 1 },
          exit: { rotate: -10, opacity: 0, scale: 0.95 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  
  // Get the appropriate variants for the current transition type
  const variants = getVariants();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration,
          type: type === 'fade' ? 'tween' : 'spring',
          stiffness: type === 'flip' || type === 'rotate' ? 100 : 300,
          damping: 20
        }}
        style={{
          width: '100%',
          height: '100%',
          perspective: type === 'flip' ? 1200 : undefined
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}