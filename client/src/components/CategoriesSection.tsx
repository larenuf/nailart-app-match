import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Category } from "@/types";
import { useCallback } from "react";

export default function CategoriesSection() {
  const [_, navigate] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Kategori seçim işleyicisi
  const handleCategorySelect = useCallback((e: React.MouseEvent, categoryId: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/search?category=${categoryId}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="px-4 py-4 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-4 dark:text-gray-300">Kategoriler</h2>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="mt-2 w-12 h-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-white dark:bg-gray-800 transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-sm font-medium tracking-tight mb-4 text-gray-700 dark:text-gray-300">Kategoriler</h2>
      <div className="grid grid-cols-4 gap-y-4">
        {categories?.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col items-center cursor-pointer" 
            onClick={(e) => handleCategorySelect(e, category.id)}
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm" 
              style={{ backgroundColor: category.backgroundColor || '#F6F6F6' }}
            >
              <i className={`fas fa-${category.iconName} text-[#333333] text-lg`}></i>
            </div>
            <p className="mt-1.5 text-xs font-medium text-center text-[#333333] dark:text-gray-300 px-1 break-words">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}