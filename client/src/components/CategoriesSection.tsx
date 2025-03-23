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
      {/* Özel Teklifler Bölümü */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#FFA5B5] to-[#FFB7B2] p-5 rounded-xl text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Özel Teklifler</h3>
              <p className="text-sm mt-1 opacity-95">Yeni müşteriler için %20 indirim</p>
              <button className="mt-4 bg-white text-primary px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
                Şimdi Keşfet
              </button>
            </div>
            <div className="text-4xl">✨</div>
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
      
      {/* Kategori Grid - Modern Minimalist */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {displayCategories.slice(0, 8).map((category) => {
          const categoryStyle = categoryImages[category.name as keyof typeof categoryImages] || defaultStyle;
          
          return (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div 
                className="relative overflow-hidden aspect-square rounded-xl mb-2 w-full shadow-sm transition-transform duration-300 group-hover:scale-105"
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
                <div className="absolute top-2 left-2 bg-white rounded-lg p-1.5 shadow-sm">
                  {categoryStyle.icon}
                </div>
              </div>
              <p className="text-xs font-medium text-center line-clamp-1 text-gray-800">
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Daha büyük kartlar - Çift sütun */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {displayCategories.slice(0, 2).map((category) => {
          const categoryStyle = categoryImages[category.name as keyof typeof categoryImages] || defaultStyle;
          
          return (
            <div
              key={`featured-${category.id}`}
              className="relative overflow-hidden rounded-xl aspect-[3/2] cursor-pointer group shadow-sm transition-transform duration-300 hover:scale-[1.02]"
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
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs text-gray-200 mt-1">Popüler Servisler</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
