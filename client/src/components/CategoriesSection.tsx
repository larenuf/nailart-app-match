import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Category } from "@/types";

export default function CategoriesSection() {
  const [_, navigate] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

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
    <div className="px-4 py-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-4 dark:text-gray-300">Kategoriler</h2>
      <div className="grid grid-cols-4 gap-3">
        {categories?.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col items-center cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/search?category=${category.id}`);
            }}
          >
            <div 
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm dark:bg-gray-700"
            >
              <i className={`fas fa-${category.iconName} text-[#FF5864] text-lg dark:text-pink-400`}></i>
            </div>
            <p className="mt-2 text-xs font-medium text-center text-[#333333] dark:text-gray-300">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}