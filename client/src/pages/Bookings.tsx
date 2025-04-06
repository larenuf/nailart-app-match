import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TopNavigation from '@/components/TopNavigation';
import { Check, Clock, Calendar as CalendarIcon, X, AlertTriangle, MapPin } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { apiRequest } from '@/lib/queryClient';

// Randevu tipi
type Booking = {
  id: number;
  date: string;
  time: string;
  status: string;
  salon: {
    id: number;
    name: string;
    address: string;
    district: string;
    imageUrl: string;
  };
  artist: {
    id: number;
    name: string;
    imageUrl: string;
    specialization: string;
  };
  service: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  userId: number;
};

// Randevu durumuna göre renk ve ikon döndüren yardımcı fonksiyon
function getStatusInfo(status: string) {
  switch (status) {
    case 'confirmed':
      return {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: <Check className="w-4 h-4 mr-1" />,
        text: 'Onaylandı'
      };
    case 'pending':
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <Clock className="w-4 h-4 mr-1" />,
        text: 'Onay Bekliyor'
      };
    case 'completed':
      return {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <Check className="w-4 h-4 mr-1" />,
        text: 'Tamamlandı'
      };
    case 'cancelled':
      return {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: <X className="w-4 h-4 mr-1" />,
        text: 'İptal Edildi'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
        text: 'Bilinmiyor'
      };
  }
}

// Randevu kartı bileşeni
const BookingCard: React.FC<{ booking: Booking; onCancel: (id: number) => void }> = ({ booking, onCancel }) => {
  const [_, navigate] = useLocation();
  const statusInfo = getStatusInfo(booking.status);
  const bookingDate = new Date(booking.date);
  
  const formattedDate = bookingDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const relativeDate = formatDistance(
    bookingDate,
    new Date(),
    { addSuffix: true, locale: tr }
  );
  
  return (
    <Card className="mb-4 overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="flex h-24 md:h-36 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-1/3 h-full relative">
          <img 
            src={booking.salon.imageUrl} 
            alt={booking.salon.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4 relative">
          <Badge className={`absolute top-4 right-4 ${statusInfo.color} flex items-center`}>
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
          
          <h3 className="font-medium">{booking.salon.name}</h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{booking.salon.district}</span>
          </div>
          <div className="flex mt-3 -ml-1">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mr-2">
              <img 
                src={booking.artist.imageUrl} 
                alt={booking.artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-medium">{booking.artist.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{booking.artist.specialization}</p>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{booking.service.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {booking.service.duration} dk • {booking.service.price} ₺
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-sm font-medium mb-1">
              <CalendarIcon className="w-3 h-3 mr-1" /> 
              {formattedDate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{booking.time}</div>
            <div className="text-xs text-gray-500 italic mt-1">{relativeDate}</div>
          </div>
        </div>
        
        {booking.status === 'pending' && (
          <div className="mt-3 flex justify-end">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onCancel(booking.id)}
            >
              Randevuyu İptal Et
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Ana Bookings sayfası bileşeni
const Bookings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // TanStack Query kullanarak randevuları çekme
  const { 
    data: bookings = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['/api/bookings/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/bookings/user');
        if (!response.ok) {
          throw new Error('Randevular yüklenirken bir hata oluştu');
        }
        return await response.json();
      } catch (error) {
        console.error('Randevuları getirme hatası:', error);
        toast({
          title: "Hata",
          description: "Randevular yüklenirken bir hata oluştu",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
  
  // Filtrelenmiş randevular
  const filteredBookings = bookings.filter((booking: Booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return ['pending', 'confirmed'].includes(booking.status) && 
        new Date(booking.date) >= new Date();
    }
    if (activeTab === 'past') {
      return booking.status === 'completed' || 
        (booking.status === 'confirmed' && new Date(booking.date) < new Date());
    }
    if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });
  
  // Randevu iptal etme fonksiyonu
  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await apiRequest('PATCH', `/api/bookings/${bookingId}/cancel`);
      
      if (response.ok) {
        toast({
          title: "Randevu iptal edildi",
          description: "Randevunuz başarıyla iptal edildi.",
          variant: "default",
        });
        
        // Randevuları yeniden çek
        refetch();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Randevu iptal edilirken bir hata oluştu');
      }
    } catch (error: any) {
      toast({
        title: "İşlem başarısız",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <TopNavigation title="Randevularım" showBackButton />
      
      <div className="max-w-3xl mx-auto p-4">
        
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-2"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="upcoming">Yaklaşan</TabsTrigger>
            <TabsTrigger value="past">Geçmiş</TabsTrigger>
            <TabsTrigger value="cancelled">İptal</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div>
                {filteredBookings.map((booking: Booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Randevu Bulunamadı</CardTitle>
                  <CardDescription className="text-center">
                    Bu kategoride henüz bir randevunuz bulunmuyor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <Button onClick={() => window.location.href = '/'}>
                    Yeni Randevu Oluştur
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookings;