import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import { ApiError } from './middleware/errorHandler';

// WebSocket bağlantılarını depolamak için Set veri yapısı
const activeConnections: Set<WebSocket> = new Set();

// WebSocket istemci rolleri için Map
const clientRoles = new Map<WebSocket, string>();

// Tüm bağlı istemcilere mesaj gönderme
export function broadcastToAll(eventType: string, data: any) {
  const message = JSON.stringify({
    type: eventType,
    data: data,
    timestamp: new Date().toISOString()
  });
  
  activeConnections.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Belirli bir role sahip istemcilere mesaj gönderme
export function broadcastToRole(role: string, eventType: string, data: any) {
  const message = JSON.stringify({
    type: eventType,
    data: data,
    timestamp: new Date().toISOString()
  });
  
  activeConnections.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && clientRoles.get(client) === role) {
      client.send(message);
    }
  });
}

// Ping kontrolü ile bağlantı durumunu izleme
function heartbeat(this: WebSocket) {
  // @ts-ignore
  this.isAlive = true;
}

export function setupWebSocketServer(server: Server) {
  // WebSocket sunucusunu oluştur
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
    // 10 MB maksimum mesaj boyutu
    maxPayload: 10 * 1024 * 1024 
  });
  
  // Bağlantı ping kontrolü için interval
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      // @ts-ignore
      if (ws.isAlive === false) {
        clientRoles.delete(ws);
        activeConnections.delete(ws);
        return ws.terminate();
      }
      
      // @ts-ignore
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // 30 saniyede bir ping kontrol et
  
  // Sunucu kapandığında interval'i temizle
  wss.on('close', () => {
    clearInterval(interval);
  });
  
  // Yeni bağlantı olduğunda
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    
    // Ping kontrolü için isAlive bayrağını ayarla
    // @ts-ignore
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    
    // Bağlantıyı aktif bağlantılar listesine ekle
    activeConnections.add(ws);
    
    // Temel yetkilendirme (geliştirilebilir)
    const { query } = parse(req.url || '', true);
    if (query.role && typeof query.role === 'string') {
      clientRoles.set(ws, query.role);
    } else {
      clientRoles.set(ws, 'user'); // Varsayılan olarak user rolü
    }
    
    // Hoş geldin mesajı gönder
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Nail Art Match WebSocket server',
      role: clientRoles.get(ws),
      timestamp: new Date().toISOString()
    }));
    
    // Bağlantı kapandığında temizle
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      clientRoles.delete(ws);
      activeConnections.delete(ws);
    });
    
    // Hata durumunu ele al
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    });
    
    // Gelen mesajları işle
    ws.on('message', (message) => {
      try {
        // Mesajı JSON olarak parse et
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Mesaj format doğrulaması
        if (!data.type) {
          throw new ApiError(400, 'Geçersiz mesaj formatı: type alanı gereklidir');
        }

        // Admin yetkisi gerektiren işlemler
        const adminActions = ['salon_update', 'artist_update', 'service_update', 'story_update', 'review_update'];
        
        if (adminActions.includes(data.type) && clientRoles.get(ws) !== 'admin') {
          // Admin yetkisi kontrolü
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Bu işlem için yetkiniz yok.',
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Mesaj tipine göre işlem yap
        switch (data.type) {
          case 'booking_update':
            // Randevu güncellemelerini tüm bağlı istemcilere gönder
            broadcastToAll('booking_notification', data.data);
            break;
            
          case 'salon_update':
          case 'artist_update':
          case 'service_update':
          case 'story_update':
          case 'review_update':
            // İlgili içerik türü güncellendiğinde tüm bağlantılara bildir
            broadcastToAll(data.type, data.data);
            break;
            
          default:
            // Bilinmeyen mesaj tipi
            ws.send(JSON.stringify({
              type: 'error',
              message: `Bilinmeyen mesaj tipi: ${data.type}`,
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        
        // Hata mesajını istemciye bildir
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error instanceof ApiError ? 
              error.message : 
              'Mesaj işlenirken bir hata oluştu.',
            timestamp: new Date().toISOString()
          }));
        }
      }
    });
  });
  
  return wss;
}