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
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full border-2 border-white`}
      style={{ background: gradient }}
    >
      <div className="p-4 h-full flex flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-white/20"></div>
        <div className="absolute right-8 -bottom-10 w-20 h-20 rounded-full bg-white/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white shadow-md rounded-full p-2 w-12 h-12 flex items-center justify-center">
              <div className="text-primary">{icon}</div>
            </div>
            {available ? (
              <span className="bg-white text-primary text-xs px-3 py-1 rounded-full font-bold shadow-sm flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full block"></span>
                <span>Aktif</span>
              </span>
            ) : (
              <span className="bg-black/10 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">
                Yakında
              </span>
            )}
          </div>
          <h3 className="text-sm font-extrabold text-white drop-shadow-sm mt-2">{title}</h3>
          <p className="text-xs text-white/90 mt-1 line-clamp-2 drop-shadow-sm">{description}</p>
        </div>
        <div className="mt-4 relative z-10">
          <button 
            className={`text-xs ${available ? 'bg-white text-primary' : 'bg-white/30 backdrop-blur-sm text-white'} rounded-full px-4 py-1.5 font-bold hover:opacity-90 transition-opacity shadow-md`}
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
      gradient: "linear-gradient(135deg, #FF66C4 0%, #FF3494 100%)" // Daha canlı pembe
    },
    {
      title: "AI Renk Eşleştirme",
      description: "Kıyafetinize ve ten renginize en uygun tırnak renklerini bulun",
      icon: <Palette size={20} />,
      onClick: () => navigate('/color-matcher'),
      available: true,
      gradient: "linear-gradient(135deg, #0096FF 0%, #0066CC 100%)" // Canlı mavi
    },
    {
      title: "Sadakat Puanları",
      description: "Her randevuda puan kazanın, özel indirimler ve hediyeler için kullanın",
      icon: <Medal size={20} />,
      onClick: () => showComingSoon('Sadakat puanları'),
      available: false,
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" // Altın-turuncu
    },
    {
      title: "Tema Kişiselleştirme",
      description: "Uygulama temasını kendi stilinize göre özelleştirin",
      icon: <MousePointerClick size={20} />,
      onClick: () => showComingSoon('Tema kişiselleştirme'),
      available: false,
      gradient: "linear-gradient(135deg, #64DD17 0%, #4CAF50 100%)" // Canlı yeşil
    },
    {
      title: "Tırnak Mood Board",
      description: "Beğendiğiniz tasarımları kaydedin ve stilistinizle paylaşın",
      icon: <ImagePlus size={20} />,
      onClick: () => showComingSoon('Mood board'),
      available: false,
      gradient: "linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)" // Mor
    },
    {
      title: "Kampanya Yönetimi",
      description: "Özel promosyon ve indirimlerden ilk siz haberdar olun",
      icon: <Megaphone size={20} />,
      onClick: () => showComingSoon('Promosyon yönetimi'),
      available: false,
      gradient: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)" // Kırmızı
    },
    {
      title: "Gelişmiş Filtreleme",
      description: "Fiyata, puana ve servis süresine göre en uygun salonu bulun",
      icon: <SlidersHorizontal size={20} />,
      onClick: () => navigate('/search'),
      available: true,
      gradient: "linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)" // Indigo
    },
    {
      title: "Takvim Entegrasyonu",
      description: "Sanatçı müsaitlik takvimine göre hızlıca randevu alın",
      icon: <Calendar size={20} />,
      onClick: () => navigate('/salons/1'),
      available: true,
      gradient: "linear-gradient(135deg, #FF4081 0%, #C2185B 100%)" // Canlı fuşya
    }
  ];
  
  return (
    <div className="px-4 py-6 mt-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-3xl relative overflow-hidden">
      {/* Dekoratif arka plan elementleri */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-pink-500/10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-purple-500/10 blur-xl"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center">
            <Sparkles size={22} className="text-pink-400 mr-2" /> 
            Premium Özellikler
          </h2>
          <p className="text-xs text-gray-300 mt-1">Nail Art Match'in özel özellikleriyle daha fazlasına erişin</p>
        </div>
        <button
          className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-1.5 rounded-full hover:opacity-90 transition-all shadow-lg shadow-pink-500/20"
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
