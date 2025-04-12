import { Server } from 'http';

import WebSocket, { WebSocketServer } from 'ws';

export function broadcastToAll(eventType: string, data: any) {
  if (!global.wss) return;
  global.wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: eventType, data }));
    }
  });
}

export function broadcastToRole(role: string, eventType: string, data: any) {
  // WebSocket devre dışı bırakıldı - mesaj gönderilmiyor
  console.log(`[WebSocket Devre Dışı] broadcastToRole çağrısı alındı: ${role}, ${eventType}`, data);
}

export function setupWebSocketServer(server: Server) {
  // WebSocket sunucusu geçici olarak devre dışı bırakıldı
  console.log('[WebSocket Devre Dışı] WebSocket sunucusu başlatılmadı');
  
  // API uyumluluğu için boş bir nesne döndür
  return {
    clients: new Set(),
    on: () => {},
    close: () => {},
  };
}