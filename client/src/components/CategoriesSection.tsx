import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

// Treatwell tarzı modern kategori görselleri - çalışan ve güvenilir URL'ler
const treatwellStyleImages = {
  "Manikür": {
    image: "https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=800",
    position: "center" // Görsel konumlandırma
  },
  "Pedikür": {
    image: "https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&cs=tinysrgb&w=800",
    position: "center"
  },
  "Jel Tırnak": {
    image: "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=800",
    position: "center"
  },
  "Kalıcı Oje": {
    image: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800",
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
            image: "https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=800",
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
