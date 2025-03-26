import TopNavigation from "./TopNavigation";
import BottomNavigation from "./BottomNavigation";
import StorySection2 from "./StorySection2";
import CategoriesSection from "./CategoriesSection";
import FeaturedSalonsSectionNew from "./FeaturedSalonsSectionNew";
import NearestSalonsMap from "./NearestSalonsMap";
import { Sparkles, Palette, Medal, MousePointerClick, ImagePlus, Megaphone, SlidersHorizontal, Calendar, Sun, ArrowRight } from 'lucide-react';
import { useCallback } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/i18n";

// Feature card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  available: boolean;
  gradient: string;
}

function FeatureCard({ title, description, icon, onClick, available, gradient }: FeatureCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`rounded-full overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 w-12 h-12 flex items-center justify-center relative`}
      style={{ background: gradient }}
      title={`${title}${!available ? ' (Yakında)' : ''}`}
    >
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
        <div className="text-primary dark:text-white">{icon}</div>
      </div>
      {!available && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full border border-white dark:border-gray-800"></div>
      )}
      {available && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
      )}
    </div>
  );
}

// Weather-based promotional banner
function WeatherPromoBanner() {
  const [_, setLocation] = useLocation();
  const { t } = useI18n();

  const handleNavigate = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation('/search');
  }, [setLocation]);
  
  return (
    <div className="px-4 pt-3 pb-4">
      
      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl shadow-md overflow-hidden relative mt-2">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 rounded-full -ml-6 -mb-6"></div>
        
        <div className="p-4 relative">
          <div className="flex items-start">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center mr-4">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white drop-shadow-sm">{t('home.elegantStartForDay')}</h3>
              <div className="mt-2 text-sm text-white/90 space-y-1.5">
                <p className="flex items-center">
                  <span className="mr-1.5">☀️</span> {t('home.niceWeatherToday')}
                </p>
                <p className="flex items-center">
                  <span className="mr-1.5">💅</span> {t('home.nailsShineAsYou')}
                </p>
                <p className="font-medium text-white mt-1">{t('home.bookAppointmentShowStyle')}</p>
              </div>
              
              <button 
                onClick={handleNavigate}
                className="mt-3 flex items-center text-sm bg-white text-indigo-600 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-white/90 transition-all"
                type="button"
              >
                {t('booking.bookAppointment')}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// New section to showcase premium features
function PremiumFeaturesSection() {
  const [_, setLocation] = useLocation();
  
  const handleNavigate = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(path);
  }, [setLocation]);
  
  const { t, locale } = useI18n();
  
  const showComingSoon = useCallback((e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    e.stopPropagation();
    const message = locale === 'en' 
      ? `${feature} coming soon! Stay tuned.`
      : locale === 'ar'
      ? `${feature} قريبًا! ترقبوا.`
      : `${feature} yakında geliyor! Bizi takip etmeye devam edin.`;
    alert(message);
  }, [locale]);
  
  const features = [
    {
      title: "Sanal Danışmanlık",
      description: "Uzman stilist avatarımız ile kişiselleştirilmiş tırnak sanatı tavsiyeleri alın",
      icon: <Sparkles size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/virtual-consultation'),
      available: true,
      gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)" // Pastel pembe
    },
    {
      title: "AI Renk Eşleştirme",
      description: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)" // Pastel mavi
    },
    {
      title: "Sadakat Puanları",
      description: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, 'Sadakat puanları'),
      available: false,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)" // Pastel sarı
    },
    {
      title: "Tema Kişiselleştirme",
      description: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, 'Tema kişiselleştirme'),
      available: false,
      gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)" // Pastel yeşil
    },
    {
      title: "Tırnak Mood Board",
      description: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, 'Mood board'),
      available: false,
      gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)" // Pastel mor
    },
    {
      title: "Kampanya Yönetimi",
      description: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, 'Promosyon yönetimi'),
      available: false,
      gradient: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)" // Pastel kırmızı
    },
    {
      title: "Gelişmiş Filtreleme",
      description: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/search'),
      available: true,
      gradient: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)" // Pastel indigo
    },
    {
      title: "Takvim Entegrasyonu",
      description: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/salons/1'),
      available: true,
      gradient: "linear-gradient(135deg, #f0abfc 0%, #d946ef 100%)" // Pastel fuşya
    }
  ];
  
  return (
    <div className="px-4 py-2 mt-1 bg-gradient-to-br from-slate-100/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60 rounded-t-2xl relative overflow-hidden transition-colors duration-200">
      {/* Minimal background elements */}
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-pink-200/10 dark:bg-pink-700/10 blur-lg"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-blue-200/10 dark:bg-blue-700/10 blur-lg"></div>
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h2 className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Sparkles size={14} className="text-pink-500 dark:text-pink-400 mr-1" /> 
          {t('home.premiumFeatures')}
        </h2>
        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-medium flex items-center">
          {locale === 'tr' ? 'Tümünü Gör' : locale === 'en' ? 'View All' : 'عرض الكل'} <ArrowRight size={10} className="ml-0.5" />
        </span>
      </div>
      
      {/* Alt alta 2 satır, her satırda 4 özellik */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="grid grid-cols-4 gap-3">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <FeatureCard 
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={feature.onClick}
                available={feature.available}
                gradient={feature.gradient}
              />
              <span className="text-[9px] mt-1 text-center text-gray-500 dark:text-gray-400 font-medium">{feature.title}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {features.slice(4, 8).map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <FeatureCard 
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={feature.onClick}
                available={feature.available}
                gradient={feature.gradient}
              />
              <span className="text-[9px] mt-1 text-center text-gray-500 dark:text-gray-400 font-medium">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeView() {
  return (
    <div 
      className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative pb-16 transition-colors duration-200"
      onClick={(e) => {
        // Ana etkinliği durdur, böylece tüm tıklamalar özgün hedeflerinde kalır
        e.stopPropagation();
      }}
    >
      <TopNavigation />
      
      <div className="pb-16" onClick={(e) => e.stopPropagation()}>
        <StorySection2 />
        <CategoriesSection />
        <WeatherPromoBanner />
        <FeaturedSalonsSectionNew />
        <div className="px-4" onClick={(e) => e.stopPropagation()}>
          <NearestSalonsMap />
        </div>
        <div className="mt-4"></div>
        <PremiumFeaturesSection />
      </div>
      
      <BottomNavigation />
    </div>
  );
}