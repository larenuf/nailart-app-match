import TopNavigation from "./TopNavigation";
import BottomNavigation from "./BottomNavigation";
import StorySection from "./StorySection";
import CategoriesSection from "./CategoriesSection";
import FeaturedSalonsSection from "./FeaturedSalonsSection";
import PromotionBanner from "./PromotionBanner";
import { Sparkles, Palette, Medal, MousePointerClick, ImagePlus, Megaphone, SlidersHorizontal, Calendar } from 'lucide-react';

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
      className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}
      style={{ background: gradient }}
    >
      <div className="p-4 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="bg-white/90 rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <div className="text-primary">{icon}</div>
            </div>
            {available ? (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                Aktif
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                Yakında
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-900 mt-2">{title}</h3>
          <p className="text-xs text-gray-700 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="mt-3">
          <button 
            className={`text-xs ${available ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} rounded-full px-3 py-1 font-medium hover:opacity-90 transition-opacity`}
          >
            {available ? 'Kullan' : 'Bilgi Al'}
          </button>
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
      gradient: "linear-gradient(135deg, #fdf2f8 0%, #fae8ff 100%)"
    },
    {
      title: "AI Renk Eşleştirme",
      description: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={20} />,
      onClick: () => navigate('/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
    },
    {
      title: "Sadakat Puanları",
      description: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={20} />,
      onClick: () => showComingSoon('Sadakat puanları'),
      available: false,
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
    },
    {
      title: "Tema Kişiselleştirme",
      description: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={20} />,
      onClick: () => showComingSoon('Tema kişiselleştirme'),
      available: false,
      gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
    },
    {
      title: "Tırnak Mood Board",
      description: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={20} />,
      onClick: () => showComingSoon('Mood board'),
      available: false,
      gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
    },
    {
      title: "Kampanya Yönetimi",
      description: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={20} />,
      onClick: () => showComingSoon('Promosyon yönetimi'),
      available: false,
      gradient: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
    },
    {
      title: "Gelişmiş Filtreleme",
      description: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={20} />,
      onClick: () => navigate('/search'),
      available: true,
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)"
    },
    {
      title: "Takvim Entegrasyonu",
      description: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={20} />,
      onClick: () => navigate('/salons/1'),
      available: true,
      gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)"
    }
  ];
  
  return (
    <div className="px-4 py-5 mt-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-3xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Sparkles size={18} className="text-primary mr-2" /> 
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
        <PromotionBanner />
      </div>
      
      <BottomNavigation />
    </div>
  );
}
