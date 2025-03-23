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
      className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full border border-gray-100`}
      style={{ background: gradient }}
    >
      <div className="p-4 h-full flex flex-col justify-between relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-white/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-white rounded-lg p-2 w-10 h-10 flex items-center justify-center">
              <div className="text-primary">{icon}</div>
            </div>
            {available ? (
              <span className="bg-white/80 text-primary text-xs px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full block mr-1"></span>
                <span>Aktif</span>
              </span>
            ) : (
              <span className="bg-white/50 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                Yakında
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-800 mt-2">{title}</h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="mt-3 relative z-10">
          <button 
            className={`text-xs ${available ? 'bg-white/80 text-primary border border-primary/20' : 'bg-white/50 text-gray-600 border border-gray-200'} rounded-full px-3 py-1 font-medium hover:bg-white transition-colors`}
          >
            {available ? 'Kullan' : 'Bilgi Al'}
          </button>
        </div>
      </div>
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
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Sun size={20} className="text-amber-500 mr-2" /> 
            Güne Özel Fırsatlar
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">Günün hava durumuna göre özel teklifler</p>
        </div>
      </div>
      
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
      icon: <Sparkles size={20} />,
      onClick: () => navigate('/virtual-consultation'),
      available: true,
      gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)" // Pastel pembe
    },
    {
      title: "AI Renk Eşleştirme",
      description: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={20} />,
      onClick: () => navigate('/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)" // Pastel mavi
    },
    {
      title: "Sadakat Puanları",
      description: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={20} />,
      onClick: () => showComingSoon('Sadakat puanları'),
      available: false,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)" // Pastel sarı
    },
    {
      title: "Tema Kişiselleştirme",
      description: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={20} />,
      onClick: () => showComingSoon('Tema kişiselleştirme'),
      available: false,
      gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)" // Pastel yeşil
    },
    {
      title: "Tırnak Mood Board",
      description: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={20} />,
      onClick: () => showComingSoon('Mood board'),
      available: false,
      gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)" // Pastel mor
    },
    {
      title: "Kampanya Yönetimi",
      description: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={20} />,
      onClick: () => showComingSoon('Promosyon yönetimi'),
      available: false,
      gradient: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)" // Pastel kırmızı
    },
    {
      title: "Gelişmiş Filtreleme",
      description: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={20} />,
      onClick: () => navigate('/search'),
      available: true,
      gradient: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)" // Pastel indigo
    },
    {
      title: "Takvim Entegrasyonu",
      description: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={20} />,
      onClick: () => navigate('/salons/1'),
      available: true,
      gradient: "linear-gradient(135deg, #f0abfc 0%, #d946ef 100%)" // Pastel fuşya
    }
  ];
  
  return (
    <div className="px-4 py-6 mt-4 bg-gradient-to-br from-slate-100 to-gray-50 rounded-t-3xl relative overflow-hidden shadow-sm">
      {/* Dekoratif arka plan elementleri - daha yumuşak */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-pink-200/20 blur-xl"></div>
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-blue-200/20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-purple-200/20 blur-xl"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Sparkles size={20} className="text-pink-500 mr-2" /> 
            Premium Özellikler
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">Nail Art Match'in özel özellikleriyle daha fazlasına erişin</p>
        </div>
        <button
          className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
        >
          Tümü
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            onClick={feature.onClick}
            available={feature.available}
            gradient={feature.gradient}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeView() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="pb-16">
        <StorySection />
        <CategoriesSection />
        <FeaturedSalonsSection />
        <PremiumFeaturesSection />
      </div>
      
      <BottomNavigation />
    </div>
  );
}
