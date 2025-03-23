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
  icon: React.ReactNode;
  onClick: () => void;
}

function FeatureCard({ title, icon, onClick }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="border rounded-lg p-3 flex items-center gap-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="text-primary">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}

// New section to showcase premium features
function PremiumFeaturesSection() {
  const navigate = (path: string) => {
    window.location.href = path;
  };
  
  const showComingSoon = (feature: string) => {
    alert(`${feature} yakında geliyor!`);
  };
  
  return (
    <div className="px-4 py-3 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Premium Özellikler</h2>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => alert('Daha az özellik gösteriliyor')}
        >
          Daha az
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FeatureCard 
          title="Stilist avatar ile sanal tırnak sanatı danışmanlığı"
          icon={<Sparkles size={20} />}
          onClick={() => navigate('/virtual-consultation')}
        />
        <FeatureCard 
          title="Kullanıcının kıyafetine göre AI renk eşleştirme"
          icon={<Palette size={20} />}
          onClick={() => navigate('/color-matcher')}
        />
        <FeatureCard 
          title="Eğlenceli ödül animasyonlı sadakat puanı sistemi"
          icon={<Medal size={20} />}
          onClick={() => showComingSoon('Sadakat puanları')}
        />
        <FeatureCard 
          title="Tek tıkla salon rezervasyonu teması kişiselleştirme"
          icon={<MousePointerClick size={20} />}
          onClick={() => showComingSoon('Tema kişiselleştirme')}
        />
        <FeatureCard 
          title="Sezonluk trendlere göre interaktif tırnak mood board"
          icon={<ImagePlus size={20} />}
          onClick={() => showComingSoon('Mood board')}
        />
        <FeatureCard 
          title="Promosyon/kampanya yönetim sistemi"
          icon={<Megaphone size={20} />}
          onClick={() => showComingSoon('Promosyon yönetimi')}
        />
        <FeatureCard 
          title="Gelişmiş filtreleme seçenekleri (fiyat, puan, servis süresi)"
          icon={<SlidersHorizontal size={20} />}
          onClick={() => navigate('/search')}
        />
        <FeatureCard 
          title="Sanatçı müsaitlik takvimi entegrasyonu"
          icon={<Calendar size={20} />}
          onClick={() => navigate('/salons/1')}
        />
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
