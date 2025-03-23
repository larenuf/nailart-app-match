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
  return (
    <div className="px-4 py-3 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Premium Features</h2>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => alert('Showing fewer features')}
        >
          Show less
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FeatureCard 
          title="Virtual nail art consultation with stylist avatar"
          icon={<Sparkles size={20} />}
          onClick={() => alert('Virtual nail art consultation coming soon!')}
        />
        <FeatureCard 
          title="AI-powered nail color matching with user's outfit"
          icon={<Palette size={20} />}
          onClick={() => alert('AI color matching coming soon!')}
        />
        <FeatureCard 
          title="Loyalty points system with fun reward animations"
          icon={<Medal size={20} />}
          onClick={() => alert('Loyalty rewards coming soon!')}
        />
        <FeatureCard 
          title="One-click salon booking theme customization"
          icon={<MousePointerClick size={20} />}
          onClick={() => alert('Booking customization coming soon!')}
        />
        <FeatureCard 
          title="Interactive nail art mood board with seasonal trends"
          icon={<ImagePlus size={20} />}
          onClick={() => alert('Mood boards coming soon!')}
        />
        <FeatureCard 
          title="Promotion/campaign management system"
          icon={<Megaphone size={20} />}
          onClick={() => alert('Promotion management coming soon!')}
        />
        <FeatureCard 
          title="Advanced filtering options (price, rating, service time)"
          icon={<SlidersHorizontal size={20} />}
          onClick={() => alert('Advanced filters coming soon!')}
        />
        <FeatureCard 
          title="Artist availability calendar integration"
          icon={<Calendar size={20} />}
          onClick={() => alert('Calendar integration coming soon!')}
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
