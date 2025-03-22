import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Service, PortfolioItem } from "@/types";
import BottomNavigation from "./BottomNavigation";

export default function ArtistDetailView() {
  const { selectedArtist, selectedSalon, setSelectedArtist, setSelectedService } = useAppContext();

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/services`],
    enabled: !!selectedArtist,
  });

  const { data: portfolioItems, isLoading: portfolioLoading } = useQuery<PortfolioItem[]>({
    queryKey: [`/api/artists/${selectedArtist?.id}/portfolio`],
    enabled: !!selectedArtist,
  });

  const handleBackToSalon = () => {
    setSelectedArtist(null);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  if (!selectedArtist || !selectedSalon) return null;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <div className="px-4 py-2">
        <div className="flex items-center mb-4">
          <button className="text-[#333333] mr-2" onClick={handleBackToSalon}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-lg font-bold font-playfair">{selectedArtist.name}</h2>
        </div>

        <div className="flex items-center mb-4">
          <img
            src={selectedArtist.imageUrl}
            alt={selectedArtist.name}
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div>
            <div className="flex items-center">
              <div className="flex text-[#FFD700]">
                {[...Array(Math.floor(selectedArtist.rating))].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {selectedArtist.rating % 1 > 0 && (
                  <i className="fas fa-star-half-alt"></i>
                )}
              </div>
              <span className="text-sm ml-1 text-gray-600">
                {selectedArtist.rating.toFixed(1)} ({selectedArtist.reviewCount} reviews)
              </span>
            </div>
            <p className="text-sm mt-1">{selectedArtist.specialty}</p>
            <p className="text-sm text-gray-600">{selectedArtist.experience}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Portfolio</h3>
          {portfolioLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-24 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {portfolioItems?.map((item) => (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  alt="Nail art example"
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Services & Pricing</h3>
          {servicesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="py-2 border-b border-gray-200">
                  <div className="w-2/3 h-5 bg-gray-100 animate-pulse rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-100 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center py-2 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.durationMinutes} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${service.price}</p>
                    <button className="text-xs bg-[#F9E0E7] text-[#333333] px-3 py-1 rounded-full mt-1">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
