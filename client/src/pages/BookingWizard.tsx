import { useParams } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Salon } from "@/types";
import { useAppContext } from "@/context/AppContext";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import BookingFlow from "@/components/BookingFlow";
import { Loader2 } from "lucide-react";

export default function BookingWizard() {
  const { id } = useParams();
  const { selectedSalon, setSelectedSalon } = useAppContext();
  
  // Salon bilgisini getir
  const { data: salon, isLoading } = useQuery<Salon>({
    queryKey: [`/api/salons/${id}`],
    enabled: !!id && !selectedSalon,
  });
  
  useEffect(() => {
    if (salon && !selectedSalon) {
      setSelectedSalon(salon);
    }
  }, [salon, selectedSalon, setSelectedSalon]);
  
  // Yükleme durumu
  if (isLoading || (!selectedSalon && !salon)) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <TopNavigation title="Randevu Oluştur" showBackButton={true} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6A5ACD]" />
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <TopNavigation title="Randevu Oluştur" showBackButton={true} />
      <div className="flex-1 overflow-auto">
        <BookingFlow salonId={Number(id)} />
      </div>
      <BottomNavigation />
    </div>
  );
}