import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

// Treatwell tarzı modern kategori görselleri
const treatwellStyleImages = {
  "Manikür": {
    image: "https://images.unsplash.com/photo-1463696775863-dd7be99cdb5c?w=800&auto=format&fit=crop",
    position: "top right" // Görsel konumlandırma
  },
  "Pedikür": {
    image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&auto=format&fit=crop",
    position: "center"
  },
  "Jel Tırnak": {
    image: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=800&auto=format&fit=crop",
    position: "center"
  },
  "Kalıcı Oje": {
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop",
    position: "center"
  }
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Ana kategoriler - Treatwell stil
  const mainCategories = [
    { id: 105, name: "Manikür", iconName: "hand-sparkles" },
    { id: 106, name: "Pedikür", iconName: "shoe-prints" },
    { id: 102, name: "Jel Tırnak", iconName: "magic" },
    { id: 108, name: "Kalıcı Oje", iconName: "exchange-alt" }
  ];

  if (isLoading) {
    return (
      <div className="px-4 py-4">
        <div className="mb-5 mt-2">
          <div className="w-2/3 h-10 bg-gray-100 animate-pulse rounded-lg mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-32 bg-gray-100 animate-pulse rounded-xl mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  // Gerçek veya demo kategorileri göster
  const displayCategories = categories?.length ? categories : mainCategories;

  return (
    <div className="px-4 py-4">
      <h2 className="text-3xl font-semibold mb-5 text-[#333333] tracking-tight">
        Hizmetleri Keşfet
      </h2>
      
      <div className="space-y-4">
        {displayCategories.slice(0, 4).map((category) => {
          const categoryStyle = treatwellStyleImages[category.name as keyof typeof treatwellStyleImages] || {
            image: "https://images.unsplash.com/photo-1601049926914-ec12a0c8bcf6?w=800&auto=format&fit=crop",
            position: "center"
          };
          
          return (
            <div
              key={category.id}
              className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm cursor-pointer"
            >
              {/* Arkaplan resmi */}
              <img 
                src={categoryStyle.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: categoryStyle.position }}
              />
              
              {/* Hafif beyaz overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>
              
              {/* Kategori adı */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                <h3 className="text-2xl font-bold text-[#333333]">
                  {category.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="mt-4 w-full py-3 text-center text-[#F9E0E7] bg-[#333333] rounded-xl font-medium">
        Tüm Hizmetleri Gör
      </button>
    </div>
  );
}
