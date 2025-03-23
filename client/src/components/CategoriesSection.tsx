import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

// Fresha tarzı gerçek insan fotoğraflı kategori görselleri
const freshaStyleImages = {
  "Hair & styling": {
    image: "https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Nails": {
    image: "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Eyebrows & eyelashes": {
    image: "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Massage": {
    image: "https://images.pexels.com/photos/5240696/pexels-photo-5240696.jpeg?auto=compress&cs=tinysrgb&w=800", 
  },
  "Barbering": {
    image: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Hair removal": {
    image: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Facials & skincare": {
    image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Injectables & fillers": {
    image: "https://images.pexels.com/photos/7446147/pexels-photo-7446147.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Body": {
    image: "https://images.pexels.com/photos/7446130/pexels-photo-7446130.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Tattoo & piercing": {
    image: "https://images.pexels.com/photos/1264218/pexels-photo-1264218.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Makeup": {
    image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "Medical & dental": {
    image: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
  }
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Ana kategoriler - Fresha stil
  const mainCategories = [
    { id: 101, name: "Hair & styling", iconName: "cut" },
    { id: 102, name: "Nails", iconName: "hand-sparkles" },
    { id: 103, name: "Eyebrows & eyelashes", iconName: "eye" },
    { id: 104, name: "Massage", iconName: "hands" },
    { id: 105, name: "Barbering", iconName: "cut" },
    { id: 106, name: "Hair removal", iconName: "feather" },
    { id: 107, name: "Facials & skincare", iconName: "smile" },
    { id: 108, name: "Injectables & fillers", iconName: "syringe" },
    { id: 109, name: "Body", iconName: "user" },
    { id: 110, name: "Tattoo & piercing", iconName: "paint-brush" },
    { id: 111, name: "Makeup", iconName: "palette" },
    { id: 112, name: "Medical & dental", iconName: "tooth" }
  ];

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="mb-4 mt-2">
          <div className="w-1/3 h-8 bg-gray-100 animate-pulse rounded-lg mb-5"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-32 bg-gray-100 animate-pulse rounded-lg"></div>
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
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-[#333333] tracking-tight">
          Kategoriler
        </h2>
        <button className="text-sm font-medium text-[#FF5864]">Tümünü Gör</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        {displayCategories.slice(0, 12).map((category) => {
          const categoryStyle = freshaStyleImages[category.name as keyof typeof freshaStyleImages] || {
            image: "https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg?auto=compress&cs=tinysrgb&w=800"
          };
          
          return (
            <div
              key={category.id}
              className="relative w-full h-32 bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer flex"
            >
              {/* Kategori adı */}
              <div className="absolute z-10 p-3 text-left">
                <h3 className="text-base font-medium text-[#333333]">
                  {category.name}
                </h3>
              </div>
              
              {/* Resim */}
              <div className="h-full w-full flex justify-end">
                <img 
                  src={categoryStyle.image}
                  alt={category.name}
                  className="h-full object-cover object-center"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Özel Teklifler Bölümü */}
      <div className="mt-6 mb-4">
        <div className="bg-gradient-to-r from-[#FF5864] to-[#FF876C] p-4 rounded-lg text-white">
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
