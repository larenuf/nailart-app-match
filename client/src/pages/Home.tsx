import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import HomeView from "@/components/HomeView";
import SalonDetailView from "@/components/SalonDetailView";
import ArtistDetailView from "@/components/ArtistDetailView";
import BookingView from "@/components/BookingView";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Home() {
  const [location, setLocation] = useLocation();
  const { 
    selectedSalon, 
    selectedArtist, 
    selectedService, 
    showConfirmation 
  } = useAppContext();

  useEffect(() => {
    // Update the URL based on the current view state
    if (selectedService) {
      setLocation(`/booking/${selectedService.id}`);
    } else if (selectedArtist) {
      setLocation(`/artists/${selectedArtist.id}`);
    } else if (selectedSalon) {
      setLocation(`/salons/${selectedSalon.id}`);
    } else {
      setLocation('/');
    }
  }, [selectedSalon, selectedArtist, selectedService, setLocation]);

  // Render the current view based on the app state
  let currentView;
  if (selectedService) {
    currentView = <BookingView />;
  } else if (selectedArtist) {
    currentView = <ArtistDetailView />;
  } else if (selectedSalon) {
    currentView = <SalonDetailView />;
  } else {
    currentView = <HomeView />;
  }

  return (
    <>
      {currentView}
      {showConfirmation && <ConfirmationModal />}
    </>
  );
}
