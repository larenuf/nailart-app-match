import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { navigationHistory } from '@/lib/navigationHistory';

/**
 * Geri gitme fonksiyonu için custom hook
 * Bu hook, bir geri tuşuna tıklandığında yapılacak geri gitme işlemini sağlar
 */
export function useBackButton() {
  const [, setLocation] = useLocation();
  
  const goBack = useCallback(() => {
    // Geçmişte geri gidilebilecek bir sayfa var mı?
    if (navigationHistory.canGoBack()) {
      const previousPath = navigationHistory.back();
      console.log('Önceki sayfaya dönülüyor:', previousPath);
      
      // Eğer bir önceki sayfa varsa oraya git
      setLocation(previousPath);
      return true;
    } else {
      // Eğer gidecek bir önceki sayfa yoksa ana sayfaya git
      console.log('Gidilecek önceki sayfa yok, ana sayfaya yönlendiriliyor');
      setLocation('/');
      return false;
    }
  }, [setLocation]);
  
  return { goBack };
}