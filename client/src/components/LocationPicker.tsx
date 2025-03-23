import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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

export default function LocationPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { userLocation, setUserLocation } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [center, setCenter] = useState<Coordinates>({ lat: 40.7128, lng: -74.0060 }); // Default New York
  const [markerPosition, setMarkerPosition] = useState<Coordinates>({ lat: 40.7128, lng: -74.0060 });
  const [locationName, setLocationName] = useState("");

  // Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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
          setMarkerPosition(userPosition);
          
          // Reverse Geocoding - koordinatları adrese çevir
          fetchLocationName(userPosition.lat, userPosition.lng);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Adres arama işlemi
  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchGeocoding(searchTerm);
    }
  };

  // Harita üzerinde tıklama işlemi
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const clickedPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(clickedPosition);
      
      // Reverse Geocoding - koordinatları adrese çevir
      fetchLocationName(clickedPosition.lat, clickedPosition.lng);
    }
  };

  // Konumu uygulama genelinde kaydet
  const handleSaveLocation = () => {
    if (locationName) {
      setUserLocation(locationName);
      onClose();
    }
  };

  // Geocoding API ile adres araması
  const fetchGeocoding = async (address: string) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
        setMarkerPosition({ lat: location.lat, lng: location.lng });
        setLocationName(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Reverse Geocoding API ile koordinatları adrese çevir
  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setLocationName(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="px-4 py-3 max-h-[80vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-center">Konum Seç</DrawerTitle>
        </DrawerHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start dark:bg-amber-900/30 dark:border-amber-700">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Harita yüklenemiyor</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Geçerli bir Google Maps API anahtarı gerekiyor. Şimdilik manuel konum seçimi yapabilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Konum ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Ara</Button>
        </div>
        
        {/* Harita yerine basit konum seçici */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 h-64 flex flex-col items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500 text-center mb-4">
            <i className="fas fa-map-marker-alt text-3xl mb-2 block"></i>
            <p className="text-sm">Harita şu anda kullanılamıyor</p>
          </div>
          
          <div className="w-full mt-4">
            <p className="text-xs text-gray-500 mb-2">Önceden tanımlanmış konumlar:</p>
            <div className="space-y-2">
              {["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"].map((city) => (
                <div 
                  key={city}
                  className="rounded-lg border p-2 hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setLocationName(city)}
                >
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
                    <span className="text-sm">{city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">Seçilen konum:</p>
          <p className="font-medium">{locationName || "Konum seçilmedi"}</p>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">İptal</Button>
          <Button 
            onClick={handleSaveLocation} 
            className="flex-1"
            disabled={!locationName}
          >
            Kaydet
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}