import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Category } from "@/types";
import { useI18n } from "@/i18n";

export default function CategoriesSection() {
  // Stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const [_, navigate] = useLocation();
  const { t, locale } = useI18n();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Translate category name based on current locale
  const translateCategoryName = (name: string): string => {
    if (locale === 'en') {
      switch (name) {
        case "Manikür": return "Manicure";
        case "Pedikür": return "Pedicure";
        case "Jel Tırnak": return "Gel Nails";
        case "AI Tırnak Önizleme": return "AI Nail Preview";
        default: return name;
      }
    } else if (locale === 'ar') {
      switch (name) {
        case "Manikür": return "مانيكير";
        case "Pedikür": return "باديكير";
        case "Jel Tırnak": return "أظافر الجل";
        case "AI Tırnak Önizleme": return "معاينة الأظافر بالذكاء الاصطناعي";
        default: return name;
      }
    } else {
      return name;
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-4 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-4 dark:text-gray-300">
          {locale === 'en' ? "Categories" : locale === 'ar' ? "الفئات" : "Kategoriler"}
        </h2>
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
      <h2 className="text-lg font-bold mb-4 dark:text-gray-300">
        {locale === 'en' ? "Categories" : locale === 'ar' ? "الفئات" : "Kategoriler"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {categories?.slice(0, 4).map((category) => (
          <div 
            key={category.id} 
            className="relative rounded-lg overflow-hidden h-28 cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] duration-300" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Redirect to nail-art-preview page when AI Nail Preview category is clicked
              if (category.name === "AI Tırnak Önizleme") {
                navigate('/nail-art-preview');
              } else {
                navigate(`/search?category=${category.id}`);
              }
            }}
          >
            <img 
              src={category.name === "AI Tırnak Önizleme" ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&purple=true" : 
                   category.name === "Manikür" ? "/images/manikur.png" : 
                   category.name === "Pedikür" ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" :
                   category.name === "Jel Tırnak" ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" :
                   "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
              alt={translateCategoryName(category.name)}
              className="w-full h-full object-cover brightness-110 contrast-110"
              onError={(e) => {
                console.error(`Failed to load category image: ${category.id}`);
                (e.target as HTMLImageElement).src = 'https://placekitten.com/300/300';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent flex items-center justify-center flex-col p-4">
              <h3 className="text-white text-lg font-semibold text-center drop-shadow-md">
                {translateCategoryName(category.name)}
              </h3>
              <p className="text-white text-xs mt-1 text-center drop-shadow-md">
                {locale === 'en' ? "Most Popular" : locale === 'ar' ? "الأكثر شعبية" : "En Popüler"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}