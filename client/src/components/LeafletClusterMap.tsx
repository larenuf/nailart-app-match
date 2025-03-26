import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import { useAppContext } from '@/context/AppContext';
import { Salon } from '@/types';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, MapPin, Navigation, Tag } from 'lucide-react';

// Leaflet icon hatası çözümü
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Özel ikon oluşturma
const createCustomIcon = (type: string, color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">
        <span style="color: white; font-size: 16px;">${type === 'featured' ? '⭐️' : type === 'filtered' ? '🎯' : '🌸'}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Marker kümeleme için simülasyon fonksiyonu
function clusterMarkers(salons: Salon[], zoom: number) {
  // Zoom seviyesi 12'nin altındaysa kümeleri oluştur
  if (zoom < 12) {
    const clusters: { 
      lat: number; 
      lng: number; 
      count: number; 
      salons: Salon[]; 
      mainType: 'featured' | 'filtered' | 'nearby';
    }[] = [];
    
    // Bu basit bir simülasyondur, gerçek uygulamada daha karmaşık bir algoritma kullanılmalıdır
    const gridSize = 0.02 / (zoom / 10); // Zoom seviyesine göre grid boyutunu ayarla
    
    salons.forEach(salon => {
      const lat = Math.floor(salon.latitude / gridSize) * gridSize;
      const lng = Math.floor(salon.longitude / gridSize) * gridSize;
      
      const existingCluster = clusters.find(
        c => Math.abs(c.lat - lat) < gridSize && Math.abs(c.lng - lng) < gridSize
      );
      
      if (existingCluster) {
        existingCluster.salons.push(salon);
        existingCluster.count += 1;
        // Küme içinde premium salon varsa, kümenin tipini featured yap
        if (salon.isPremium && existingCluster.mainType !== 'featured') {
          existingCluster.mainType = 'featured';
        }
      } else {
        clusters.push({ 
          lat, 
          lng, 
          count: 1, 
          salons: [salon],
          mainType: salon.isPremium ? 'featured' : 'nearby'
        });
      }
    });
    
    return clusters;
  }
  
  // Zoom seviyesi yüksekse kümeleme yapma
  return salons.map(salon => ({
    lat: salon.latitude,
    lng: salon.longitude,
    count: 1,
    salons: [salon],
    mainType: salon.isPremium ? 'featured' : salon.id % 5 === 0 ? 'filtered' : 'nearby'
  }));
}

// Harita merkezini ve zoom seviyesini kontrol etmek için bir bileşen
function MapControl({ 
  city, 
  onZoomChange 
}: { 
  city: { lat: number; lng: number; }, 
  onZoomChange: (zoom: number) => void 
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([city.lat, city.lng], 12);
  }, [city, map]);
  
  useEffect(() => {
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

// Seçilen marker için kart bileşeni
function SelectedSalonCard({ 
  salon, 
  onClose, 
  onViewDetails 
}: { 
  salon: Salon, 
  onClose: () => void, 
  onViewDetails: (salon: Salon) => void 
}) {
  return (
    <Card className="absolute bottom-4 right-4 z-[1000] w-72 p-3 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex items-start">
        <div className={`h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 border-2 ${
          salon.isPremium 
            ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-700' 
            : 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-700'
        }`}>
          {salon.isPremium ? <span className="text-2xl">⭐️</span> : <span className="text-2xl">🌸</span>}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap">
            <h3 className="font-bold text-gray-800 dark:text-white">{salon.name}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              &times;
            </button>
          </div>
          <div className="flex space-x-1 mt-1">
            {salon.isPremium && (
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                <Award className="w-2.5 h-2.5 mr-0.5" /> En İyi
              </span>
            )}
            {salon.discount && (
              <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                <Tag className="w-2.5 h-2.5 mr-0.5" /> {salon.discount}
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
            <span className="text-xs text-green-600 dark:text-green-400">{salon.openTime}e kadar</span>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => onViewDetails(salon)} 
        size="sm" 
        className="w-full mt-3 bg-gradient-to-r from-pink-500 to-pink-600"
      >
        Salon Detaylarını Görüntüle
      </Button>
    </Card>
  );
}

// Türkiye şehir bölgeleri
const turkishCities = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4237, lng: 27.1428 }
};

// Marker renk türleri ve açıklamaları
const markerTypes = {
  featured: {
    label: "Öne Çıkan",
    color: "#F59E0B"
  },
  nearby: {
    label: "Yakındaki",
    color: "#EC4899"
  },
  filtered: {
    label: "Filtrelenmiş",
    color: "#8B5CF6"
  }
};

export default function LeafletClusterMap({ salons }: { salons: Salon[] }) {
  const [zoom, setZoom] = useState(12);
  const [selectedCity, setSelectedCity] = useState<string>("istanbul");
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [_, navigate] = useLocation();
  const { setSelectedSalon: setGlobalSelectedSalon } = useAppContext();
  
  // Kümelenmiş markerları oluştur
  const clusters = clusterMarkers(salons, zoom);
  
  const handleMarkerClick = (salon: Salon) => {
    setSelectedSalon(salon);
  };
  
  const handleViewSalonDetails = (salon: Salon) => {
    setGlobalSelectedSalon(salon);
    navigate(`/salons/${salon.id}`);
  };
  
  return (
    <div className="relative mt-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-800 dark:text-white leading-none flex items-center">
          <div className="bg-pink-500 rounded-full p-2 mr-2 shadow-md">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <span>Yakındaki Salonlar</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Size en yakın güzellik salonlarını keşfedin
            </p>
          </div>
        </h2>
        
        {/* Şehir seçimi */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 flex space-x-1 border border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setSelectedCity("istanbul")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
              selectedCity === "istanbul" 
                ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md translate-y-[-1px]" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            İstanbul
          </button>
          <button 
            onClick={() => setSelectedCity("ankara")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
              selectedCity === "ankara" 
                ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md translate-y-[-1px]" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Ankara
          </button>
          <button 
            onClick={() => setSelectedCity("izmir")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
              selectedCity === "izmir" 
                ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md translate-y-[-1px]" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            İzmir
          </button>
        </div>
      </div>
      
      {/* Renk açıklamaları */}
      <div className="mx-4 flex mb-2 items-center gap-4 justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerTypes.featured.color }}></div>
          <span className="text-[10px] text-gray-600 dark:text-gray-300">{markerTypes.featured.label}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerTypes.nearby.color }}></div>
          <span className="text-[10px] text-gray-600 dark:text-gray-300">{markerTypes.nearby.label}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerTypes.filtered.color }}></div>
          <span className="text-[10px] text-gray-600 dark:text-gray-300">{markerTypes.filtered.label}</span>
        </div>
      </div>
    
      <div className="h-64 mx-4 rounded-lg overflow-hidden shadow-md relative">
        <MapContainer 
          center={[turkishCities[selectedCity as keyof typeof turkishCities].lat, turkishCities[selectedCity as keyof typeof turkishCities].lng] as LatLngExpression} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapControl 
            city={turkishCities[selectedCity as keyof typeof turkishCities]} 
            onZoomChange={setZoom} 
          />
          
          {clusters.map((cluster, index) => {
            const type = cluster.mainType;
            const icon = createCustomIcon(
              type, 
              type === 'featured' 
                ? markerTypes.featured.color 
                : type === 'filtered' 
                  ? markerTypes.filtered.color 
                  : markerTypes.nearby.color
            );
            
            return (
              <Marker 
                key={`${cluster.lat}-${cluster.lng}-${index}`}
                position={[cluster.lat, cluster.lng] as LatLngExpression}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    // Eğer bu bir küme ise ve birden fazla salon içeriyorsa
                    if (cluster.count > 1) {
                      // Zoom seviyesini bir arttır - kullanıcıyı yakınlaştır
                      // Bu gerçek kümeleme kütüphanelerindeki davranışı simüle eder
                    } else {
                      // Tekil bir salon ise, salon detaylarını göster
                      handleMarkerClick(cluster.salons[0]);
                    }
                  }
                }}
              >
                {cluster.count > 1 ? (
                  <Popup>
                    <div className="p-2">
                      <div className="font-semibold text-sm mb-2">Bu bölgede {cluster.count} salon bulunuyor</div>
                      <ul className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                        {cluster.salons.slice(0, 3).map(salon => (
                          <li key={salon.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xs mr-1">
                                {salon.isPremium ? '⭐' : '💅'}
                              </span>
                              <span>{salon.name}</span>
                            </div>
                            <button 
                              className="text-[10px] text-pink-600 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSalonDetails(salon);
                              }}
                            >
                              Görüntüle
                            </button>
                          </li>
                        ))}
                        {cluster.salons.length > 3 && (
                          <li className="text-center text-gray-500 text-[10px]">
                            + {cluster.salons.length - 3} salon daha...
                          </li>
                        )}
                      </ul>
                      <div className="text-[10px] text-gray-500 mt-2">
                        Daha fazla salon görmek için yakınlaştırın
                      </div>
                    </div>
                  </Popup>
                ) : (
                  <Popup>
                    <div className="p-2 min-w-48">
                      <div className="font-semibold">{cluster.salons[0].name}</div>
                      <div className="text-xs text-gray-600 mt-1">{cluster.salons[0].address}</div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-500 text-xs">
                          {[...Array(Math.floor(cluster.salons[0].rating))].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-xs ml-1">({cluster.salons[0].rating})</span>
                      </div>
                      <button
                        className="text-xs text-pink-600 hover:underline mt-2 block"
                        onClick={() => handleViewSalonDetails(cluster.salons[0])}
                      >
                        Salon Detayları
                      </button>
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Merkezi konumu sıfırla butonu */}
        <button 
          className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-[900] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110"
          onClick={() => {
            // Harita ref'i elimizde olsaydı, burada setView kullanabilirdik
            // Şimdilik sadece şehri yeniden seçiyoruz, bu MapControl'ü yeniden tetikleyecek
            setSelectedCity(selectedCity);
          }}
        >
          <Navigation className="h-5 w-5 text-pink-500" />
        </button>
      </div>
      
      {/* Seçili salon kartı */}
      {selectedSalon && (
        <SelectedSalonCard 
          salon={selectedSalon} 
          onClose={() => setSelectedSalon(null)} 
          onViewDetails={handleViewSalonDetails} 
        />
      )}
      
      {/* Salon İsimleri Listesi */}
      <div className="p-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <span className="bg-pink-100 dark:bg-pink-900/30 w-5 h-5 rounded-full flex items-center justify-center text-pink-500 mr-2">
              {selectedCity === "istanbul" ? "İ" : selectedCity === "ankara" ? "A" : "İZ"}
            </span>
            {selectedCity === "istanbul" ? "İstanbul" : selectedCity === "ankara" ? "Ankara" : "İzmir"}'daki En İyi Salonlar
          </h3>
          <button 
            className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
          >
            <svg 
              className="h-3 w-3 mr-1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Filtrele ve Sırala</span>
          </button>
        </div>
        
        <div className="space-y-2">
          {salons.slice(0, 3).map((salon) => (
            <div 
              key={salon.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md hover:shadow-lg cursor-pointer transition-all hover:scale-[1.01] border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
              onClick={() => handleViewSalonDetails(salon)}
            >
              {/* Arka plan süsü */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-pink-50 dark:bg-pink-900/10 z-0 group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="flex items-start relative z-10">
                {/* Salon thumbnail */}
                <div className="h-16 w-16 flex-shrink-0 rounded-lg mr-3 overflow-hidden">
                  <img 
                    src={salon.imageUrl} 
                    alt={salon.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap">
                    <h3 className="font-bold text-gray-800 dark:text-white">{salon.name}</h3>
                    <div className="flex space-x-1">
                      {salon.isPremium && (
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                          <Award className="w-2.5 h-2.5 mr-0.5" /> En İyi
                        </span>
                      )}
                      {salon.discount && (
                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center">
                          <Tag className="w-2.5 h-2.5 mr-0.5" /> {salon.discount}
                        </span>
                      )}
                    </div>
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
              
              {/* Aksiyon butonları */}
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs px-3 py-1 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Haritada bu salonu göster ve kartını aç
                    handleMarkerClick(salon);
                  }}
                >
                  Haritada Göster
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs px-3 py-1 h-8 bg-gradient-to-r from-pink-500 to-pink-600"
                >
                  Randevu Al
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}