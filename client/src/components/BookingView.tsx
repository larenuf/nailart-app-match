import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { TimeSlot, DateOption } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "./BottomNavigation";

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
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
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
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    if (!selectedArtist || !selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Booking Error",
        description: "Please select all booking details",
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
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-lg font-bold font-playfair">Book Appointment</h2>
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
              <p className="text-gray-600">{selectedService.durationMinutes} minutes</p>
              <p className="font-bold">${selectedService.price}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Select Date</h3>
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
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Available Time Slots</h3>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse py-2 rounded-lg h-10"></div>
              ))}
            </div>
          ) : timeSlots && timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`py-2 rounded-lg text-sm transition
                    ${
                      selectedTime === slot.startTime
                        ? "bg-[#F9E0E7] bg-opacity-30 font-medium"
                        : "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F9E0E7] hover:bg-opacity-30"
                    }`}
                  onClick={() => handleTimeSelect(slot.startTime)}
                  disabled={slot.isBooked}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No time slots available for this date</p>
          )}
        </div>

        <button
          className="w-full bg-[#D6C3E5] text-white py-3 rounded-lg font-bold hover:bg-[#D6C3E5]/90 transition"
          onClick={handleBookingConfirm}
          disabled={bookingMutation.isPending || !selectedTime}
        >
          {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
}
