import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Salon } from "@/types";
import { ShoppingCart, Sparkles, Fingerprint, ArrowRight, MapPin, Star, Clock, ArrowDownAZ, Percent, Filter } from "lucide-react";
import { useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";
import SalonFilters, { SalonFilterType, ServiceType, DistrictType } from "./SalonFilters";

export default function FeaturedSalonsSection() {
  const { setSelectedSalon } = useAppContext();
  const [, navigate] = useLocation();
  const { t } = useI18n();
  
  const { data: salons = [], isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons/featured"],
  });

  // Filtre durumları
  const [filterType, setFilterType] = useState<SalonFilterType>("all");
  const [serviceType, setServiceType] = useState<ServiceType>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictType>("all");
  
  // Salon kartlarının genişletme durumlarını saklamak için
  const [expandedSalonIds, setExpandedSalonIds] = useState<Set<number>>(new Set());

  // Salon genişletme durumunu değiştirmek için yardımcı fonksiyon
  const toggleSalonExpand = useCallback((salonId: number) => {
    setExpandedSalonIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(salonId)) {
        newIds.delete(salonId);
      } else {
        newIds.add(salonId);
      }
      return newIds;
    });
  }, []);

  // Filtrelenmiş salonları hesapla
  const filteredSalons = useMemo(() => {
    if (!salons || salons.length === 0) return [];
    
    let filtered = [...salons];
    
    // Ana filtre tipine göre işlemler
    switch (filterType) {
      case 'nearest':
        filtered = filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'top-rated':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'open-now':
        // Şu anda açık olan salonları filtrele
        const currentHour = new Date().getHours();
        filtered = filtered.filter(salon => {
          const openHour = parseInt(salon.openTime.split(':')[0]);
          const closeHour = parseInt(salon.closeTime.split(':')[0]);
          return currentHour >= openHour && currentHour < closeHour;
        });
        break;
      case 'discounts':
        filtered = filtered.filter(salon => salon.discount);
        break;
    }
    
    // Hizmet türüne göre filtrele
    if (serviceType !== 'all') {
      // Salon hizmetlerinde belirli bir hizmet var mı kontrol et
      // Not: Gerçek implementasyon salon.services içinde belirli hizmetleri kontrol etmeli
      const serviceMap: Record<ServiceType, string[]> = {
        'gel': ['Jel Oje', 'Jel Tırnak'],
        'nail-art': ['Nail Art', 'Özel Tasarım'],
        'manicure': ['Manikür'],
        'pedicure': ['Pedikür'],
        'all': []
      };
      
      filtered = filtered.filter(salon => {
        // Örnek uygulamada bu bilgileri salon nesnesinden alıyoruz
        // Gerçek uygulamada salon.services'dan kontrol edilmeli
        if (serviceType === 'gel' && salon.isPremium) return true;
        if (serviceType === 'nail-art' && salon.isPremium) return true;
        // Diğer hizmet türleri için tüm salonların desteklediğini varsayıyoruz (demo için)
        return true;
      });
    }
    
    // Fiyat aralığına göre filtrele
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filtered = filtered.filter(salon => {
        // Burada salonun ortalama fiyatını simüle ediyoruz
        // Gerçek uygulamada salon.averagePrice veya salon.priceRange kullanılabilir
        const simulatedAvgPrice = salon.isPremium ? 300 + Math.random() * 400 : 100 + Math.random() * 200;
        return simulatedAvgPrice >= priceRange[0] && simulatedAvgPrice <= priceRange[1];
      });
    }
    
    // Semte/ilçeye göre filtrele
    if (selectedDistrict !== 'all') {
      const districtMap: Record<DistrictType, string[]> = {
        'kadikoy': ['Kadıköy', 'Moda'],
        'besiktas': ['Beşiktaş', 'Levent'],
        'sisli': ['Şişli', 'Nişantaşı'],
        'uskudar': ['Üsküdar', 'Bağlarbaşı'],
        'beyoglu': ['Beyoğlu', 'Taksim'],
        'all': []
      };
      
      filtered = filtered.filter(salon => {
        // Adres içinde ilçe adı geçiyor mu kontrol et (basit bir yaklaşım)
        const keywords = districtMap[selectedDistrict];
        return keywords.some(keyword => 
          salon.address.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    }
    
    return filtered;
  }, [salons, filterType, serviceType, priceRange, selectedDistrict]);

  // Basitleştirilmiş salon seçimi işleyicisi
  const handleSelectSalon = useCallback((salon: Salon) => {
    console.log("Salon seçildi, yönlendiriliyor:", salon.name);
    
    // Hem context'i güncelle hem de URL'yi doğrudan değiştir
    setSelectedSalon(salon);
    navigate(`/salons/${salon.id}`);
  }, [setSelectedSalon, navigate]);

  // Tümünü Gör butonu işleyicisi
  const handleViewAll = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/search');
  }, [navigate]);

  // Ürün kategorisine yönlendirme işleyicisi
  const handleProductCategory = useCallback((e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product-category/${category}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold font-playfair dark:text-gray-300">Öne Çıkan Salonlar</h2>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-3">
                <div className="w-2/3 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="px-4 py-4"  
      // Tıklama olayını burada durdur
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Tırnak Ürünleri Satış Alanı */}
      <div 
        className="mb-6" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div 
          className="flex justify-between items-center mb-3"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <h2 
            className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingCart size={14} className="text-purple-500 mr-1"/>
            Tırnak Ürünleri
          </h2>
          <button 
            className="text-xs font-medium text-primary dark:text-pink-400 flex items-center"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/shop');
            }}
          >
            Mağazaya Git <ShoppingCart size={10} className="ml-0.5"/>
          </button>
        </div>
        
        <div 
          className="grid grid-cols-2 gap-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Tırnak Bakım Ürünleri */}
          <div 
            className="cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProductCategory(e, 'nail-care');
            }}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02] bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-500 text-2xl font-medium">Tırnak Bakım Ürünleri</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-2.5 text-white">
                <h3 className="text-sm font-bold">💅 Tırnak Bakım Ürünleri</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs mr-2 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">Özel Fiyatlar</span>
                  <span className="text-xs bg-primary/80 px-2 py-0.5 rounded-full">%15 İndirim</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nail Art Kitleri */}
          <div 
            className="cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProductCategory(e, 'nail-art-kits');
            }}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02] bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-500 text-2xl font-medium">Nail Art Kitleri</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-2.5 text-white">
                <h3 className="text-sm font-bold">✨ Nail Art Kitleri</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs mr-2 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">Yeni Ürünler</span>
                  <span className="text-xs bg-primary/80 px-2 py-0.5 rounded-full">%20 İndirim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Yeni Gelişmiş Filtre Bileşeni */}
      <SalonFilters
        filterType={filterType}
        setFilterType={setFilterType}
        serviceType={serviceType}
        setServiceType={setServiceType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />
      
      <div 
        className="flex justify-between items-center mb-3"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h2 
          className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300 flex items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Sparkles size={14} className="text-amber-500 mr-1"/>
          Öne Çıkan Salonlar
        </h2>
        <button 
          className="text-xs font-medium text-primary dark:text-pink-400 flex items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleViewAll(e);
          }}
          type="button"
        >
          Tümünü Gör <ArrowRight size={10} className="ml-0.5"/>
        </button>
      </div>

      <div 
        className="grid grid-cols-1 gap-4"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {filteredSalons.map((salon) => {
          // Salon kartının genişletilmiş olup olmadığını kontrol et
          const isExpanded = expandedSalonIds.has(salon.id);
          
          // Kartı genişletmek için tıklama işleyicisi
          const toggleExpand = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSalonExpand(salon.id);
          };
          
          return (
            <div
              key={salon.id}
              className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${isExpanded ? 'shadow-lg scale-[1.02]' : ''}`}
            >
              <div 
                className="relative h-48 w-full overflow-hidden"
                onClick={toggleExpand}
              >
                <img
                  src={salon.id === 1 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=300&fit=crop&q=80" : 
                       salon.id === 2 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=300&fit=crop&q=80" :
                       salon.id === 3 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=300&fit=crop&q=80" :
                       "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=300&fit=crop&q=80"}
                  alt={salon.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Badges on top */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {salon.isPremium && (
                    <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                      <Sparkles size={10} className="inline mr-1" />
                      Premium
                    </span>
                  )}
                  {salon.discount && (
                    <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                      <Percent size={10} className="inline mr-1" />
                      {salon.discount} İndirim
                    </span>
                  )}
                </div>
                
                {/* Salon name at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white drop-shadow-md">{salon.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-amber-400 mr-2 drop-shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={`${i < Math.floor(salon.rating) ? 'fill-current' : 'stroke-current fill-none'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-white/90">
                      {salon.rating.toFixed(1)} ({salon.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Salon bilgileri ve butonlar */}
              <div className="p-4">
                {/* Adres bilgisi */}
                <div className="flex items-start mb-3">
                  <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{salon.address}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <Clock size={12} className="inline mr-1" />
                      {salon.openTime} - {salon.closeTime}
                    </p>
                  </div>
                </div>
                
                {/* Hizmetler */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Sağlanan Hizmetler:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-lg">Manikür</span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-lg">Pedikür</span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-lg">Kalıcı Oje</span>
                    {salon.isPremium && (
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-lg">
                        Özel Tasarımlar
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Butonlar */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200">
                    Randevu Al
                  </button>
                  <button 
                    className="w-12 aspect-square bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectSalon(salon);
                    }}
                  >
                    <ArrowRight size={18} className="text-primary" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}