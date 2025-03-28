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
  imageUrl?: string;
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
              {design.imageUrl && (
                <img 
                  src={design.imageUrl}
                  alt={design.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white text-sm font-medium drop-shadow-sm">
                  {locale === 'tr' ? design.title : locale === 'en' ? design.titleEn : design.titleAr}
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