import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";
import { 
  ScissorsIcon, 
  FingerprintIcon, 
  EyeIcon, 
  WavesIcon, 
  HeartPulseIcon, 
  FeatherIcon, 
  SmileIcon, 
  SparklesIcon, 
  PaintbrushIcon 
} from "lucide-react";

// Modern minimalist kategori görselleri
const categoryImages = {
  "Hair & styling": {
    image: "https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg",
    color: "#F9E0E7",
    icon: <ScissorsIcon size={20} />
  },
  "Nails": {
    image: "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg",
    color: "#FFE8D6",
    icon: <FingerprintIcon size={20} />
  },
  "Eyebrows & eyelashes": {
    image: "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg",
    color: "#E2ECE9",
    icon: <EyeIcon size={20} />
  },
  "Massage": {
    image: "https://images.pexels.com/photos/5240696/pexels-photo-5240696.jpeg",
    color: "#D6E2E9",
    icon: <WavesIcon size={20} />
  },
  "Barbering": {
    image: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg",
    color: "#FBE7C6",
    icon: <ScissorsIcon size={20} />
  },
  "Hair removal": {
    image: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg",
    color: "#DDEBF1",
    icon: <FeatherIcon size={20} />
  },
  "Facials & skincare": {
    image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg",
    color: "#E2ECE9",
    icon: <SmileIcon size={20} />
  },
  "Makeup": {
    image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg",
    color: "#FFD6E0",
    icon: <PaintbrushIcon size={20} />
  },
  "Medical & dental": {
    image: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg",
    color: "#E0E1DD",
    icon: <SparklesIcon size={20} />
  }
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Ana kategoriler - Modern minimalist stil
  const mainCategories = [
    { id: 101, name: "Hair & styling", iconName: "cut" },
    { id: 102, name: "Nails", iconName: "hand-sparkles" },
    { id: 103, name: "Eyebrows & eyelashes", iconName: "eye" },
    { id: 104, name: "Massage", iconName: "hands" },
    { id: 105, name: "Barbering", iconName: "cut" },
    { id: 106, name: "Hair removal", iconName: "feather" },
    { id: 107, name: "Facials & skincare", iconName: "smile" },
    { id: 108, name: "Makeup", iconName: "palette" },
    { id: 109, name: "Medical & dental", iconName: "tooth" }
  ];

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="mb-4 mt-2">
          <div className="w-1/3 h-8 bg-gray-100 animate-pulse rounded-lg mb-5"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gerçek veya demo kategorileri göster
  const displayCategories = categories?.length ? categories : mainCategories;

  // Default fallback stil
  const defaultStyle = {
    image: "https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg",
    color: "#F2F5F7",
    icon: <FingerprintIcon size={20} />
  };

  return (
    <div className="px-4 py-6">
      {/* Özel Teklifler Bölümü - Sabit, yan yana kartlar */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-[#FFA5B5] to-[#FFB7B2] p-3 rounded-xl text-white shadow-sm">
            <div>
              <h3 className="text-base font-bold flex justify-between items-start">
                <span>Özel Teklifler</span>
                <span className="text-xl">✨</span>
              </h3>
              <p className="text-xs mt-0.5 opacity-95">Yeni müşteriler için %20 indirim</p>
              <button className="mt-2 bg-white text-primary px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 w-full">
                Şimdi Keşfet
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#93c5fd] to-[#60a5fa] p-3 rounded-xl text-white shadow-sm">
            <div>
              <h3 className="text-base font-bold flex justify-between items-start">
                <span>Hafta Sonu</span>
                <span className="text-xl">🎁</span>
              </h3>
              <p className="text-xs mt-0.5 opacity-95">Tüm hizmetlerde %15 indirim</p>
              <button className="mt-2 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 w-full">
                Detaylar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium tracking-tight text-gray-900">
          Kategoriler
        </h2>
        <button className="text-sm font-medium text-primary">
          Tümünü Gör
        </button>
      </div>
      
      {/* Kategori Scroll - Yatay Kaydırma */}
      <div className="flex overflow-x-auto gap-3 mb-8 hide-scrollbar pb-4">
        {displayCategories.map((category) => {
          const categoryStyle = categoryImages[category.name as keyof typeof categoryImages] || defaultStyle;
          
          return (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer group flex-shrink-0"
              style={{ width: '80px' }}
            >
              <div 
                className="relative overflow-hidden aspect-square rounded-lg mb-2 w-16 h-16 shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: categoryStyle.color }}
              >
                <div className="absolute inset-0 opacity-80 overflow-hidden">
                  <img 
                    src={categoryStyle.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                <div className="absolute top-1.5 left-1.5 bg-white rounded-md p-1 shadow-sm">
                  {categoryStyle.icon}
                </div>
              </div>
              <p className="text-[10px] font-medium text-center line-clamp-1 text-gray-800">
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Popüler Kategoriler - Yatay kaydırma */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-medium tracking-tight text-gray-900">
            Popüler Kategoriler
          </h2>
          <button className="text-xs font-medium text-primary">
            Tümü
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 -mx-4 px-4">
          {displayCategories.slice(0, 5).map((category) => {
            const categoryStyle = categoryImages[category.name as keyof typeof categoryImages] || defaultStyle;
            
            return (
              <div
                key={`featured-${category.id}`}
                className="relative overflow-hidden rounded-lg aspect-[3/2] cursor-pointer group shadow-sm transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                style={{ width: '180px' }}
              >
                <div className="absolute inset-0">
                  <img 
                    src={categoryStyle.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-2.5 text-white">
                  <h3 className="text-sm font-semibold">{category.name}</h3>
                  <p className="text-[10px] text-gray-200 mt-0.5">En Popüler</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
