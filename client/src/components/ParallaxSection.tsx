import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  backgroundUrl: string;
  children: React.ReactNode;
  height?: string;
  speed?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundUrl,
  children,
  height = '50vh',
  speed = 0.5,
  overlayColor = '#000000',
  overlayOpacity = 0.4,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Paralaks efekti için transform değerini hesaplama
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8]);

  return (
    <div 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Arkaplan Resmi - Paralaks Efekti */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y,
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity,
        }}
      />
      
      {/* Resim Üzerindeki Kaplama/Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }} 
      />
      
      {/* İçerik */}
      <div className="relative z-20 h-full w-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;