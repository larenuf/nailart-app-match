import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Heart, Image, Star } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import * as AppWrite from '@/lib/appwrite';

interface Salon {
  $id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isPremium: boolean;
  discount?: string;
  likeCount?: number;
  galleryCount?: number;
}

export default function FeaturedPremiumSalons() {
  const [_, navigate] = useLocation();
  
  // Premium salonları Appwrite'dan getir
  const { data: featuredSalons, isLoading, error } = useQuery<Salon[]>({
    queryKey: ['featured-premium-salons'],
    queryFn: async () => {
      try {
        const salons = await AppWrite.getFeaturedSalons();
        return salons as any;
      } catch (err) {
        console.error('Premium salonlar alınırken hata oluştu:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Öne Çıkan Premium Salonlar</h2>
          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[280px] h-[220px] bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !featuredSalons || featuredSalons.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <BadgeCheck className="h-5 w-5 text-primary mr-1 fill-primary" />
          Öne Çıkan Premium Salonlar
        </h2>
        <Button 
          variant="link" 
          className="text-primary p-0 h-auto"
          onClick={() => navigate('/salons')}
        >
          Tümünü Gör
        </Button>
      </div>
      
      <ScrollArea className="pb-4 -mx-4 px-4">
        <div className="flex gap-4">
          {featuredSalons.map((salon) => (
            <Card 
              key={salon.$id} 
              className="min-w-[280px] overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
              onClick={() => navigate(`/salons/${salon.$id}`)}
            >
              <div className="relative h-36">
                <img
                  src={salon.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=250&fit=crop&q=80"}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Salon resmi yüklenemedi:", salon.$id);
                    // Yedek resim göster
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop&q=80';
                  }}
                />
                
                {salon.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {salon.discount}
                  </div>
                )}
                
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  Premium
                </div>
                
                {/* Galeri Fotoğraf Sayısı Butonu */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-lg py-1 px-2 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Salon detay sayfasına yönlendir
                    navigate(`/salons/${salon.$id}`);
                  }}
                >
                  <Image className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">{salon.galleryCount || 5} Fotoğraf</span>
                </Button>
                
                {/* Beğeni/Kalp Butonu */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-lg py-1 px-2 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Kullanıcı oturum açmışsa beğeni ekle
                    if (window.confirm('Bu salonu beğenmek için oturum açmanız gerekiyor. Oturum açma sayfasına yönlendirilmek ister misiniz?')) {
                      navigate('/auth');
                    }
                  }}
                >
                  <Heart className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">{salon.likeCount || 120}</span>
                </Button>
              </div>
              
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold line-clamp-1">{salon.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{salon.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({salon.reviewCount})</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">{salon.address}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}