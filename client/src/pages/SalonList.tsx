import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { 
  MapPin, 
  Star, 
  Clock, 
  Filter, 
  Search, 
  Heart, 
  Scissors, 
  Check, 
  ChevronDown, 
  DollarSign, 
  Percent 
} from 'lucide-react';

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
  openTime: string;
  closeTime: string;
}

interface SalonWithCity extends Salon {
  city: string;
}

// Filter tiplerini tanımla
export type SalonFilterType = 'all' | 'nearest' | 'top-rated' | 'discounts' | 'open-now';
export type ServiceType = 'gel' | 'nail-art' | 'manicure' | 'pedicure' | 'all';
export type DistrictType = 'all' | 'kadikoy' | 'besiktas' | 'sisli' | 'uskudar' | 'beyoglu';

interface FilterOptions {
  searchText: string;
  filterType: SalonFilterType;
  serviceType: ServiceType;
  city: string;
  district: DistrictType;
  sort: string;
  priceRange: [number, number];
  isPremium: boolean;
}

export default function SalonList() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<SalonFilterType>("all");
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: "",
    filterType: "all",
    serviceType: "all",
    city: "all",
    district: "all",
    sort: "rating",
    priceRange: [0, 1000],
    isPremium: false
  });
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);
  
  // Tüm salonları getir
  const { data: salons, isLoading, error } = useQuery<Salon[]>({
    queryKey: ['/api/salons'],
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchText: "",
      filterType: "all",
      serviceType: "all",
      city: "all",
      district: "all",
      sort: "rating",
      priceRange: [0, 1000],
      isPremium: false
    });
    setActiveTab("all");
  };

  const toggleDetailedFilters = () => {
    setShowDetailedFilters(prev => !prev);
  };
  
  // Sekme değişikliğinde filtreleri güncelle
  const handleTabChange = (value: string) => {
    setActiveTab(value as SalonFilterType);
    setFilters(prev => ({ 
      ...prev, 
      filterType: value as SalonFilterType 
    }));
  };

  const handleSalonClick = (salon: SalonWithCity) => {
    navigate(`/salons/${salon.id}`);
  };

  // Salonlar için şehir bilgisi ekle
  const salonsWithCity: SalonWithCity[] = salons ? salons.map((salon): SalonWithCity => {
    // Adresten şehir bilgisini çıkar
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
  }) : [];
  
  // Salonları filtrele
  const filteredSalons: SalonWithCity[] = salonsWithCity.filter((salon) => {
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
    
    // Salon tipi filtreleri
    if (filters.filterType === "nearest" && salon.distance > 5) {
      return false;
    }
    
    if (filters.filterType === "top-rated" && salon.rating < 4.5) {
      return false;
    }
    
    if (filters.filterType === "discounts" && !salon.discount) {
      return false;
    }
    
    // Açık/Kapalı durumunu kontrol et
    if (filters.filterType === "open-now") {
      // Saatleri parçalara ayır ve 24 saatlik biçime dönüştür
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const openTimeParts = salon.openTime.split(':');
      const closeTimeParts = salon.closeTime.split(':');
      
      const openHour = parseInt(openTimeParts[0]);
      const openMinute = parseInt(openTimeParts[1]);
      
      const closeHour = parseInt(closeTimeParts[0]);
      const closeMinute = parseInt(closeTimeParts[1]);
      
      // Şu anki zamanı dakika cinsinden hesapla
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const openTimeInMinutes = openHour * 60 + openMinute;
      const closeTimeInMinutes = closeHour * 60 + closeMinute;
      
      // Eğer şu anki zaman, açılış ve kapanış saatleri arasında değilse filtrele
      if (currentTimeInMinutes < openTimeInMinutes || currentTimeInMinutes > closeTimeInMinutes) {
        return false;
      }
    }
    
    // Semt/İlçe filtresi
    if (filters.district !== "all") {
      // Adreste ilçe adı geçiyor mu kontrol et
      const districtMap: Record<DistrictType, string> = {
        "all": "",
        "kadikoy": "Kadıköy",
        "besiktas": "Beşiktaş",
        "sisli": "Şişli",
        "uskudar": "Üsküdar",
        "beyoglu": "Beyoğlu"
      };
      
      const districtName = districtMap[filters.district];
      if (districtName && !salon.address.includes(districtName)) {
        return false;
      }
    }
    
    // Hizmet türü filtresi
    if (filters.serviceType !== "all") {
      // Gerçek uygulamada salon verilerinde hizmet türleri olmalıdır
      // Şu anda demo amaçlı basit bir eşleştirme yapıyoruz
      const hasService = salon.id % 5 === 0 ? ["gel", "nail-art"] :
                        salon.id % 4 === 0 ? ["manicure", "pedicure"] :
                        salon.id % 3 === 0 ? ["gel", "manicure"] :
                        salon.id % 2 === 0 ? ["nail-art", "pedicure"] :
                        ["gel", "nail-art", "manicure", "pedicure"];
      
      if (!hasService.includes(filters.serviceType)) {
        return false;
      }
    }
    
    // Fiyat aralığı filtresi
    // Gerçek uygulamada salon verilerinde fiyat aralıkları olmalı
    // Şu anda demo amaçlı rastgele bir fiyat kontrolü yapıyoruz
    const minServicePrice = salon.id * 30 + 100; // Basit bir örnek fiyat hesabı
    const maxServicePrice = salon.id * 50 + 200;
    
    if (
      (minServicePrice > filters.priceRange[1]) || 
      (maxServicePrice < filters.priceRange[0])
    ) {
      return false;
    }
    
    return true;
  });

  // Salonları sırala
  const sortedSalons = [...filteredSalons].sort((a, b) => {
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
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNavigation title="Salonlar" showBackButton={true} />
      
      <div className="flex-1 container max-w-md mx-auto px-4 py-4">
        {/* Arama */}
        <div className="mb-6">
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
            <Select
              value={filters.city}
              onValueChange={(value) => handleFilterChange("city", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Şehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="İstanbul">İstanbul</SelectItem>
                <SelectItem value="Ankara">Ankara</SelectItem>
                <SelectItem value="İzmir">İzmir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Sekmeler (Ana Filtreler) */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => handleTabChange(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="nearest">Yakınımdaki</TabsTrigger>
            <TabsTrigger value="top-rated">Popüler</TabsTrigger>
            <TabsTrigger value="discounts">İndirimli</TabsTrigger>
            <TabsTrigger value="open-now">Şimdi Açık</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Detaylı Filtreler Butonu */}
        <div className="mb-5">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-between"
            onClick={toggleDetailedFilters}
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Detaylı Filtreler
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetailedFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Detaylı Filtreler Paneli */}
        {showDetailedFilters && (
          <Card className="p-4 mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <div className="space-y-4">
              {/* Hizmet Türü Filtreleri */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">💅 Hizmet Türü</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.serviceType === "gel" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("serviceType", filters.serviceType === "gel" ? "all" : "gel")}
                  >
                    {filters.serviceType === "gel" && <Check className="w-3 h-3 mr-1" />}
                    Jel Oje
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.serviceType === "nail-art" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("serviceType", filters.serviceType === "nail-art" ? "all" : "nail-art")}
                  >
                    {filters.serviceType === "nail-art" && <Check className="w-3 h-3 mr-1" />}
                    Nail Art
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.serviceType === "manicure" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("serviceType", filters.serviceType === "manicure" ? "all" : "manicure")}
                  >
                    {filters.serviceType === "manicure" && <Check className="w-3 h-3 mr-1" />}
                    Manikür
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.serviceType === "pedicure" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("serviceType", filters.serviceType === "pedicure" ? "all" : "pedicure")}
                  >
                    {filters.serviceType === "pedicure" && <Check className="w-3 h-3 mr-1" />}
                    Pedikür
                  </Button>
                </div>
              </div>
              
              {/* Fiyat Aralığı */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">💰 Fiyat Aralığı</h3>
                  <div className="text-sm text-gray-500">
                    {filters.priceRange[0]}₺ - {filters.priceRange[1]}₺
                  </div>
                </div>
                <Slider
                  min={0}
                  max={1000}
                  step={50}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
                  className="my-4"
                />
              </div>
              
              {/* Semt/İlçe Filtreleri */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">📍 Semt/İlçe</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.district === "kadikoy" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("district", filters.district === "kadikoy" ? "all" : "kadikoy")}
                  >
                    {filters.district === "kadikoy" && <Check className="w-3 h-3 mr-1" />}
                    Kadıköy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.district === "besiktas" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("district", filters.district === "besiktas" ? "all" : "besiktas")}
                  >
                    {filters.district === "besiktas" && <Check className="w-3 h-3 mr-1" />}
                    Beşiktaş
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.district === "sisli" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("district", filters.district === "sisli" ? "all" : "sisli")}
                  >
                    {filters.district === "sisli" && <Check className="w-3 h-3 mr-1" />}
                    Şişli
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.district === "uskudar" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("district", filters.district === "uskudar" ? "all" : "uskudar")}
                  >
                    {filters.district === "uskudar" && <Check className="w-3 h-3 mr-1" />}
                    Üsküdar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={filters.district === "beyoglu" ? "bg-primary text-white" : ""} 
                    onClick={() => handleFilterChange("district", filters.district === "beyoglu" ? "all" : "beyoglu")}
                  >
                    {filters.district === "beyoglu" && <Check className="w-3 h-3 mr-1" />}
                    Beyoğlu
                  </Button>
                </div>
              </div>
              
              {/* Filtre Temizleme */}
              <Button onClick={resetFilters} variant="secondary" className="w-full mt-2">
                Tüm Filtreleri Temizle
              </Button>
            </div>
          </Card>
        )}
        
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