
import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

declare global {
  var wss: WebSocketServer;
}

export function broadcastToAll(eventType: string, data: any) {
  if (!global.wss) {
    console.log('WebSocket server başlatılmamış');
    return;
  }
  global.wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: eventType, data }));
    }
  });
}

export function broadcastToRole(role: string, eventType: string, data: any) {
  if (!global.wss) {
    console.log('WebSocket server başlatılmamış');
    return;
  }
  global.wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN && client.role === role) {
      client.send(JSON.stringify({ type: eventType, data }));
    }
  });
}

export function setupWebSocketServer(server: Server) {
  if (global.wss) {
    console.log('WebSocket server zaten çalışıyor');
    return global.wss;
  }

  const wss = new WebSocketServer({ 
    server,
    port: undefined,
    host: '0.0.0.0'
  });
    
  global.wss = wss;

  wss.on('connection', (ws: any) => {
    console.log('Yeni WebSocket bağlantısı kuruldu');
      
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'setRole') {
          ws.role = data.role;
          console.log('Rol atandı:', data.role);
        }
      } catch (error) {
        console.error('WebSocket mesaj hatası:', error);
      }
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket bağlantı hatası:', error);
    });

    ws.on('close', () => {
      console.log('İstemci bağlantısı kapandı');
    });
  });

  wss.on('error', (error: Error) => {
    console.error('WebSocket server hatası:', error);
  });

  return wss;
}
