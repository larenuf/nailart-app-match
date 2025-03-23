import {
  users,
  type User,
  type InsertUser,
  salons,
  type Salon,
  type InsertSalon,
  artists,
  type Artist,
  type InsertArtist,
  services,
  type Service,
  type InsertService,
  portfolioItems,
  type PortfolioItem,
  type InsertPortfolioItem,
  categories,
  type Category,
  type InsertCategory,
  stories,
  promotions,
  type Promotion,
  type InsertPromotion,
  type Story,
  type InsertStory,
  bookings,
  type Booking,
  type InsertBooking,
  availableTimeSlots,
  type TimeSlot,
  type InsertTimeSlot,
  reviews,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, lt, desc, asc, sql, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// AI Chat message type
export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  getUsers(): Promise<User[]>; // Yeni: Tüm kullanıcıları getir
  
  // Salon operations
  getSalons(): Promise<Salon[]>;
  getFeaturedSalons(): Promise<Salon[]>;
  getSalon(id: number): Promise<Salon | undefined>;
  createSalon(salon: InsertSalon): Promise<Salon>;
  updateSalon(id: number, salonData: Partial<Salon>): Promise<Salon>; // Yeni: Salon güncelleme
  deleteSalon(id: number): Promise<boolean>; // Yeni: Salon silme
  
  // Artist operations
  getAllArtists(): Promise<Artist[]>;
  getArtistsBySalon(salonId: number): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: number, artistData: Partial<Artist>): Promise<Artist>; // Yeni: Artist güncelleme
  deleteArtist(id: number): Promise<boolean>; // Yeni: Artist silme
  
  // Service operations
  getServicesByArtist(artistId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, serviceData: Partial<Service>): Promise<Service>; // Yeni: Hizmet güncelleme
  deleteService(id: number): Promise<boolean>; // Yeni: Hizmet silme
  getAllServices(): Promise<Service[]>; // Yeni: Tüm hizmetleri getir
  
  // Portfolio operations
  getPortfolioByArtist(artistId: number): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<boolean>; // Yeni: Portfolyo öğesi silme
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, categoryData: Partial<Category>): Promise<Category>; // Yeni: Kategori güncelleme
  deleteCategory(id: number): Promise<boolean>; // Yeni: Kategori silme
  
  // Story operations
  getStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, storyData: Partial<Story>): Promise<Story>; // Yeni: Hikaye güncelleme
  deleteStory(id: number): Promise<boolean>; // Yeni: Hikaye silme
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>; // Yeni: Tüm randevuları getir
  getBookingsByArtist(artistId: number): Promise<Booking[]>; // Yeni: Artiste göre randevuları getir
  getBookingsBySalon(salonId: number): Promise<Booking[]>; // Yeni: Salona göre randevuları getir
  getBookingsByDate(date: Date): Promise<Booking[]>; // Yeni: Tarihe göre randevuları getir
  
  // Time slot operations
  getAvailableTimeSlots(artistId: number, date: Date): Promise<TimeSlot[]>;
  bookTimeSlot(id: number): Promise<TimeSlot>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  deleteTimeSlot(id: number): Promise<boolean>; // Yeni: Zaman dilimi silme
  getAllTimeSlots(): Promise<TimeSlot[]>; // Yeni: Tüm zaman dilimlerini getir
  
  // Chat operations
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<ChatMessage>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByArtist(artistId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  getAllReviews(): Promise<Review[]>; // Yeni: Tüm yorumları getir
  updateReview(id: number, reviewData: Partial<Review>): Promise<Review>; // Yeni: Yorum güncelleme
  deleteReview(id: number): Promise<boolean>; // Yeni: Yorum silme
  
  // Promotion operations
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotionByCode(code: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, promotionData: Partial<Promotion>): Promise<Promotion>;
  deletePromotion(id: number): Promise<boolean>;
  incrementPromotionUsage(id: number): Promise<Promotion>;

  // Session store
  sessionStore: any;
}

