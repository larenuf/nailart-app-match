/**
 * WebSocket Override
 * Bu dosya, WebSocket kullanımını geçici olarak devre dışı bırakır
 * ve global WebSocket sınıfını ezdirir
 */

// Orijinal WebSocket referansını kaydedelim
const OriginalWebSocket = window.WebSocket;

// Sahte WebSocket sınıfı
class MockWebSocket {
  // WebSocket sabitleri
  static readonly CLOSED = 3;
  static readonly CLOSING = 2;
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  
  // Statik sabitleri nesne örneğinde de tanımla
  readonly CLOSED = 3;
  readonly CLOSING = 2;
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  
  // WebSocket özellikleri
  binaryType: BinaryType = 'blob';
  bufferedAmount: number = 0;
  extensions: string = '';
  protocol: string = '';
  readyState: number = MockWebSocket.CLOSED;
  url: string = '';
  
  // Event handlers
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent<any>) => any) | null = null;
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  
  // JSDOM için EventTarget özellikleri
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {}
  dispatchEvent(event: Event): boolean { return true; }
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {}
  
  // WebSocket metotları
  close(code?: number, reason?: string): void {
    console.log('[MockWebSocket] close called');
  }
  
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    console.log('[MockWebSocket] send called', data);
  }
  
  constructor(url: string, protocols?: string | string[]) {
    console.log('[MockWebSocket] Constructor called with URL:', url);
    
    // Hemen bağlantıyı kapattık olarak sinyalize edelim
    setTimeout(() => {
      if (this.onclose) {
        const closeEvent = new CloseEvent('close', {
          wasClean: false,
          code: 1006,
          reason: 'WebSocket functionality is disabled'
        });
        this.onclose.call(this, closeEvent);
      }
    }, 0);
  }
}

// Global WebSocket sınıfını ezdirelim
window.WebSocket = MockWebSocket;

console.log('[WebSocket] WebSocket sınıfı ezdirildi, tüm bağlantılar devre dışı bırakıldı');

export { MockWebSocket };