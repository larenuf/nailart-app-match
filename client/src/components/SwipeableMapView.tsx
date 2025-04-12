import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import { Salon } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Navigation, 
  Award,
  Tag
} from 'lucide-react';

// Türkiye şehir bölgeleri
const turkishCities = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4237, lng: 27.1428 }
};

// Salon özel ikon oluşturma fonksiyonu
const createSalonIcon = (isPremium: boolean, color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid white;">
        <span style="color: white; font-size: 18px;">${isPremium ? '⭐️' : '💅'}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Harita merkezini ve zoom seviyesini kontrol etmek için bir bileşen
function MapControl({ position, onZoomChange }: { 
  position: LatLngExpression, 
  onZoomChange?: (zoom: number) => void 
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  
  useEffect(() => {
    if (!onZoomChange) return;
    
    const updateZoom = () => {
      onZoomChange(map.getZoom());
    };
    
    map.on('zoomend', updateZoom);
    return () => {
      map.off('zoomend', updateZoom);
    };
  }, [map, onZoomChange]);
  
  return null;
}

interface SwipeableMapViewProps {
  salons: Salon[];
  initialCity?: 'istanbul' | 'ankara' | 'izmir';
}

export default function SwipeableMapView({ salons, initialCity = 'istanbul' }: SwipeableMapViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [_, navigate] = useLocation();
  const { setSelectedSalon } = useAppContext();
  const mapRef = useRef<any>(null);
  
  // Boş salon listesi kontrolü
  if (!salons || salons.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <MapPinOff className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Bu bölgede salon bulunamadı.</p>
      </div>
    );
  }
  
  const currentSalon = salons[currentIndex];
  
  // Salon detaylarını görüntülemek için
  const handleViewDetails = () => {
    setSelectedSalon(currentSalon);
    navigate(`/salons/${currentSalon.id}`);
  };
  
  // Sonraki salona geçiş
  const nextSalon = () => {
    if (currentIndex < salons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Listenin sonuna gelince başa dön
      setCurrentIndex(0);
    }
  };
  
  // Önceki salona geçiş
  const prevSalon = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Listenin başındayken sona git
      setCurrentIndex(salons.length - 1);
    }
  };
  
  // Dokunma olayları için işleyiciler
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Eğer kaydırma mesafesi yeterince büyükse (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Sola kaydırma - sonraki salon
        nextSalon();
      } else {
        // Sağa kaydırma - önceki salon
        prevSalon();
      }
    }
    
    setTouchStartX(null);
  };
  
  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-lg text-gray-800 dark:text-white leading-none flex items-center">
          <div className="bg-pink-500 rounded-full p-2 mr-2 shadow-md">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <div>
            <span>Haritada Gezerek Keşfet</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Salonları kaydırarak görüntüleyin ({currentIndex + 1}/{salons.length})
            </p>
          </div>
        </h2>
      </div>
      
      <div 
        className="relative h-64 w-full" 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <MapContainer 
          center={[currentSalon.latitude, currentSalon.longitude] as LatLngExpression} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapControl 
            position={[currentSalon.latitude, currentSalon.longitude] as LatLngExpression}
          />
          
          <Marker 
            position={[currentSalon.latitude, currentSalon.longitude] as LatLngExpression}
            icon={createSalonIcon(currentSalon.isPremium, currentSalon.isPremium ? "#F59E0B" : "#EC4899")}
          />
        </MapContainer>
        
        {/* Gölgeli kenar geçişleri - swipe işaretleyicisi */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/20 to-transparent"></div>
        </div>
        
        {/* Kaydırma butonları */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button 
            onClick={prevSalon}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-10 w-10 rounded-full shadow flex items-center justify-center ml-4 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button 
            onClick={nextSalon}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-10 w-10 rounded-full shadow flex items-center justify-center mr-4 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-3">
          <div className={`h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 border-2 ${
            currentSalon.isPremium 
              ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-700' 
              : 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-700'
          }`}>
            {currentSalon.isPremium ? <span className="text-2xl">⭐️</span> : <span className="text-2xl">💅</span>}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 dark:text-white">{currentSalon.name}</h3>
            <div className="flex space-x-1 mt-1">
              {currentSalon.isPremium && (
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Award className="w-2.5 h-2.5 mr-0.5" /> En İyi
                </span>
              )}
              {currentSalon.discount && (
                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Tag className="w-2.5 h-2.5 mr-0.5" /> {currentSalon.discount}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3 inline mr-1 text-pink-400" />
              <span className="line-clamp-1">{currentSalon.address}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <div className="flex text-yellow-500">
                  {[...Array(Math.floor(currentSalon.rating))].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                  {currentSalon.rating % 1 > 0 && (
                    <span className="text-xs">☆</span>
                  )}
                </div>
                <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                  ({currentSalon.reviewCount})
                </span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">{currentSalon.openTime}e kadar</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleViewDetails} 
          size="sm" 
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600"
        >
          Salon Detaylarını Görüntüle
        </Button>
        
        <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <ChevronLeft className="h-3 w-3 inline" />
          <span className="mx-1">Salonlar arasında geçiş yapmak için kaydırın</span>
          <ChevronRight className="h-3 w-3 inline" />
        </div>
      </div>
    </div>
  );
}

// Yerine koyulabilecek bir bileşen
export function MapPinOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 14.95-5 5" />
      <path d="m20 9-5-5" />
      <path d="m3 3 18 18" />
      <path d="M14.05 17.5c-.92.91-1.4 1.45-2.13 1.95a2 2 0 0 1-1.83 0c-1.85-1.17-3.56-3.14-5.09-5.67-1.35-2.21-1.85-4.28-1.36-5.97a2.1 2.1 0 0 1 .51-.96" />
      <path d="M7.92 7.92c-.7 1.72.56 3.45 2.08 5.5 1.29 1.76 2.68 3.16 4.8 4.58" />
      <path d="M13.5 8.33a2.67 2.67 0 0 0 3.17 3.17" />
      <path d="M19.35 10.5c.32 1.22.15 2.48-.5 3.63a16.64 16.64 0 0 1-2 3.04" />
    </svg>
  );
}