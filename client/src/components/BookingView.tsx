import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { TimeSlot, DateOption } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "./BottomNavigation";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay, addMonths, startOfMonth } from "date-fns";
import { tr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from "lucide-react";

// Function to generate available times based on service duration
const generateAvailableTimes = (serviceMinutes: number) => {
  const times: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour - 1 && minute + serviceMinutes > 60) {
        continue; // Skip if the service would end after closing
      }
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  return times;
};

export default function BookingView() {
  const {
    selectedService,
    selectedArtist,
    selectedSalon,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    setBookingDetails,
    setShowConfirmation,
  } = useAppContext();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); // Default to the second date (tomorrow)
  const [calendarView, setCalendarView] = useState<Date>(new Date());
  const [displayMode, setDisplayMode] = useState<'quick' | 'calendar'>('quick');
  
  // Generate the next 30 days for booking availability
  const nextThirtyDays = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));
  
  // Generate available time slots based on service duration
  const availableTimes = selectedService ? generateAvailableTimes(selectedService.durationMinutes) : [];

  useEffect(() => {
    const today = new Date();
    const options: DateOption[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        fullDate: date,
      });
    }

    setDateOptions(options);
    // Default to tomorrow
    setSelectedDate(options[1].fullDate);
  }, [setSelectedDate]);

  const { data: timeSlots, isLoading } = useQuery<TimeSlot[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/timeslots`, selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedArtist && !!selectedDate,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: { userId: number; artistId: number; serviceId: number; date: Date; startTime: string }) => {
      return apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/artists/${selectedArtist?.id}/timeslots`] });
      
      if (selectedArtist && selectedService && selectedSalon && selectedDate && selectedTime) {
        const formattedDate = selectedDate.toLocaleDateString('tr-TR', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
        setBookingDetails({
          artist: selectedArtist,
          service: selectedService,
          salon: selectedSalon,
          date: formattedDate,
          time: selectedTime
        });
        
        setShowConfirmation(true);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Rezervasyon Başarısız",
        description: error.message || "Rezervasyon oluşturulamadı",
        variant: "destructive",
      });
    }
  });

  const handleBackToArtist = () => {
    setSelectedService(null);
  };

  const handleDateSelect = (index: number) => {
    setSelectedDateIndex(index);
    setSelectedDate(dateOptions[index].fullDate);
    setSelectedTime(null);
  };
  
  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };
  
  const handleNextMonth = () => {
    setCalendarView(addMonths(calendarView, 1));
  };
  
  const handlePrevMonth = () => {
    setCalendarView(addMonths(calendarView, -1));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    if (!selectedArtist || !selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Rezervasyon Hatası",
        description: "Lütfen tüm rezervasyon detaylarını seçin",
        variant: "destructive",
      });
      return;
    }

    // Navigate to checkout page instead of completing booking directly
    window.location.href = '/checkout';
  };

  if (!selectedService || !selectedArtist || !selectedSalon) return null;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <div className="px-4 py-2">
        <div className="flex items-center mb-4">
          <button className="text-[#333333] mr-2" onClick={handleBackToArtist}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold font-playfair">Rezervasyon Yap</h2>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
          <div className="flex items-center">
            <img
              src={selectedArtist.imageUrl}
              alt={selectedArtist.name}
              className="w-14 h-14 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-medium">{selectedArtist.name}</h3>
              <p className="text-sm text-gray-600">{selectedSalon.name}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3">
            <h4 className="font-medium">{selectedService.name}</h4>
            <div className="flex justify-between text-sm mt-1">
              <p className="text-gray-600">{selectedService.durationMinutes} dakika</p>
              <p className="font-bold">₺{selectedService.price}</p>
            </div>
          </div>
        </div>

        {/* Date Selection Tabs */}
        <div className="mb-4">
          <Tabs defaultValue="quick" className="w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Tarih Seçin</h3>
              <TabsList className="grid w-auto grid-cols-2">
                <TabsTrigger value="quick" onClick={() => setDisplayMode('quick')}>Hızlı</TabsTrigger>
                <TabsTrigger value="calendar" onClick={() => setDisplayMode('calendar')}>Takvim</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="quick" className="mt-0">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {dateOptions.map((date, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg cursor-pointer transition
                      ${
                        selectedDateIndex === index
                          ? "bg-[#F9E0E7] bg-opacity-30"
                          : "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F9E0E7] hover:bg-opacity-30"
                      }`}
                    onClick={() => handleDateSelect(index)}
                  >
                    <p className="text-xs text-gray-500">{date.day}</p>
                    <p className="font-bold text-lg">{date.date}</p>
                    <p className="text-xs">{date.month}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="border rounded-lg overflow-hidden mb-2 bg-white">
                <div className="flex items-center justify-between p-3 border-b">
                  <Button 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium">
                    {format(calendarView, 'MMMM yyyy', { locale: tr })}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="h-7 w-7 p-0"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={handleCalendarDateSelect}
                  month={calendarView}
                  onMonthChange={setCalendarView}
                  className="p-0"
                  locale={tr}
                  disabled={(date) => {
                    // Disable past dates
                    return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                           // Disable dates more than 30 days in the future
                           date > addDays(new Date(), 30);
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      // Add visual markers for available dates (this is a mock example)
                      const isAvailable = true;
                      return (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {format(date, 'd')}
                          {isAvailable && (
                            <div className="absolute bottom-0 h-1 w-1 rounded-full bg-green-500"></div>
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </div>
              
              {selectedDate && (
                <div className="text-center text-sm text-gray-600 mb-2">
                  {format(selectedDate, 'dd MMMM yyyy, EEEE', { locale: tr })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 mr-1 text-gray-600" />
            <h3 className="font-bold">Müsait Saatler</h3>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse py-2 rounded-lg h-10"></div>
              ))}
            </div>
          ) : timeSlots && timeSlots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`
                    py-2 rounded-lg text-sm transition relative
                    ${slot.isBooked ? "bg-gray-100 text-gray-400 cursor-not-allowed" : 
                      selectedTime === slot.startTime
                        ? "bg-[#F9E0E7] text-[#333333] font-medium"
                        : "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F9E0E7] hover:bg-opacity-30 text-gray-700"
                    }
                  `}
                  onClick={() => !slot.isBooked && handleTimeSelect(slot.startTime)}
                  disabled={slot.isBooked}
                >
                  {slot.startTime}
                  {selectedTime === slot.startTime && (
                    <div className="absolute top-1 right-1 text-primary">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Bu tarih için müsait saat bulunmuyor</p>
              <p className="text-xs text-gray-400 mt-1">Lütfen başka bir tarih seçin</p>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        {selectedTime && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Rezervasyon Özeti</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih:</span>
                <span className="font-medium">{selectedDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saat:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Süre:</span>
                <span className="font-medium">{selectedService.durationMinutes} dakika</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ücret:</span>
                <span className="font-medium text-primary">₺{selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        <Button
          className="w-full py-6 bg-[#D6C3E5] hover:bg-[#D6C3E5]/90 text-white font-bold"
          onClick={handleBookingConfirm}
          disabled={bookingMutation.isPending || !selectedTime}
        >
          {bookingMutation.isPending ? "İşleniyor..." : "Rezervasyonu Onayla"}
        </Button>
      </div>
      <BottomNavigation />
    </div>
  );
}
