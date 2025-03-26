import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, InfoWindow } from "@react-google-maps/api";
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
    <Card className="mt-4 overflow-hidden relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-pink-100/20 to-blue-100/20 dark:from-pink-900/30 dark:to-blue-900/30 z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1604754742629-3e0498a7255e?w=800&auto=format&fit=crop&q=20&blur=20')] bg-no-repeat bg-right-bottom bg-contain opacity-5 dark:opacity-10 z-0"></div>
      
      <CardContent className="p-0 relative z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-pink-500 rounded-full p-2 shadow-md">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800 dark:text-white leading-none">Yakındaki Salonlar</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Size en yakın güzellik salonlarını keşfedin</p>
            </div>
          </div>
          
          {/* Şehir seçimi - yeni tasarım */}
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex space-x-1 border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setSelectedCity("istanbul")}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedCity === "istanbul" 
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              İstanbul
            </button>
            <button 
              onClick={() => setSelectedCity("ankara")}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedCity === "ankara" 
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Ankara
            </button>
            <button 
              onClick={() => setSelectedCity("izmir")}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedCity === "izmir" 
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              İzmir
            </button>
          </div>
        </div>
        
        {mapError ? (
          <div className="mx-4 mb-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Harita yüklenemiyor</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {mapError}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64 relative mx-4 rounded-lg overflow-hidden shadow-md">
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
                  zoomControl: true,
                  styles: [
                    {
                      featureType: 'all',
                      elementType: 'geometry',
                      stylers: [{ color: '#f5f5f5' }]
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry',
                      stylers: [{ color: '#c9d3de' }]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'geometry',
                      stylers: [{ color: '#dbe7e5' }]
                    }
                  ]
                }}
              >
                {/* Merkez konumu belirten animasyonlu marker */}
                <div className="pulse-marker">
                  <div 
                    className="relative"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
                    <div className="w-12 h-12 bg-blue-500 opacity-20 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                    <div className="w-8 h-8 bg-blue-500 opacity-40 rounded-full animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                  </div>
                </div>
                
                {/* Salon işaretçileri */}
                {salons?.map((salon) => (
                  <div 
                    key={salon.id}
                    className="absolute cursor-pointer"
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleMarkerClick(salon)}
                  >
                    <div className="flex flex-col items-center">
                      <div 
                        className={`
                          w-10 h-10 rounded-lg shadow-lg relative cursor-pointer
                          ${salon.isPremium ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-gradient-to-br from-pink-400 to-pink-500'}
                        `}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {salon.isPremium ? (
                            <span className="text-white">★</span>
                          ) : (
                            <span className="text-white">💅</span>
                          )}
                        </div>
                        {/* Üçgen çıkıntı */}
                        <div 
                          className={`
                            absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45
                            w-2 h-2 ${salon.isPremium ? 'bg-yellow-500' : 'bg-pink-500'}
                          `}
                        ></div>
                      </div>
                      {/* Mini etiket */}
                      <div className="mt-1 bg-white dark:bg-gray-800 rounded-md shadow-md px-1 py-0.5 text-[8px] whitespace-nowrap">
                        {salon.name}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Seçilen salon için bilgi penceresi - modern tasarım */}
                {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: selectedMarker.latitude,
                      lng: selectedMarker.longitude
                    }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div className="p-2 max-w-[220px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t-2 border-pink-500 rounded-lg shadow-lg">
                      <div className="flex items-start">
                        <div className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-md mr-2 ${selectedMarker.isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-pink-100 text-pink-600'}`}>
                          {selectedMarker.isPremium ? (
                            <span className="text-xl">★</span>
                          ) : (
                            <span className="text-xl">💅</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-gray-800">{selectedMarker.name}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{selectedMarker.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pb-1 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="flex text-yellow-500">
                            {[...Array(Math.floor(selectedMarker.rating))].map((_, i) => (
                              <span key={i} className="text-xs">★</span>
                            ))}
                            {selectedMarker.rating % 1 > 0 && (
                              <span className="text-xs">☆</span>
                            )}
                          </div>
                          <span className="ml-1 text-xs text-gray-600">{selectedMarker.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 inline mr-0.5 text-pink-500" /> 
                            {selectedMarker.distance} km
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                          {selectedMarker.openTime}'e kadar açık
                        </span>
                        <Button 
                          size="sm" 
                          className="text-[10px] h-6 px-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700" 
                          onClick={() => handleViewSalon(selectedMarker)}
                        >
                          Salonu Görüntüle
                        </Button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
            
            {/* Harita yükleniyor göstergesi */}
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-1 border-4 border-t-transparent border-r-transparent border-b-pink-300 border-l-transparent rounded-full animate-spin animation-delay-500"></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 mt-3 font-medium">Harita Yükleniyor</span>
                </div>
              </div>
            )}
            
            {/* Konumu sıfırla butonu - modern tasarım */}
            <button 
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110"
              onClick={() => setCenter(turkishCities[selectedCity as keyof typeof turkishCities])}
            >
              <Navigation className="h-5 w-5 text-pink-500" />
            </button>
          </div>
        )}
        
        {/* Salon listesi - modern tasarım */}
        <div className="p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <span className="bg-pink-100 dark:bg-pink-900/30 w-5 h-5 rounded-full flex items-center justify-center text-pink-500 mr-2">
                {selectedCity === "istanbul" ? "İ" : selectedCity === "ankara" ? "A" : "İZ"}
              </span>
              {selectedCity === "istanbul" ? "İstanbul" : selectedCity === "ankara" ? "Ankara" : "İzmir"}'daki En İyi Salonlar
            </h3>
            <span className="text-xs text-pink-500 dark:text-pink-400 font-medium cursor-pointer hover:underline">
              Tümünü Gör
            </span>
          </div>
          
          <div className="space-y-2">
            {salons?.slice(0, 3).map((salon, index) => (
              <div 
                key={salon.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md hover:shadow-lg cursor-pointer transition-all hover:scale-[1.01] border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
                onClick={() => handleViewSalon(salon)}
              >
                {/* Arka plan süsü */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-pink-50 dark:bg-pink-900/10 z-0 group-hover:scale-110 transition-transform duration-300"></div>
                {salon.isPremium && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm z-10">
                    PREMIUM
                  </div>
                )}
                
                <div className="flex items-start relative z-10">
                  <div className={`h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 border-2 ${salon.isPremium ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-700' : 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-700'}`}>
                    {salon.isPremium ? (
                      <span className="text-2xl">★</span>
                    ) : (
                      <span className="text-2xl">💅</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 dark:text-white">{salon.name}</h3>
                      {salon.discount && (
                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {salon.discount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 inline mr-1 text-pink-400" />
                      <span className="line-clamp-1">{salon.address}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-500">
                          {[...Array(Math.floor(salon.rating))].map((_, i) => (
                            <span key={i} className="text-xs">★</span>
                          ))}
                          {salon.rating % 1 > 0 && (
                            <span className="text-xs">☆</span>
                          )}
                        </div>
                        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                          ({salon.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{salon.distance} km</span>
                        <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span className="text-xs text-green-600 dark:text-green-400">{salon.openTime}'e kadar açık</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Süslü ok */}
                <div className="absolute right-3 bottom-3 w-6 h-6 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-pink-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* İndikatör noktası (sıralama için) */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-pink-400 to-pink-500 rounded-r-full opacity-60"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}