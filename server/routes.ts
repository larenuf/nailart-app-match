import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";

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
  // Get all stories
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

  // Get featured salons
  app.get("/api/salons/featured", async (req, res) => {
    try {
      const salons = await storage.getFeaturedSalons();
      res.json(salons);
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
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      const artists = await storage.getArtistsBySalon(salonId);
      res.json(artists);
    } catch (error: any) {
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

  const httpServer = createServer(app);

  return httpServer;
}
