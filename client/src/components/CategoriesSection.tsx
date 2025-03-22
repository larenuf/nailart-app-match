import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

// Treatwell tarzı modern kategori görselleri - daha şık ve profesyonel
const treatwellStyleImages = {
  "Manikür": {
    image: "https://images.pexels.com/photos/4210276/pexels-photo-4210276.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#FFCDD2]/80" // Kategori renk tonları
  },
  "Pedikür": {
    image: "https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#BBDEFB]/80"
  },
  "Jel Tırnak": {
    image: "https://images.pexels.com/photos/7766185/pexels-photo-7766185.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#E1BEE7]/80"
  },
  "Kalıcı Oje": {
    image: "https://images.pexels.com/photos/1638349/pexels-photo-1638349.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#C8E6C9]/80"
  },
  "French Manicure": {
    image: "https://images.pexels.com/photos/3422099/pexels-photo-3422099.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#FFE0B2]/80"
  },
  "Nail Art": {
    image: "https://images.pexels.com/photos/3422099/pexels-photo-3422099.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "from-[#F8BBD0]/80"
  }
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Ana kategoriler - Treatwell stil
  const mainCategories = [
    { id: 101, name: "Manikür", iconName: "hand-sparkles" },
    { id: 102, name: "Pedikür", iconName: "shoe-prints" },
    { id: 103, name: "Jel Tırnak", iconName: "magic" },
    { id: 104, name: "Kalıcı Oje", iconName: "exchange-alt" },
    { id: 105, name: "French Manicure", iconName: "paint-brush" },
    { id: 106, name: "Nail Art", iconName: "palette" }
  ];

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="mb-4 mt-2">
          <div className="w-2/3 h-8 bg-gray-100 animate-pulse rounded-lg mb-5"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-24 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gerçek veya demo kategorileri göster
  const displayCategories = categories?.length ? categories : mainCategories;

  return (
    <div className="px-4 py-4 bg-[#FAFAFA]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#333333] tracking-tight">
          Keşfet
        </h2>
        <button className="text-sm font-medium text-[#FF5864]">Tümünü Gör</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        {displayCategories.slice(0, 6).map((category) => {
          const categoryStyle = treatwellStyleImages[category.name as keyof typeof treatwellStyleImages] || {
            image: "https://images.pexels.com/photos/4210663/pexels-photo-4210663.jpeg?auto=compress&cs=tinysrgb&w=800",
            color: "from-[#FFCCBC]/80"
          };
          
          return (
            <div
              key={category.id}
              className="relative w-full h-24 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
            >
              {/* Arkaplan resmi */}
              <img 
                src={categoryStyle.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Renkli overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${categoryStyle.color} to-transparent`}></div>
              
              {/* Kategori adı */}
              <div className="absolute inset-0 flex flex-col justify-center px-4">
                <h3 className="text-lg font-bold text-white drop-shadow-sm">
                  {category.name}
                </h3>
                <div className="w-6 h-0.5 bg-white mt-1 rounded-full opacity-80"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Özel Teklifler Bölümü */}
      <div className="mt-6 mb-4">
        <div className="bg-gradient-to-r from-[#FF5864] to-[#FF876C] p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Özel Teklifler 🎁</h3>
              <p className="text-sm mt-1 opacity-90">Yeni müşteriler için %20 indirim</p>
              <button className="mt-3 bg-white text-[#FF5864] px-4 py-1.5 rounded-full text-sm font-medium">
                Şimdi Keşfet
              </button>
            </div>
            <div className="text-4xl">✨</div>
          </div>
        </div>
      </div>
    </div>
  );
}