// Chat messages table (not in schema.ts because it's only used server-side)
const chatMessages: ChatMessage[] = [];

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, lastLogin: userData.lastLogin || users.lastLogin })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Salon operations
  async getSalons(): Promise<Salon[]> {
    return await db.select().from(salons);
  }

  async getFeaturedSalons(): Promise<Salon[]> {
    return await db
      .select()
      .from(salons)
      .where(eq(salons.isPremium, true))
      .orderBy(salons.featuredPosition);
  }

  async getSalon(id: number): Promise<Salon | undefined> {
    const [salon] = await db.select().from(salons).where(eq(salons.id, id));
    return salon;
  }

  async createSalon(salon: InsertSalon): Promise<Salon> {
    const [createdSalon] = await db.insert(salons).values(salon).returning();
    return createdSalon;
  }
  
  async updateSalon(id: number, salonData: Partial<Salon>): Promise<Salon> {
    const [updatedSalon] = await db
      .update(salons)
      .set(salonData)
      .where(eq(salons.id, id))
      .returning();
    return updatedSalon;
  }
  
  async deleteSalon(id: number): Promise<boolean> {
    await db.delete(salons).where(eq(salons.id, id));
    return true;
  }

  // Artist operations
  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists);
  }

  async getArtistsBySalon(salonId: number): Promise<Artist[]> {
    return await db.select().from(artists).where(eq(artists.salonId, salonId));
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist;
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const [createdArtist] = await db.insert(artists).values(artist).returning();
    return createdArtist;
  }
  
  async updateArtist(id: number, artistData: Partial<Artist>): Promise<Artist> {
    const [updatedArtist] = await db
      .update(artists)
      .set(artistData)
      .where(eq(artists.id, id))
      .returning();
    return updatedArtist;
  }
  
  async deleteArtist(id: number): Promise<boolean> {
    await db.delete(artists).where(eq(artists.id, id));
    return true;
  }

  // Service operations
  async getServicesByArtist(artistId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.artistId, artistId));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [createdService] = await db.insert(services).values(service).returning();
    return createdService;
  }
  
  async updateService(id: number, serviceData: Partial<Service>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  // Portfolio operations
  async getPortfolioByArtist(artistId: number): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.artistId, artistId));
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [createdItem] = await db.insert(portfolioItems).values(item).returning();
    return createdItem;
  }
  
  async deletePortfolioItem(id: number): Promise<boolean> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    return true;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db.insert(categories).values(category).returning();
    return createdCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  // Story operations
  async getStories(): Promise<Story[]> {
    return await db.select().from(stories);
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [createdStory] = await db.insert(stories).values(story).returning();
    return createdStory;
  }
  
  async updateStory(id: number, storyData: Partial<Story>): Promise<Story> {
    const [updatedStory] = await db
      .update(stories)
      .set(storyData)
      .where(eq(stories.id, id))
      .returning();
    return updatedStory;
  }
  
  async deleteStory(id: number): Promise<boolean> {
    await db.delete(stories).where(eq(stories.id, id));
    return true;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [createdBooking] = await db.insert(bookings).values(booking).returning();
    return createdBooking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  
  async getBookingsByArtist(artistId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.artistId, artistId))
      .orderBy(desc(bookings.createdAt));
  }
  
  async getBookingsBySalon(salonId: number): Promise<Booking[]> {
    // Bu işlev için önce artistleri sorgulayıp, sonra bu artistlerin randevularını birleştiriyoruz
    const salonArtists = await this.getArtistsBySalon(salonId);
    const artistIds = salonArtists.map(artist => artist.id);
    
    if (artistIds.length === 0) {
      return [];
    }
    
    return await db
      .select()
      .from(bookings)
      .where(inArray(bookings.artistId, artistIds))
      .orderBy(desc(bookings.createdAt));
  }
  
  async getBookingsByDate(date: Date): Promise<Booking[]> {
    // Belirli bir tarihe ait randevuları getir (saat bilgisini dikkate almadan)
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.date, startDate),
          lt(bookings.date, endDate)
        )
      )
      .orderBy(asc(bookings.startTime));
  }

  // Time slot operations
  async getAvailableTimeSlots(artistId: number, date: Date): Promise<TimeSlot[]> {
    // Create start and end date for the given date (ignoring time)
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    return await db
      .select()
      .from(availableTimeSlots)
      .where(
        and(
          eq(availableTimeSlots.artistId, artistId),
          eq(availableTimeSlots.isBooked, false),
          gte(availableTimeSlots.date, startDate),
          lte(availableTimeSlots.date, endDate)
        )
      );
  }

  async bookTimeSlot(id: number): Promise<TimeSlot> {
    const [updatedTimeSlot] = await db
      .update(availableTimeSlots)
      .set({ isBooked: true })
      .where(eq(availableTimeSlots.id, id))
      .returning();
    return updatedTimeSlot;
  }

  async createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const [createdTimeSlot] = await db
      .insert(availableTimeSlots)
      .values(timeSlot)
      .returning();
    return createdTimeSlot;
  }
  
  async deleteTimeSlot(id: number): Promise<boolean> {
    await db.delete(availableTimeSlots).where(eq(availableTimeSlots.id, id));
    return true;
  }
  
  async getAllTimeSlots(): Promise<TimeSlot[]> {
    return await db.select().from(availableTimeSlots).orderBy(asc(availableTimeSlots.date));
  }

  // Chat operations
  async getChatMessages(): Promise<ChatMessage[]> {
    return chatMessages;
  }

  async addChatMessage(message: ChatMessage): Promise<ChatMessage> {
    const newMessage = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    };
    chatMessages.push(newMessage);
    return newMessage;
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [createdReview] = await db.insert(reviews).values(review).returning();
    
    // Update artist rating
    const artistReviews = await this.getReviewsByArtist(review.artistId);
    const averageRating = artistReviews.reduce((sum, r) => sum + r.rating, 0) / artistReviews.length;
    
    await db
      .update(artists)
      .set({ 
        rating: averageRating,
        reviewCount: artistReviews.length
      })
      .where(eq(artists.id, review.artistId));
      
    return createdReview;
  }

  async getReviewsByArtist(artistId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.artistId, artistId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }
  
  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set(reviewData)
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    await db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }

  // Promotion operations
  async getPromotions(): Promise<Promotion[]> {
    return await db.select().from(promotions);
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return await db
      .select()
      .from(promotions)
      .where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      );
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db
      .select()
      .from(promotions)
      .where(eq(promotions.id, id));
    return promotion;
  }

  async getPromotionByCode(code: string): Promise<Promotion | undefined> {
    const [promotion] = await db
      .select()
      .from(promotions)
      .where(eq(promotions.code, code));
    return promotion;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [createdPromotion] = await db
      .insert(promotions)
      .values(promotion)
      .returning();
    return createdPromotion;
  }

  async updatePromotion(
    id: number,
    promotionData: Partial<Promotion>
  ): Promise<Promotion> {
    const [updatedPromotion] = await db
      .update(promotions)
      .set(promotionData)
      .where(eq(promotions.id, id))
      .returning();
    return updatedPromotion;
  }

  async deletePromotion(id: number): Promise<boolean> {
    const result = await db
      .delete(promotions)
      .where(eq(promotions.id, id));
    return true;
  }

  async incrementPromotionUsage(id: number): Promise<Promotion> {
    const [updatedPromotion] = await db
      .update(promotions)
      .set({
        usageCount: sql`${promotions.usageCount} + 1`
      })
      .where(eq(promotions.id, id))
      .returning();
    return updatedPromotion;
  }
}

export const storage = new DatabaseStorage();