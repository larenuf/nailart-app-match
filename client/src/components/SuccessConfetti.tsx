import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
// Window boyutunu izlemek için inline hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

interface SuccessConfettiProps {
  duration?: number;
}

export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ 
  duration = 5000 
}) => {
  const [isActive, setIsActive] = useState(true);
  const { width, height } = useWindowSize();

  // Konfeti için renkler
  const colors = ['#FFC0CB', '#FF69B4', '#FFB6C1', '#FF1493', '#DB7093', '#C71585', '#9370DB', '#BA55D3'];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isActive) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={400}
      gravity={0.2}
      colors={colors}
      confettiSource={{
        x: width / 2,
        y: height / 3,
        w: 0,
        h: 0
      }}
    />
  );
};

export default SuccessConfetti;