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
  getAllArtists(): Promise<Artist[]>;
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
  
  // Promotion operations
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotionByCode(code: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, promotionData: Partial<Promotion>): Promise<Promotion>;
  deletePromotion(id: number): Promise<boolean>;
  incrementPromotionUsage(id: number): Promise<Promotion>;
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
  private promotions: Map<number, Promotion>;
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
  private promotionIdCounter: number;

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
    this.promotions = new Map();
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
    this.promotionIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    try {
      console.log("Initializing sample data...");
      
      // Sample categories - Fresha style
      this.categories.set(1, {
        id: 1,
        name: 'Hair & styling',
        iconName: 'cut',
        backgroundColor: 'white'
      });
      
      this.categories.set(2, {
        id: 2,
        name: 'Nails',
        iconName: 'hand-sparkles',
        backgroundColor: 'white'
      });
      
      this.categories.set(3, {
        id: 3,
        name: 'Eyebrows & eyelashes',
        iconName: 'eye',
        backgroundColor: 'white'
      });
      
      this.categories.set(4, {
        id: 4,
        name: 'Massage',
        iconName: 'hands',
        backgroundColor: 'white'
      });
      
      this.categories.set(5, {
        id: 5,
        name: 'Barbering',
        iconName: 'cut',
        backgroundColor: 'white'
      });
      
      this.categories.set(6, {
        id: 6,
        name: 'Hair removal',
        iconName: 'feather',
        backgroundColor: 'white'
      });
      
      this.categories.set(7, {
        id: 7,
        name: 'Facials & skincare',
        iconName: 'smile',
        backgroundColor: 'white'
      });
      
      this.categories.set(8, {
        id: 8,
        name: 'Injectables & fillers',
        iconName: 'syringe',
        backgroundColor: 'white'
      });
      
      this.categories.set(9, {
        id: 9,
        name: 'Body',
        iconName: 'user',
        backgroundColor: 'white'
      });
      
      this.categories.set(10, {
        id: 10,
        name: 'Tattoo & piercing',
        iconName: 'paint-brush',
        backgroundColor: 'white'
      });
      
      this.categories.set(11, {
        id: 11,
        name: 'Makeup',
        iconName: 'palette',
        backgroundColor: 'white'
      });
      
      this.categories.set(12, {
        id: 12,
        name: 'Medical & dental',
        iconName: 'tooth',
        backgroundColor: 'white'
      });
      
      this.categoryIdCounter = 13;
      
      // Sample stories
      this.stories.set(1, {
        id: 1,
        title: 'Popüler',
        imageUrl: 'https://loremflickr.com/150/150/nails',
        highlighted: false,
        videoUrl: null
      });
      
      this.stories.set(2, {
        id: 2,
        title: 'Yeni',
        imageUrl: 'https://loremflickr.com/150/150/manicure',
        highlighted: false,
        videoUrl: null
      });
      
      this.stories.set(3, {
        id: 3,
        title: 'Bugüne Özel',
        imageUrl: 'https://loremflickr.com/150/150/pedicure',
        highlighted: true,
        videoUrl: 'https://sora.com/g/gen_01jq210yk3fkts4yyx120kqy2x'
      });
      
      this.stories.set(4, {
        id: 4,
        title: 'İndirimli',
        imageUrl: 'https://loremflickr.com/150/150/nail,art',
        highlighted: false,
        videoUrl: null
      });
      
      this.stories.set(5, {
        id: 5,
        title: 'Yeni İndirimler',
        imageUrl: 'https://loremflickr.com/150/150/polish,nails',
        highlighted: false,
        videoUrl: null
      });
      
      this.storyIdCounter = 6;
      
      // Sample salons
      // First salon
      this.salons.set(1, {
        id: 1,
        name: 'Glossy Nails Salon',
        address: '123 Fashion Ave, New York',
        latitude: 40.7128,
        longitude: -74.0060,
        phoneNumber: '(212) 555-1234',
        rating: 4.8,
        reviewCount: 124,
        openTime: '9:00 AM',
        closeTime: '7:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=300&fit=crop&crop=focalpoint&auto=format',
        discount: '20% Off for New Clients',
        distance: 0.8,
        isPremium: false
      });
      
      // Second salon
      this.salons.set(2, {
        id: 2,
        name: 'Luxe Nail Bar',
        address: '456 Style Blvd, New York',
        latitude: 40.7282,
        longitude: -73.9942,
        phoneNumber: '(212) 555-5678',
        rating: 5.0,
        reviewCount: 94,
        openTime: '9:00 AM',
        closeTime: '9:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=300&fit=crop&crop=focalpoint&auto=format',
        discount: '',
        distance: 1.2,
        isPremium: true
      });
      
      this.salonIdCounter = 3;
      
      // Sample artists
      // Artists for first salon
      this.artists.set(1, {
        id: 1,
        salonId: 1,  // Explicitly set to salon 1
        name: 'Emma Thompson',
        specialty: 'Nail Art Specialist',
        experience: '5+ years experience',
        rating: 5.0,
        reviewCount: 48,
        imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=faces&auto=format'
      });
      
      this.artists.set(2, {
        id: 2,
        salonId: 1,  // Explicitly set to salon 1
        name: 'Sophia Chen',
        specialty: 'Gel Expert',
        experience: '3+ years experience',
        rating: 4.0,
        reviewCount: 32,
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&auto=format'
      });
      
      // Artists for second salon
      this.artists.set(3, {
        id: 3,
        salonId: 2,  // Explicitly set to salon 2
        name: 'Olivia Parker',
        specialty: 'Nail Art Designer',
        experience: '7+ years experience',
        rating: 4.9,
        reviewCount: 56,
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format'
      });
      
      this.artists.set(4, {
        id: 4,
        salonId: 2,  // Explicitly set to salon 2
        name: 'Isabella Martinez',
        specialty: 'Acrylics Expert',
        experience: '4+ years experience',
        rating: 4.7,
        reviewCount: 38,
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&auto=format'
      });
      
      this.artistIdCounter = 5;
      
      // Sample services
      // Services for Emma Thompson (Artist 1)
      this.services.set(1, {
        id: 1,
        artistId: 1,
        name: 'Gel Manicure',
        price: 35,
        durationMinutes: 45,
        description: 'Long-lasting gel polish that won\'t chip for 2-3 weeks'
      });
      
      this.services.set(2, {
        id: 2,
        artistId: 1,
        name: 'Nail Art (Basic)',
        price: 50,
        durationMinutes: 60,
        description: 'Custom designs on 2-4 accent nails'
      });
      
      this.services.set(3, {
        id: 3,
        artistId: 1,
        name: 'Full Set Acrylics',
        price: 75,
        durationMinutes: 90,
        description: 'Complete acrylic nail extension with gel polish'
      });
      
      // Services for Olivia Parker (Artist 3)
      this.services.set(4, {
        id: 4,
        artistId: 3,
        name: 'Premium Gel Manicure',
        price: 45,
        durationMinutes: 60,
        description: 'High-end gel polish with luxury hand treatment'
      });
      
      this.services.set(5, {
        id: 5,
        artistId: 3,
        name: 'Advanced Nail Art',
        price: 65,
        durationMinutes: 75,
        description: 'Custom designs with crystals and 3D elements'
      });
      
      // Services for Isabella Martinez (Artist 4)
      this.services.set(6, {
        id: 6,
        artistId: 4,
        name: 'Acrylic Full Set',
        price: 80,
        durationMinutes: 90,
        description: 'Premium acrylic extensions with custom shapes'
      });
      
      this.services.set(7, {
        id: 7,
        artistId: 4,
        name: 'Acrylic Fill',
        price: 45,
        durationMinutes: 60,
        description: 'Maintenance for existing acrylic nails'
      });
      
      this.serviceIdCounter = 8;
      
      // Sample portfolio items
      // Portfolio for artist 1
      this.portfolioItems.set(1, {
        id: 1,
        artistId: 1,
        imageUrl: 'https://loremflickr.com/200/200/nails,manicure'
      });
      
      this.portfolioItems.set(2, {
        id: 2,
        artistId: 1,
        imageUrl: 'https://loremflickr.com/200/200/nails,art'
      });
      
      this.portfolioItems.set(3, {
        id: 3,
        artistId: 1,
        imageUrl: 'https://loremflickr.com/200/200/manicure,art'
      });
      
      // Portfolio for artist 2
      this.portfolioItems.set(4, {
        id: 4,
        artistId: 2,
        imageUrl: 'https://loremflickr.com/200/200/nails,polish'
      });
      
      this.portfolioItems.set(5, {
        id: 5,
        artistId: 2,
        imageUrl: 'https://loremflickr.com/200/200/nail,design'
      });
      
      // Portfolio for artist 3
      this.portfolioItems.set(6, {
        id: 6,
        artistId: 3,
        imageUrl: 'https://loremflickr.com/200/200/nail,salon'
      });
      
      this.portfolioItems.set(7, {
        id: 7,
        artistId: 3,
        imageUrl: 'https://loremflickr.com/200/200/pedicure'
      });
      
      // Portfolio for artist 4
      this.portfolioItems.set(8, {
        id: 8,
        artistId: 4,
        imageUrl: 'https://loremflickr.com/200/200/nails,gel'
      });
      
      this.portfolioItems.set(9, {
        id: 9,
        artistId: 4,
        imageUrl: 'https://loremflickr.com/200/200/acrylic,nails'
      });
      
      this.portfolioIdCounter = 10;
      
      // Sample time slots
      const today = new Date();
      const times = ['10:00 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
      
      // Create a dummy user for demo purposes
      this.users.set(1, {
        id: 1,
        username: 'demo_user',
        password: 'password123',
        email: 'demo@example.com',
        fullName: 'Demo User',
        phoneNumber: '+1234567890',
        location: 'New York, NY'
      });
      
      this.userIdCounter = 2;
      
      let timeSlotId = 1;
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        for (let artistId = 1; artistId <= 4; artistId++) {
          for (const time of times) {
            this.timeSlots.set(timeSlotId, {
              id: timeSlotId,
              artistId: artistId,
              date: date,
              startTime: time,
              isBooked: false
            });
            
            timeSlotId++;
          }
        }
      }
      
      this.timeSlotIdCounter = timeSlotId;
      
      console.log("Sample data initialized successfully!");
      // Sample promotions
      // Using the existing 'today' variable
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);
      
      const oneMonthFromNow = new Date(today);
      oneMonthFromNow.setMonth(today.getMonth() + 1);
      
      // Global promotion (applies to all salons)
      this.promotions.set(1, {
        id: 1,
        title: "Hoş Geldin İndirimi",
        description: "Yeni müşteriler için ilk randevuda %20 indirim",
        imageUrl: "https://loremflickr.com/400/200/nails,promotion",
        code: "WELCOME20",
        discountType: "percentage",
        discountValue: 20,
        startDate: today, // Date object is compatible with Timestamp
        endDate: oneMonthFromNow,
        isActive: true,
        salonId: null,
        serviceId: null,
        minSpend: 0,
        maxDiscount: 100,
        usageLimit: 100,
        usageCount: 0,
        createdAt: new Date()
      });
      
      // Salon-specific promotion
      this.promotions.set(2, {
        id: 2,
        title: "Glossy Salon Özel Teklif",
        description: "Glossy Nails Salon'da sadece bu hafta tüm hizmetlerde %15 indirim",
        imageUrl: "https://loremflickr.com/400/200/manicure,promotion",
        code: "GLOSSY15",
        discountType: "percentage",
        discountValue: 15,
        startDate: today,
        endDate: oneWeekFromNow,
        isActive: true,
        salonId: 1,
        serviceId: null,
        minSpend: 30,
        maxDiscount: null,
        usageLimit: 50,
        usageCount: 0,
        createdAt: new Date()
      });
      
      // Service-specific promotion
      this.promotions.set(3, {
        id: 3,
        title: "Jel Manikür İndirimi",
        description: "Premium Jel Manikür hizmetinde 10₺ indirim",
        imageUrl: "https://loremflickr.com/400/200/gel,nails",
        code: "GEL10",
        discountType: "fixed",
        discountValue: 10,
        startDate: today,
        endDate: oneMonthFromNow,
        isActive: true,
        salonId: null,
        serviceId: 4,
        minSpend: 0,
        maxDiscount: null,
        usageLimit: null,
        usageCount: 0,
        createdAt: new Date()
      });
      
      this.promotionIdCounter = 4;
      
      console.log(`Created ${this.salons.size} salons`);
      console.log(`Created ${this.artists.size} artists`);
      console.log(`Created ${this.services.size} services`);
      console.log(`Created ${this.portfolioItems.size} portfolio items`);
      console.log(`Created ${this.timeSlots.size} time slots`);
      console.log(`Created ${this.promotions.size} promotions`);
      
    } catch (error) {
      console.error("Error initializing sample data:", error);
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
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      phoneNumber: insertUser.phoneNumber || null,
      location: insertUser.location || null
    };
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
  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }
  
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

  // Promotion operations
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(promo => {
      const usageCount = promo.usageCount || 0;
      const usageLimit = promo.usageLimit || null;
      
      return promo.isActive && 
        new Date(promo.startDate) <= now && 
        new Date(promo.endDate) >= now &&
        (!usageLimit || usageCount < usageLimit);
    });
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async getPromotionByCode(code: string): Promise<Promotion | undefined> {
    return Array.from(this.promotions.values()).find(
      promo => promo.code === code && promo.isActive
    );
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const id = this.promotionIdCounter++;
    const newPromotion: Promotion = { 
      ...promotion, 
      id,
      salonId: promotion.salonId || null,
      serviceId: promotion.serviceId || null,
      maxDiscount: promotion.maxDiscount || null,
      usageLimit: promotion.usageLimit || null,
      usageCount: 0,
      createdAt: new Date()
    };
    this.promotions.set(id, newPromotion);
    return newPromotion;
  }

  async updatePromotion(id: number, promotionData: Partial<Promotion>): Promise<Promotion> {
    const promotion = await this.getPromotion(id);
    if (!promotion) {
      throw new Error(`Promotion with id ${id} not found`);
    }

    const updatedPromotion: Promotion = {
      ...promotion,
      ...promotionData,
      // Ensure we don't override these fields
      id: promotion.id,
      createdAt: promotion.createdAt
    };

    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deletePromotion(id: number): Promise<boolean> {
    const exists = this.promotions.has(id);
    if (exists) {
      this.promotions.delete(id);
    }
    return exists;
  }

  async incrementPromotionUsage(id: number): Promise<Promotion> {
    const promotion = await this.getPromotion(id);
    if (!promotion) {
      throw new Error(`Promotion with id ${id} not found`);
    }

    const currentCount = promotion.usageCount || 0;

    const updatedPromotion: Promotion = {
      ...promotion,
      usageCount: currentCount + 1
    };

    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }
}

export const storage = new MemStorage();
