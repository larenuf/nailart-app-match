import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Service, PortfolioItem, TimeSlot } from "@/types";
import BottomNavigation from "./BottomNavigation";
import ReviewSystem from "./ReviewSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, addDays, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

export default function ArtistDetailView() {
  const { 
    selectedArtist, 
    selectedSalon, 
    selectedService,
    setSelectedArtist, 
    setSelectedService, 
    setSelectedDate, 
    setSelectedTime, 
    setBookingDetails 
  } = useAppContext();
  
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/services`],
    enabled: !!selectedArtist,
  });

  const { data: portfolioItems, isLoading: portfolioLoading } = useQuery<PortfolioItem[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/portfolio`],
    enabled: !!selectedArtist,
  });
  
  const { data: availableTimeSlots, isLoading: timeSlotsLoading } = useQuery<TimeSlot[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/timeslots`, calendarDate?.toISOString().split('T')[0]],
    enabled: !!selectedArtist && !!calendarDate,
  });

  // Benzer çalışmalar - gerçek veritabanından gelecek
  const similarWorks = [
    "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&auto=format&fit=crop"
  ];

  const handleBackToSalon = () => {
    setSelectedArtist(null);
  };

  const handleServiceSelect = (service: Service | undefined) => {
    if (service) {
      setSelectedService(service);
      // Sekmeyi takvim sekmesine değiştir
      const availabilityTab = document.querySelector('[data-state="inactive"][value="availability"]') as HTMLElement;
      if (availabilityTab) {
        availabilityTab.click();
      }
    }
  };
  
  // Zaman dilimi seçimi
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setSelectedDate(calendarDate);
      setSelectedTime(slot.startTime);
      setShowBookingConfirmation(true);
    }
  };
  
  // Randevu onaylama
  const handleConfirmBooking = () => {
    if (selectedService && selectedArtist && selectedSlot && selectedSalon) {
      setBookingDetails({
        artist: selectedArtist,
        service: selectedService,
        salon: selectedSalon,
        date: format(calendarDate, 'yyyy-MM-dd'),
        time: selectedSlot.startTime
      });
      
      // Randevu sayfasına yönlendir
      window.location.href = `/booking/confirm`;
    }
  };

  if (!selectedArtist || !selectedSalon) return null;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative pb-20">
      {/* Sabit Üst Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button className="text-[#333333] dark:text-white mr-2" onClick={handleBackToSalon}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-lg font-bold font-playfair dark:text-white">{selectedArtist.name}</h2>
          {selectedArtist.experience?.includes("Senior") && (
            <Badge className="ml-2 bg-[#6A0DAD] text-white">Uzman</Badge>
          )}
        </div>
      </div>

      {/* Sanatçı Profil Başlığı */}
      <div className="px-4 py-4 bg-[#FBF7FA] dark:bg-gray-800">
        <div className="flex">
          <img
            src={selectedArtist.imageUrl}
            alt={selectedArtist.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
          />
          <div className="ml-4 flex-1">
            <h3 className="text-xl font-semibold dark:text-white">{selectedArtist.name}</h3>
            <p className="text-sm font-medium text-[#6A0DAD] dark:text-pink-400 mt-1">{selectedArtist.specialty}</p>
            
            <div className="flex items-center mt-1">
              <div className="flex text-[#FFD700]">
                {[...Array(Math.floor(selectedArtist.rating))].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {selectedArtist.rating % 1 > 0 && (
                  <i className="fas fa-star-half-alt"></i>
                )}
              </div>
              <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
                {selectedArtist.rating.toFixed(1)} ({selectedArtist.reviewCount} yorum)
              </span>
            </div>
            
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={() => handleServiceSelect(services?.[0])}
                className="bg-[#F9E0E7] dark:bg-pink-900 text-[#333333] dark:text-white px-4 py-1.5 rounded-full text-sm font-medium">
                <i className="far fa-calendar-check mr-1"></i> Randevu Al
              </button>
              <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-2 rounded-full">
                <i className="far fa-heart text-gray-400 dark:text-gray-300"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sekme Yapısı */}
      <Tabs defaultValue="about" className="w-full">
        <div className="px-4 border-b">
          <TabsList className="grid grid-cols-5 h-10">
            <TabsTrigger value="about" className="text-xs">Hakkında</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs">Portfolyo</TabsTrigger>
            <TabsTrigger value="services" className="text-xs">Hizmetler</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs">Takvim</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">Yorumlar</TabsTrigger>
          </TabsList>
        </div>

        {/* Hakkında Sekmesi */}
        <TabsContent value="about" className="px-4 py-3">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Sanatçı Hakkında</h3>
            <p className="text-sm text-gray-600">
              {selectedArtist.name}, {selectedArtist.experience} deneyime sahip, {selectedSalon.name}'da çalışan uzman bir tırnak sanatçısıdır. 
              {selectedArtist.specialty} alanında uzmanlaşmış olup, yaratıcı ve detaylara önem veren çalışmalarıyla tanınır.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Uzmanlık Alanları</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-[#FBF7FA]">Kalıcı Oje</Badge>
              <Badge variant="outline" className="bg-[#FBF7FA]">Jel Tırnak</Badge>
              <Badge variant="outline" className="bg-[#FBF7FA]">3D Nail Art</Badge>
              <Badge variant="outline" className="bg-[#FBF7FA]">French Manicure</Badge>
              <Badge variant="outline" className="bg-[#FBF7FA]">Akrilik Uygulamalar</Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Çalışma Saatleri</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium">Pazartesi - Cuma</p>
                <p className="text-gray-600">09:00 - 19:00</p>
              </div>
              <div>
                <p className="font-medium">Cumartesi</p>
                <p className="text-gray-600">10:00 - 18:00</p>
              </div>
              <div>
                <p className="font-medium">Pazar</p>
                <p className="text-gray-600">Kapalı</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Salon Bilgileri</h3>
            <div className="bg-[#FBF7FA] p-3 rounded-lg flex items-center">
              <img
                src={selectedSalon.imageUrl}
                alt={selectedSalon.name}
                className="w-16 h-16 rounded-lg object-cover mr-3"
              />
              <div>
                <h4 className="font-semibold">{selectedSalon.name}</h4>
                <p className="text-xs text-gray-600">{selectedSalon.address}</p>
                <div className="flex items-center mt-1">
                  <div className="flex text-[#FFD700] text-xs">
                    {[...Array(Math.floor(selectedSalon.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <span className="text-xs ml-1 text-gray-600">
                    ({selectedSalon.reviewCount} yorum)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Portfolyo Sekmesi */}
        <TabsContent value="portfolio" className="px-4 py-3">
          <h3 className="font-bold mb-3">Sanatçı Portfolyosu</h3>
          
          {portfolioLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-40 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {portfolioItems?.map((item) => (
                  <div key={item.id} className="rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={item.imageUrl}
                      alt="Nail art example"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">Benzer Çalışmalar</h4>
              <div className="grid grid-cols-3 gap-2">
                {similarWorks.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Similar work ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Hizmetler Sekmesi */}
        <TabsContent value="services" className="px-4 py-3">
          <h3 className="font-bold mb-3">Sunulan Hizmetler</h3>
          
          {servicesLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="py-3 border-b border-gray-100">
                  <div className="w-2/3 h-5 bg-gray-100 animate-pulse rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-100 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className="p-3 border border-gray-100 rounded-lg hover:border-[#F9E0E7] transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{service.description || "Premium tırnak bakımı ve uygulama"}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <i className="far fa-clock mr-1"></i>
                        <span>{service.durationMinutes} dakika</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${service.price}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceSelect(service);
                        }}
                        className="text-xs bg-[#F9E0E7] hover:bg-[#F9E0E7]/80 text-[#333333] px-3 py-1 rounded-full mt-1">
                        Randevu Al
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 p-3 bg-[#FBF7FA] rounded-lg">
            <h4 className="font-medium flex items-center">
              <i className="fas fa-info-circle text-[#6A0DAD] mr-2"></i>
              Ek Bilgi
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Tüm hizmetlerimiz, kullanılan malzemeleri ve gerekli bakımı içerir. 
              İptal ve değişiklikler için lütfen en az 24 saat önceden haber veriniz.
            </p>
          </div>
        </TabsContent>

        {/* Takvim ve Müsaitlik Sekmesi */}
        <TabsContent value="availability" className="px-4 py-3">
          <div className="space-y-4">
            <h3 className="font-bold">Müsaitlik Takvimi</h3>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(date) => date && setCalendarDate(date)}
                className="rounded-md"
                locale={tr}
                disabled={(date) => 
                  date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                  date > addDays(new Date(), 30)
                }
                components={{
                  DayContent: ({ date }: { date: Date }) => {
                    // Örnek için rastgele müsaitlik statüsü
                    const isAvailable = !isToday(date) || Math.random() > 0.3;
                    const isBusy = !isAvailable && Math.random() > 0.5;
                    
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {format(date, 'd')}
                        {isAvailable && (
                          <div className="absolute bottom-0 h-1 w-1 rounded-full bg-green-500"></div>
                        )}
                        {isBusy && (
                          <div className="absolute bottom-0 h-1 w-1 rounded-full bg-orange-500"></div>
                        )}
                        {!isAvailable && !isBusy && (
                          <div className="absolute bottom-0 h-1 w-1 rounded-full bg-red-500"></div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">
                {format(calendarDate, 'dd MMMM yyyy, EEEE', { locale: tr })}
              </h4>
              
              {/* Seçilen servis bilgisi varsa göster */}
              {selectedService && (
                <div className="mb-4 p-3 bg-[#FDF4F8] rounded-lg">
                  <h4 className="font-medium text-gray-800">{selectedService.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{selectedService.durationMinutes} dakika</span>
                    <span className="font-bold">${selectedService.price}</span>
                  </div>
                </div>
              )}
              
              {timeSlotsLoading ? (
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-100 animate-pulse h-9 rounded-md"></div>
                  ))}
                </div>
              ) : availableTimeSlots && availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      className={`
                        py-2 rounded-md text-sm transition relative
                        ${slot.isBooked 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : selectedSlot?.id === slot.id
                            ? "bg-pink-500 text-white font-medium"
                            : "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F9E0E7] hover:bg-opacity-30 text-gray-700"
                        }
                      `}
                      disabled={slot.isBooked}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.startTime}
                      {slot.isBooked && (
                        <span className="ml-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                      {selectedSlot?.id === slot.id && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 text-center rounded-lg">
                  <CalendarIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Bu tarih için müsait saat bulunmuyor</p>
                  <p className="text-xs text-gray-400 mt-1">Lütfen başka bir gün seçin</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Müsait</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Kısmen Müsait</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Müsait Değil</span>
              </div>
            </div>
            
            {!selectedSlot ? (
              <div className="mt-4 bg-[#FBF7FA] p-4 rounded-lg">
                <h4 className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-[#6A0DAD]" />
                  Randevu Bilgisi
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Randevu almak için lütfen önce bir hizmet seçin, ardından uygun bir tarih ve saat belirleyin.
                  İptal ve değişiklikler için en az 24 saat önceden haber vermeniz gerekmektedir.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <div className="bg-white border border-green-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Randevu Seçiminiz</h4>
                      <p className="text-sm text-gray-500">Aşağıdaki bilgileri onaylayın</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Sanatçı:</span>
                      <span className="font-medium">{selectedArtist.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Hizmet:</span>
                      <span className="font-medium">{selectedService?.name || 'Seçilmedi'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Tarih:</span>
                      <span className="font-medium">{format(calendarDate, 'dd MMMM yyyy', { locale: tr })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Saat:</span>
                      <span className="font-medium">{selectedSlot.startTime}</span>
                    </div>
                    {selectedService && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Süre:</span>
                          <span className="font-medium">{selectedService.durationMinutes} dakika</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Fiyat:</span>
                          <span className="font-medium">${selectedService.price}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button 
                    className="w-full bg-[#FF5864] hover:bg-[#FF5864]/90 text-white py-3 rounded-lg font-medium transition"
                    onClick={handleConfirmBooking}
                    disabled={!selectedService}
                  >
                    {selectedService 
                      ? 'Randevuyu Onayla' 
                      : 'Lütfen önce bir hizmet seçin'}
                  </button>
                  
                  <div className="mt-3 text-center">
                    <button 
                      onClick={() => {
                        setSelectedSlot(null);
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Seçimi İptal Et
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-start">
                  <div className="text-blue-500 mr-3 mt-0.5">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="text-xs text-blue-700">
                    <p>Randevunuz onaylandıktan sonra, takvim uygulamanıza eklemek için bir seçenek sunulacaktır.</p>
                    <p className="mt-1">İptal ve erteleme için en az 24 saat önceden haber verilmelidir.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Yorumlar Sekmesi */}
        <TabsContent value="reviews" className="px-4 py-3">
          <ReviewSystem artistId={selectedArtist.id} />
        </TabsContent>
      </Tabs>

      {/* Alt Navigasyon */}
      <BottomNavigation />
    </div>
  );
}
