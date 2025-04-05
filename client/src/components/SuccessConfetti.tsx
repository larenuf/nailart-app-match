import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { motion } from 'framer-motion';

interface SuccessConfettiProps {
  show: boolean;
  duration?: number;
  message?: string;
  onComplete?: () => void;
  recycle?: boolean;
  particleCount?: number;
}

/**
 * Başarılı işlemler sonrasında konfeti efekti gösterir
 * 
 * @param show - Konfeti gösterilsin mi?
 * @param duration - Konfeti süresi (ms)
 * @param message - Gösterilecek başarı mesajı
 * @param onComplete - Konfeti tamamlandığında çağrılacak fonksiyon
 * @param recycle - Parçacıklar yeniden kullanılsın mı (sonsuz loop için true, kısa animasyon için false)
 * @param particleCount - Parçacık sayısı
 */
export function SuccessConfetti({
  show,
  duration = 3000,
  message = 'İşlem başarıyla tamamlandı!',
  onComplete,
  recycle = false,
  particleCount = 200
}: SuccessConfettiProps) {
  const [showConfetti, setShowConfetti] = useState(show);
  const { width, height } = useWindowSize();
  
  // Belirtilen süre sonra konfeti gösterimini kapat
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      
      if (!recycle) {
        const timer = setTimeout(() => {
          setShowConfetti(false);
          if (onComplete) onComplete();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setShowConfetti(false);
    }
  }, [show, duration, recycle, onComplete]);
  
  // Mesaj animasyonları için varyantlar
  const variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -20,
      transition: {
        type: 'ease',
        duration: 0.4
      }
    }
  };
  
  return (
    <>
      {showConfetti && (
        <>
          <ReactConfetti
            width={width}
            height={height}
            recycle={recycle}
            numberOfPieces={particleCount}
            gravity={0.2}
            colors={[
              '#f472b6', // pink-400
              '#ec4899', // pink-500
              '#a855f7', // purple-500
              '#8b5cf6', // violet-500
              '#60a5fa', // blue-400
              '#22d3ee', // cyan-400
            ]}
          />
          
          {message && (
            <motion.div 
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-lg px-6 py-4 rounded-xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              <h3 className="text-lg font-bold text-center text-primary">{message}</h3>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}