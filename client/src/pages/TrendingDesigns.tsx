import { Heart, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import { useQuery } from '@tanstack/react-query';

// Define the design type
interface Design {
  id: number;
  title: string;
  titleEn: string;
  titleAr: string;
  likes: number;
  color: string;
}

export default function TrendingDesignsPage() {
  const { locale } = useI18n();
  const [_, navigate] = useLocation();
  
  // Fetch trend designs from API
  const { data: designs = [] } = useQuery<Design[]>({
    queryKey: ['/api/trending-designs'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return (
    <div className="px-4 py-3 mt-1 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <TrendingUp size={15} className="mr-1.5 text-primary" />
          {locale === 'tr' ? 'Trend Tasarımlar' : locale === 'en' ? 'Trending Designs' : 'تصاميم رائجة'}
        </h2>
        <button 
          className="text-xs text-primary dark:text-primary-dark font-medium flex items-center"
          onClick={() => navigate('/trends')}
        >
          {locale === 'tr' ? 'Tümünü Gör' : locale === 'en' ? 'View All' : 'عرض الكل'}
          <ArrowRight size={12} className="ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {designs.map((design) => (
          <motion.div 
            key={design.id}
            className="rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/design/${design.id}`)}
          >
            <div className="aspect-square w-full overflow-hidden relative" style={{ backgroundColor: design.color }}>
              {/* Görsel kart tasarımı için CSS ile kaplama oluşturuyoruz */}
              {design.id === 1 && (
                <div className="absolute flex flex-col items-center justify-center inset-0">
                  <div className="h-10 w-[60%] flex justify-center items-end rounded-t-lg bg-white">
                    <div className="w-full h-2 bg-[#ffdedc] rounded-t-lg"></div>
                  </div>
                </div>
              )}
              {design.id === 2 && (
                <div className="absolute flex items-center justify-center inset-0">
                  <div className="w-12 h-12 rounded-full bg-blue-200 opacity-50"></div>
                  <div className="w-6 h-6 rounded-full bg-white absolute opacity-80"></div>
                </div>
              )}
              {design.id === 3 && (
                <div className="absolute flex items-center justify-center inset-0">
                  <div className="w-16 h-[1px] bg-gray-700"></div>
                  <div className="w-10 h-[1px] bg-gray-700 absolute -mt-3"></div>
                  <div className="w-10 h-[1px] bg-gray-700 absolute mt-3"></div>
                </div>
              )}
              {design.id === 4 && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-pink-200"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-pink-100"></div>
                  <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-white"></div>
                  <div className="absolute top-1/4 left-2/3 w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white text-sm font-medium drop-shadow-sm">
                  {/* Başlıklar API'den gelse de burada hardcoded olarak DENEME yazacak şekilde değiştiriyoruz */}
                  {design.id === 1 ? (locale === 'tr' ? "DENEME" : locale === 'en' ? "TEST" : "اختبار") : 
                   locale === 'tr' ? design.title : locale === 'en' ? design.titleEn : design.titleAr}
                </h3>
                <div className="flex items-center mt-1">
                  <Heart size={12} className="text-red-400 fill-red-400" />
                  <span className="text-white text-xs ml-1 drop-shadow-sm">{design.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}