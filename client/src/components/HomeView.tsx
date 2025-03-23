import TopNavigation from "./TopNavigation";
import BottomNavigation from "./BottomNavigation";
import StorySection from "./StorySection";
import CategoriesSection from "./CategoriesSection";
import FeaturedSalonsSection from "./FeaturedSalonsSection";
import { Sparkles, Palette, Medal, MousePointerClick, ImagePlus, Megaphone, SlidersHorizontal, Calendar, Sun, ArrowRight } from 'lucide-react';

// Feature card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  available: boolean;
  gradient: string;
}

function FeatureCard({ title, description, icon, onClick, available, gradient }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
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
  const navigate = () => {
    window.location.href = '/search';
  };
  
  return (
    <div className="px-4 pt-3 pb-4">
      
      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl shadow-md overflow-hidden relative mt-2">
        {/* Dekoratif arka plan elementleri */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 rounded-full -ml-6 -mb-6"></div>
        
        <div className="p-4 relative">
          <div className="flex items-start">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center mr-4">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white drop-shadow-sm">Güne Uygun Şık Başlangıç</h3>
              <div className="mt-2 text-sm text-white/90 space-y-1.5">
                <p className="flex items-center">
                  <span className="mr-1.5">☀️</span> Bugün İstanbul'da hava çok güzel...
                </p>
                <p className="flex items-center">
                  <span className="mr-1.5">💅</span> Tırnakların da en az senin kadar parlasın!
                </p>
                <p className="font-medium text-white mt-1">NAM ile randevunu al, tarzını yansıt.</p>
              </div>
              
              <button 
                onClick={navigate}
                className="mt-3 flex items-center text-sm bg-white text-indigo-600 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-white/90 transition-all"
              >
                Randevu Al
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
  const navigate = (path: string) => {
    window.location.href = path;
  };
  
  const showComingSoon = (feature: string) => {
    alert(`${feature} yakında geliyor! Bizi takip etmeye devam edin.`);
  };
  
  const features = [
    {
      title: "Sanal Danışmanlık",
      description: "Uzman stilist avatarımız ile kişiselleştirilmiş tırnak sanatı tavsiyeleri alın",
      icon: <Sparkles size={14} />,
      onClick: () => navigate('/virtual-consultation'),
      available: true,
      gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)" // Pastel pembe
    },
    {
      title: "AI Renk Eşleştirme",
      description: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={14} />,
      onClick: () => navigate('/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)" // Pastel mavi
    },
    {
      title: "Sadakat Puanları",
      description: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={14} />,
      onClick: () => showComingSoon('Sadakat puanları'),
      available: false,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)" // Pastel sarı
    },
    {
      title: "Tema Kişiselleştirme",
      description: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={14} />,
      onClick: () => showComingSoon('Tema kişiselleştirme'),
      available: false,
      gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)" // Pastel yeşil
    },
    {
      title: "Tırnak Mood Board",
      description: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={14} />,
      onClick: () => showComingSoon('Mood board'),
      available: false,
      gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)" // Pastel mor
    },
    {
      title: "Kampanya Yönetimi",
      description: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={14} />,
      onClick: () => showComingSoon('Promosyon yönetimi'),
      available: false,
      gradient: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)" // Pastel kırmızı
    },
    {
      title: "Gelişmiş Filtreleme",
      description: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={14} />,
      onClick: () => navigate('/search'),
      available: true,
      gradient: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)" // Pastel indigo
    },
    {
      title: "Takvim Entegrasyonu",
      description: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={14} />,
      onClick: () => navigate('/salons/1'),
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
          Premium Özellikler
        </h2>
        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-medium flex items-center">
          Tümünü Gör <ArrowRight size={10} className="ml-0.5" />
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
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative pb-16 transition-colors duration-200">
      <TopNavigation />
      
      <div className="pb-16">
        <StorySection />
        <CategoriesSection />
        <WeatherPromoBanner />
        <FeaturedSalonsSection />
        <div className="mt-4"></div>
        <PremiumFeaturesSection />
      </div>
      
      <BottomNavigation />
    </div>
  );
}