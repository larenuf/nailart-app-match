import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Salon } from "@/types";

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
