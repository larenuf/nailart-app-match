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
      <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 h-full shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className={`relative ${imageSize} w-full overflow-hidden`}>
          <LazyImage 
            src={salon.imageUrl} 
            alt={salon.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {salon.isTopRated && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {locale === 'tr' ? 'En İyi' : locale === 'en' ? 'Top Rated' : 'الأفضل تقييماً'}
              </span>
            )}
            {salon.hasDiscount && (
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {locale === 'tr' ? '15% İndirim' : locale === 'en' ? '15% Off' : 'خصم 15٪'}
              </span>
            )}
          </div>
        </div>
        
        <CardContent className={`${contentPadding}`}>
          <div>
            <div className="flex justify-between items-start">
              <h3 className={`${nameSize} font-semibold text-gray-900 dark:text-white line-clamp-1`}>
                {salon.name}
              </h3>
              <div className="flex items-center">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">{salon.rating}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({salon.reviewCount})</span>
              </div>
            </div>
            
            <div className="mt-1 flex items-start">
              <MapPin size={14} className="text-gray-500 min-w-[14px] mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400 ml-1 line-clamp-1">
                {salon.address}
                {salon.distance && <span className="ml-1 text-primary font-medium">{salon.distance}</span>}
              </p>
            </div>
            
            {(salon.openNow !== undefined || salon.openTime) && (
              <div className="mt-1 flex items-center">
                <Clock size={14} className="text-gray-500 min-w-[14px]" />
                <p className="text-xs ml-1">
                  {salon.openNow ? (
                    <span className="text-green-600 dark:text-green-500 font-medium">
                      {locale === 'tr' ? 'Şimdi Açık' : locale === 'en' ? 'Open Now' : 'مفتوح الآن'}
                    </span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">
                      {locale === 'tr' ? 'Açık' : locale === 'en' ? 'Open' : 'مفتوح'}: {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
                    </span>
                  )}
                </p>
              </div>
            )}
            
            {salon.phoneNumber && density !== 'compact' && (
              <div className="mt-1 flex items-center">
                <Phone size={14} className="text-gray-500 min-w-[14px]" />
                <p className="text-xs text-gray-600 dark:text-gray-400 ml-1">{salon.phoneNumber}</p>
              </div>
            )}
            
            {salon.promotion && density === 'expanded' && (
              <div className="mt-2 flex items-start">
                <Megaphone size={14} className="text-purple-600 min-w-[14px] mt-0.5" />
                <p className="text-xs text-purple-600 dark:text-purple-400 ml-1 font-medium">
                  {salon.promotion}
                </p>
              </div>
            )}
            
            {density === 'expanded' && (
              <div className="mt-3 flex space-x-2">
                <button className="text-xs bg-primary text-white py-1.5 px-3 rounded-full flex-1 hover:bg-primary-dark transition-colors">
                  {locale === 'tr' ? 'Randevu Al' : locale === 'en' ? 'Book Now' : 'احجز الآن'}
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-1.5 px-3 rounded-full flex items-center justify-center">
                  <Phone size={12} className="mr-1" />
                  {locale === 'tr' ? 'Ara' : locale === 'en' ? 'Call' : 'اتصل'}
                </button>
              </div>
            )}
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