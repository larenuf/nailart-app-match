import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from './LazyImage';
import { MapPin, Star, Clock, Phone, Megaphone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useTilt } from '../hooks/useTilt';

// Define the salon type used in this component
interface SalonCardProps {
  salon: {
    id: number;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    distance?: string;
    openNow?: boolean;
    openTime?: string;
    closeTime?: string;
    phoneNumber?: string;
    promotion?: string;
    isTopRated?: boolean;
    hasDiscount?: boolean;
  };
  density?: 'compact' | 'normal' | 'expanded';
  onClick?: () => void;
  showTiltEffect?: boolean;
}

function SalonCardComponent({
  salon,
  density = 'normal',
  onClick,
  showTiltEffect = true
}: SalonCardProps) {
  const { locale } = useI18n();
  const [_, navigate] = useLocation();
  const { ref: tiltRef } = useTilt({ 
    scale: 1.03, 
    max: 15, 
    speed: 500, 
    enabled: showTiltEffect 
  });
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/salon/${salon.id}`);
    }
  };
  
  // Format time for display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };
  
  // The card layout changes based on density setting
  let cardHeight = 'auto';
  let imageSize = 'h-36';
  let contentPadding = 'p-3';
  let nameSize = 'text-base';
  
  if (density === 'compact') {
    imageSize = 'h-24';
    contentPadding = 'p-2';
    nameSize = 'text-sm';
  } else if (density === 'expanded') {
    imageSize = 'h-48';
    contentPadding = 'p-4';
    nameSize = 'text-lg';
  }
  
  return (
    <motion.div
      ref={tiltRef}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="h-full cursor-pointer"
    >
      <Card className="overflow-hidden border-none dark:border-gray-800 h-full shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-gray-900/90">
        <div className={`relative ${imageSize} w-full overflow-hidden rounded-t-xl`}>
          <LazyImage 
            src={salon.imageUrl} 
            alt={salon.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {salon.isTopRated && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                {locale === 'tr' ? 'En İyi' : locale === 'en' ? 'Top Rated' : 'الأفضل تقييماً'}
              </span>
            )}
            {salon.hasDiscount && (
              <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                {locale === 'tr' ? '15% İndirim' : locale === 'en' ? '15% Off' : 'خصم 15٪'}
              </span>
            )}
          </div>
          
          {/* Salon name overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className={`${nameSize} font-semibold text-white line-clamp-1 drop-shadow-sm`}>
              {salon.name}
            </h3>
          </div>
        </div>
        
        <CardContent className={`${contentPadding} pt-3`}>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 ml-1">{salon.rating}</span>
                <span className="text-xs text-amber-600 dark:text-amber-500 ml-1">({salon.reviewCount})</span>
              </div>
              
              {salon.openNow && (
                <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 px-2 py-1 rounded-lg font-medium flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  {locale === 'tr' ? 'Şimdi Açık' : locale === 'en' ? 'Open Now' : 'مفتوح الآن'}
                </span>
              )}
            </div>
            
            <div className="mt-3 flex items-start">
              <MapPin size={16} className="text-primary min-w-[16px] mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium line-clamp-1">
                {salon.address}
                {salon.distance && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-primary px-1.5 py-0.5 rounded-md text-xs">
                    {salon.distance}
                  </span>
                )}
              </p>
            </div>
            
            {(salon.openTime) && (
              <div className="mt-2 flex items-center">
                <Clock size={16} className="text-primary min-w-[16px]" />
                <p className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
                  {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
                </p>
              </div>
            )}
            
            {salon.phoneNumber && (
              <div className="mt-2 flex items-center">
                <Phone size={16} className="text-primary min-w-[16px]" />
                <p className="text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">{salon.phoneNumber}</p>
              </div>
            )}
            
            {salon.promotion && (
              <div className="mt-3 flex items-start bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                <Megaphone size={16} className="text-purple-600 min-w-[16px] mt-0.5" />
                <p className="text-sm text-purple-700 dark:text-purple-400 ml-2 font-medium">
                  {salon.promotion}
                </p>
              </div>
            )}
            
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200">
                {locale === 'tr' ? 'Randevu Al' : locale === 'en' ? 'Book Now' : 'احجز الآن'}
              </button>
              <button className="w-12 aspect-square bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
                <Phone size={18} className="text-primary" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Memoize the component to prevent unnecessary re-renders
const SalonCard = memo(SalonCardComponent, (prevProps, nextProps) => {
  // Only re-render if certain props change
  return (
    prevProps.salon.id === nextProps.salon.id &&
    prevProps.density === nextProps.density &&
    prevProps.showTiltEffect === nextProps.showTiltEffect
  );
});

export default SalonCard;