import { ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';

interface AnimatedOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  margin?: string;
  once?: boolean;
  distance?: number;
  staggerIndex?: number;
}

/**
 * Bileşen görünür olduğunda animasyon başlatan bir sarmalayıcı
 * Scroll tabanlı, görünürlüğe (intersection observer) dayalı animasyonlar için
 * 
 * @param children - İçerik
 * @param className - Ek CSS sınıfları
 * @param animation - Animasyon yönü/tipi
 * @param delay - Animasyon gecikmesi (saniye)
 * @param duration - Animasyon süresi (saniye)
 * @param threshold - Görünürlük eşiği (0-1)
 * @param margin - Root margin (intersection observer için)
 * @param once - Bir kez çalıştırılacak mı?
 * @param distance - Animasyon mesafesi (px)
 * @param staggerIndex - Çoklu öğeler için geciktirme indeksi
 */
export function AnimatedOnScroll({
  children,
  className = '',
  animation = 'fade',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  margin = '0px',
  once = true,
  distance = 50,
  staggerIndex = 0
}: AnimatedOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(ref, {
    threshold,
    rootMargin: margin,
    freezeOnceVisible: once
  });

  // Hareket tiplerine göre varyantlar
  const getVariants = () => {
    const baseDelay = delay + (staggerIndex * 0.1);
    
    switch (animation) {
      case 'up':
        return {
          hidden: { y: distance, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'down':
        return {
          hidden: { y: -distance, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'left':
        return {
          hidden: { x: distance, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'right':
        return {
          hidden: { x: -distance, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'rotate':
        return {
          hidden: { rotate: -10, opacity: 0, scale: 0.9 },
          visible: { 
            rotate: 0, 
            opacity: 1, 
            scale: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration,
              delay: baseDelay,
              ease: 'easeOut'
            }
          }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isIntersecting ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}