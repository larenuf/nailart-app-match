import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Category } from "@/types";

export default function CategoriesSection() {
  // Tıklama olaylarını durdur
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const [_, navigate] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="px-4 py-4 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-4 dark:text-gray-300">Kategoriler</h2>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden h-28 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-4 dark:text-gray-300">Kategoriler</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories?.slice(0, 4).map((category) => (
          <div 
            key={category.id} 
            className="relative rounded-lg overflow-hidden h-28 cursor-pointer shadow-sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/search?category=${category.id}`);
            }}
          >
            <img 
              src={category.id === 1 ? "https://i.imgur.com/lDRLXVu.jpg" : 
                   category.id === 2 ? "https://i.imgur.com/fX0JMHs.jpg" :
                   category.id === 3 ? "https://i.imgur.com/QdVQoYL.jpg" :
                   "https://i.imgur.com/PGQrKuM.jpg"}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Kategori resmi yüklenemedi: ${category.id}`);
                (e.target as HTMLImageElement).src = 'https://placekitten.com/300/300';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col p-4">
              <h3 className="text-white text-lg font-semibold text-center">{category.name}</h3>
              <p className="text-white text-xs mt-1 text-center">En Popüler</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}