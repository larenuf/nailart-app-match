import { createContext, useContext, useState, ReactNode } from 'react';
import { Artist, Salon, Service, BookingDetails } from '@/types';

type AppContextType = {
  selectedSalon: Salon | null;
  setSelectedSalon: (salon: Salon | null) => void;
  selectedArtist: Artist | null;
  setSelectedArtist: (artist: Artist | null) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  bookingDetails: BookingDetails | null;
  setBookingDetails: (details: BookingDetails | null) => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;
  resetSelection: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userLocation, setUserLocation] = useState('İstanbul');

  const resetSelection = () => {
    setSelectedSalon(null);
    setSelectedArtist(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingDetails(null);
    setShowConfirmation(false);
  };

  return (
    <AppContext.Provider
      value={{
        selectedSalon,
        setSelectedSalon,
        selectedArtist,
        setSelectedArtist,
        selectedService,
        setSelectedService,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        bookingDetails,
        setBookingDetails,
        showConfirmation,
        setShowConfirmation,
        userLocation,
        setUserLocation,
        resetSelection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
