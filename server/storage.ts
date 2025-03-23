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
  
  // Salon operations
  getSalons(): Promise<Salon[]>;
  getFeaturedSalons(): Promise<Salon[]>;
  getSalon(id: number): Promise<Salon | undefined>;
  createSalon(salon: InsertSalon): Promise<Salon>;
  
  // Artist operations
  getArtistsBySalon(salonId: number): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Service operations
  getServicesByArtist(artistId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Portfolio operations
  getPortfolioByArtist(artistId: number): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Story operations
  getStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  
  // Time slot operations
  getAvailableTimeSlots(artistId: number, date: Date): Promise<TimeSlot[]>;
  bookTimeSlot(id: number): Promise<TimeSlot>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  
  // Chat operations
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<ChatMessage>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByArtist(artistId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private salons: Map<number, Salon>;
  private artists: Map<number, Artist>;
  private services: Map<number, Service>;
  private portfolioItems: Map<number, PortfolioItem>;
  private categories: Map<number, Category>;
  private stories: Map<number, Story>;
  private bookings: Map<number, Booking>;
  private timeSlots: Map<number, TimeSlot>;
  private reviews: Map<number, Review>;
  private chatMessages: ChatMessage[];
  
  private userIdCounter: number;
  private salonIdCounter: number;
  private artistIdCounter: number;
  private serviceIdCounter: number;
  private portfolioIdCounter: number;
  private categoryIdCounter: number;
  private storyIdCounter: number;
  private bookingIdCounter: number;
  private timeSlotIdCounter: number;
  private reviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.salons = new Map();
    this.artists = new Map();
    this.services = new Map();
    this.portfolioItems = new Map();
    this.categories = new Map();
    this.stories = new Map();
    this.bookings = new Map();
    this.timeSlots = new Map();
    this.reviews = new Map();
    this.chatMessages = [];
    
    this.userIdCounter = 1;
    this.salonIdCounter = 1;
    this.artistIdCounter = 1;
    this.serviceIdCounter = 1;
    this.portfolioIdCounter = 1;
    this.categoryIdCounter = 1;
    this.storyIdCounter = 1;
    this.bookingIdCounter = 1;
    this.timeSlotIdCounter = 1;
    this.reviewIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Sample categories - Fresha stil
    const categories = [
      { name: 'Hair & styling', iconName: 'cut', backgroundColor: 'white' },
      { name: 'Nails', iconName: 'hand-sparkles', backgroundColor: 'white' },
      { name: 'Eyebrows & eyelashes', iconName: 'eye', backgroundColor: 'white' },
      { name: 'Massage', iconName: 'hands', backgroundColor: 'white' },
      { name: 'Barbering', iconName: 'cut', backgroundColor: 'white' },
      { name: 'Hair removal', iconName: 'feather', backgroundColor: 'white' },
      { name: 'Facials & skincare', iconName: 'smile', backgroundColor: 'white' },
      { name: 'Injectables & fillers', iconName: 'syringe', backgroundColor: 'white' },
      { name: 'Body', iconName: 'user', backgroundColor: 'white' },
      { name: 'Tattoo & piercing', iconName: 'paint-brush', backgroundColor: 'white' },
      { name: 'Makeup', iconName: 'palette', backgroundColor: 'white' },
      { name: 'Medical & dental', iconName: 'tooth', backgroundColor: 'white' }
    ];
    
    categories.forEach(cat => {
      this.createCategory({
        name: cat.name,
        iconName: cat.iconName,
        backgroundColor: cat.backgroundColor
      });
    });
    
    // Sample stories - yüksek kaliteli nail art resimleri
    const stories = [
      { title: 'Popular', imageUrl: 'https://images.pexels.com/photos/4210665/pexels-photo-4210665.jpeg?auto=compress&cs=tinysrgb&w=800', highlighted: false },
      { title: 'New', imageUrl: 'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=800', highlighted: false },
      { title: 'Today Only', imageUrl: 'https://images.pexels.com/photos/939835/pexels-photo-939835.jpeg?auto=compress&cs=tinysrgb&w=800', highlighted: true },
      { title: 'Discounted', imageUrl: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800', highlighted: false },
      { title: 'New discounted', imageUrl: 'https://images.pexels.com/photos/4210276/pexels-photo-4210276.jpeg?auto=compress&cs=tinysrgb&w=800', highlighted: false }
    ];
    
    stories.forEach(story => {
      this.createStory({
        title: story.title,
        imageUrl: story.imageUrl,
        highlighted: story.highlighted
      });
    });
    
    // Sample salons
    const salons = [
      {
        name: 'Glossy Nails Salon',
        address: '123 Fashion Ave, New York',
        latitude: 40.7128,
        longitude: -74.0060,
        phoneNumber: '(212) 555-1234',
        rating: 4.5,
        reviewCount: 128,
        openTime: '10AM',
        closeTime: '8PM',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=300&fit=crop&crop=focalpoint&auto=format',
        discount: '20% OFF',
        distance: 0.8,
        isPremium: false
      },
      {
        name: 'Luxe Nail Bar',
        address: '456 Style Blvd, New York',
        latitude: 40.7282,
        longitude: -74.0776,
        phoneNumber: '(212) 555-5678',
        rating: 5.0,
        reviewCount: 94,
        openTime: '9AM',
        closeTime: '9PM',
        imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=300&fit=crop&crop=focalpoint&auto=format',
        discount: '',
        distance: 1.2,
        isPremium: true
      }
    ];
    
    const salonIds = salons.map(salon => this.createSalon(salon).id);
    
    // Sample artists
    const artists = [
      {
        salonId: salonIds[0],
        name: 'Emma Thompson',
        specialty: 'Nail Art Specialist',
        experience: '5+ years experience',
        rating: 5.0,
        reviewCount: 48,
        imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=faces&auto=format'
      },
      {
        salonId: salonIds[0],
        name: 'Sophia Chen',
        specialty: 'Gel Expert',
        experience: '3+ years experience',
        rating: 4.0,
        reviewCount: 32,
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&auto=format'
      }
    ];
    
    const artistIds = artists.map(artist => this.createArtist(artist).id);
    
    // Sample services
    const services = [
      {
        artistId: artistIds[0],
        name: 'Gel Manicure',
        price: 35,
        durationMinutes: 45,
        description: 'Long-lasting gel polish that won\'t chip for 2-3 weeks'
      },
      {
        artistId: artistIds[0],
        name: 'Nail Art (Basic)',
        price: 50,
        durationMinutes: 60,
        description: 'Custom designs on 2-4 accent nails'
      },
      {
        artistId: artistIds[0],
        name: 'Full Set Acrylics',
        price: 75,
        durationMinutes: 90,
        description: 'Complete acrylic nail extension with gel polish'
      }
    ];
    
    services.forEach(service => this.createService(service));
    
    // Sample portfolio items
    const portfolioItems = [
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop&auto=format' },
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1613452707901-1160c8010239?w=200&h=200&fit=crop&auto=format' },
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1604902394631-2ce5401662b8?w=200&h=200&fit=crop&auto=format' },
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1604902396636-da5aea655eca?w=200&h=200&fit=crop&auto=format' },
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798c?w=200&h=200&fit=crop&auto=format' },
      { artistId: artistIds[0], imageUrl: 'https://images.unsplash.com/photo-1610992932411-f200e69c841c?w=200&h=200&fit=crop&auto=format' }
    ];
    
    portfolioItems.forEach(item => this.createPortfolioItem(item));
    
    // Sample time slots for booking
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const times = ['10:00 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
      
      times.forEach(time => {
        this.createTimeSlot({
          artistId: artistIds[0],
          date,
          startTime: time,
          isBooked: false
        });
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
      // Ensure we don't override the id or password
      id: user.id,
      password: user.password,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Salon operations
  async getSalons(): Promise<Salon[]> {
    return Array.from(this.salons.values());
  }
  
  async getFeaturedSalons(): Promise<Salon[]> {
    return Array.from(this.salons.values());
  }
  
  async getSalon(id: number): Promise<Salon | undefined> {
    return this.salons.get(id);
  }
  
  async createSalon(salon: InsertSalon): Promise<Salon> {
    const id = this.salonIdCounter++;
    const newSalon: Salon = { ...salon, id };
    this.salons.set(id, newSalon);
    return newSalon;
  }
  
  // Artist operations
  async getArtistsBySalon(salonId: number): Promise<Artist[]> {
    return Array.from(this.artists.values()).filter(
      (artist) => artist.salonId === salonId
    );
  }
  
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }
  
  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = this.artistIdCounter++;
    const newArtist: Artist = { ...artist, id };
    this.artists.set(id, newArtist);
    return newArtist;
  }
  
  // Service operations
  async getServicesByArtist(artistId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.artistId === artistId
    );
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }
  
  // Portfolio operations
  async getPortfolioByArtist(artistId: number): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(
      (item) => item.artistId === artistId
    );
  }
  
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.portfolioIdCounter++;
    const newItem: PortfolioItem = { ...item, id };
    this.portfolioItems.set(id, newItem);
    return newItem;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Story operations
  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }
  
  async createStory(story: InsertStory): Promise<Story> {
    const id = this.storyIdCounter++;
    const newStory: Story = { ...story, id };
    this.stories.set(id, newStory);
    return newStory;
  }
  
  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    const newBooking: Booking = { 
      ...booking, 
      id,
      createdAt: now
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Time slot operations
  async getAvailableTimeSlots(artistId: number, date: Date): Promise<TimeSlot[]> {
    const dateStr = date.toISOString().split('T')[0];
    
    return Array.from(this.timeSlots.values()).filter(
      (slot) => {
        const slotDateStr = slot.date.toISOString().split('T')[0];
        return slot.artistId === artistId && 
               slotDateStr === dateStr && 
               !slot.isBooked;
      }
    );
  }
  
  async bookTimeSlot(id: number): Promise<TimeSlot> {
    const timeSlot = this.timeSlots.get(id);
    if (!timeSlot) {
      throw new Error(`Time slot with id ${id} not found`);
    }
    
    const updatedTimeSlot: TimeSlot = { ...timeSlot, isBooked: true };
    this.timeSlots.set(id, updatedTimeSlot);
    return updatedTimeSlot;
  }
  
  async createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const id = this.timeSlotIdCounter++;
    const newTimeSlot: TimeSlot = { ...timeSlot, id };
    this.timeSlots.set(id, newTimeSlot);
    return newTimeSlot;
  }
  
  // Chat operations
  async getChatMessages(): Promise<ChatMessage[]> {
    return this.chatMessages;
  }
  
  async addChatMessage(message: ChatMessage): Promise<ChatMessage> {
    this.chatMessages.push(message);
    return message;
  }
  
  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const newReview: Review = {
      ...review,
      id,
      createdAt: now
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviewsByArtist(artistId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.artistId === artistId
    );
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
}

export const storage = new MemStorage();
