import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

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
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      case "pending":
        return "Onay Bekliyor";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="w-1/2 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4 border rounded-lg overflow-hidden">
            <div className="w-full h-24 bg-gray-200 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Randevu Geçmişi</h2>
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">Henüz bir randevunuz bulunmamaktadır.</p>
          <Button className="mt-4">Randevu Al</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Randevu Geçmişi</h2>
      <div className="space-y-4">
        {bookings.map((booking) => {
          // In a real app, we would fetch these details from the API
          // For now, we'll just simulate it with mock data
          const bookingDate = new Date(booking.date);
          
          return (
            <div key={booking.id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">Randevu #{booking.id}</p>
                    <p className="text-lg font-medium mt-1">Tırnak Bakımı</p>
                    <p className="text-sm text-gray-600 mt-1">Güzellik Salonu</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="far fa-calendar-alt mr-1"></i>
                    <span>
                      {format(bookingDate, "d MMMM yyyy", { locale: tr })}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{booking.startTime}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={booking.status !== "pending"}
                  >
                    {booking.status === "pending" ? "İptal Et" : "Detaylar"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}