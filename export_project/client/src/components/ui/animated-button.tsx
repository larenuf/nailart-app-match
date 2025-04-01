import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary-dark hover:to-primary"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        bounce: "",
        pulse: "",
        scale: "",
        shimmer: "relative overflow-hidden",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    },
  }
);

export interface AnimatedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, animation, asChild = false, isLoading = false, children, ...props }, ref) => {
    
    // Animation variants based on the animation prop
    const getAnimationProps = () => {
      if (isLoading) {
        return {
          animate: { opacity: [0.5, 1], transition: { yoyo: Infinity, duration: 0.5 } }
        };
      }
      
      switch (animation) {
        case 'bounce':
          return {
            whileHover: { y: -3 },
            whileTap: { y: 1 }
          };
        case 'pulse':
          return {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            transition: { type: 'spring', stiffness: 400, damping: 10 }
          };
        case 'scale':
          return {
            whileHover: { scale: 1.08 },
            whileTap: { scale: 0.9 },
            transition: { type: 'spring', stiffness: 400, damping: 17 }
          };
        case 'shimmer':
          return {
            // Shimmer effect is handled via CSS
          };
        default:
          return {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 }
          };
      }
    };
    
    // Shimmer effect css
    const shimmerClasses = animation === 'shimmer' 
      ? "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" 
      : "";
    
    // Add loading indicator
    const content = isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {children}
      </>
    ) : children;
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, animation }), shimmerClasses, className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
        {...getAnimationProps()}
      >
        {content}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };