
import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

declare global {
  var wss: WebSocketServer;
}

export function broadcastToAll(eventType: string, data: any) {
  if (!global.wss) return;
  global.wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: eventType, data }));
    }
  });
}

export function broadcastToRole(role: string, eventType: string, data: any) {
  if (!global.wss) return;
  global.wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN && client.role === role) {
      client.send(JSON.stringify({ type: eventType, data }));
    }
  });
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });
  global.wss = wss;

  wss.on('connection', (ws: any) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'setRole') {
          ws.role = data.role;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  return wss;
}
