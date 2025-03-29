import TopNavigation from "./TopNavigation";
import BottomNavigation from "./BottomNavigation";
import StorySection2 from "./StorySection2";
import CategoriesSection from "./CategoriesSection";
import FeaturedSalonsSectionNew from "./FeaturedSalonsSectionNew";
import NailProductsSection from "@/components/NailProductsSection";
import LeafletClusterMap from "./LeafletClusterMap";
//import TrendingDesigns from "./TrendingDesigns";
import { 
  Sparkles, Palette, Medal, MousePointerClick, ImagePlus, Megaphone, 
  SlidersHorizontal, Calendar, Sun, ArrowRight, Bell, MapPin, 
  Heart, SearchIcon, Star, LayoutGrid, Map, Moon, Settings,
  User, Clock, Filter, TrendingUp, Menu, XCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'wouter';
import { useCallback, useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";

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

// Notifications popup component
function NotificationsPopup({ onClose }: { onClose: () => void }) {
  const { locale } = useI18n();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: locale === 'tr' ? 'Yeni Randevu Onaylandı' : locale === 'en' ? 'New Appointment Confirmed' : 'تم تأكيد موعد جديد',
      message: locale === 'tr' ? 'NAM Nail Studio randevunuz onaylandı' : locale === 'en' ? 'Your appointment at NAM Nail Studio has been confirmed' : 'تم تأكيد موعدك في استوديو NAM للأظافر',
      time: '14:30 - Bugün',
      isRead: false,
      type: 'appointment'
    },
    {
      id: 2,
      title: locale === 'tr' ? 'Özel İndirim' : locale === 'en' ? 'Special Discount' : 'خصم خاص',
      message: locale === 'tr' ? '%15 indirim kuponunuz hazır' : locale === 'en' ? 'Your 15% discount coupon is ready' : 'كوبون الخصم الخاص بك بنسبة 15٪ جاهز',
      time: '09:45 - Dün',
      isRead: true,
      type: 'promotion'
    }
  ];
  
  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={notificationRef}
        className="bg-white dark:bg-gray-800 w-11/12 max-w-sm mt-16 rounded-xl shadow-lg overflow-hidden"
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {locale === 'tr' ? 'Bildirimler' : locale === 'en' ? 'Notifications' : 'الإشعارات'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <motion.div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 ${notification.isRead ? 'opacity-70' : ''}`}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      notification.type === 'appointment' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300' 
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300'
                    }`}>
                      {notification.type === 'appointment' ? (
                        <Calendar size={16} />
                      ) : (
                        <Megaphone size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm">{notification.title}</h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-500 dark:text-gray-500">{notification.time}</span>
                        <button className="text-[10px] font-medium text-primary">
                          {locale === 'tr' ? 'Detaylar' : locale === 'en' ? 'Details' : 'تفاصيل'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {locale === 'tr' ? 'Henüz bildiriminiz yok' : locale === 'en' ? 'No notifications yet' : 'لا توجد إشعارات حتى الآن'}
              </p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-850 flex justify-between">
          <button className="text-xs text-primary font-medium">
            {locale === 'tr' ? 'Tümünü Okundu İşaretle' : locale === 'en' ? 'Mark All as Read' : 'تحديد الكل كمقروء'}
          </button>
          <button className="text-xs text-primary font-medium">
            {locale === 'tr' ? 'Tüm Bildirimleri Gör' : locale === 'en' ? 'See All Notifications' : 'عرض كل الإشعارات'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Personalized greeting section based on time of day
function PersonalizedGreeting({ 
  showNotifications, 
  setShowNotifications 
}: { 
  showNotifications: boolean; 
  setShowNotifications: (show: boolean) => void 
}) {
  const { t, locale } = useI18n();
  const { userLocation } = useAppContext();
  const [timeBasedGreeting, setTimeBasedGreeting] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [location, setLocation] = useState<string>(userLocation || "İstanbul");
  const [_, navigate] = useLocation();
  
  // Function to get greeting based on time of day
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      let greeting = "";
      
      if (hour >= 5 && hour < 12) {
        greeting = locale === 'tr' ? 'Günaydın' : locale === 'en' ? 'Good Morning' : 'صباح الخير';
      } else if (hour >= 12 && hour < 18) {
        greeting = locale === 'tr' ? 'İyi Günler' : locale === 'en' ? 'Good Afternoon' : 'مساء الخير';
      } else {
        greeting = locale === 'tr' ? 'İyi Akşamlar' : locale === 'en' ? 'Good Evening' : 'مساء الخير';
      }
      
      setTimeBasedGreeting(greeting);
    };
    
    getGreeting();
    
    // Try to get user info if available
    fetch('/api/user')
      .then(response => {
        if (response.ok) return response.json();
        return { fullName: "" };
      })
      .then(data => {
        if (data && data.fullName) {
          setUserName(data.fullName.split(' ')[0]); // Just the first name
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [locale]);
  
  const handleNavigateToSearch = () => {
    navigate('/search');
  };
  
  return (
    <motion.div 
      className="px-4 pt-4 mb-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Modern card look with glass effect */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 rounded-2xl shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                  {timeBasedGreeting}{userName && <span>, </span>}
                  {userName && <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">{userName}</span>}
                </h1>
                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="mr-1 text-primary" />
                  <span>{location}</span>
                  <button 
                    className="ml-1 text-primary dark:text-primary-dark text-xs font-medium hover:underline"
                    onClick={() => navigate('/location')}
                  >
                    {locale === 'tr' ? 'Değiştir' : locale === 'en' ? 'Change' : 'تغيير'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button 
              className="p-2 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigateToSearch}
            >
              <SearchIcon size={18} className="text-primary" />
            </motion.button>
            <motion.button 
              className="p-2 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center relative shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
            >
              <Bell size={18} className="text-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-bold">2</span>
              </div>
            </motion.button>
          </div>
        </div>
        
        {/* Day progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{locale === 'tr' ? 'Sabah' : locale === 'en' ? 'Morning' : 'صباح'}</span>
            <span>{locale === 'tr' ? 'Öğle' : locale === 'en' ? 'Noon' : 'ظهر'}</span>
            <span>{locale === 'tr' ? 'Akşam' : locale === 'en' ? 'Evening' : 'مساء'}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-400"
              initial={{ width: "0%" }}
              animate={{ width: `${(new Date().getHours() / 24) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// View type selector component was removed as requested

// Quick filter tags component
function QuickFilterTags() {
  const { locale } = useI18n();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  
  const getLocalizedFilterName = (trName: string): string => {
    switch(trName) {
      case "Şimdi Açık": 
        return locale === 'en' ? 'Now Open' : locale === 'ar' ? 'مفتوح الآن' : trName;
      case "Yakınımdaki": 
        return locale === 'en' ? 'Near Me' : locale === 'ar' ? 'بالقرب مني' : trName;
      case "En Yüksek Puan": 
        return locale === 'en' ? 'Top Rated' : locale === 'ar' ? 'الأعلى تقييماً' : trName;
      case "İndirimli": 
        return locale === 'en' ? 'Discounted' : locale === 'ar' ? 'خصومات' : trName;
      case "Bugün Müsait": 
        return locale === 'en' ? 'Available Today' : locale === 'ar' ? 'متاح اليوم' : trName;
      default: 
        return trName;
    }
  };
  
  const filters = [
    { id: 'open', name: 'Şimdi Açık', icon: <Clock size={12} className="mr-1.5 text-green-600" /> },
    { id: 'nearby', name: 'Yakınımdaki', icon: <MapPin size={12} className="mr-1.5 text-blue-600" /> },
    { id: 'rated', name: 'En Yüksek Puan', icon: <Star size={12} className="mr-1.5 text-amber-500" /> },
    { id: 'discount', name: 'İndirimli', icon: <Megaphone size={12} className="mr-1.5 text-purple-600" /> },
    { id: 'today', name: 'Bugün Müsait', icon: <Calendar size={12} className="mr-1.5 text-pink-600" /> }
  ];
  
  const handleFilterClick = (filterId: string) => {
    if (activeFilter === filterId) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterId);
      
      // Implement appropriate filter logic here
      if (filterId === 'nearby') {
        // Example: navigate to nearest salons or update map view
        navigate('/search?filter=nearest');
      }
    }
  };
  
  return (
    <div className="px-4 mb-4 mt-2">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2.5 flex items-center">
          <Filter size={14} className="mr-1.5 text-primary" />
          {locale === 'tr' ? 'Hızlı Filtreler' : locale === 'en' ? 'Quick Filters' : 'مرشحات سريعة'}
        </h3>
        <div className="flex overflow-x-auto pb-2 no-scrollbar space-x-2 scrollbar-hide" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              className={`flex-shrink-0 flex items-center px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-all duration-200 ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-primary to-pink-600 text-white' 
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.icon}
              {getLocalizedFilterName(filter.name)}
              {activeFilter === filter.id && (
                <motion.span 
                  className="ml-1.5 bg-white bg-opacity-30 rounded-full w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <XCircle size={10} />
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pull to refresh component
function PullToRefresh({ onRefresh }: { onRefresh: () => void }) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startY = useRef(0);
  const thresholdToRefresh = 80; // pixels needed to pull down to trigger refresh
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) { // Only enable pull-to-refresh at the top of the page
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      // Resist the pull as it gets further
      const resistance = 0.4;
      const newProgress = Math.min(100, (diff * resistance / thresholdToRefresh) * 100);
      setPullProgress(newProgress);
    } else {
      setPullProgress(0);
    }
  };
  
  const handleTouchEnd = () => {
    if (!isPulling) return;
    
    if (pullProgress > 70) { // If pulled enough, trigger refresh
      onRefresh();
    }
    
    setIsPulling(false);
    setPullProgress(0);
  };
  
  return (
    <div
      className="fixed top-0 left-0 right-0 z-10 pointer-events-none"
      style={{ 
        transform: `translateY(${isPulling ? (pullProgress * 0.8) : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {isPulling && (
        <div className="flex justify-center items-center h-16 bg-transparent">
          <motion.div 
            animate={{ 
              rotate: pullProgress > 70 ? 360 : pullProgress * 2,
              scale: pullProgress > 70 ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 0.5 }, 
              scale: { duration: 0.3, repeat: pullProgress > 70 ? Infinity : 0 } 
            }}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <ArrowRight 
              size={16} 
              className="text-primary"
              style={{ 
                transform: `rotate(${90 + (pullProgress * 1.8)}deg)`,
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Density toggle for content display was removed as requested

// Trending designs section
// Bu bölüm tamamen kaldırıldı

export default function HomeView() {
  const { locale } = useI18n();
  const { darkMode, toggleDarkMode } = useTheme();
  const [salons, setSalons] = useState([]);
  // View type and density settings are removed as requested
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Customize sections visibility
  const [visibleSections, setVisibleSections] = useState({
    stories: true,
    categories: true,
    weatherPromo: true,
    featuredSalons: true,
    map: true,
    products: true,
    trendingDesigns: false, // Trend tasarımlar bölümünü kaldır
    premiumFeatures: true
  });
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      // Refresh data
      fetch('/api/salons')
        .then(response => response.json())
        .then(data => {
          setSalons(data);
          setIsRefreshing(false);
        })
        .catch(error => {
          console.error('Error fetching salons:', error);
          setIsRefreshing(false);
        });
    }, 1000);
  };

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
  
  // Set up pull-to-refresh
  const pullRef = useRef({
    startY: 0,
    isPulling: false,
    pullProgress: 0
  });
  const pullThreshold = 80; // pixels to trigger refresh
  
  useEffect(() => {
    // Create pull-to-refresh instance on document
    (document as any).pullToRefreshInstance = {
      handleTouchStart: (e: TouchEvent) => {
        if (window.scrollY === 0) {
          pullRef.current.startY = e.touches[0].clientY;
          pullRef.current.isPulling = true;
        }
      },
      handleTouchMove: (e: TouchEvent) => {
        if (!pullRef.current.isPulling) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - pullRef.current.startY;
        
        if (diff > 0) {
          const resistance = 0.4;
          const newProgress = Math.min(100, (diff * resistance / pullThreshold) * 100);
          pullRef.current.pullProgress = newProgress;
        } else {
          pullRef.current.pullProgress = 0;
        }
      },
      handleTouchEnd: () => {
        if (pullRef.current.isPulling && pullRef.current.pullProgress > 70) {
          handleRefresh();
        }
        
        pullRef.current.isPulling = false;
        pullRef.current.pullProgress = 0;
      }
    };
    
    return () => {
      // Clean up
      delete (document as any).pullToRefreshInstance;
    };
  }, [handleRefresh]);

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
      <PullToRefresh onRefresh={handleRefresh} />
      
      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 py-2 shadow-md flex justify-center items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {locale === 'tr' ? 'Yenileniyor...' : locale === 'en' ? 'Refreshing...' : 'جارٍ التحديث...'}
          </span>
        </div>
      )}
      
      <div className="pb-16" onClick={(e) => e.stopPropagation()}>
        {/* New personalized greeting section */}
        <PersonalizedGreeting 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications} 
        />
        
        {visibleSections.stories && <StorySection2 />}
        
        {/* Quick filter tags */}
        <QuickFilterTags />
        
        {visibleSections.categories && <CategoriesSection />}
        
        {visibleSections.weatherPromo && <WeatherPromoBanner />}
        
        {visibleSections.featuredSalons && <FeaturedSalonsSectionNew />}
        
        {visibleSections.map && (
          <div className="px-4" onClick={(e) => e.stopPropagation()}>
            <LeafletClusterMap salons={salons} />
          </div>
        )}
        
        {/* Yeniden tasarlanmış trend tasarımlar bölümü - tamamen kaldırıldı */}
        {/* Trend Tasarımlar bölümü artık görünmüyor */}
        
        {visibleSections.products && <NailProductsSection />}
        
        {visibleSections.premiumFeatures && <PremiumFeaturesSection />}
        
        <div className="mt-4"></div>
      </div>
      
      <BottomNavigation />
      
      {/* Dark mode toggle button */}
      <motion.button
        className="fixed bottom-20 right-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <Sun size={18} className="text-yellow-500" />
        ) : (
          <Moon size={18} className="text-indigo-600" />
        )}
      </motion.button>
      
      {/* Notifications popup */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPopup onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}