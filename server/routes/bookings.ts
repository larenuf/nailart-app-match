import { Router } from 'express';
import { storage } from '../storage';

export const bookingsRouter = Router();

// Kullanıcı randevularını getirme endpoint'i
bookingsRouter.get("/user", async (req, res) => {
  try {
    // Oturum açmış kullanıcı kontrolü
    if (!req.isAuthenticated()) {
      // İşe yarar bir önizleme veri seti gönder
      // Gerçek uygulamada, kimlik doğrulama gereklidir
      const demoBookings = [
        {
          id: 1,
          date: new Date().toISOString(),
          time: "14:30",
          status: "confirmed",
          salon: {
            id: 1,
            name: "NAM Nail Studio",
            address: "Bağdat Caddesi No: 123",
            district: "Kadıköy",
            imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&auto=format&fit=crop"
          },
          artist: {
            id: 1,
            name: "Ayşe Yılmaz",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
            specialization: "Nail Art Uzmanı"
          },
          service: {
            id: 1,
            name: "Klasik Manikür",
            price: 250,
            duration: 45
          },
          userId: 1
        },
        {
          id: 2,
          date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 gün sonra
          time: "16:00",
          status: "pending",
          salon: {
            id: 2,
            name: "Chic Nails",
            address: "İstiklal Caddesi No: 45",
            district: "Beyoğlu",
            imageUrl: "https://images.unsplash.com/photo-1610901157520-3c320582c2bd?w=800&auto=format&fit=crop"
          },
          artist: {
            id: 2,
            name: "Mehmet Kaya",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop", 
            specialization: "Jel Uzmanı"
          },
          service: {
            id: 2,
            name: "Jel Tırnak",
            price: 350,
            duration: 60
          },
          userId: 1
        },
        {
          id: 3,
          date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 gün önce
          time: "10:15",
          status: "completed",
          salon: {
            id: 1,
            name: "NAM Nail Studio",
            address: "Bağdat Caddesi No: 123",
            district: "Kadıköy",
            imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&auto=format&fit=crop"
          },
          artist: {
            id: 3,
            name: "Zeynep Demir",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
            specialization: "Pedikür Uzmanı"
          },
          service: {
            id: 3,
            name: "Pedikür",
            price: 300,
            duration: 50
          },
          userId: 1
        },
        {
          id: 4,
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 gün önce
          time: "13:45",
          status: "cancelled",
          salon: {
            id: 3,
            name: "Lux Beauty",
            address: "Nişantaşı Sok. No: 8",
            district: "Şişli",
            imageUrl: "https://images.unsplash.com/photo-1632344446982-3f08e62f68fb?w=800&auto=format&fit=crop"
          },
          artist: {
            id: 4,
            name: "Elif Şahin",
            imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
            specialization: "Nail Art Uzmanı"
          },
          service: {
            id: 4,
            name: "Kalıcı Oje",
            price: 200,
            duration: 30
          },
          userId: 1
        }
      ];
      
      return res.json(demoBookings);
    }
    
    // Gerçek uygulamada, veritabanından kullanıcının randevularını getirme
    const userId = req.user.id;
    const userBookings = await storage.getBookingsByUser(userId);
    
    res.json(userBookings);
  } catch (error) {
    console.error("Randevuları getirme hatası:", error);
    res.status(500).json({ error: "Randevular getirilirken bir hata oluştu" });
  }
});

// Randevu iptal etme endpoint'i
bookingsRouter.patch("/:id/cancel", async (req, res) => {
  try {
    // Oturum açmış kullanıcı kontrolü
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Bu işlem için giriş yapmanız gerekiyor" });
    }
    
    const bookingId = parseInt(req.params.id);
    const userId = req.user.id;
    
    // Randevu mevcut mu kontrol et
    const booking = await storage.getBooking(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: "Randevu bulunamadı" });
    }
    
    // Randevu bu kullanıcıya mı ait kontrol et
    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Bu randevuyu iptal etme yetkiniz yok" });
    }
    
    // Randevu durumunu güncelle
    const updatedBooking = await storage.updateBookingStatus(bookingId, "cancelled");
    
    res.json(updatedBooking);
  } catch (error) {
    console.error("Randevu iptal hatası:", error);
    res.status(500).json({ error: "Randevu iptal edilirken bir hata oluştu" });
  }
});