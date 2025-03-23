import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Salon } from "@/types";
import { ShoppingCart, Sparkles, Fingerprint, ArrowRight } from "lucide-react";
import { useCallback } from "react";

export default function FeaturedSalonsSection() {
  const { setSelectedSalon } = useAppContext();
  const [, navigate] = useLocation();
  
  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons/featured"],
  });

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
        {salons?.map((salon) => (
          <div
            key={salon.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => {
              // Çok basit tıklama işleyicisi
              handleSelectSalon(salon);
            }}
          >
            <img
              src={salon.id === 1 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" : 
                   salon.id === 2 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                   salon.id === 3 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                   "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80"}
              alt={salon.name}
              className="w-full h-40 object-cover"
              onClick={(e) => {
                e.stopPropagation(); // Sadece yayılımı durduruyoruz
              }}
              onError={(e) => {
                console.error("Salon resmi yüklenemedi:", salon.id);
                // Yedek resim göster
                (e.target as HTMLImageElement).src = 'https://placekitten.com/400/300';
              }}
            />
            <div 
              className="p-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div 
                className="flex justify-between items-start"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <h3 className="font-bold text-[#333333] dark:text-white">{salon.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-[#FFD700]">
                      {[...Array(Math.floor(salon.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star text-xs"></i>
                      ))}
                      {salon.rating % 1 > 0 && (
                        <i className="fas fa-star-half-alt text-xs"></i>
                      )}
                    </div>
                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">
                      {salon.rating.toFixed(1)} ({salon.reviewCount})
                    </span>
                  </div>
                </div>
                {salon.discount && (
                  <span className="bg-[#F9E0E7] text-[#333333] text-xs font-semibold px-2 py-1 rounded-full">
                    {salon.discount} İndirim
                  </span>
                )}
                {salon.isPremium && (
                  <span className="bg-[#D6C3E5] text-[#333333] text-xs font-semibold px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div 
                className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <i className="fas fa-map-marker-alt mr-1"></i>
                <span>{salon.distance} km uzaklıkta</span>
                <div className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <i className="far fa-clock mr-1"></i>
                <span>{salon.closeTime}'e kadar açık</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}