/**
 * Performans İyileştirme Yardımcıları
 * Bu dosya, uygulamanın performansını artıracak yardımcı fonksiyonları içerir
 */

import { useEffect } from 'react';
import { queryClient } from './queryClient';

// API isteklerini paralel hale getiren fonksiyon
export const runParallelQueries = async (queryKeys: string[]) => {
  return Promise.all(
    queryKeys.map(key => 
      queryClient.fetchQuery({ queryKey: [key] })
    )
  );
};

// Sayfa önbelleğini optimize eden hook
export const usePageCacheOptimizer = (cacheDuration = 5 * 60 * 1000) => {
  useEffect(() => {
    // Sayfanın görüntülenme zamanını kaydet
    const timeVisited = Date.now();
    
    return () => {
      // Bileşen kaldırıldığında mevcut önbellek süresini kontrol et
      const currentTime = Date.now();
      const timeOnPage = currentTime - timeVisited;
      
      // Sayfada belirli bir süreden az kaldıysak önbelleği koruyalım
      if (timeOnPage < 2000) {
        console.log('Sayfa hızlı terk edildi, önbellek korunuyor');
        // Önbellek süresini uzat
        const queries = queryClient.getQueryCache().findAll();
        queries.forEach(query => {
          // Mevcut sorgunun süresini uzat
          queryClient.setQueryDefaults(query.queryKey, {
            gcTime: cacheDuration,
            staleTime: cacheDuration / 2,
          });
        });
      }
    };
  }, [cacheDuration]);
};

// Sayfayı önceden yüklemeye yarayan fonksiyon
export const prefetchPage = async (pagePath: string, queryKeys: string[]) => {
  console.log(`Sayfa önceden yükleniyor: ${pagePath}`);
  
  try {
    // İlgili API endpoint'lerini önceden yükle
    await Promise.all(
      queryKeys.map(key => 
        queryClient.prefetchQuery({ queryKey: [key] })
      )
    );
  } catch (error) {
    console.error('Önceden yükleme hatası:', error);
  }
};

// Ağ isteklerini optimize eden fonksiyon
export const optimizeNetworkRequests = () => {
  // Gerçek bir uygulama için burada önbellek başlıkları ve 
  // hız optimizasyonları ayarlanabilir
  console.log('Ağ istekleri optimize ediliyor');
};