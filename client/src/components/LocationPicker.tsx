import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Konum ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Ara</Button>
        </div>
        
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onClick={handleMapClick}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </LoadScript>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">Seçilen konum:</p>
          <p className="font-medium">{locationName || "Konum seçilmedi"}</p>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">İptal</Button>
          <Button onClick={handleSaveLocation} className="flex-1">Kaydet</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}