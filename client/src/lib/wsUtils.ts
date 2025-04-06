// WebSocket yardımcı fonksiyonları

interface MockWebSocket {
  onopen: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  readyState: number;
  send: (data: string) => void;
  close: () => void;
}

// Sahte WebSocket sınıfı
class MockWebSocketImpl implements MockWebSocket {
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  readyState = 3; // WebSocket.CLOSED değeri

  send(data: string) {
    console.log('[Mock WebSocket] send:', data);
  }

  close() {
    console.log('[Mock WebSocket] close');
  }
}

// WebSocket yerine geçen bir fonksiyon
export function createWebSocket(url: string): WebSocket | MockWebSocket {
  console.log('[WebSocket] Devre dışı bırakıldı, sahte WebSocket kullanılıyor');
  return new MockWebSocketImpl();
}

// WebSocket istemci bağlantısı için kullanım örneği:
/*
import { createWebSocket } from '@/lib/wsUtils';

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;
const socket = createWebSocket(wsUrl);

socket.onopen = () => {
  console.log("WebSocket bağlantısı kuruldu");
};
*/