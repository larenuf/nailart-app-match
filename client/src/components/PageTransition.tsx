import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import React, { ReactNode, useEffect, useState } from 'react';

// Enhanced transition types with more options
type TransitionType = 
  'fade' | 
  'slide-left' | 
  'slide-right' | 
  'slide-up' | 
  'slide-down' |
  'scale' | 
  'flip-x' | 
  'flip-y' | 
  'rotate' |
  'bounce' |
  'elastic' |
  'staggered' |
  'wave';

// Expanded props for more customization options
interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  location?: string; // If provided, will only animate when this location matches current
  ease?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circIn' | 'circOut'; 
  delayChildren?: number;
  staggerChildren?: number;
}

export function PageTransition({
  children,
  type = 'fade',
  duration = 0.3,
  location: propLocation,
  ease = 'easeOut',
  delayChildren = 0.1,
  staggerChildren = 0.05
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
  
  // Define animation variants based on type with enhanced options
  const getVariants = () => {
    switch (type) {
      case 'slide-left':
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 }
        };
      case 'slide-right':
        return {
          initial: { x: -300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 300, opacity: 0 }
        };
      case 'slide-up':
        return {
          initial: { y: 300, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -300, opacity: 0 }
        };
      case 'slide-down':
        return {
          initial: { y: -300, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 300, opacity: 0 }
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      case 'flip-x':
        return {
          initial: { rotateX: 90, opacity: 0 },
          animate: { rotateX: 0, opacity: 1 },
          exit: { rotateX: -90, opacity: 0 }
        };
      case 'flip-y':
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
      case 'bounce':
        return {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 }
        };
      case 'elastic':
        return {
          initial: { scaleX: 0.5, scaleY: 0.5, opacity: 0 },
          animate: { scaleX: 1, scaleY: 1, opacity: 1 },
          exit: { scaleX: 0.5, scaleY: 0.5, opacity: 0 }
        };
      case 'staggered':
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { staggerChildren }
          },
          exit: { opacity: 0 },
          // These will be applied to all children
          children: {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -20, opacity: 0 }
          }
        };
      case 'wave':
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { staggerChildren }
          },
          exit: { opacity: 0 },
          // Creates a wave effect for children
          children: {
            initial: { scale: 0, opacity: 0 },
            animate: (i: number) => ({ 
              scale: 1, 
              opacity: 1,
              transition: { 
                delay: i * staggerChildren 
              }
            }),
            exit: { scale: 0, opacity: 0 }
          }
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
  
  // Determine the appropriate animation type
  const getTransitionSettings = () => {
    switch (type) {
      case 'bounce':
        return {
          type: 'spring',
          stiffness: 400,
          damping: 10
        };
      case 'elastic':
        return {
          type: 'spring',
          stiffness: 300,
          damping: 15
        };
      case 'flip-x':
      case 'flip-y':
        return {
          type: 'spring',
          stiffness: 100,
          damping: 20
        };
      case 'staggered':
      case 'wave':
        return {
          duration: duration,
          delayChildren: delayChildren,
          staggerChildren: staggerChildren
        };
      default:
        return {
          duration: duration,
          ease: ease,
          type: type.includes('slide') ? 'spring' : 'tween',
          stiffness: 300,
          damping: 20
        };
    }
  };
  
  // Extract children property if it exists
  const { children: childVariants, ...animationVariants } = variants as any;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animationVariants}
        transition={getTransitionSettings()}
        style={{
          width: '100%',
          height: '100%',
          perspective: type.includes('flip') ? 1200 : undefined,
          transformStyle: type.includes('flip') ? 'preserve-3d' : undefined
        }}
        className="page-transition-container"
      >
        {/* 
          If we're using a staggered animation, we need to wrap children
          with animations. Otherwise, just render them directly.
        */}
        {type === 'staggered' || type === 'wave' ? (
          <AnimateChildren variants={childVariants} type={type}>
            {children}
          </AnimateChildren>
        ) : (
          children
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Helper component for animating children in staggered animations
function AnimateChildren({ children, variants, type }: { 
  children: ReactNode, 
  variants: any,
  type: TransitionType
}) {
  // Split children into an array if it's not already
  const childrenArray = React.Children.toArray(children);
  
  return (
    <>
      {childrenArray.map((child: React.ReactNode, i: number) => (
        <motion.div
          key={i}
          custom={i}
          variants={variants}
          style={{ display: 'contents' }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}