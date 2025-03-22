import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

// Kategoriler için nail art görsel arka planları
const categoryImages = {
  "French Manicure": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=300&auto=format&fit=crop",
  "Gel Nails": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&auto=format&fit=crop",
  "Acrylic": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=300&auto=format&fit=crop",
  "Nail Art": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=300&auto=format&fit=crop",
  "Manicure": "https://images.unsplash.com/photo-1601049926914-ec12a0c8bcf6?w=300&auto=format&fit=crop",
  "Pedicure": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&auto=format&fit=crop", 
  "Dipping Powder": "https://images.unsplash.com/photo-1607779097040-26e60666945b?w=300&auto=format&fit=crop",
  "Polish Change": "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=300&auto=format&fit=crop",
  "Nail Extensions": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=300&auto=format&fit=crop",
  "3D Designs": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&auto=format&fit=crop",
  "Chrome Nails": "https://images.unsplash.com/photo-1601049926914-ec12a0c8bcf6?w=300&auto=format&fit=crop",
  "Ombre Nails": "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=300&auto=format&fit=crop",
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Daha fazla kategori için ekstra örnekler
  const extendedCategories = [
    { id: 101, name: "French Manicure", iconName: "paint-brush", backgroundColor: "soft-pink" },
    { id: 102, name: "Gel Nails", iconName: "magic", backgroundColor: "nude" },
    { id: 103, name: "Acrylic", iconName: "layer-group", backgroundColor: "lavender" },
    { id: 104, name: "Nail Art", iconName: "palette", backgroundColor: "soft-pink" },
    { id: 105, name: "Manicure", iconName: "hand-sparkles", backgroundColor: "nude" },
    { id: 106, name: "Pedicure", iconName: "shoe-prints", backgroundColor: "lavender" },
    { id: 107, name: "Dipping Powder", iconName: "fill-drip", backgroundColor: "soft-pink" },
    { id: 108, name: "Polish Change", iconName: "exchange-alt", backgroundColor: "nude" },
    { id: 109, name: "Nail Extensions", iconName: "ruler", backgroundColor: "lavender" },
    { id: 110, name: "3D Designs", iconName: "cube", backgroundColor: "soft-pink" },
    { id: 111, name: "Chrome Nails", iconName: "tint", backgroundColor: "nude" },
    { id: 112, name: "Ombre Nails", iconName: "map", backgroundColor: "lavender" },
  ];

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold font-playfair mb-3">Kategoriler</h2>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-[3/4]"></div>
          ))}
        </div>
      </div>
    );
  }

  // Kategorileri ekranda göstermek için veri kaynağı seçilir
  // Backend'den veri gelmediyse genişletilmiş veri kullanılır
  const displayCategories = categories?.length ? categories : extendedCategories;

  return (
    <div className="px-4 py-3">
      <h2 className="text-lg font-bold font-playfair mb-3">Kategoriler</h2>
      <div className="grid grid-cols-3 gap-3">
        {displayCategories.slice(0, 12).map((category) => (
          <div
            key={category.id}
            className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-sm cursor-pointer group"
          >
            {/* Arkaplan resmi */}
            <img 
              src={categoryImages[category.name as keyof typeof categoryImages] || "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=300&auto=format&fit=crop"} 
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Koyu overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            
            {/* Kategori bilgisi */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 mb-2 flex items-center justify-center">
                <i className={`fas fa-${category.iconName} text-lg text-[#333333]`}></i>
              </div>
              <p className="text-sm font-medium text-white text-center drop-shadow-md">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
