import { useRef, useEffect, useState } from 'react';

interface TiltOptions {
  max?: number;       // Maximum tilt rotation (degrees)
  scale?: number;     // Scale on hover
  speed?: number;     // Speed of the enter/exit transition
  enabled?: boolean;  // Whether the effect is enabled
}

interface TiltResult {
  ref: React.RefObject<HTMLDivElement>;
}

export function useTilt({
  max = 25,
  scale = 1.05,
  speed = 400,
  enabled = true
}: TiltOptions = {}): TiltResult {
  const ref = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const element = ref.current;
    if (!element) return;
    
    // Perspective styles to be added to the element
    element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    element.style.transformStyle = 'preserve-3d';
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const middleX = rect.width / 2;
      const middleY = rect.height / 2;
      
      // Calculate rotation based on mouse position
      const rotateY = max * ((x - middleX) / middleX);
      const rotateX = max * -((y - middleY) / middleY);
      
      // Apply transform
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };
    
    const handleMouseLeave = () => {
      // Reset transform on mouse leave
      element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };
    
    const handleMouseEnter = () => {
      // Make sure transform is reset initially
      element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };
    
    // Add event listeners
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseenter', handleMouseEnter);
    
    // Clean up
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.style.transform = '';
      element.style.transition = '';
      element.style.transformStyle = '';
    };
  }, [max, scale, speed, isEnabled]);
  
  return { ref };
}