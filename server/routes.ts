import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertReviewSchema, insertPromotionSchema } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from './storage';
import { setupAuth } from "./auth";
import { setupWebSocketServer, broadcastToAll } from './websocket';
import uploadRoutes from './routes/upload';

// Mock Stripe implementation for now
const mockStripe = {
  paymentIntents: {
    create: async ({ amount, currency }: { amount: number; currency: string }) => {
      console.log(`Creating payment intent for ${amount} ${currency}`);
      return {
        client_secret: `mock_client_secret_${Date.now()}`,
        id: `pi_${Date.now()}`,
        amount,
        currency
      };
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Dosya yükleme API'lerini tanımla
  app.use('/api/upload', uploadRoutes);
  
  // ---------- ADMİN API ENDPOİNTLERİ ----------
  
  // Salon işlemleri
  app.get("/api/admin/salons", async (req, res) => {
    try {
      const salons = await storage.getSalons();
      res.json(salons);
    } catch (error) {
      res.status(500).json({ error: "Salonlar alınırken bir hata oluştu" });
    }
  });
  
  app.get("/api/admin/salons/:id", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ error: "Salon bulunamadı" });
      }
      
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: "Salon bilgileri alınırken bir hata oluştu" });
    }
  });
  
  // Bu endpoint aşağıda daha detaylı olarak tanımlandığı için kaldırıldı
  
  app.put("/api/admin/salons/:id", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.updateSalon(salonId, req.body);
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: "Salon güncellenirken bir hata oluştu" });
    }
  });
  
  app.delete("/api/admin/salons/:id", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      await storage.deleteSalon(salonId);
      res.json({ success: true, message: "Salon başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ error: "Salon silinirken bir hata oluştu" });
    }
  });
  
  // Salon durumunu güncelleme (aktif/pasif)
  app.patch("/api/admin/salons/:id/status", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        return res.status(400).json({ error: "isActive değeri gereklidir" });
      }
      
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ error: "Salon bulunamadı" });
      }
      
      // İki şekilde de durum güncellenebilmesi için
      const updatedSalon = await storage.updateSalon(salonId, { 
        isActive: isActive, 
        status: isActive ? "active" : "inactive" 
      });
      
      res.json(updatedSalon);
    } catch (error) {
      res.status(500).json({ error: "Salon durumu güncellenirken bir hata oluştu" });
    }
  });
  
  // Sanatçı işlemleri
  app.get("/api/admin/artists", async (req, res) => {
    try {
      const artists = await storage.getAllArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: "Sanatçılar alınırken bir hata oluştu" });
    }
  });
  
  app.get("/api/admin/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ error: "Sanatçı bulunamadı" });
      }
      
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Sanatçı bilgileri alınırken bir hata oluştu" });
    }
  });
  
  app.post("/api/admin/artists", async (req, res) => {
    try {
      const artist = await storage.createArtist(req.body);
      res.status(201).json(artist);
    } catch (error) {
      res.status(500).json({ error: "Sanatçı oluşturulurken bir hata oluştu" });
    }
  });
  
  app.put("/api/admin/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.updateArtist(artistId, req.body);
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Sanatçı güncellenirken bir hata oluştu" });
    }
  });
  
  app.delete("/api/admin/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      await storage.deleteArtist(artistId);
      res.json({ success: true, message: "Sanatçı başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ error: "Sanatçı silinirken bir hata oluştu" });
    }
  });
  
  // Hizmet işlemleri
  app.get("/api/admin/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Hizmetler alınırken bir hata oluştu" });
    }
  });
  
  app.get("/api/admin/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const service = await storage.getService(serviceId);
      
      if (!service) {
        return res.status(404).json({ error: "Hizmet bulunamadı" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Hizmet bilgileri alınırken bir hata oluştu" });
    }
  });
  
  app.post("/api/admin/services", async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: "Hizmet oluşturulurken bir hata oluştu" });
    }
  });
  
  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const service = await storage.updateService(serviceId, req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Hizmet güncellenirken bir hata oluştu" });
    }
  });
  
  app.delete("/api/admin/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      await storage.deleteService(serviceId);
      res.json({ success: true, message: "Hizmet başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ error: "Hizmet silinirken bir hata oluştu" });
    }
  });
  
  // Yorumları yönetme
  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Yorumlar alınırken bir hata oluştu" });
    }
  });
  
  app.put("/api/admin/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const updatedReview = await storage.updateReview(reviewId, {
        ...req.body,
        adminReviewed: true
      });
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('review_update', {
        action: 'update',
        review: updatedReview
      });
      
      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: "Yorum güncellenirken bir hata oluştu" });
    }
  });
  
  app.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      await storage.deleteReview(reviewId);
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('review_update', {
        action: 'delete',
        reviewId
      });
      
      res.json({ success: true, message: "Yorum başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ error: "Yorum silinirken bir hata oluştu" });
    }
  });
  
  // Admin istatistikleri
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      
      // Toplam salon sayısı
      const salons = await storage.getSalons();
      const activeSalons = salons.filter(salon => salon.status === "active").length;
      
      // Kullanıcı sayısı
      const users = await storage.getUsers();
      
      // Randevu sayısı
      const bookings = await storage.getAllBookings();
      
      // Bugünkü randevular
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today && bookingDate < tomorrow;
      });
      
      // Bekleyen randevular
      const pendingBookings = bookings.filter(booking => booking.status === "pending");
      
      // Yorumlar
      const reviews = await storage.getAllReviews();
      
      // Ortalama değerlendirme
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";
      
      // Son aktiviteler
      const recentActivities = [
        ...bookings.slice(0, 5).map(booking => ({
          id: booking.id,
          type: "appointment",
          message: "Yeni randevu oluşturuldu",
          user: `ID: ${booking.userId}`,
          time: new Date(booking.createdAt || new Date()).toLocaleString()
        })),
        ...reviews.slice(0, 5).map(review => ({
          id: review.id,
          type: "review",
          message: `Yeni yorum eklendi (${review.rating} yıldız)`,
          user: `ID: ${review.userId}`,
          time: new Date(review.createdAt || new Date()).toLocaleString()
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
       .slice(0, 5);
      
      // En iyi salonlar
      const topSalons = [...salons]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
        .map(salon => ({
          id: salon.id,
          name: salon.name,
          rating: salon.rating,
          bookings: bookings.filter(b => b.artistId && salon.id === b.artistId).length
        }));
      
      // Tüm istatistikler
      const stats = {
        totalSalons: salons.length,
        activeSalons,
        totalUsers: users.length,
        totalAppointments: bookings.length,
        pendingAppointments: pendingBookings.length,
        todayAppointments: todayBookings.length,
        totalReviews: reviews.length,
        unreviewedComments: reviews.filter(r => !r.adminReviewed).length,
        averageRating,
        recentActivity: recentActivities,
        topSalons,
        popularCategories: [
          { id: 1, name: "Manikür", count: 1245 },
          { id: 2, name: "Pedikür", count: 832 },
          { id: 3, name: "Protez Tırnak", count: 678 }
        ]
      };
      
      res.json(stats);
    } catch (error: any) {
      console.error("Admin istatistikleri alınırken hata:", error);
      res.status(500).json({ 
        message: error.message,
        error: "Admin istatistikleri alınamadı"
      });
    }
  });
  
  // Admin salon yönetimi - salon oluşturma
  app.post("/api/admin/salons", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      
      const salonData = req.body;
      
      // Salon verilerini doğrula
      if (!salonData.name || !salonData.address) {
        return res.status(400).json({ message: "Salon adı ve adresi gereklidir" });
      }
      
      // Salon oluştur
      const newSalon = await storage.createSalon({
        name: salonData.name,
        address: salonData.address,
        phoneNumber: salonData.phoneNumber || "",
        latitude: salonData.latitude || 0,
        longitude: salonData.longitude || 0,
        rating: 0,
        reviewCount: 0,
        openTime: salonData.openTime || "09:00",
        closeTime: salonData.closeTime || "18:00",
        imageUrl: salonData.imageUrl || "https://images.unsplash.com/photo-1632345031435-8727f6897d53",
        discount: salonData.discount || "",
        distance: 0,
        isPremium: salonData.isPremium || false,
        isActive: salonData.isActive !== undefined ? salonData.isActive : true,
        city: salonData.city || "İstanbul",
        district: salonData.district || "",
        description: salonData.description || "",
        email: salonData.email || "",
        website: salonData.website || "",
        specialFeatures: salonData.specialFeatures || ""
      });
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('salon_update', {
        action: 'create',
        salon: newSalon
      });
      
      res.status(201).json(newSalon);
    } catch (error: any) {
      console.error("Salon oluşturulurken hata:", error);
      res.status(500).json({ 
        message: error.message,
        error: "Salon oluşturulamadı"
      });
    }
  });
  
  // Admin kullanıcı listesi
  app.get("/api/admin/users", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      
      const users = await storage.getUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Story yönetimi - Admin API'leri
  app.get("/api/admin/stories", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ error: "Hikayeler alınırken bir hata oluştu" });
    }
  });
  
  app.post("/api/admin/stories", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      const storyData = req.body;
      
      if (!storyData.title || !storyData.imageUrl) {
        return res.status(400).json({ error: "Hikaye başlığı ve resim URL'si gereklidir" });
      }
      
      const newStory = await storage.createStory({
        title: storyData.title,
        imageUrl: storyData.imageUrl,
        highlighted: storyData.highlighted || false,
        videoUrl: storyData.videoUrl || null
      });
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('story_update', {
        action: 'create',
        story: newStory
      });
      
      res.status(201).json(newStory);
    } catch (error: any) {
      console.error("Hikaye oluşturulurken hata:", error);
      res.status(500).json({ 
        message: error.message,
        error: "Hikaye oluşturulamadı"
      });
    }
  });
  
  app.put("/api/admin/stories/:id", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      const storyId = parseInt(req.params.id);
      const storyData = req.body;
      
      const updatedStory = await storage.updateStory(storyId, storyData);
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('story_update', {
        action: 'update',
        story: updatedStory
      });
      
      res.json(updatedStory);
    } catch (error: any) {
      console.error("Hikaye güncellenirken hata:", error);
      res.status(500).json({ 
        message: error.message,
        error: "Hikaye güncellenemedi"
      });
    }
  });
  
  app.delete("/api/admin/stories/:id", async (req, res) => {
    try {
      // Admin yetkisi kontrolü yapılabilir (şimdilik atlanıyor)
      const storyId = parseInt(req.params.id);
      
      await storage.deleteStory(storyId);
      
      // Gerçek zamanlı güncelleme gönder
      broadcastToAll('story_update', {
        action: 'delete',
        storyId
      });
      
      res.json({ success: true, message: "Hikaye başarıyla silindi" });
    } catch (error: any) {
      console.error("Hikaye silinirken hata:", error);
      res.status(500).json({ 
        message: error.message,
        error: "Hikaye silinemedi"
      });
    }
  });
  
  // Genel API - Tüm hikayeleri getir
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all salons
  app.get("/api/salons", async (req, res) => {
    try {
      const salons = await storage.getSalons();
      res.json(salons);
    } catch (error: any) {
      console.error("Error fetching all salons:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get featured salons
  app.get("/api/salons/featured", async (req, res) => {
    try {
      const salons = await storage.getFeaturedSalons();
      res.json(salons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get salon for logged in salon owner
  app.get("/api/my-salon", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      // Kullanıcının rolü kontrol edilebilir, ama şimdilik herhangi bir kaydedilmiş salon dönelim
      const salons = await storage.getSalons();
      const firstSalon = salons[0];
      
      if (!firstSalon) {
        return res.status(404).json({ message: "Salon bulunamadı" });
      }
      
      res.json(firstSalon);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get salon by ID
  app.get("/api/salons/:id", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      res.json(salon);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get artists by salon ID
  app.get("/api/salons/:id/artists", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      console.log(`Getting artists for salon ID: ${salonId}`);
      
      const salon = await storage.getSalon(salonId);
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      console.log(`Found salon: ${salon.name}`);
      
      // Get all artists for debugging
      const allArtists = await storage.getAllArtists();
      console.log(`Total artists in system: ${allArtists.length}`);
      console.log(`All artists:`, allArtists.map(a => ({ id: a.id, name: a.name, salonId: a.salonId })));
      
      // Get filtered artists
      const artists = await storage.getArtistsBySalon(salonId);
      console.log(`Found ${artists.length} artists for salon ID ${salonId}`);
      
      res.json(artists);
    } catch (error: any) {
      console.error(`Error getting artists for salon ID ${req.params.id}:`, error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get artist by ID
  app.get("/api/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json(artist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get services by artist ID
  app.get("/api/artists/:id/services", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      const services = await storage.getServicesByArtist(artistId);
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get service by ID
  app.get("/api/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const service = await storage.getService(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get portfolio by artist ID
  app.get("/api/artists/:id/portfolio", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      const portfolioItems = await storage.getPortfolioByArtist(artistId);
      res.json(portfolioItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get available time slots for an artist on a specific date
  app.get("/api/artists/:id/timeslots", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const dateParam = req.query.date as string;
      
      if (!dateParam) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateParam);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const timeSlots = await storage.getAvailableTimeSlots(artistId, date);
      res.json(timeSlots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const result = insertBookingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: result.error.errors 
        });
      }
      
      const booking = await storage.createBooking(result.data);
      
      // Mark the time slot as booked
      const timeSlots = await storage.getAvailableTimeSlots(
        booking.artistId, 
        booking.date
      );
      
      const matchingSlot = timeSlots.find(
        slot => slot.startTime === booking.startTime
      );
      
      if (matchingSlot) {
        await storage.bookTimeSlot(matchingSlot.id);
      }
      
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get bookings by user ID
  app.get("/api/users/:id/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we would validate the request body
      const updatedUser = await storage.updateUser(userId, req.body);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment route for processing payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, serviceId } = req.body;
      
      // For demo only, in real implementation we would verify the service exists
      if (serviceId) {
        const service = await storage.getService(parseInt(serviceId));
        if (!service) {
          return res.status(404).json({ error: "Service not found" });
        }
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await mockStripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // AI Assistant Chat API endpoints
  app.get("/api/ai-chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/ai-chat/messages", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message text is required" });
      }
      
      // Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      await storage.addChatMessage(userMessage);
      
      // AI Güzellik Danışmanı - Gelişmiş Yanıt Sistemi
      setTimeout(async () => {
        let responseText = '';
        
        // Gelişmiş pattern matching ve bağlam analizi
        const lowercaseMessage = message.toLowerCase();
        
        // Selamlama mesajları
        if (lowercaseMessage.includes('merhaba') || lowercaseMessage.includes('selam') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
          responseText = 'Merhaba! Ben AI Güzellik Danışmanınız. Tırnak bakımı, oje renkleri, nail art tasarımları veya en yakın salonlar hakkında sorularınızı yanıtlayabilirim. Size nasıl yardımcı olabilirim?';
        }
        
        // Tırnak bakımı ve sağlığı hakkında
        else if (lowercaseMessage.includes('tırnak bakım') || lowercaseMessage.includes('nail care') || lowercaseMessage.includes('tırnak sağlığı')) {
          responseText = 'Sağlıklı tırnaklar için birkaç önemli ipucu:\n\n1. Düzenli olarak nemlendirici kullanın ve tırnak etlerini besleyin\n2. Asetonu sık kullanmaktan kaçının, tırnakları kurutur\n3. Protein açısından zengin gıdalar tüketin (yumurta, balık, baklagiller)\n4. Biotin ve E vitamini destekleri tırnak sağlığına yardımcı olabilir\n5. Eldivenle temizlik yapın, kimyasallar tırnaklara zarar verir\n\nÖzel bir konuda daha fazla bilgi ister misiniz?';
        }
        
        // Tırnak trendleri ve stil önerileri
        else if (lowercaseMessage.includes('trend') || lowercaseMessage.includes('popüler') || lowercaseMessage.includes('moda') || lowercaseMessage.includes('stil')) {
          responseText = '2025 yılının en trend tırnak stilleri:\n\n1. Minimalist geometrik desenler\n2. "Glazed donut" parlak, inci efektli ojeler\n3. Mikro-gem ve üç boyutlu aplikasyonlar\n4. Matlaştırılmış, dokulu yüzeyler\n5. Neon ve canlı renklerde "French tip"\n6. Doğadan ilham alan organik desenler\n\nKişisel stiliniz ve ten renginize göre özelleştirilmiş öneriler için "ten rengime uygun" diye sorabilirsiniz.';
        }
        
        // Başka bir tematik yanıt yoksa genel yanıt ver
        else {
          responseText = 'Tırnak bakımı, oje renkleri veya nail art teknikleri hakkında daha spesifik sorularınız varsa sorabilirsiniz. Size en iyi şekilde yardımcı olmaya çalışacağım!';
        }
        
        // Yapay zeka yanıtını ekle
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        };
        await storage.addChatMessage(aiMessage);
        
        // WebSocket ile gerçek zamanlı yanıt gönderimi yapılabilir
      }, 1000);
      
      // Hemen başarılı yanıt döndür, AI yanıtı arkada oluşturulacak
      res.status(201).json(userMessage);
    } catch (error: any) {
      console.error("Error adding chat message:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Live Chat API endpoints for salon-user chat
  app.get("/api/chat/by-user/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const userId = parseInt(req.params.userId);
      const chats = await storage.getChatsByUser(userId);
      
      // Populate salon details for each chat
      const chatsWithDetails = await Promise.all(
        chats.map(async (chat) => {
          const salon = await storage.getSalon(chat.salonId);
          const unreadCount = await storage.getUnreadMessageCount(chat.id, userId);
          return {
            ...chat,
            salon,
            unreadCount
          };
        })
      );
      
      res.json(chatsWithDetails);
    } catch (error: any) {
      console.error("Error getting user chats:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/chat/by-salon/:salonId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const salonId = parseInt(req.params.salonId);
      const chats = await storage.getChatsBySalon(salonId);
      
      // Populate user details for each chat
      const chatsWithDetails = await Promise.all(
        chats.map(async (chat) => {
          const user = await storage.getUser(chat.userId);
          const unreadCount = await storage.getUnreadMessageCount(chat.id, chat.salonId);
          return {
            ...chat,
            user,
            unreadCount
          };
        })
      );
      
      res.json(chatsWithDetails);
    } catch (error: any) {
      console.error("Error getting salon chats:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/chat/:chatId/messages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const chatId = parseInt(req.params.chatId);
      const messages = await storage.getChatMessagesByChatId(chatId);
      
      res.json(messages);
    } catch (error: any) {
      console.error("Error getting chat messages:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/chat/start", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const { userId, salonId } = req.body;
      
      if (!userId || !salonId) {
        return res.status(400).json({ message: "userId ve salonId gereklidir" });
      }
      
      // Önce varolan bir sohbet var mı diye kontrol et
      let chat = await storage.getChat(userId, salonId);
      
      if (!chat) {
        // Yeni sohbet oluştur
        chat = await storage.createChat({
          userId,
          salonId,
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      res.status(201).json(chat);
    } catch (error: any) {
      console.error("Error starting chat:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/chat/:chatId/messages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const chatId = parseInt(req.params.chatId);
      const { text, senderType, senderId } = req.body;
      
      if (!text || !senderType || !senderId) {
        return res.status(400).json({ message: "text, senderType ve senderId gereklidir" });
      }
      
      // Mesajı ekle
      const message = await storage.addChatMessageToChat({
        chatId,
        text,
        senderType,
        senderId,
        isRead: false,
        createdAt: new Date()
      });
      
      // WebSocket ile gerçek zamanlı bildirim gönder
      broadcastToAll('new_chat_message', {
        chatId,
        message
      });
      
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error adding message:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/chat/:chatId/mark-read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const chatId = parseInt(req.params.chatId);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "userId gereklidir" });
      }
      
      await storage.markChatMessagesAsRead(chatId, userId);
      
      // WebSocket ile gerçek zamanlı bildirim gönder
      broadcastToAll('messages_marked_read', {
        chatId,
        userId
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Favorites API endpoints
  app.get("/api/favorites/user/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Kullanıcının tüm favorilerini getir
      const favorites = await storage.getFavoritesByUser(userId);
      
      // Favori detaylarını doldur (salon, artist, service bilgileri)
      const favoritesWithDetails = await Promise.all(
        favorites.map(async (favorite) => {
          let item = null;
          
          if (favorite.type === 'salon' && favorite.salonId) {
            item = await storage.getSalon(favorite.salonId);
          } else if (favorite.type === 'artist' && favorite.artistId) {
            item = await storage.getArtist(favorite.artistId);
          } else if (favorite.type === 'service' && favorite.serviceId) {
            item = await storage.getService(favorite.serviceId);
          }
          
          return {
            ...favorite,
            item
          };
        })
      );
      
      res.json(favoritesWithDetails);
    } catch (error: any) {
      console.error("Error getting user favorites:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/favorites/user/:userId/type/:type", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const userId = parseInt(req.params.userId);
      const type = req.params.type;
      
      // Geçerli tip kontrolü
      if (!['salon', 'artist', 'service'].includes(type)) {
        return res.status(400).json({ message: "Geçersiz favori tipi. 'salon', 'artist' veya 'service' olmalı." });
      }
      
      // Belirli tipte olan favorileri getir
      const favorites = await storage.getFavoritesByType(userId, type);
      
      // Favori detaylarını doldur
      const favoritesWithDetails = await Promise.all(
        favorites.map(async (favorite) => {
          let item = null;
          
          if (type === 'salon' && favorite.salonId) {
            item = await storage.getSalon(favorite.salonId);
          } else if (type === 'artist' && favorite.artistId) {
            item = await storage.getArtist(favorite.artistId);
          } else if (type === 'service' && favorite.serviceId) {
            item = await storage.getService(favorite.serviceId);
          }
          
          return {
            ...favorite,
            item
          };
        })
      );
      
      res.json(favoritesWithDetails);
    } catch (error: any) {
      console.error(`Error getting user ${req.params.type} favorites:`, error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/favorites", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const { userId, type, itemId } = req.body;
      
      if (!userId || !type || !itemId) {
        return res.status(400).json({ message: "userId, type ve itemId gereklidir" });
      }
      
      // Geçerli tip kontrolü
      if (!['salon', 'artist', 'service'].includes(type)) {
        return res.status(400).json({ message: "Geçersiz favori tipi. 'salon', 'artist' veya 'service' olmalı." });
      }
      
      // Eklenecek öğe var mı kontrol et
      let exists = false;
      if (type === 'salon') {
        const salon = await storage.getSalon(itemId);
        exists = !!salon;
      } else if (type === 'artist') {
        const artist = await storage.getArtist(itemId);
        exists = !!artist;
      } else if (type === 'service') {
        const service = await storage.getService(itemId);
        exists = !!service;
      }
      
      if (!exists) {
        return res.status(404).json({ message: "Favorilere eklenecek öğe bulunamadı" });
      }
      
      // Zaten favorilerde mi kontrol et
      const isFavorite = await storage.checkIsFavorite(userId, type, itemId);
      
      if (isFavorite) {
        return res.status(400).json({ message: "Bu öğe zaten favorilerinizde" });
      }
      
      // Favori ekle
      const favoriteData: any = {
        userId,
        type,
        createdAt: new Date()
      };
      
      // Tip'e göre id'yi doğru alana ekle
      if (type === 'salon') {
        favoriteData.salonId = itemId;
      } else if (type === 'artist') {
        favoriteData.artistId = itemId;
      } else if (type === 'service') {
        favoriteData.serviceId = itemId;
      }
      
      const favorite = await storage.addFavorite(favoriteData);
      
      // WebSocket ile gerçek zamanlı bildirim gönder
      broadcastToAll('favorite_update', {
        action: 'add',
        favorite
      });
      
      res.status(201).json(favorite);
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const favoriteId = parseInt(req.params.id);
      
      // Favoriden çıkar
      await storage.removeFavorite(favoriteId);
      
      // WebSocket ile gerçek zamanlı bildirim gönder
      broadcastToAll('favorite_update', {
        action: 'remove',
        favoriteId
      });
      
      res.json({ success: true, message: "Öğe favorilerden kaldırıldı" });
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/favorites/check", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Oturum açılmamış" });
      }
      
      const { userId, type, itemId } = req.query;
      
      if (!userId || !type || !itemId) {
        return res.status(400).json({ message: "userId, type ve itemId gereklidir" });
      }
      
      // Geçerli tip kontrolü
      if (!['salon', 'artist', 'service'].includes(type as string)) {
        return res.status(400).json({ message: "Geçersiz favori tipi. 'salon', 'artist' veya 'service' olmalı." });
      }
      
      // Favorilerde mi kontrol et
      const isFavorite = await storage.checkIsFavorite(
        parseInt(userId as string), 
        type as string, 
        parseInt(itemId as string)
      );
      
      res.json({ isFavorite });
    } catch (error: any) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Reviews API endpoints
        else if (lowercaseMessage.includes('tırnak bakım') || lowercaseMessage.includes('nail care') || lowercaseMessage.includes('tırnak sağlığı')) {
          responseText = 'Sağlıklı tırnaklar için birkaç önemli ipucu:\n\n1. Düzenli olarak nemlendirici kullanın ve tırnak etlerini besleyin\n2. Asetonu sık kullanmaktan kaçının, tırnakları kurutur\n3. Protein açısından zengin gıdalar tüketin (yumurta, balık, baklagiller)\n4. Biotin ve E vitamini destekleri tırnak sağlığına yardımcı olabilir\n5. Eldivenle temizlik yapın, kimyasallar tırnaklara zarar verir\n\nÖzel bir konuda daha fazla bilgi ister misiniz?';
        }
        
        // Tırnak trendleri ve stil önerileri
        else if (lowercaseMessage.includes('trend') || lowercaseMessage.includes('popüler') || lowercaseMessage.includes('moda') || lowercaseMessage.includes('stil')) {
          responseText = '2025 yılının en trend tırnak stilleri:\n\n1. Minimalist geometrik desenler\n2. "Glazed donut" parlak, inci efektli ojeler\n3. Mikro-gem ve üç boyutlu aplikasyonlar\n4. Matlaştırılmış, dokulu yüzeyler\n5. Neon ve canlı renklerde "French tip"\n6. Doğadan ilham alan organik desenler\n\nKişisel stiliniz ve ten renginize göre özelleştirilmiş öneriler için "ten rengime uygun" diye sorabilirsiniz.';
        }
        
        // Kişiye özel renk önerileri
        else if (lowercaseMessage.includes('ten reng') || lowercaseMessage.includes('cilt ton') || lowercaseMessage.includes('bana yakış') || lowercaseMessage.includes('benim için')) {
          responseText = 'Kişiye özel renk önerileri için ten tonunuzu bilmem gerekiyor. Eğer:\n\n• Açık/soluk tenliyseniz: Soft pembe, açık leylak, buz mavisi veya nötr nude tonlar\n• Orta/buğday tenliyseniz: Mercan, turkuaz, zümrüt yeşili, lavanta\n• Koyu/esmer tenliyseniz: Canlı kırmızı, kobalt mavi, mor tonları, altın sarısı\n\nDaha detaylı kişiselleştirilmiş öneriler için "Color Matcher" özelliğimizi de kullanabilirsiniz.';
        }
        
        // Nail art teknikleri
        else if (lowercaseMessage.includes('nail art') || lowercaseMessage.includes('desen') || lowercaseMessage.includes('tasarım') || lowercaseMessage.includes('süsleme')) {
          responseText = 'Nail art teknikleri çok çeşitli! İşte en popüler olanları:\n\n• Marble (mermer efekti): Su bazlı uygulamayla elde edilir\n• Foil (folyo): Metalik efekt için transfer folyoları kullanılır\n• Ombre: Renkler arasında yumuşak geçişler yapılır\n• French tip: Klasik beyaz uçlardan, renkli versiyonlara kadar değişebilir\n• Stamping: Özel kalıplarla desen transferi yapılır\n\nEvde hangi tekniği denemek istersiniz? Veya bir profesyonelden randevu almak için size yardımcı olabilirim.';
        }
        
        // Tırnak ürünleri ve malzemeleri
        else if (lowercaseMessage.includes('ürün') || lowercaseMessage.includes('malzeme') || lowercaseMessage.includes('oje') || lowercaseMessage.includes('jel') || lowercaseMessage.includes('product')) {
          responseText = 'Tırnak bakımı için önerilen kaliteli ürünler:\n\n• Temel kat (base coat): OPI Natural Nail Base Coat, Essie Here To Stay\n• Üst kat (top coat): Seche Vite Dry Fast, Sally Hansen Insta-Dri\n• Jel sistem: CND Shellac, Gelish, OPI GelColor\n• Tırnak güçlendirici: OPI Nail Envy, Sally Hansen Hard As Nails\n• Nemlendirici: CND Solar Oil, Burt\'s Bees Lemon Butter Cuticle Cream\n\nSizin özel bir ihtiyacınız var mı?';
        }
        
        // Problemler ve çözümleri
        else if (lowercaseMessage.includes('kırıl') || lowercaseMessage.includes('zayıf') || lowercaseMessage.includes('sorun') || lowercaseMessage.includes('problem')) {
          responseText = 'Tırnak problemleri için çözümler:\n\n• Kırılgan tırnaklar: Biotin takviyeleri, protein açısından zengin beslenme ve tırnak güçlendiriciler\n• Soyulan tırnaklar: Nemlendirme ve koruyucu baz katları kullanma\n• Tırnak yeme alışkanlığı: Acı tadı olan özel ojeler ve stres yönetimi teknikleri\n• Beyaz lekeler: Genellikle travma sonucu oluşur, zamanla büyüyerek kaybolur\n• Tırnak mantarı: Medikal tedavi gerektirir, bir dermatologa danışılmalıdır\n\nBu konulardan birinde daha fazla bilgiye ihtiyacınız var mı?';
        }
        
        // Salonlar ve profesyoneller hakkında
        else if (lowercaseMessage.includes('salon') || lowercaseMessage.includes('profesyonel') || lowercaseMessage.includes('randevu') || lowercaseMessage.includes('rezervasyon')) {
          responseText = 'Uygulamamızda en iyi salonları ve nail artistleri bulabilirsiniz. Sadece konum bilginiz ve tercihlerinizi paylaşın, size en yakın ve en uygun profesyonelleri önerelim.\n\n"Salonlar" sekmesinden tüm listeyi görebilir, puanlamaları inceleyebilir ve doğrudan randevu alabilirsiniz.\n\nŞu anda özel bir hizmet mi arıyorsunuz? Mesela jel protez, kalıcı oje veya nail art?';
        }
        
        // Fiyatlar
        else if (lowercaseMessage.includes('fiyat') || lowercaseMessage.includes('ücret') || lowercaseMessage.includes('pahalı') || lowercaseMessage.includes('ucuz') || lowercaseMessage.includes('price')) {
          responseText = 'Hizmet fiyatları salon ve işlem türüne göre değişir:\n\n• Klasik Manikür: 150-300 TL\n• Kalıcı Oje: 250-450 TL\n• Jel Tırnak Uygulaması: 400-800 TL\n• Protez Tırnak (Akrilik/Jel): 500-1200 TL\n• Nail Art (tasarıma göre): +50-300 TL\n\nTemel işlem + özel tasarım kombinasyonları fiyatları değiştirebilir. Size özel fiyat bilgisi için salon profillerini inceleyebilirsiniz. Ayrıca "Özel Teklifler" bölümünden indirimli fırsatları da görebilirsiniz.';
        }
        
        // Süre ve işlem bilgileri
        else if (lowercaseMessage.includes('ne kadar süre') || lowercaseMessage.includes('zaman') || lowercaseMessage.includes('sürer') || lowercaseMessage.includes('saat')) {
          responseText = 'Nail işlemleri süresi:\n\n• Klasik Manikür: 30-45 dakika\n• Kalıcı Oje: 45-60 dakika\n• Jel Tırnak: 60-90 dakika\n• Protez Tırnak: 90-120 dakika\n• Detaylı Nail Art: +30-60 dakika\n\nRandevu planlamanız için tam süreyi salon profilinde görebilirsiniz. Önceden randevu almanızı öneririz, özellikle hafta sonları salonlar çok yoğun olabiliyor.';
        }
        
        // Yeni başlayanlar için
        else if (lowercaseMessage.includes('yeni başla') || lowercaseMessage.includes('ilk kez') || lowercaseMessage.includes('deneyim') || lowercaseMessage.includes('başlangıç')) {
          responseText = 'Nail bakımına yeni başlıyorsanız, işte önerilerim:\n\n1. İlk deneyiminiz için klasik manikür veya kalıcı oje ile başlayın\n2. Çok uzun veya abartılı tasarımlardan kaçının, günlük hayatınıza alışmak için klasik şekiller tercih edin\n3. Hassas tırnaklarınız varsa, bunu önceden nail artistinize belirtin\n4. Tercihlerinizi ve beklentilerinizi açıkça ifade edin (şekil, uzunluk, renk)\n5. Evde bakım için önerileri mutlaka sorun\n\nDaha spesifik bilgiye ihtiyacınız var mı?';
        }
        
        // Evde bakım önerileri
        else if (lowercaseMessage.includes('evde') || lowercaseMessage.includes('kendin yap') || lowercaseMessage.includes('diy') || lowercaseMessage.includes('bakım')) {
          responseText = 'Evde tırnak bakımı için 5 temel ipucu:\n\n1. Haftada bir kez düzenli manikür yapın (etleri geriye itin, törpüleyin, nemlendirin)\n2. Kaliteli bir törpü ve et itici kullanın\n3. Tırnaklarınızı sık sık nemlendirin ve güçlendirici ürünler kullanın\n4. Oje çıkarırken asetonsuz ürünleri tercih edin\n5. Ellerinizi her yıkadıktan sonra nemlendirin\n\nDaha detaylı evde bakım ipuçları için "Sanal Tırnak Danışmanı" özelliğimizi de kullanabilirsiniz.';
        }
        
        // Kalıcılık ve dayanıklılık
        else if (lowercaseMessage.includes('kalıcı') || lowercaseMessage.includes('dayanıklı') || lowercaseMessage.includes('ne kadar dayanır') || lowercaseMessage.includes('bozul')) {
          responseText = 'Farklı nail uygulamalarının dayanıklılık süreleri:\n\n• Klasik Oje: 3-5 gün\n• Kalıcı Oje: 2-3 hafta\n• Jel Tırnak: 3-4 hafta\n• Akrilik/Protez: 3-4 hafta (dolgu gerekebilir)\n\nDayanıklılığı artırmak için:\n- Bulaşık ve temizlik işlerinde eldiven kullanın\n- Aşırı sıcak su temasından kaçının\n- Asetonu el temizleyici olarak kullanmayın\n- Tırnaklarınızı alet olarak kullanmaktan kaçının (kutu açma, çizme vb.)';
        }
        
        // Ten tonuna uygun renkler
        else if (lowercaseMessage.includes('kombin') || lowercaseMessage.includes('elbise') || lowercaseMessage.includes('kıyafet') || lowercaseMessage.includes('ayakkabı')) {
          responseText = 'Kıyafet-oje kombinleri için öneriler:\n\n• Kırmızı elbise: Nötr nude tonları, klasik kırmızı veya siyah\n• Mavi tonları: Gümüş, pudra pembesi veya koyu lacivert\n• Pastel kıyafetler: Aynı rengin daha koyu tonları veya soft pembeler\n• Siyah: Her renk oje yakışır, özellikle metalik tonlar harika durur\n• Beyaz: Canlı renkler, mercan, turkuaz veya pastel tonlar\n\nDaha özel kombin önerileri için "Color Matcher" özelliğimizi kullanabilir, kıyafet fotoğrafınızı yükleyerek size özel öneriler alabilirsiniz.';
        }
        
        // Vitamin ve besin önerileri
        else if (lowercaseMessage.includes('vitamin') || lowercaseMessage.includes('beslenme') || lowercaseMessage.includes('besin') || lowercaseMessage.includes('yemek')) {
          responseText = 'Güçlü tırnaklar için beslenme önerileri:\n\n• Biotin: Yumurta sarısı, badem, ceviz\n• Protein: Tavuk, balık, baklagiller\n• Demir: Kırmızı et, ıspanak, mercimek\n• Çinko: İstiridye, et, kabak çekirdeği\n• Silisyum: Tam tahıllar, salatalık, çilek\n• Kükürt: Soğan, sarımsak, brokoli\n\nAyrıca günde 2-3 litre su içmek de tırnak sağlığı için çok önemlidir. Multivitamin takviyeleri de düşünebilirsiniz.';
        }
        
        // Default yanıt - anlayamadığı durumlar için
        else {
          responseText = 'Tırnak bakımı ve güzelliği konusunda size yardımcı olmak isterim. Aşağıdaki konularda bilgi alabilirim:\n\n• Tırnak bakımı ve sağlığı\n• En yeni tırnak trendleri\n• Ten renginize uygun oje renkleri\n• Nail art teknikleri\n• Salon seçimi ve rezervasyon\n• Kalıcı oje, jel ve protez tırnaklar\n• Evde tırnak bakımı\n• Özel durumlar için tırnak tasarımları\n\nHangi konuda size yardımcı olabilirim?';
        }
        
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        };
        await storage.addChatMessage(aiMessage);
      }, 1000);
      
      res.status(201).json(userMessage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reviews API endpoints
  app.get("/api/artists/:id/reviews", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      const reviews = await storage.getReviewsByArtist(artistId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:id/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const result = insertReviewSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: result.error.errors 
        });
      }
      
      // Verify artist exists
      const artist = await storage.getArtist(result.data.artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      // Verify user exists
      const user = await storage.getUser(result.data.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const review = await storage.createReview(result.data);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.getReview(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket sunucusunu geliştirilmiş modül ile kur
  setupWebSocketServer(httpServer);

  return httpServer;
}
