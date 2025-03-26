import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Salon } from "@/types";
import { ShoppingCart, Sparkles, Fingerprint, ArrowRight, MapPin, Star, Clock, ArrowDownAZ, Percent, Filter } from "lucide-react";
import { useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeaturedSalonsSection() {
  const { setSelectedSalon } = useAppContext();
  const [, navigate] = useLocation();
  const { t } = useI18n();
  
  const { data: salons = [], isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons/featured"],
  });

  // Filtre durumları
  const [filterType, setFilterType] = useState<string>("all"); // 'all', 'nearest', 'top-rated', 'discounts'
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
    
    switch (filterType) {
      case 'nearest':
        return filtered.sort((a, b) => a.distance - b.distance);
      case 'top-rated':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'discounts':
        return filtered.filter(salon => salon.discount);
      default:
        return filtered;
    }
  }, [salons, filterType]);

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
          className="grid grid-cols-2 gap-3"
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
      
      {/* Yeni Filtre Butonları - Başlıktan önce yerleştirildi */}
      <ScrollArea className="mb-4" type="scroll">
        <div className="flex space-x-2 pb-2">
          <Button 
            size="sm" 
            variant={filterType === "all" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("all")}
          >
            <Filter size={12} className="mr-1" />
            Sırala
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "nearest" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("nearest")}
          >
            <MapPin size={12} className="mr-1" />
            En Yakın
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "top-rated" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("top-rated")}
          >
            <Star size={12} className="mr-1" />
            En Yüksek Puan
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "discounts" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("discounts")}
          >
            <Percent size={12} className="mr-1" />
            Kampanya
          </Button>
        </div>
      </ScrollArea>
      
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
        className="space-y-4"
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
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${isExpanded ? 'shadow-lg' : ''}`}
            >
              {/* Daraltılmış görünümde sadece başlık ve minimal bilgi */}
              <div 
                className="flex items-center p-3 border-b dark:border-gray-700"
                onClick={toggleExpand}
              >
                <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0 mr-3">
                  <span className="text-pink-600 dark:text-pink-300 font-bold text-lg">
                    {salon.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 dark:text-white truncate">{salon.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MapPin size={10} className="mr-1" />
                    <span className="truncate">{salon.distance} km</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex text-yellow-400 items-center">
                      <Star size={10} className="mr-0.5 fill-current" />
                      <span>{salon.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`flex items-center justify-center h-6 w-6 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={toggleExpand}
                >
                  <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`}></i>
                </button>
              </div>
              
              {/* Genişletilmiş görünüm */}
              {isExpanded && (
                <div className="transition-all duration-300 ease-in-out">
                  <img
                    src={salon.id === 1 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" : 
                         salon.id === 2 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                         salon.id === 3 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                         "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80"}
                    alt={salon.name}
                    className="w-full h-40 object-cover"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onError={(e) => {
                      console.error("Salon resmi yüklenemedi:", salon.id);
                      (e.target as HTMLImageElement).src = 'https://placekitten.com/400/300';
                    }}
                  />
                  
                  <div className="p-3 space-y-3">
                    {/* Salon detaylarını göster */}
                    <div className="flex flex-wrap gap-1">
                      {salon.discount && (
                        <span className="bg-[#F9E0E7] text-[#333333] text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center">
                          <Percent size={10} className="mr-1" />
                          {salon.discount} İndirim
                        </span>
                      )}
                      {salon.isPremium && (
                        <span className="bg-[#D6C3E5] text-[#333333] text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center">
                          <Sparkles size={10} className="mr-1" />
                          Premium
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center">
                        <Clock size={10} className="mr-1" />
                        {salon.openTime} - {salon.closeTime}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <p className="mb-1 flex items-start">
                        <MapPin size={12} className="mr-1 flex-shrink-0 mt-0.5" />
                        <span>{salon.address}</span>
                      </p>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={`${i < Math.floor(salon.rating) ? 'fill-current' : 'fill-none stroke-current'}`} />
                          ))}
                        </div>
                        <span className="ml-1">
                          {salon.rating.toFixed(1)} ({salon.reviewCount} değerlendirme)
                        </span>
                      </div>
                    </div>
                    
                    {/* Aksiyon butonları */}
                    <div className="flex gap-2 pt-1">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectSalon(salon);
                        }}
                      >
                        Detaylar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/booking/${salon.id}`);
                        }}
                      >
                        Randevu Al
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}