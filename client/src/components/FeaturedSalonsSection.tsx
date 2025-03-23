import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Salon } from "@/types";
import { ShoppingCart, Sparkles } from "lucide-react";

export default function FeaturedSalonsSection() {
  const { setSelectedSalon } = useAppContext();
  const [, navigate] = useLocation();
  
  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons/featured"],
  });

  const handleSelectSalon = (salon: Salon) => {
    // Hem context'i güncelle hem de URL'yi doğrudan değiştir
    setSelectedSalon(salon);
    navigate(`/salons/${salon.id}`);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold font-playfair">Öne Çıkan Salonlar</h2>
          <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-3">
                <div className="w-2/3 h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Tırnak Ürünleri Satış Alanı */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold font-playfair">Tırnak Ürünleri</h2>
          <a href="#" className="text-sm text-[#D6C3E5] flex items-center">
            <ShoppingCart size={14} className="mr-1"/>
            Mağaza
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Tırnak Bakım Ürünleri */}
          <div className="cursor-pointer group">
            <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02] bg-gradient-to-b from-gray-100 to-gray-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://i.imgur.com/6uj5YgZ.png" 
                  alt="Tırnak Bakım Ürünleri"
                  className="w-full h-full object-contain p-2"
                />
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
          <div className="cursor-pointer group">
            <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000"
                alt="Nail Art Kitleri"
                className="w-full h-full object-cover"
              />
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
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold font-playfair">Öne Çıkan Salonlar</h2>
        <a href="#" className="text-sm text-[#D6C3E5]">
          Tümünü Gör
        </a>
      </div>

      <div className="space-y-4">
        {salons?.map((salon) => (
          <div
            key={salon.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleSelectSalon(salon)}
          >
            <img
              src={salon.imageUrl}
              alt={salon.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#333333]">{salon.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-[#FFD700]">
                      {[...Array(Math.floor(salon.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star text-xs"></i>
                      ))}
                      {salon.rating % 1 > 0 && (
                        <i className="fas fa-star-half-alt text-xs"></i>
                      )}
                    </div>
                    <span className="text-xs ml-1 text-gray-600">
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
              <div className="flex items-center mt-2 text-xs text-gray-600">
                <i className="fas fa-map-marker-alt mr-1"></i>
                <span>{salon.distance} km uzaklıkta</span>
                <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
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
