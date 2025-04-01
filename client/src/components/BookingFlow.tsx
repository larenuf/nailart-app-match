import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Salon, Service, Artist, TimeSlot } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Loader2, Check, ArrowRight, Calendar, Clock, User } from "lucide-react";
import SuccessConfetti from "@/components/SuccessConfetti";
import { motion } from "framer-motion";

type BookingStep = "service" | "date" | "artist" | "confirm";

export default function BookingFlow({ salonId }: { salonId: number }) {
  const [step, setStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [, setLocation] = useLocation();
  const { setSelectedSalon } = useAppContext();
  
  // Salon verisini getir
  const { data: salon, isLoading: salonLoading } = useQuery<Salon>({
    queryKey: [`/api/salons/${salonId}`],
    enabled: !!salonId,
  });
  
  // Mock servisleri
  const mockServices = [
    { id: 1, name: "Klasik Manikür", price: 25, durationMinutes: 30, description: "Tırnak şekillendirme, törpüleme ve oje sürme" },
    { id: 2, name: "Klasik Pedikür", price: 35, durationMinutes: 45, description: "Ayak bakımı, tırnak şekillendirme ve oje" },
    { id: 3, name: "Jel Tırnak", price: 50, durationMinutes: 60, description: "Uzun süre dayanıklı jel tırnak uygulaması" },
    { id: 4, name: "Kalıcı Oje", price: 40, durationMinutes: 45, description: "2-3 hafta dayanan kalıcı oje uygulaması" }
  ];
  
  // Salon sanatçılarını getir
  const { data: artists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: [`/api/salons/${salonId}/artists`],
    enabled: !!salonId && step === "artist",
  });
  
  // Mock zaman dilimlerini oluştur
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const timeSlots: TimeSlot[] = [];
    const startHour = 9; // 09:00
    const endHour = 18; // 18:00
    const interval = 30; // 30 dakikalık aralıklar
    
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += interval) {
        const slotDate = new Date(date);
        slotDate.setHours(h, m, 0);
        
        // Bazı rastgele zaman dilimlerini dolu olarak işaretle
        const isAvailable = Math.random() > 0.3; // %70 ihtimalle müsait
        
        timeSlots.push({
          id: `${h}-${m}`,
          startTime: slotDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          endTime: new Date(slotDate.getTime() + interval * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: slotDate,
          isAvailable,
          artistId: 0
        });
      }
    }
    
    return timeSlots;
  };
  
  // Mock zaman dilimlerini getir
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  
  useEffect(() => {
    if (selectedDate) {
      setTimeSlotsLoading(true);
      
      // API çağrısını simüle ediyoruz
      setTimeout(() => {
        setTimeSlots(generateTimeSlots(selectedDate));
        setTimeSlotsLoading(false);
      }, 500);
    }
  }, [selectedDate]);
  
  // Salon verisini AppContext'e yükle
  useEffect(() => {
    if (salon) {
      setSelectedSalon(salon);
    }
  }, [salon, setSelectedSalon]);
  
  // Servis seçimi için handler
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep("date");
  };
  
  // Tarih seçimi için handler
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setTimeSlots([]); // Önceki zaman dilimlerini temizle
    setSelectedTimeSlot(null);
  };
  
  // Zaman dilimi seçimi için handler
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setStep("artist");
  };
  
  // Sanatçı seçimi için handler
  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    setStep("confirm");
  };
  
  // Randevuyu onayla
  const handleConfirmBooking = () => {
    // Konfeti göster
    setShowConfetti(true);
    setBookingSuccess(true);
    
    // Gerçek bir uygulamada burada API'ye bir istek gönderilecek
    // ve rezervasyon veritabanına kaydedilecektir
    
    // Gecikme ile ödeme sayfasına yönlendir
    setTimeout(() => {
      setLocation("/checkout");
    }, 3000);
  };
  
  // Yükleme durumu
  if (salonLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-[#6A5ACD]" />
      </div>
    );
  }
  
  // Adımları göster
  return (
    <div className="p-4 relative">
      {/* Konfeti efekti */}
      {showConfetti && <SuccessConfetti duration={3000} />}
      
      {/* Başarılı randevu mesajı */}
      {bookingSuccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 p-6 rounded-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <Check className="h-10 w-10 text-green-500" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Randevunuz Oluşturuldu!
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Ödeme sayfasına yönlendiriliyorsunuz...
          </motion.p>
        </motion.div>
      )}
      
      {/* Adım göstergesi */}
      <div className="flex justify-between mb-6 px-2">
        <div className={`flex flex-col items-center ${step === "service" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "service" ? "bg-[#6A5ACD] text-white" : "bg-gray-200"}`}>
            {step === "service" ? "1" : <Check className="h-4 w-4" />}
          </div>
          <span className="text-xs">Hizmet</span>
        </div>
        <div className={`flex flex-col items-center ${step === "date" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "date" ? "bg-[#6A5ACD] text-white" : step === "artist" || step === "confirm" ? "bg-gray-200" : "bg-gray-200"}`}>
            {step === "date" ? "2" : step === "artist" || step === "confirm" ? <Check className="h-4 w-4" /> : "2"}
          </div>
          <span className="text-xs">Tarih</span>
        </div>
        <div className={`flex flex-col items-center ${step === "artist" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "artist" ? "bg-[#6A5ACD] text-white" : step === "confirm" ? "bg-gray-200" : "bg-gray-200"}`}>
            {step === "artist" ? "3" : step === "confirm" ? <Check className="h-4 w-4" /> : "3"}
          </div>
          <span className="text-xs">Sanatçı</span>
        </div>
        <div className={`flex flex-col items-center ${step === "confirm" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "confirm" ? "bg-[#6A5ACD] text-white" : "bg-gray-200"}`}>
            {"4"}
          </div>
          <span className="text-xs">Onay</span>
        </div>
      </div>

      {/* 1. Adım: Hizmet Seçimi */}
      {step === "service" && (
        <div>
          <h3 className="font-bold text-lg mb-4">Hizmet Seçin</h3>
          
          <div className="space-y-3">
            {mockServices.map((service) => (
              <div 
                key={service.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#6A5ACD] transition-all cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">{service.name}</h4>
                  <span className="font-bold">{service.price} ₺</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{service.durationMinutes} dakika</span>
                  <ArrowRight className="h-4 w-4 text-[#6A5ACD]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Adım: Tarih ve Saat Seçimi */}
      {step === "date" && (
        <div>
          <h3 className="font-bold text-lg mb-4">Tarih ve Saat Seçin</h3>
          
          {/* Seçilen hizmet bilgisi */}
          {selectedService && (
            <div className="bg-[#F5F5F5] p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{selectedService.name}</h4>
                  <p className="text-xs text-gray-500">{selectedService.durationMinutes} dakika</p>
                </div>
                <span className="font-bold">{selectedService.price} ₺</span>
              </div>
            </div>
          )}
          
          {/* Tarih seçimi */}
          <h4 className="font-medium mb-2 mt-4">Tarih</h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              return (
                <div
                  key={i}
                  className={`p-2 border ${selectedDate?.toDateString() === date.toDateString() ? 'border-[#6A5ACD] bg-[#6A5ACD]/10' : 'border-gray-200'} rounded-lg text-center cursor-pointer hover:border-[#6A5ACD] transition-colors`}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="text-xs text-gray-500">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</div>
                  <div className="font-bold">{date.getDate()}</div>
                  <div className="text-xs">{date.toLocaleDateString('tr-TR', { month: 'short' })}</div>
                </div>
              );
            })}
          </div>
          
          {/* Saat seçimi */}
          {selectedDate && (
            <>
              <h4 className="font-medium mb-2">Saat</h4>
              
              {timeSlotsLoading ? (
                <div className="flex justify-center my-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#6A5ACD]" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-2 border ${!slot.isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : selectedTimeSlot?.id === slot.id ? 'border-[#6A5ACD] bg-[#6A5ACD]/10' : 'border-gray-200 hover:border-[#6A5ACD] cursor-pointer'} rounded-lg text-center transition-colors`}
                      onClick={() => slot.isAvailable && handleTimeSlotSelect(slot)}
                    >
                      <div className="font-medium">{slot.startTime}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 3. Adım: Sanatçı Seçimi */}
      {step === "artist" && (
        <div>
          <h3 className="font-bold text-lg mb-4">Sanatçı Seçin</h3>
          
          {/* Seçilen hizmet ve zaman bilgisi */}
          {selectedService && selectedTimeSlot && (
            <div className="bg-[#F5F5F5] p-3 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">{selectedService.name}</h4>
                  <p className="text-xs text-gray-500">{selectedService.durationMinutes} dakika</p>
                </div>
                <span className="font-bold">{selectedService.price} ₺</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                <span>{selectedDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                <Clock className="h-4 w-4 ml-3 mr-1 text-gray-500" />
                <span>{selectedTimeSlot.startTime}</span>
              </div>
            </div>
          )}
          
          {/* Sanatçı listesi */}
          {artistsLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#6A5ACD]" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Mock sanatçılar */}
              {[
                { id: 1, name: "Aslı Yılmaz", specialty: "Nail Art Uzmanı", rating: 4.8, reviewCount: 124, imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" },
                { id: 2, name: "Mehmet Kaya", specialty: "Manikür Uzmanı", rating: 4.5, reviewCount: 96, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" },
                { id: 3, name: "Zeynep Demir", specialty: "Jel Tırnak Uzmanı", rating: 4.9, reviewCount: 152, imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" }
              ].map((artist) => (
                <div
                  key={artist.id}
                  className="flex p-3 border border-gray-200 rounded-lg hover:border-[#6A5ACD] cursor-pointer transition-colors"
                  onClick={() => handleArtistSelect(artist)}
                >
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium">{artist.name}</h4>
                    <p className="text-sm text-gray-600">{artist.specialty}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-[#FFD700] text-xs">
                        {[...Array(Math.floor(artist.rating))].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                        {artist.rating % 1 > 0 && (
                          <i className="fas fa-star-half-alt"></i>
                        )}
                      </div>
                      <span className="text-xs ml-1 text-gray-500">
                        ({artist.reviewCount} yorum)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-[#6A5ACD]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Adım: Onay */}
      {step === "confirm" && (
        <div>
          <h3 className="font-bold text-lg mb-4">Randevunuzu Onaylayın</h3>
          
          <div className="bg-[#F5F5F5] p-4 rounded-lg mb-4">
            {/* Salon bilgisi */}
            <div className="flex items-center mb-4">
              <img
                src={salon?.imageUrl}
                alt={salon?.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <h4 className="font-medium">{salon?.name}</h4>
                <p className="text-xs text-gray-500">{salon?.address}</p>
              </div>
            </div>
            
            {/* Çizgi */}
            <div className="border-t border-gray-300 my-3"></div>
            
            {/* Randevu detayları */}
            <div className="space-y-3">
              {/* Hizmet */}
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="bg-[#6A5ACD]/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-spa text-[#6A5ACD]"></i>
                  </div>
                  <div>
                    <h5 className="font-medium">Hizmet</h5>
                    <p className="text-sm">{selectedService?.name}</p>
                    <p className="text-xs text-gray-500">{selectedService?.durationMinutes} dakika</p>
                  </div>
                </div>
                <span className="font-bold">{selectedService?.price} ₺</span>
              </div>
              
              {/* Tarih ve Saat */}
              <div className="flex items-start">
                <div className="bg-[#6A5ACD]/10 p-2 rounded-lg mr-3">
                  <i className="far fa-calendar-alt text-[#6A5ACD]"></i>
                </div>
                <div>
                  <h5 className="font-medium">Tarih ve Saat</h5>
                  <p className="text-sm">{selectedDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm">{selectedTimeSlot?.startTime}</p>
                </div>
              </div>
              
              {/* Sanatçı */}
              <div className="flex items-start">
                <div className="bg-[#6A5ACD]/10 p-2 rounded-lg mr-3">
                  <User className="h-4 w-4 text-[#6A5ACD]" />
                </div>
                <div>
                  <h5 className="font-medium">Sanatçı</h5>
                  <p className="text-sm">{selectedArtist?.name}</p>
                  <p className="text-xs text-gray-500">{selectedArtist?.specialty}</p>
                </div>
              </div>
            </div>
            
            {/* Çizgi */}
            <div className="border-t border-gray-300 my-3"></div>
            
            {/* Toplam */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Toplam</span>
              <span className="font-bold text-lg">{selectedService?.price} ₺</span>
            </div>
          </div>
          
          {/* Onay butonu */}
          <button
            className="w-full bg-[#6A5ACD] text-white py-3 rounded-lg font-medium hover:bg-[#6A5ACD]/90 transition-colors"
            onClick={handleConfirmBooking}
          >
            Ödemeye Geç
          </button>
        </div>
      )}
    </div>
  );
}