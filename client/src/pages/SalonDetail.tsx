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
    // API'den salon verisi gelirse ve seçili salon yoksa, context'e kaydet
    if (salon && !selectedSalon) {
      setSelectedSalon(salon);
    }
    
    // Eğer useQuery hala yükleniyor ve selectedSalon boş değilse bekle
    // Yükleme tamamlandı, API yanıtı ve seçili salon yoksa anasayfaya yönlendir
    const queryIsLoading = id && !salon;
    if (!queryIsLoading && !selectedSalon && !salon) {
      console.log("Salon bulunamadı, anasayfaya yönlendiriliyor...");
      setLocation('/');
    }
  }, [salon, selectedSalon, setSelectedSalon, setLocation, id]);
  
  if (!selectedSalon) return null;
  
  return <SalonDetailView />;
}
