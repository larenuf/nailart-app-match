import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Star, 
  MapPin, 
  DollarSign,
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp,
  X,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    rating: number | null;
    distance: number | null;
    priceRange: string | null;
    priceSlider: number[];
    serviceTime: number[];
    hasDiscount: boolean;
    isPremium: boolean;
    availableToday: boolean;
  }>({
    rating: null,
    distance: null,
    priceRange: null,
    priceSlider: [0, 500],
    serviceTime: [30, 120],
    hasDiscount: false,
    isPremium: false,
    availableToday: false
  });

  const { toast } = useToast();

  const { data: salons, isLoading: isLoadingSalons } = useQuery<Salon[]>({
    queryKey: ["/api/salons"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (selectedFilters.rating) count++;
    if (selectedFilters.distance) count++;
    if (selectedFilters.priceRange) count++;
    if (selectedFilters.priceSlider && 
        (selectedFilters.priceSlider[0] > 0 || selectedFilters.priceSlider[1] < 500)) count++;
    if (selectedFilters.serviceTime) count++;
    if (selectedFilters.hasDiscount) count++;
    if (selectedFilters.isPremium) count++;
    if (selectedFilters.availableToday) count++;
    if (selectedCategory) count++;
    return count;
  };

  const activeFilterCount = countActiveFilters();

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
        
      // Filter by premium status
      const matchesPremium = selectedFilters.isPremium
        ? salon.isPremium === true
        : true;
        
      // Filter by discount availability
      const matchesDiscount = selectedFilters.hasDiscount
        ? salon.discount !== ""
        : true;
        
      // Price Range Filter - this would need more accurate data in a real app
      // Here we're making a simplification just for UI demonstration
      const hasPriceInRange = selectedFilters.priceSlider &&
        (selectedFilters.priceSlider[0] > 0 || selectedFilters.priceSlider[1] < 500);
      
      // Mock price check - in a real app we would check service prices
      // For demo, premium salons have higher prices
      const estimatedMinPrice = salon.isPremium ? 200 : 50;
      const estimatedMaxPrice = salon.isPremium ? 500 : 300;
      const priceOverlaps = (min1: number, max1: number, min2: number, max2: number) => {
        return Math.max(min1, min2) <= Math.min(max1, max2);
      };
      
      const matchesPriceRange = hasPriceInRange
        ? priceOverlaps(
            selectedFilters.priceSlider[0], 
            selectedFilters.priceSlider[1], 
            estimatedMinPrice, 
            estimatedMaxPrice
          )
        : true;
        
      // Service Time Filter - check if service duration is within the selected range
      // For demo, we use an estimated service time range
      const estimatedMinDuration = salon.isPremium ? 60 : 30;
      const estimatedMaxDuration = salon.isPremium ? 120 : 90;
      
      const hasServiceTimeRange = selectedFilters.serviceTime &&
        (selectedFilters.serviceTime[0] !== 15 || selectedFilters.serviceTime[1] !== 120);
        
      const matchesServiceTime = hasServiceTimeRange
        ? priceOverlaps(
            selectedFilters.serviceTime[0],
            selectedFilters.serviceTime[1],
            estimatedMinDuration,
            estimatedMaxDuration
          )
        : true;
        
      // Filter by availability today
      const matchesAvailability = selectedFilters.availableToday
        ? Math.random() > 0.3 // For demo, random availability
        : true;

      // Combined filters
      return matchesSearch && 
             matchesCategory && 
             matchesRating && 
             matchesDistance && 
             matchesPremium && 
             matchesDiscount &&
             matchesPriceRange &&
             matchesServiceTime &&
             matchesAvailability;
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
  
  const handleSwitchChange = (filterType: 'hasDiscount' | 'isPremium' | 'availableToday') => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };
  
  const handleServiceTimeChange = (value: number[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      serviceTime: value,
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceSlider: value,
    }));
  };
  
  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedFilters({
      rating: null,
      distance: null,
      priceRange: null,
      priceSlider: [0, 500],
      serviceTime: [30, 120],
      hasDiscount: false,
      isPremium: false,
      availableToday: false
    });
    toast({
      description: "Tüm filtreler temizlendi",
    });
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filtreler
              {activeFilterCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                  onClick={resetAllFilters}
                >
                  <X size={14} />
                  <span>Temizle</span>
                </button>
              )}
              <button
                className="text-sm text-primary hover:underline flex items-center gap-1"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? (
                  <>
                    <ChevronUp size={16} />
                    <span>Daha Az</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal size={16} />
                    <span>Gelişmiş Filtreler</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Basic Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border rounded-lg p-4 bg-gray-50 mb-4 space-y-4">
              <h4 className="font-medium text-sm mb-3">Gelişmiş Filtreler</h4>
              
              {/* Price Range Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-500" />
                    Fiyat Aralığı
                  </label>
                  <span className="text-xs text-gray-500">
                    {selectedFilters.priceSlider ? `${selectedFilters.priceSlider[0]}₺ - ${selectedFilters.priceSlider[1]}₺` : 'Tümü'}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 500]}
                  min={0}
                  max={500}
                  step={10}
                  onValueChange={handlePriceRangeChange}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0₺</span>
                  <span>500₺</span>
                </div>
              </div>
              
              {/* Service Time Filter */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    Hizmet Süresi
                  </label>
                  <span className="text-xs text-gray-500">
                    {selectedFilters.serviceTime ? `${selectedFilters.serviceTime[0]} - ${selectedFilters.serviceTime[1]} dk` : 'Tümü'}
                  </span>
                </div>
                <Slider
                  defaultValue={[30, 120]}
                  min={15}
                  max={120}
                  step={15}
                  onValueChange={handleServiceTimeChange}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>15 dk</span>
                  <span>120 dk</span>
                  <span className="absolute -top-7 left-1/3 bg-[#F9E0E7] text-[#333333] text-xs px-2 py-0.5 rounded-full transform -translate-x-1/2 opacity-0 transition-opacity duration-200" id="serviceTimeBadge">
                    {selectedFilters.serviceTime ? `${selectedFilters.serviceTime[0]} dk` : ''}
                  </span>
                </div>
              </div>
              
              {/* Toggle Filters */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-500" />
                    İndirimli Salonlar
                  </label>
                  <Switch
                    checked={selectedFilters.hasDiscount}
                    onCheckedChange={() => handleSwitchChange('hasDiscount')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Star size={16} className="text-gray-500" />
                    Sadece Premium Salonlar
                  </label>
                  <Switch
                    checked={selectedFilters.isPremium}
                    onCheckedChange={() => handleSwitchChange('isPremium')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    Bugün Müsait Olanlar
                  </label>
                  <Switch
                    checked={selectedFilters.availableToday}
                    onCheckedChange={() => handleSwitchChange('availableToday')}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Filter Count & Results */}
          {filteredSalons && (
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{filteredSalons.length} sonuç bulundu</span>
              {activeFilterCount > 0 && (
                <span>{activeFilterCount} filtre aktif</span>
              )}
            </div>
          )}
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