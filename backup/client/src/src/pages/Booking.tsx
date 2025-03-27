import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Service } from "@/types";
import BookingView from "@/components/BookingView";

export default function Booking() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { selectedService, setSelectedService } = useAppContext();
  
  const { data: service } = useQuery<Service>({
    queryKey: [`/api/services/${id}`],
    enabled: !!id && !selectedService,
  });
  
  useEffect(() => {
    if (service && !selectedService) {
      setSelectedService(service);
    }
    
    // If there's no service selected, redirect to home
    if (!selectedService && !service) {
      setLocation('/');
    }
  }, [service, selectedService, setSelectedService, setLocation]);
  
  if (!selectedService) return null;
  
  return <BookingView />;
}
