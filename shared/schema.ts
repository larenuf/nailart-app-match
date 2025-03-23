import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  phoneNumber: text("phone_number"),
  location: text("location"),
});

// Salon model
export const salons = pgTable("salons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  phoneNumber: text("phone_number"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  imageUrl: text("image_url"),
  discount: text("discount"),
  distance: doublePrecision("distance"),
  isPremium: boolean("is_premium"),
});

// Artist model
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  salonId: integer("salon_id").notNull(),
  name: text("name").notNull(),
  specialty: text("specialty"),
  experience: text("experience"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  imageUrl: text("image_url"),
});

// Service model
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  description: text("description"),
});

// Portfolio model
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").notNull(),
  imageUrl: text("image_url").notNull(),
});

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iconName: text("icon_name").notNull(),
  backgroundColor: text("background_color").notNull(),
});

// Story model
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  highlighted: boolean("highlighted").default(false),
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artistId: integer("artist_id").notNull(),
  serviceId: integer("service_id").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Available time slots model
export const availableTimeSlots = pgTable("available_time_slots", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  isBooked: boolean("is_booked").default(false),
});

// Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artistId: integer("artist_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Promotions model
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  code: text("code").notNull(),
  discountType: text("discount_type").notNull(), // percentage, fixed
  discountValue: doublePrecision("discount_value").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  salonId: integer("salon_id"), // can be null for global promotions
  serviceId: integer("service_id"), // can be null for all services
  minSpend: doublePrecision("min_spend").default(0),
  maxDiscount: doublePrecision("max_discount"), // can be null for no limit
  usageLimit: integer("usage_limit"), // can be null for unlimited
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  location: true,
});

export const insertSalonSchema = createInsertSchema(salons).omit({
  id: true,
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertTimeSlotSchema = createInsertSchema(availableTimeSlots).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSalon = z.infer<typeof insertSalonSchema>;
export type Salon = typeof salons.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type TimeSlot = typeof availableTimeSlots.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotions.$inferSelect;
