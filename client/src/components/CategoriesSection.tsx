import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

const bgColors = {
  "soft-pink": "bg-[#F9E0E7] bg-opacity-30 hover:bg-[#F9E0E7] hover:bg-opacity-50",
  "nude": "bg-[#F5F1EB] bg-opacity-40 hover:bg-[#F5F1EB] hover:bg-opacity-60",
  "lavender": "bg-[#D6C3E5] bg-opacity-30 hover:bg-[#D6C3E5] hover:bg-opacity-50",
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold font-playfair mb-3">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-3 text-center h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <h2 className="text-lg font-bold font-playfair mb-3">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories?.map((category) => (
          <div
            key={category.id}
            className={`${
              bgColors[category.backgroundColor as keyof typeof bgColors]
            } rounded-lg p-3 text-center transition cursor-pointer`}
          >
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <i className={`fas fa-${category.iconName} text-2xl text-[#333333]`}></i>
            </div>
            <p className="text-sm font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
