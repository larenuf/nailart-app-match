import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Navigation } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '300px'
};

type Coordinates = {
  lat: number;
  lng: number;
};

// Türkiye şehir bölgeleri
const turkishCities = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4237, lng: 27.1428 }
};

export default function NearestSalonsMap() {
  // stopPropagation handler
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const [_, navigate] = useLocation();
  const { setSelectedSalon } = useAppContext();
  
  const [center, setCenter] = useState<Coordinates>(turkishCities.istanbul); // Default Istanbul
  const [selectedMarker, setSelectedMarker] = useState<Salon | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("istanbul");

  // Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons"],
  });

  // Kullanıcının konumunu al (veya varsayılan şehir olarak İstanbul'u kullan)
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
          // Hata durumunda varsayılan olarak İstanbul'u kullan
          setCenter(turkishCities.istanbul);
        }
      );
    }
  }, []);

  // Şehir değiştiğinde merkezi güncelle
  useEffect(() => {
    setCenter(turkishCities[selectedCity as keyof typeof turkishCities]);
  }, [selectedCity]);

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

  const handleMapError = () => {
    setMapError("Google Maps yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.");
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Google Maps API key olmadan fallback UI
  if (!apiKey) {
    return (
      <Card 
        className="mt-4" 
        onClick={stopPropagation}
      >
        <CardContent 
          className="p-3"
          onClick={stopPropagation}
        >
          <h2 
            className="font-bold mb-2"
            onClick={stopPropagation}
          >
            Yakındaki Salonlar
          </h2>
          
          {/* API anahtarı sorunu uyarısı */}
          <div 
            className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 flex items-start dark:bg-amber-900/30 dark:border-amber-700"
            onClick={stopPropagation}
          >
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div onClick={stopPropagation}>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Harita yüklenemiyor</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Geçerli bir Google Maps API anahtarı gerekiyor. Şimdilik size normal liste görünümü sunuyoruz.
              </p>
            </div>
          </div>
          
          <div 
            className="space-y-2 mt-3"
            onClick={stopPropagation}
          >
            {salons?.map((salon) => (
              <div 
                key={salon.id} 
                className="border rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleViewSalon(salon);
                }}
              >
                <div 
                  className="flex items-start"
                  onClick={stopPropagation}
                >
                  <div 
                    className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full mr-3"
                    onClick={stopPropagation}
                  >
                    {salon.isPremium ? (
                      <span className="text-yellow-500 text-lg">★</span>
                    ) : (
                      <span className="text-pink-500">💅</span>
                    )}
                  </div>
                  <div onClick={stopPropagation}>
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

  // Google Maps ile harita gösterimi
  return (
    <Card className="mt-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-white dark:bg-gray-800 p-3 flex items-center justify-between border-b dark:border-gray-700">
          <h2 className="font-bold text-sm flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-pink-500" />
            Yakındaki Salonlar
          </h2>
          
          {/* Şehir seçimi */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedCity("istanbul")}
              className={`text-xs px-2 py-1 rounded-full transition-all ${
                selectedCity === "istanbul" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              İstanbul
            </button>
            <button 
              onClick={() => setSelectedCity("ankara")}
              className={`text-xs px-2 py-1 rounded-full transition-all ${
                selectedCity === "ankara" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Ankara
            </button>
            <button 
              onClick={() => setSelectedCity("izmir")}
              className={`text-xs px-2 py-1 rounded-full transition-all ${
                selectedCity === "izmir" 
                  ? "bg-pink-500 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              İzmir
            </button>
          </div>
        </div>
        
        {mapError ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm">
            {mapError}
          </div>
        ) : (
          <div className="h-64 relative">
            <LoadScript
              googleMapsApiKey={apiKey}
              onError={handleMapError}
              onLoad={() => setIsMapLoaded(true)}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  zoomControl: true
                }}
              >
                {/* Kullanıcının konumu */}
                <Marker
                  position={center}
                  icon={{
                    path: 0, // Icon will be a simple circle
                    fillColor: "#3B82F6",
                    fillOpacity: 1,
                    scale: 8,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                  }}
                />
                
                {/* Salon işaretleri */}
                {salons?.map((salon) => (
                  <Marker
                    key={salon.id}
                    position={{
                      lat: salon.latitude,
                      lng: salon.longitude
                    }}
                    onClick={() => handleMarkerClick(salon)}
                    icon={{
                      path: 0, // Icon will be a simple circle
                      fillColor: salon.isPremium ? "#F59E0B" : "#EC4899",
                      fillOpacity: 1,
                      scale: 7,
                      strokeColor: "#FFFFFF",
                      strokeWeight: 2,
                    }}
                  />
                ))}
                
                {/* Seçilen salon için bilgi penceresi */}
                {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: selectedMarker.latitude,
                      lng: selectedMarker.longitude
                    }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div className="p-1 max-w-[200px]">
                      <h3 className="font-bold text-sm">{selectedMarker.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{selectedMarker.address}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="ml-1 text-xs">{selectedMarker.rating}</span>
                        <span className="mx-1 text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-500">{selectedMarker.distance} km</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 text-xs" 
                        onClick={() => handleViewSalon(selectedMarker)}
                      >
                        Salonu Görüntüle
                      </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
            
            {/* Harita henüz yüklenmiyorsa yükleniyor göster */}
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Harita yükleniyor...</span>
                </div>
              </div>
            )}
            
            {/* Konumu sıfırla butonu */}
            <button 
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setCenter(turkishCities[selectedCity as keyof typeof turkishCities])}
            >
              <Navigation className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
        
        {/* Salon listesi */}
        <div className="p-3 border-t dark:border-gray-700">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {selectedCity === "istanbul" ? "İstanbul" : selectedCity === "ankara" ? "Ankara" : "İzmir"}'daki Salonlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {salons?.slice(0, 4).map((salon) => (
              <div 
                key={salon.id} 
                className="border rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center"
                onClick={() => handleViewSalon(salon)}
              >
                <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full mr-2">
                  {salon.isPremium ? (
                    <span className="text-yellow-500 text-sm">★</span>
                  ) : (
                    <span className="text-pink-500 text-sm">💅</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-xs">{salon.name}</h3>
                  <div className="flex items-center mt-0.5">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-[10px]">★</span>
                      <span className="ml-0.5 text-[10px]">{salon.rating}</span>
                    </div>
                    <span className="mx-1 text-gray-300 text-[10px]">•</span>
                    <span className="text-[10px] text-gray-500">{salon.distance} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}