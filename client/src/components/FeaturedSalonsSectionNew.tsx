import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Salon } from "@/types";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function FeaturedSalonsSectionNew() {
  const { setSelectedSalon } = useAppContext();
  
  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons/featured"],
  });

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
    <div className="px-4 py-4">
      {/* Tırnak Ürünleri Satış Alanı */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300 flex items-center">
            <ShoppingCart size={14} className="text-purple-500 mr-1"/>
            Tırnak Ürünleri
          </h2>
          <Link href="/shop">
            <a className="text-xs font-medium text-primary dark:text-pink-400 flex items-center">
              Mağazaya Git <ArrowRight size={10} className="ml-0.5"/>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Tırnak Bakım Ürünleri */}
          <Link href="/product-category/nail-care">
            <a className="cursor-pointer group">
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
            </a>
          </Link>
          
          {/* Nail Art Kitleri */}
          <Link href="/product-category/nail-art-kits">
            <a className="cursor-pointer group">
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
            </a>
          </Link>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300 flex items-center">
          <Sparkles size={14} className="text-amber-500 mr-1"/>
          Öne Çıkan Salonlar
        </h2>
        <Link href="/search">
          <a className="text-xs font-medium text-primary dark:text-pink-400 flex items-center">
            Tümünü Gör <ArrowRight size={10} className="ml-0.5"/>
          </a>
        </Link>
      </div>

      <div className="space-y-4">
        {salons?.map((salon) => (
          <Link key={salon.id} href={`/salons/${salon.id}`}>
            <a 
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => {
                // Context'i güncelle
                setSelectedSalon(salon);
                console.log("Salon seçildi:", salon.name);
              }}
            >
              <img
                src={salon.id === 1 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" : 
                     salon.id === 2 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                     salon.id === 3 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                     "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80"}
                alt={salon.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  console.error("Salon resmi yüklenemedi:", salon.id);
                  // Yedek resim göster
                  (e.target as HTMLImageElement).src = 'https://placekitten.com/400/300';
                }}
              />
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
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
                      {salon.discount}
                    </span>
                  )}
                  {salon.isPremium && (
                    <span className="bg-[#D6C3E5] text-[#333333] text-xs font-semibold px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span>{salon.distance} km uzaklıkta</span>
                  <div className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <i className="far fa-clock mr-1"></i>
                  <span>{salon.closeTime}'e kadar açık</span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}