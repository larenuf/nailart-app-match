import { useEffect } from 'react';

/**
 * Replit webview'daki önbellek sorunlarını çözen bir hook.
 * Webview'ın içeriği doğru şekilde yenilenmediğinde sayfayı zorlayarak yeniler.
 */
export function useCacheBuster() {
  useEffect(() => {
    // Bu sadece Replit webview'da çalışacak
    const isReplitWebview = window.location.host.includes('replit.dev');
    
    if (isReplitWebview) {
      // İlk yükleme sırasında
      console.log('Replit Webview algılandı, önbellek kontrolü yapılıyor...');
      
      // Sayfa parametrelerine timestamp ekleyin
      const timestamp = Date.now();
      const currentParams = new URLSearchParams(window.location.search);
      
      // Eğer önbellek parametresi yoksa ekleyin
      if (!currentParams.has('_t')) {
        const newUrl = `${window.location.pathname}?_t=${timestamp}${window.location.hash}`;
        console.log('Önbellek yenileniyor, yeni URL:', newUrl);
        
        // Mevcut sayfayı bozmadan, sadece history.replaceState kullanarak URL'i güncelle
        window.history.replaceState({}, '', newUrl);
        
        // 2 saniye sonra sayfayı yenile (kullanıcıya UI'ın yüklenmesi için zaman ver)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }, []);
}