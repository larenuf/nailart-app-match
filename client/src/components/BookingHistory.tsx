import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Booking {
  id: number;
  artistId: number;
  serviceId: number;
  userId: number;
  date: Date;
  startTime: string;
  status: string;
  createdAt: Date;
}

interface Artist {
  id: number;
  name: string;
  salonId: number;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

interface Service {
  id: number;
  artistId: number;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

interface Salon {
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
  discount: string;
  distance: number;
  isPremium: boolean;
}

interface BookingHistoryProps {
  userId: number;
}

export default function BookingHistory({ userId }: BookingHistoryProps) {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: [`/api/users/${userId}/bookings`],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Onaylandı";
      case "cancelled":
        return "İptal Edildi";
      case "pending":
        return "Beklemede";
      case "completed":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  // Helper function to fetch booking related data
  const getBookingDetails = async (bookingId: number) => {
    try {
      // In a real app, we'd fetch these details from the API
      // For demo purposes, we'll just simulate loading times
      // and return mock data
      const artist = await new Promise<Artist>(resolve => 
        setTimeout(() => resolve({
          id: 1,
          name: "Jane Doe",
          salonId: 1,
          specialty: "Nail Art",
          experience: "5 years",
          rating: 4.8,
          reviewCount: 250,
          imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop"
        }), 300)
      );
      
      const service = await new Promise<Service>(resolve => 
        setTimeout(() => resolve({
          id: 1,
          artistId: 1,
          name: "Geometric Nail Art",
          price: 45,
          durationMinutes: 60,
          description: "Beautiful geometric patterns on your nails."
        }), 200)
      );
      
      const salon = await new Promise<Salon>(resolve => 
        setTimeout(() => resolve({
          id: 1,
          name: "Elegant Nails",
          address: "123 Main St, City",
          latitude: 40.7128,
          longitude: -74.0060,
          phoneNumber: "123-456-7890",
          rating: 4.5,
          reviewCount: 500,
          openTime: "09:00",
          closeTime: "20:00",
          imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&h=600&fit=crop",
          discount: "10% off",
          distance: 2.5,
          isPremium: true
        }), 400)
      );
      
      return { artist, service, salon };
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="far fa-calendar-alt text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz Rezervasyonunuz Yok</h3>
        <p className="mt-1 text-sm text-gray-500">
          Rezervasyonlarınız burada görüntülenecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Randevu #{booking.id}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.date), "d MMMM yyyy")} • {booking.startTime}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
              {getStatusTranslation(booking.status)}
            </span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm">
              <span className="font-medium mr-2">Sanatçı:</span>
              <span className="text-gray-600">{booking.artistId} - Yükleniyor...</span>
            </div>
            <div className="flex items-center text-sm mt-1">
              <span className="font-medium mr-2">Hizmet:</span>
              <span className="text-gray-600">{booking.serviceId} - Yükleniyor...</span>
            </div>
          </div>
          
          {booking.status.toLowerCase() === "confirmed" && (
            <div className="mt-3 flex">
              <button className="text-sm bg-[#F9E0E7] text-[#333333] px-3 py-1 rounded-full mr-2">
                Düzenle
              </button>
              <button className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                İptal Et
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}