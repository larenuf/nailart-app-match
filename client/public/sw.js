// Service Worker Versiyonu
const CACHE_VERSION = 'v1';

// Önbelleğe alınacak dosyalar
const STATIC_CACHE_NAME = `nail-match-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `nail-match-dynamic-${CACHE_VERSION}`;

// Önceden önbelleğe alınacak statik varlıklar
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Service Worker'ın kurulumu
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Önbelleğe alma işlemi tamamlanmadan service worker kurulumunu tamamlama
  event.waitUntil(
    // Statik önbelleği aç ve varlıkları ekle
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        // Tüm statik varlıkları önbelleğe ekle
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Precaching completed');
        // Aktif service worker'ı hemen kontrol almaya zorla
        return self.skipWaiting();
      })
  );
});

// Service Worker'ın aktifleşmesi
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Eski önbellekleri temizle
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        // Eski önbellekleri silme promiselerini oluştur
        return Promise.all(keyList.map(key => {
          // Mevcut versiyonun önbellekleri dışındaki tüm önbellekleri sil
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        // Tüm açık sekmelerde bu service worker'ı aktif hale getir
        return self.clients.claim();
      })
  );
  return self.clients.claim();
});

// Ağ isteklerini yakalama ve önbellek stratejisi
self.addEventListener('fetch', event => {
  // API istekleri için farklı stratejiler kullanalım
  if (event.request.url.includes('/api/')) {
    // API istekleri için Stale-While-Revalidate stratejisi
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // Yanıtı önbelleğe kaydet ve döndür (non-mutating istekler için)
            if (event.request.method === 'GET' && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Çevrimdışıysa önbellekteki yanıtı döndür
            return cache.match(event.request);
          });
      })
    );
  } else {
    // Diğer istekler için Cache-First stratejisi
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Önbellekte varsa, önbellekten döndür
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Önbellekte yoksa ağdan al ve dinamik önbelleğe ekle
          return fetch(event.request)
            .then(response => {
              // 404 veya benzer sorunlarda, yanıtı olduğu gibi döndür
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Yanıtı klonla (response stream'i bir kez kullanılabilir)
              const responseClone = response.clone();
              
              // Yanıtı dinamik önbelleğe ekle
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
                
              return response;
            })
            .catch(err => {
              // Offline sayfa servis etme veya özel bir hata sayfası
              console.log('[Service Worker] Fetch failed:', err);
              
              // HTML isteği için offline sayfasını göster
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
});

// Background Sync için olay dinleyicisi
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background Syncing', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(
      // IndexedDB'den bekleyen rezervasyonları al ve sunucuya gönder
      // Bu örnekte gerçekleştirilmemiştir, gerçek uygulamada IndexedDB kullanılacaktır
      console.log('[Service Worker] Syncing pending bookings')
    );
  }
});

// Push Bildirimleri için olay dinleyicisi
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Notification received', event);
  
  let data = { title: 'Yeni Bildirim', body: 'Yeni bir bildiriminiz var', icon: '/icons/icon-96x96.png' };
  
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Bildirime tıklama olayı
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;
  const url = notification.data.url;
  
  console.log('[Service Worker] Notification click', action);
  
  notification.close();
  
  // Bildirime tıklandığında uygulamayı aç
  event.waitUntil(
    clients.matchAll()
      .then(clis => {
        // Uygulama zaten açıksa, o pencereye odaklan
        const client = clis.find(c => c.visibilityState === 'visible');
        if (client) {
          client.navigate(url);
          client.focus();
        } else {
          // Değilse yeni pencere aç
          clients.openWindow(url);
        }
      })
  );
});