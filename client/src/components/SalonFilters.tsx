import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MapPin, 
  Star, 
  Percent, 
  Filter, 
  Clock, 
  Scissors, 
  ShoppingBag, 
  DollarSign,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type SalonFilterType = 'all' | 'nearest' | 'top-rated' | 'discounts' | 'open-now';
export type ServiceType = 'gel' | 'nail-art' | 'manicure' | 'pedicure' | 'all';
export type DistrictType = 'all' | 'kadikoy' | 'besiktas' | 'sisli' | 'uskudar' | 'beyoglu';

interface SalonFiltersProps {
  filterType: SalonFilterType;
  setFilterType: (type: SalonFilterType) => void;
  serviceType: ServiceType;
  setServiceType: (type: ServiceType) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedDistrict: DistrictType;
  setSelectedDistrict: (district: DistrictType) => void;
}

export default function SalonFilters({
  filterType,
  setFilterType,
  serviceType,
  setServiceType,
  priceRange,
  setPriceRange,
  selectedDistrict,
  setSelectedDistrict
}: SalonFiltersProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  // Hizmet türlerini Türkçe olarak göster
  const serviceTypeLabels: Record<ServiceType, string> = {
    'all': 'Tüm Hizmetler',
    'gel': 'Jel Oje',
    'nail-art': 'Nail Art',
    'manicure': 'Manikür',
    'pedicure': 'Pedikür'
  };
  
  // İlçe adlarını Türkçe olarak göster
  const districtLabels: Record<DistrictType, string> = {
    'all': 'Tüm İlçeler',
    'kadikoy': 'Kadıköy',
    'besiktas': 'Beşiktaş',
    'sisli': 'Şişli',
    'uskudar': 'Üsküdar',
    'beyoglu': 'Beyoğlu'
  };
  
  // Fiyat aralığı formatını göster
  const formatPriceRange = (range: [number, number]) => {
    return `${range[0]}₺ - ${range[1]}₺`;
  };
  
  return (
    <div className="w-full mb-4">
      {/* Ana Filtreler (Her zaman görünür) */}
      <ScrollArea className="pb-2" type="scroll">
        <div className="flex space-x-2 pb-2">
          <Button 
            size="sm" 
            variant={filterType === "all" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("all")}
          >
            <Filter size={12} className="mr-1" />
            Tümü
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "nearest" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("nearest")}
          >
            <MapPin size={12} className="mr-1" />
            Yakınımdaki
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "top-rated" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("top-rated")}
          >
            <Star size={12} className="mr-1" />
            Popüler
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "open-now" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("open-now")}
          >
            <Clock size={12} className="mr-1" />
            Şimdi Açık
          </Button>
          <Button 
            size="sm" 
            variant={filterType === "discounts" ? "default" : "outline"}
            className="rounded-full text-xs whitespace-nowrap"
            onClick={() => setFilterType("discounts")}
          >
            <Percent size={12} className="mr-1" />
            İndirimli
          </Button>
        </div>
      </ScrollArea>
      
      {/* Filtre Genişletme Butonu */}
      <div className="flex justify-between items-center mt-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2 text-xs flex items-center text-gray-600"
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
        >
          <Filter size={12} className="mr-1" />
          Detaylı Filtreler
          <ChevronDown size={12} className={`ml-1 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {/* Aktif Filtre Sayısı */}
        {(serviceType !== 'all' || selectedDistrict !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
            {(serviceType !== 'all' ? 1 : 0) + 
             (selectedDistrict !== 'all' ? 1 : 0) + 
             ((priceRange[0] > 0 || priceRange[1] < 1000) ? 1 : 0)} filtre aktif
          </Badge>
        )}
      </div>
      
      {/* Genişletilmiş Filtreler */}
      {isFiltersExpanded && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-4 mt-2 animate-in fade-in slide-in-from-top duration-300">
          {/* Hizmet Türüne Göre */}
          <div>
            <p className="text-xs font-medium mb-2 flex items-center">
              <Scissors size={12} className="mr-1 text-primary" />
              💅 Hizmet Türüne Göre
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(serviceTypeLabels).map(([key, label]) => (
                <Badge 
                  key={key}
                  variant={serviceType === key as ServiceType ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors"
                  onClick={() => setServiceType(key as ServiceType)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Fiyat Aralığı */}
          <div>
            <p className="text-xs font-medium mb-2 flex items-center">
              <DollarSign size={12} className="mr-1 text-primary" />
              💰 Fiyat Aralığı
            </p>
            <div className="px-2">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{priceRange[0]}₺</span>
                <span>{formatPriceRange(priceRange)}</span>
                <span>{priceRange[1]}₺</span>
              </div>
            </div>
          </div>
          
          {/* Semt/İlçe */}
          <div>
            <p className="text-xs font-medium mb-2 flex items-center">
              <MapPin size={12} className="mr-1 text-primary" />
              📍 Semt/İlçe
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(districtLabels).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`district-${key}`} 
                    checked={selectedDistrict === key as DistrictType}
                    onCheckedChange={() => setSelectedDistrict(key as DistrictType)}
                  />
                  <Label htmlFor={`district-${key}`} className="text-xs">{label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}