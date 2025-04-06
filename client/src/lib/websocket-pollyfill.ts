/**
 * WebSocket Polyfill
 * Bu dosya, WebSocket bağlantılarını taklit eden bir çözüm sağlar
 */

console.log('[WebSocket Polyfill] Aktivite başlıyor');

// WebSocket sınıfının mevcut haline bir referans tutalım
// @ts-ignore
const OriginalWebSocket = window.WebSocket;

// Bağlantı isteklerini yakalayıp hata mesajı döndüren bir fonksiyon oluştur
function createWebSocketShim() {
  // @ts-ignore
  window.WebSocket = function(url: string, protocols?: string | string[]) {
    console.log(`[WebSocket Shim] WebSocket bağlantısı devre dışı bırakıldı: ${url}`);
    
    // Sahte bağlantı nesnesini oluştur
    const mockSocket = {
      url,
      readyState: 3, // CLOSED
      send: (data: any) => console.log('[WebSocket Shim] send() çağrıldı:', data),
      close: () => console.log('[WebSocket Shim] close() çağrıldı'),
    };
    
    // Onclose event handler'ını çalıştır
    setTimeout(() => {
      // @ts-ignore
      if (this.onclose) {
        // @ts-ignore
        this.onclose({ 
          type: 'close',
          wasClean: false,
          code: 1006,
          reason: 'WebSocket disabled'
        });
      }
    }, 0);
    
    return mockSocket;
  };
  
  // Statik değerleri koru
  // @ts-ignore
  window.WebSocket.CONNECTING = 0;
  // @ts-ignore
  window.WebSocket.OPEN = 1;
  // @ts-ignore
  window.WebSocket.CLOSING = 2;
  // @ts-ignore
  window.WebSocket.CLOSED = 3;
}

// WebSocket taklit fonksiyonunu uygula
createWebSocketShim();

console.log('[WebSocket Polyfill] WebSocket bağlantıları devre dışı bırakıldı');