import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  backgroundUrl?: string;
  height?: string;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  speed?: number;
  zIndex?: number;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

/**
 * ParallaxSection bileşeni sayfada kaydırma ile hareket eden bölümler oluşturur
 * 
 * @param children - Içerik
 * @param className - Ek CSS sınıfları
 * @param offset - Başlangıç offseti
 * @param direction - Hareket yönü
 * @param speed - Hareket hızı faktörü, 0-1 arası değerler
 * @param zIndex - z-index değeri
 * @param overlay - Renk katmanı eklenip eklenmeyeceği
 * @param overlayColor - Renk katmanı rengi
 * @param overlayOpacity - Renk katmanı şeffaflığı
 */
function ParallaxSection({
  children,
  className = '',
  backgroundUrl,
  height = 'auto',
  offset = 50,
  direction = 'up',
  speed = 0.3,
  zIndex = 0,
  overlay = backgroundUrl ? true : false,
  overlayColor = '#000',
  overlayOpacity = 0.4
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  const { scrollY } = useScroll();
  
  // Elementin pozisyonunu takip et
  useEffect(() => {
    if (!containerRef.current) return;
    
    const setValues = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      setElementTop(rect.top + window.scrollY);
      setClientHeight(window.innerHeight);
    };
    
    setValues();
    window.addEventListener('resize', setValues);
    return () => window.removeEventListener('resize', setValues);
  }, [containerRef]);
  
  // Kaydırma için kullanılacak çevirimi hesapla
  const getDirectionalValue = () => {
    switch (direction) {
      case 'up':
        return { y: [0, -offset] };
      case 'down':
        return { y: [0, offset] };
      case 'left':
        return { x: [0, -offset] };
      case 'right':
        return { x: [0, offset] };
      default:
        return { y: [0, -offset] };
    }
  };
  
  // Elementin görünürlüğünü kontrol et ve hareket et
  const { x, y } = getDirectionalValue();
  
  // Parallax efekt için yY değeri hesapla
  const transformY = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    y || [0, 0],
    { clamp: false }
  );
  
  // Parallax efekt için X değeri hesapla
  const transformX = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    x || [0, 0],
    { clamp: false }
  );
  
  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ zIndex, height }}
    >
      {/* Arkaplan resmi */}
      {backgroundUrl && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            x: transformX,
            y: transformY,
            backgroundImage: `url(${backgroundUrl})`,
          }}
        />
      )}
      
      {/* İçerik */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
      
      {/* Opsiyonel overlay katmanı */}
      {overlay && (
        <div 
          className="absolute inset-0 pointer-events-none z-5" 
          style={{ 
            backgroundColor: overlayColor, 
            opacity: overlayOpacity
          }}
        />
      )}
    </div>
  );
}

export default ParallaxSection;