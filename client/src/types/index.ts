export type Story = {
  id: number;
  title: string;
  imageUrl: string;
  highlighted: boolean;
  videoUrl?: string;
};

export type Category = {
  id: number;
  name: string;
  iconName: string;
  backgroundColor: string;
};

export type Salon = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  closeTime: string;
  imageUrl: string;
  galleryImages?: string[];
  discount: string;
  distance: number;
  isPremium: boolean;
  videoUrl?: string;
};

export type Artist = {
  id: number;
  salonId: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
};

export type Service = {
  id: number;
  artistId: number;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
};

export type PortfolioItem = {
  id: number;
  artistId: number;
  imageUrl: string;
};

export type TimeSlot = {
  id: number;
  artistId: number;
  date: Date;
  startTime: string;
  isBooked: boolean;
};

export type Booking = {
  id: number;
  userId: number;
  artistId: number;
  serviceId: number;
  date: Date;
  startTime: string;
  status: string;
  createdAt: Date;
};

export type DateOption = {
  day: string;
  date: number;
  month: string;
  fullDate: Date;
};

export type BookingDetails = {
  artist: Artist;
  service: Service;
  salon: Salon;
  date: string;
  time: string;
};
