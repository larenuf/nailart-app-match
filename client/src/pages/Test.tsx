import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedOnScroll } from '@/components/AnimatedOnScroll';
import { MasonryGrid } from '@/components/MasonryGrid';
import { ParallaxSection } from '@/components/ParallaxSection';
import { SuccessConfetti } from '@/components/SuccessConfetti';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';

// UI bileşenlerini ve iyileştirmeleri test etmek için sayfa
export default function Test() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTransition, setCurrentTransition] = useState('fade');
  const [appStatus, setAppStatus] = useState('Uygulama yükleniyor...');
  
  useEffect(() => {
    console.log('Test sayfası mount edildi');
    setAppStatus('Sayfa yüklendi');
    
    // Diagnostik bilgilerini logla
    setTimeout(() => {
      console.log('URL:', window.location.href);
      console.log('User Agent:', navigator.userAgent);
      console.log('DOM Loaded:', document.readyState);
      
      // Sayfanın görünür olduğundan emin olalım
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
      document.body.style.display = 'block';
    }, 500);
    
    return () => {
      console.log('Test sayfası unmount edildi');
    };
  }, []);
  
  // Test için basitleştirilmiş bir içerik
  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Test Sayfası Status: {appStatus}</h1>
      
      <div className="p-4 border border-gray-300 rounded mb-4">
        <pre className="text-xs">{JSON.stringify({
          url: typeof window !== 'undefined' ? window.location.href : 'Yok',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'Yok',
          time: new Date().toISOString()
        }, null, 2)}</pre>
      </div>
      
      <div className="p-6 border border-gray-300 rounded mb-4 bg-pink-50">
        <h2 className="text-xl font-bold mb-4">Konfeti Testi</h2>
        <Button 
          onClick={() => setShowConfetti(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Konfeti Göster
        </Button>
        <SuccessConfetti 
          show={showConfetti} 
          onComplete={() => setShowConfetti(false)}
          message="Tebrikler! 🎉"
        />
      </div>
      
      <div className="p-6 border border-gray-300 rounded mb-4">
        <h2 className="text-xl font-bold mb-4">Animasyon Tipleri</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['fade', 'slide-left', 'slide-up', 'scale', 'flip-x', 'bounce'].map((type) => (
            <Button 
              key={type}
              variant={currentTransition === type ? "default" : "outline"}
              onClick={() => setCurrentTransition(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="text-center my-8">
        <h3 className="text-lg font-semibold mb-2">Test sayfası yüklendi. Bileşenler çalışıyor mu?</h3>
        <p>Bu sayfadan diğer sayfaları test edebilirsiniz.</p>
      </div>
    </div>
  );
}