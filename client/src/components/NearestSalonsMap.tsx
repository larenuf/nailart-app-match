import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <Card className="mt-4">
      <CardContent className="p-3">
        <h2 className="font-bold mb-2">Yakındaki Salonlar</h2>
        
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
          >
            {/* Kullanıcı konumu */}
            <Marker
              position={center}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
            
            {/* Salon konumları */}
            {salons?.map((salon) => (
              <Marker
                key={salon.id}
                position={{ lat: salon.latitude, lng: salon.longitude }}
                onClick={() => handleMarkerClick(salon)}
                icon={{
                  url: salon.isPremium 
                    ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" 
                    : "https://maps.google.com/mapfiles/ms/icons/pink-dot.png"
                }}
              />
            ))}
            
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-1">
                  <h3 className="font-bold text-sm">{selectedMarker.name}</h3>
                  <p className="text-xs text-gray-600">{selectedMarker.address}</p>
                  <div className="flex items-center text-xs my-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{selectedMarker.rating} ({selectedMarker.reviewCount} yorum)</span>
                  </div>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      className="text-xs p-2 h-7 w-full"
                      onClick={() => handleViewSalon(selectedMarker)}
                    >
                      Detayları Gör
                    </Button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
}