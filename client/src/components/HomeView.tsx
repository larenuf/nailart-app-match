import TopNavigation from "./TopNavigation";
import BottomNavigation from "./BottomNavigation";
import StorySection2 from "./StorySection2";
import CategoriesSection from "./CategoriesSection";
import FeaturedSalonsSectionNew from "./FeaturedSalonsSectionNew";
import NailProductsSection from "@/components/NailProductsSection";
import LeafletClusterMap from "./LeafletClusterMap";
import { Sparkles, Palette, Medal, MousePointerClick, ImagePlus, Megaphone, SlidersHorizontal, Calendar, Sun, ArrowRight } from 'lucide-react';
import { useCallback, useState, useEffect } from "react";
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
  const { locale } = useI18n();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };
  
  const comingSoonText = locale === 'tr' ? 'Yakında' : locale === 'en' ? 'Coming Soon' : 'قريبًا';
  
  return (
    <div 
      onClick={handleClick}
      className={`rounded-full overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 w-12 h-12 flex items-center justify-center relative`}
      style={{ background: gradient }}
      title={`${title}${!available ? ` (${comingSoonText})` : ''}`}
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
  
  const getLocalizedFeatureName = (trName: string): string => {
    switch(trName) {
      case "Sanal Danışmanlık": 
        return locale === 'en' ? 'Virtual Consultation' : 
               locale === 'ar' ? 'استشارة افتراضية' : trName;
      case "AI Renk Eşleştirme": 
        return locale === 'en' ? 'AI Color Matching' : 
               locale === 'ar' ? 'مطابقة الألوان بالذكاء الاصطناعي' : trName;
      case "Sadakat Puanları": 
        return locale === 'en' ? 'Loyalty Points' : 
               locale === 'ar' ? 'نقاط الولاء' : trName;
      case "Tema Kişiselleştirme": 
        return locale === 'en' ? 'Theme Customization' : 
               locale === 'ar' ? 'تخصيص السمة' : trName;
      case "Tırnak Mood Board": 
        return locale === 'en' ? 'Nail Mood Board' : 
               locale === 'ar' ? 'لوحة أفكار الأظافر' : trName;
      case "Kampanya Yönetimi": 
        return locale === 'en' ? 'Promotion Management' : 
               locale === 'ar' ? 'إدارة العروض' : trName;
      case "Gelişmiş Filtreleme": 
        return locale === 'en' ? 'Advanced Filtering' : 
               locale === 'ar' ? 'تصفية متقدمة' : trName;
      case "Takvim Entegrasyonu": 
        return locale === 'en' ? 'Calendar Integration' : 
               locale === 'ar' ? 'تكامل التقويم' : trName;
      default: return trName;
    }
  };

  const getLocalizedFeatureDesc = (trName: string, trDesc: string): string => {
    if (locale === 'tr') return trDesc;
    
    switch(trName) {
      case "Sanal Danışmanlık": 
        return locale === 'en' ? 'Get personalized nail art advice with our expert stylist avatar' : 
               'احصل على نصائح مخصصة لفن الأظافر مع خبير التصميم الافتراضي';
      case "AI Renk Eşleştirme": 
        return locale === 'en' ? 'Find nail colors that best match your outfit and skin tone' : 
               'ابحث عن ألوان الأظافر التي تناسب ملابسك ولون بشرتك';
      case "Sadakat Puanları": 
        return locale === 'en' ? 'Earn points with every appointment, use for special discounts and gifts' : 
               'اكسب النقاط مع كل موعد، واستخدمها للحصول على خصومات وهدايا خاصة';
      case "Tema Kişiselleştirme": 
        return locale === 'en' ? 'Customize the app theme according to your style' : 
               'خصص سمة التطبيق وفقًا لأسلوبك الخاص';
      case "Tırnak Mood Board": 
        return locale === 'en' ? 'Save designs you like and share with your stylist' : 
               'احفظ التصاميم التي تعجبك وشاركها مع مصمم الأظافر الخاص بك';
      case "Kampanya Yönetimi": 
        return locale === 'en' ? 'Be the first to know about special promotions and discounts' : 
               'كن أول من يعرف عن العروض والخصومات الخاصة';
      case "Gelişmiş Filtreleme": 
        return locale === 'en' ? 'Find the best salon by price, rating and service duration' : 
               'ابحث عن أفضل صالون حسب السعر والتقييم ومدة الخدمة';
      case "Takvim Entegrasyonu": 
        return locale === 'en' ? 'Quickly book appointments based on artist availability' : 
               'احجز المواعيد بسرعة بناءً على توفر الفنان';
      default: return trDesc;
    }
  };
  
  const featureData = [
    {
      trTitle: "Sanal Danışmanlık",
      trDescription: "Uzman stilist avatarımız ile kişiselleştirilmiş tırnak sanatı tavsiyeleri alın",
      icon: <Sparkles size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/virtual-consultation'),
      available: true,
      gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)" // Pastel pembe
    },
    {
      trTitle: "AI Renk Eşleştirme",
      trDescription: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)" // Pastel mavi
    },
    {
      trTitle: "Sadakat Puanları",
      trDescription: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, getLocalizedFeatureName("Sadakat Puanları")),
      available: false,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)" // Pastel sarı
    },
    {
      trTitle: "Tema Kişiselleştirme",
      trDescription: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, getLocalizedFeatureName("Tema Kişiselleştirme")),
      available: false,
      gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)" // Pastel yeşil
    },
    {
      trTitle: "Tırnak Mood Board",
      trDescription: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, getLocalizedFeatureName("Tırnak Mood Board")),
      available: false,
      gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)" // Pastel mor
    },
    {
      trTitle: "Kampanya Yönetimi",
      trDescription: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={14} />,
      onClick: (e: React.MouseEvent) => showComingSoon(e, getLocalizedFeatureName("Kampanya Yönetimi")),
      available: false,
      gradient: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)" // Pastel kırmızı
    },
    {
      trTitle: "Gelişmiş Filtreleme",
      trDescription: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/search'),
      available: true,
      gradient: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)" // Pastel indigo
    },
    {
      trTitle: "Takvim Entegrasyonu",
      trDescription: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={14} />,
      onClick: (e: React.MouseEvent) => handleNavigate(e, '/salons/1'),
      available: true,
      gradient: "linear-gradient(135deg, #f0abfc 0%, #d946ef 100%)" // Pastel fuşya
    }
  ];
  
  const features = featureData.map(feature => ({
    title: getLocalizedFeatureName(feature.trTitle),
    description: getLocalizedFeatureDesc(feature.trTitle, feature.trDescription),
    icon: feature.icon,
    onClick: feature.onClick,
    available: feature.available,
    gradient: feature.gradient
  }));
  
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
  const { locale } = useI18n();
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    fetch('/api/salons')
      .then(response => response.json())
      .then(data => {
        setSalons(data);
      })
      .catch(error => {
        console.error('Error fetching salons:', error);
      });
  }, []);
  
  return (
    <div 
      className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative pb-16 transition-colors duration-200"
      onClick={(e) => {
        // Stop the main event, so all clicks remain in their original targets
        e.stopPropagation();
      }}
      dir={locale === 'ar' ? 'rtl' : 'ltr'} // Support for RTL layouts in Arabic
    >
      <TopNavigation />
      
      <div className="pb-16" onClick={(e) => e.stopPropagation()}>
        <StorySection2 />
        <CategoriesSection />
        <WeatherPromoBanner />
        <FeaturedSalonsSectionNew />
        <div className="px-4" onClick={(e) => e.stopPropagation()}>
          <LeafletClusterMap salons={salons} />
        </div>
        <NailProductsSection />
        <PremiumFeaturesSection />
        <div className="mt-4"></div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}