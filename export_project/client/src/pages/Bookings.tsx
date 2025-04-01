import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);
  
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
  
  // Animasyon varyantları
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    hover: { scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  };
  
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.3, duration: 0.2 } }
  };
  
  const avatarVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.4, type: "spring", stiffness: 200 } },
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };
  
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={isHovered ? "hover" : ""}
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-4"
      layout
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="flex h-24 md:h-36 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="w-1/3 h-full relative overflow-hidden">
            <motion.img 
              src={booking.salon.imageUrl} 
              alt={booking.salon.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="w-2/3 p-4 relative">
            <motion.div
              initial="initial"
              animate="animate"
              variants={badgeVariants}
            >
              <Badge className={`absolute top-4 right-4 ${statusInfo.color} flex items-center`}>
                {statusInfo.icon}
                {statusInfo.text}
              </Badge>
            </motion.div>
            
            <motion.h3 
              className="font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {booking.salon.name}
            </motion.h3>
            
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MapPin className="w-3 h-3 mr-1" />
              <span>{booking.salon.district}</span>
            </motion.div>
            
            <div className="flex mt-3 -ml-1">
              <motion.div 
                className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mr-2"
                variants={avatarVariants}
                whileHover="hover"
              >
                <img 
                  src={booking.artist.imageUrl} 
                  alt={booking.artist.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-medium">{booking.artist.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{booking.artist.specialization}</p>
              </motion.div>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-medium">{booking.service.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {booking.service.duration} dk • {booking.service.price} ₺
              </div>
            </motion.div>
            <motion.div 
              className="flex flex-col items-end"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center text-sm font-medium mb-1">
                <CalendarIcon className="w-3 h-3 mr-1" /> 
                {formattedDate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{booking.time}</div>
              <div className="text-xs text-gray-500 italic mt-1">{relativeDate}</div>
            </motion.div>
          </div>
          
          {booking.status === 'pending' && (
            <motion.div 
              className="mt-3 flex justify-end"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onCancel(booking.id)}
              >
                Randevuyu İptal Et
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Ana Bookings sayfası bileşeni
const Bookings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // Randevuları çekme
  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/user'],
    queryFn: async () => {
      const response = await fetch('/api/bookings/user');
      if (!response.ok) {
        throw new Error('Randevular yüklenirken bir hata oluştu');
      }
      return response.json();
    }
  });
  
  // Filtrelenmiş randevular
  const filteredBookings = bookings.filter(booking => {
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-950"
    >
      <TopNavigation title="Randevularım" showBackButton />
      
      <motion.div 
        className="max-w-3xl mx-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-2"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <TabsList className="grid grid-cols-4 mb-4">
              {['all', 'upcoming', 'past', 'cancelled'].map((tab, index) => (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                >
                  <TabsTrigger value={tab}>
                    {tab === 'all' && 'Tümü'}
                    {tab === 'upcoming' && 'Yaklaşan'}
                    {tab === 'past' && 'Geçmiş'}
                    {tab === 'cancelled' && 'İptal'}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={activeTab} className="mt-2">
                {isLoading ? (
                  <motion.div 
                    className="p-8 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                ) : filteredBookings.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <AnimatePresence>
                      {filteredBookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <BookingCard 
                            booking={booking} 
                            onCancel={handleCancelBooking}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <CardTitle className="text-center">Randevu Bulunamadı</CardTitle>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <CardDescription className="text-center">
                            Bu kategoride henüz bir randevunuz bulunmuyor.
                          </CardDescription>
                        </motion.div>
                      </CardHeader>
                      <CardContent className="flex justify-center pb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button onClick={() => window.location.href = '/'}>
                            Yeni Randevu Oluştur
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Bookings;