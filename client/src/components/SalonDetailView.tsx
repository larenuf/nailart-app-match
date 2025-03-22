import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Artist } from "@/types";
import BottomNavigation from "./BottomNavigation";

export default function SalonDetailView() {
  const { selectedSalon, setSelectedSalon, setSelectedArtist } = useAppContext();

  const { data: artists, isLoading } = useQuery<Artist[]>({
    queryKey: [`/api/salons/${selectedSalon?.id}/artists`],
    enabled: !!selectedSalon,
  });

  const handleBackToHome = () => {
    setSelectedSalon(null);
  };

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  if (!selectedSalon) return null;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <div className="px-4 py-2">
        <div className="flex items-center mb-4">
          <button className="text-[#333333] mr-2" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-lg font-bold font-playfair">{selectedSalon.name}</h2>
        </div>

        <div className="mb-4">
          <img
            src={selectedSalon.imageUrl}
            alt={selectedSalon.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <div className="flex text-[#FFD700]">
                    {[...Array(Math.floor(selectedSalon.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    {selectedSalon.rating % 1 > 0 && (
                      <i className="fas fa-star-half-alt"></i>
                    )}
                  </div>
                  <span className="text-sm ml-1 text-gray-600">
                    {selectedSalon.rating.toFixed(1)} ({selectedSalon.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span>{selectedSalon.address}</span>
                </div>
              </div>
              <button className="bg-[#F9E0E7] text-[#333333] px-3 py-1 rounded-full text-sm">
                <i className="far fa-heart mr-1"></i> Save
              </button>
            </div>

            <div className="flex mt-3 space-x-3">
              <div className="flex items-center text-sm">
                <i className="far fa-clock text-gray-500 mr-1"></i>
                <span>{selectedSalon.openTime} - {selectedSalon.closeTime}</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-phone-alt text-gray-500 mr-1"></i>
                <span>{selectedSalon.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-2">
          <h3 className="font-bold mb-3">Our Nail Artists</h3>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-3 h-32"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {artists?.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-white rounded-lg shadow-sm p-3 cursor-pointer"
                  onClick={() => handleArtistSelect(artist)}
                >
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  />
                  <h4 className="text-center font-medium">{artist.name}</h4>
                  <div className="flex justify-center text-[#FFD700] text-xs mt-1">
                    {[...Array(Math.floor(artist.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    {artist.rating % 1 > 0 && (
                      <i className="fas fa-star-half-alt"></i>
                    )}
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    {artist.specialty}
                  </p>
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
