import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '300px'
};

type Coordinates = {
  lat: number;
  lng: number;
};

export default function NearestSalonsMap() {
  const [_, navigate] = useLocation();
  const { setSelectedSalon } = useAppContext();
  
  const [center, setCenter] = useState<Coordinates>({ lat: 40.7128, lng: -74.0060 }); // Default New York
  const [selectedMarker, setSelectedMarker] = useState<Salon | null>(null);

  // Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons"],
  });

  // Kullanıcının konumunu al
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userPosition);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleMarkerClick = (salon: Salon) => {
    setSelectedMarker(salon);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const handleViewSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    navigate(`/salons/${salon.id}`);
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Geçici bir çözüm olarak harita yerine kart gösterimi
  return (
    <Card className="mt-4">
      <CardContent className="p-3">
        <h2 className="font-bold mb-2">Yakındaki Salonlar</h2>
        
        {/* API anahtarı sorunu düzeltilene kadar salon listesi göster */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 flex items-start dark:bg-amber-900/30 dark:border-amber-700">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Harita yüklenemiyor</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Geçerli bir Google Maps API anahtarı gerekiyor. Şimdilik size normal liste görünümü sunuyoruz.
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mt-3">
          {salons?.map((salon) => (
            <div 
              key={salon.id} 
              className="border rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => handleViewSalon(salon)}
            >
              <div className="flex items-start">
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full mr-3">
                  {salon.isPremium ? (
                    <span className="text-yellow-500 text-lg">★</span>
                  ) : (
                    <span className="text-pink-500">💅</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{salon.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{salon.address}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="ml-1 text-xs">{salon.rating}</span>
                    </div>
                    <span className="mx-1 text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-500">{salon.distance} km</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}