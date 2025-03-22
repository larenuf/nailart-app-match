import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { useLocation } from "wouter";

interface Salon {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  distance: number;
  discount: string;
  isPremium: boolean;
}

interface Category {
  id: number;
  name: string;
  iconName: string;
  backgroundColor: string;
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    rating: number | null;
    distance: number | null;
    priceRange: string | null;
  }>({
    rating: null,
    distance: null,
    priceRange: null,
  });

  const { toast } = useToast();

  const { data: salons, isLoading: isLoadingSalons } = useQuery<Salon[]>({
    queryKey: ["/api/salons"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const getFilteredSalons = () => {
    if (!salons) return [];

    return salons.filter((salon) => {
      // Filter by search term
      const matchesSearch = searchTerm 
        ? salon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          salon.address.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filter by category (would require additional data mapping in a real app)
      const matchesCategory = selectedCategory ? true : true; // Placeholder for category filtering

      // Filter by rating
      const matchesRating = selectedFilters.rating 
        ? salon.rating >= selectedFilters.rating 
        : true;

      // Filter by distance
      const matchesDistance = selectedFilters.distance 
        ? salon.distance <= selectedFilters.distance 
        : true;

      // Combined filters
      return matchesSearch && matchesCategory && matchesRating && matchesDistance;
    });
  };

  const filteredSalons = getFilteredSalons();

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleFilterChange = (filterType: 'rating' | 'distance' | 'priceRange', value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }));
  };

  const handleSalonSelect = (salonId: number) => {
    setLocation(`/salons/${salonId}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold font-playfair mb-4">Keşfet</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Salon ismi, adres veya hizmet ara..."
            className="w-full bg-gray-100 rounded-full py-3 px-5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D6C3E5]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </span>
        </div>
        
        {/* Categories */}
        {isLoadingCategories ? (
          <div className="flex space-x-3 overflow-x-auto pb-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-24 bg-gray-100 animate-pulse rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-3 overflow-x-auto pb-2 mb-6">
            {categories?.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-[#F9E0E7] bg-opacity-30"
                    : "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F9E0E7] hover:bg-opacity-30"
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  category.backgroundColor === 'soft-pink' ? 'bg-pink-100' :
                  category.backgroundColor === 'nude' ? 'bg-yellow-50' :
                  category.backgroundColor === 'lavender' ? 'bg-purple-50' : 'bg-gray-100'
                }`}>
                  <i className={`fas fa-${category.iconName} text-lg ${
                    category.backgroundColor === 'soft-pink' ? 'text-pink-500' :
                    category.backgroundColor === 'nude' ? 'text-yellow-600' :
                    category.backgroundColor === 'lavender' ? 'text-purple-500' : 'text-gray-500'
                  }`}></i>
                </div>
                <span className="text-xs text-center">{category.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Filtreler</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.rating === 4
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("rating", 4)}
              >
                4+ Yıldız
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.rating === 4.5
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("rating", 4.5)}
              >
                4.5+ Yıldız
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.distance === 5
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("distance", 5)}
              >
                5 km yakınımda
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.distance === 10
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("distance", 10)}
              >
                10 km yakınımda
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.priceRange === "low"
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("priceRange", "low")}
              >
                $ Ekonomik
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.priceRange === "high"
                    ? "bg-[#F9E0E7] text-[#333333]"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterChange("priceRange", "high")}
              >
                $$$ Premium
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {isLoadingSalons ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-40 rounded-lg"></div>
            ))}
          </div>
        ) : filteredSalons.length > 0 ? (
          <div className="space-y-4">
            {filteredSalons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 cursor-pointer transition hover:shadow-md"
                onClick={() => handleSalonSelect(salon.id)}
              >
                <div className="relative h-40 bg-gray-200">
                  <img
                    src={salon.imageUrl}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                  {salon.isPremium && (
                    <span className="absolute top-2 right-2 bg-[#D6C3E5] text-white text-xs px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                  {salon.discount && (
                    <span className="absolute bottom-2 left-2 bg-[#F9E0E7] text-[#333333] text-xs px-2 py-1 rounded-full">
                      {salon.discount}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{salon.name}</h3>
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-400 text-xs mr-1"></i>
                      <span className="text-sm">{salon.rating}</span>
                      <span className="text-xs text-gray-400 ml-1">({salon.reviewCount})</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <i className="fas fa-map-marker-alt mr-1 text-xs"></i>
                    <span>{salon.address}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <i className="fas fa-route mr-1"></i>
                    <span>{salon.distance} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sonuç Bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Farklı arama terimleri veya filtreler deneyin.
            </p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}