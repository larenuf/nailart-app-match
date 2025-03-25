import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TopNavigation from '@/components/TopNavigation';
import BottomNavigation from '@/components/BottomNavigation';
import { MapPin, Star, Clock, Filter, Search, Heart, Scissors, Check } from 'lucide-react';

type Salon = {
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
  openTime: string;
  closeTime: string;
  city?: string;
  district?: string;
};

type FilterOptions = {
  searchText: string;
  city: string;
  sort: string;
  priceRange: number[];
  isPremium: boolean;
};

export default function SalonList() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: "",
    city: "all",
    sort: "rating",
    priceRange: [0, 1000],
    isPremium: false
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Tüm salonları getir
  const { data: salons, isLoading, error } = useQuery<Salon[]>({
    queryKey: ['/api/salons'],
    refetchOnWindowFocus: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchText: "",
      city: "all",
      sort: "rating",
      priceRange: [0, 1000],
      isPremium: false
    });
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleSalonClick = (salon: Salon) => {
    navigate(`/salons/${salon.id}`);
  };

  // Salonlar için şehir bilgisi ekle (örnek olarak)
  const salonsWithCity = salons?.map(salon => {
    // Adresten şehir bilgisini çıkar (örnek veri için)
    let city = "İstanbul";
    
    if (salon.address.includes("Ankara")) {
      city = "Ankara";
    } else if (salon.address.includes("İzmir")) {
      city = "İzmir";
    }
    
    return {
      ...salon,
      city
    };
  });
  
  // Salonları filtrele
  const filteredSalons = salonsWithCity?.filter(salon => {
    // Arama metni filtresi
    if (filters.searchText && !salon.name.toLowerCase().includes(filters.searchText.toLowerCase()) &&
        !salon.address.toLowerCase().includes(filters.searchText.toLowerCase())) {
      return false;
    }
    
    // Şehir filtresi
    if (filters.city !== "all" && salon.city !== filters.city) {
      return false;
    }
    
    // Premium filtresi
    if (filters.isPremium && !salon.isPremium) {
      return false;
    }
    
    return true;
  });

  // Salonları sırala
  const sortedSalons = filteredSalons ? [...filteredSalons].sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return a.distance - b.distance;
      case "reviewCount":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNavigation title="Salonlar" showBackButton={true} />
      
      <div className="flex-1 container max-w-md mx-auto px-4 py-4">
        {/* Arama ve Filtre */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Salon adı veya konum ara"
                value={filters.searchText}
                onChange={(e) => handleFilterChange("searchText", e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFilters}
              className={showFilters ? "bg-primary/10" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <Card className="p-3 animate-in fade-in-50 slide-in-from-top-5 duration-300">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Şehir</label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => handleFilterChange("city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Şehir seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="İstanbul">İstanbul</SelectItem>
                      <SelectItem value="Ankara">Ankara</SelectItem>
                      <SelectItem value="İzmir">İzmir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Sıralama</label>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange("sort", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sıralama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Puana Göre</SelectItem>
                      <SelectItem value="distance">Mesafeye Göre</SelectItem>
                      <SelectItem value="reviewCount">Yorum Sayısına Göre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 flex items-center space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.isPremium ? "bg-primary text-white" : ""}
                    onClick={() => handleFilterChange("isPremium", !filters.isPremium)}
                  >
                    {filters.isPremium && <Check className="mr-1 h-3 w-3" />}
                    Premium Salonlar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetFilters}
                    className="ml-auto"
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Sekmeler (isteğe bağlı) */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="near">Yakınımdaki</TabsTrigger>
            <TabsTrigger value="popular">Popüler</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Sonuçlar */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Salonlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </div>
          ) : sortedSalons.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Arama kriterlerinize uygun salon bulunamadı.
            </div>
          ) : (
            sortedSalons.map((salon) => (
              <Card key={salon.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSalonClick(salon)}>
                <div className="relative h-40">
                  <img
                    src={salon.id === 1 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" : 
                         salon.id === 2 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                         salon.id === 3 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80" :
                         "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80"}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Salon resmi yüklenemedi:", salon.id);
                      // Yedek resim göster
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop&q=80';
                    }}
                  />
                  {salon.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {salon.discount}
                    </div>
                  )}
                  {salon.isPremium && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Premium
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-white rounded-full h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Favorilere ekleme işlevi
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{salon.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{salon.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({salon.reviewCount})</span>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-500 mb-1">
                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>{salon.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="h-4 w-4 mr-1 shrink-0" />
                    <span>{salon.openTime} - {salon.closeTime}</span>
                    <div className="ml-auto flex items-center">
                      <Scissors className="h-4 w-4 mr-1" />
                      <span>+10 hizmet</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}