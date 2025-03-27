import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import SalonDetailView from "@/components/SalonDetailView";

export default function SalonDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { selectedSalon, setSelectedSalon } = useAppContext();
  
  const { data: salon } = useQuery<Salon>({
    queryKey: [`/api/salons/${id}`],
    enabled: !!id && !selectedSalon,
  });
  
  useEffect(() => {
    if (salon && !selectedSalon) {
      setSelectedSalon(salon);
    }
    
    // If there's no salon selected, redirect to home
    if (!selectedSalon && !salon) {
      setLocation('/');
    }
  }, [salon, selectedSalon, setSelectedSalon, setLocation]);
  
  if (!selectedSalon) return null;
  
  return <SalonDetailView />;
}
