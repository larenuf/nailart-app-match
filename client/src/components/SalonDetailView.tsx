import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Artist, Service } from "@/types";
import BottomNavigation from "./BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function SalonDetailView() {
  const { selectedSalon, setSelectedSalon, setSelectedArtist } = useAppContext();

  const { data: artists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: [`/api/salons/${selectedSalon?.id}/artists`],
    enabled: !!selectedSalon,
  });

  // Bu veri endpoint'i gerçekte oluşturulmadı, sadece UI'ı zenginleştirmek için kullanıyoruz
  const { data: salonServices } = useQuery<Service[]>({
    queryKey: [`/api/salons/${selectedSalon?.id}/services`],
    enabled: false, // Endpoint yok, o yüzden devre dışı
  });

  // Salon fotoğraf galerisi - önce salon imageUrl, sonra galleryImages dizisinden gelir
  const galleryImages = [
    selectedSalon?.imageUrl,
    ...(selectedSalon?.galleryImages || [])
  ].filter(Boolean) as string[];

  // Örnek hizmetler - gerçek veritabanından gelecek
  const mockServices = [
    { id: 1, name: "Klasik Manikür", price: 25, durationMinutes: 30, description: "Tırnak şekillendirme, törpüleme ve oje sürme" },
    { id: 2, name: "Klasik Pedikür", price: 35, durationMinutes: 45, description: "Ayak bakımı, tırnak şekillendirme ve oje" },
    { id: 3, name: "Jel Tırnak", price: 50, durationMinutes: 60, description: "Uzun süre dayanıklı jel tırnak uygulaması" },
    { id: 4, name: "Kalıcı Oje", price: 40, durationMinutes: 45, description: "2-3 hafta dayanan kalıcı oje uygulaması" }
  ];

  const handleBackToHome = () => {
    setSelectedSalon(null);
  };

  const [_, navigate] = useLocation();

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    // Sanatçı detay sayfasına yönlendir - Wouter navigate kullan
    navigate(`/artists/${artist.id}`);
  };

  if (!selectedSalon) return null;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-20">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button className="text-[#333333] mr-2" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-lg font-bold font-playfair">{selectedSalon.name}</h2>
          {selectedSalon.isPremium && (
            <Badge className="ml-2 bg-[#FFD700] text-black">Premium</Badge>
          )}
        </div>
      </div>

      {/* Salon Kapak Fotoğrafı ve Ana Bilgileri */}
      <div className="relative">
        <img
          src={selectedSalon.imageUrl}
          alt={selectedSalon.name}
          className="w-full h-48 object-cover"
        />
        {selectedSalon.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {selectedSalon.discount} İndirim
          </div>
        )}
      </div>

      {/* Derecelendirme ve Temel Bilgiler */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="flex text-[#FFD700]">
              {[...Array(Math.floor(selectedSalon.rating))].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
              {selectedSalon.rating % 1 > 0 && (
                <i className="fas fa-star-half-alt"></i>
              )}
            </div>
            <span className="text-sm ml-1 text-gray-600">
              {selectedSalon.rating.toFixed(1)} ({selectedSalon.reviewCount} yorumlar)
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white border border-gray-200 p-2 rounded-full">
              <i className="fas fa-share-alt text-gray-500"></i>
            </button>
            <button className="bg-[#F9E0E7] p-2 rounded-full">
              <i className="far fa-heart text-[#333333]"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center mt-1 text-sm text-gray-600 mb-2">
          <i className="fas fa-map-marker-alt mr-1"></i>
          <span>{selectedSalon.address}</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center text-sm bg-[#F5F5F5] px-3 py-1 rounded-full">
            <i className="far fa-clock text-gray-500 mr-1"></i>
            <span>{selectedSalon.openTime} - {selectedSalon.closeTime}</span>
          </div>
          <div className="flex items-center text-sm bg-[#F5F5F5] px-3 py-1 rounded-full">
            <i className="fas fa-phone-alt text-gray-500 mr-1"></i>
            <span>{selectedSalon.phoneNumber}</span>
          </div>
          <div className="flex items-center text-sm bg-[#F5F5F5] px-3 py-1 rounded-full">
            <i className="fas fa-map-pin text-gray-500 mr-1"></i>
            <span>{selectedSalon.distance ? `${selectedSalon.distance} km` : "1.2 km"}</span>
          </div>
        </div>
      </div>

      {/* Sekme Yapısı */}
      <Tabs defaultValue="services" className="w-full">
        <div className="px-4 border-b">
          <TabsList className="grid grid-cols-4 h-10">
            <TabsTrigger value="services" className="text-xs">Hizmetler</TabsTrigger>
            <TabsTrigger value="about" className="text-xs">Hakkında</TabsTrigger>
            <TabsTrigger value="artists" className="text-xs">Sanatçılar</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs">Galeri</TabsTrigger>
          </TabsList>
        </div>

        {/* Hakkında Sekmesi */}
        <TabsContent value="about" className="px-4 py-3">
          <h3 className="font-bold mb-2">Salon Hakkında</h3>
          <p className="text-sm text-gray-600 mb-4">
            Şehrin merkezinde yer alan {selectedSalon.name}, modern ve şık tasarımı, 
            profesyonel ekibi ve kaliteli hizmetiyle müşterilerine en iyi tırnak bakım 
            deneyimini sunmaktadır. Deneyimli nail artistlerimiz ile tüm tırnak bakım 
            ihtiyaçlarınızı karşılıyoruz.
          </p>

          {/* Salon Tanıtım Videosu */}
          {selectedSalon.videoUrl && (
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-lg text-gray-800 dark:text-gray-200">Salon Tanıtım Videosu</h3>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <video 
                  src={selectedSalon.videoUrl} 
                  controls 
                  className="w-full h-auto"
                  poster={selectedSalon.imageUrl}
                  preload="metadata"
                  playsInline
                >
                  <source src={selectedSalon.videoUrl} type="video/mp4" />
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>
            </div>
          )}

          <h3 className="font-bold mb-2">Özellikler</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center text-sm">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Wi-Fi</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Klima</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Ücretsiz İçecek</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <span>Otopark</span>
            </div>
          </div>

          <h3 className="font-bold mb-2">Konum</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <i className="fas fa-map-marked-alt text-gray-400 text-3xl"></i>
          </div>
        </TabsContent>

        {/* Hizmetler Sekmesi */}
        <TabsContent value="services" className="px-4 py-3">
          <h3 className="font-bold mb-3">Sunulan Hizmetler</h3>
          <div className="space-y-3">
            {mockServices.map((service) => (
              <div 
                key={service.id}
                className="p-3 border border-gray-100 rounded-lg hover:border-[#F9E0E7] transition-colors"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{service.name}</h4>
                  <span className="font-bold">${service.price}</span>
                </div>
                <p className="text-sm text-gray-600 my-1">{service.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{service.durationMinutes} dakika</span>
                  <button className="text-xs bg-[#F9E0E7] hover:bg-[#F9E0E7]/80 text-[#333333] px-3 py-1 rounded-full">
                    Randevu Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Nail Artistleri Sekmesi */}
        <TabsContent value="artists" className="px-4 py-3">
          <h3 className="font-bold mb-3">Tırnak Sanatçılarımız</h3>

          {artistsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 animate-pulse rounded-lg h-24"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {artists?.map((artist) => (
                <div
                  key={artist.id}
                  className="flex p-3 border border-gray-100 rounded-lg hover:border-[#F9E0E7] cursor-pointer transition-colors"
                  onClick={() => handleArtistSelect(artist)}
                >
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium">{artist.name}</h4>
                    <p className="text-sm text-gray-600">{artist.specialty}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-[#FFD700] text-xs">
                        {[...Array(Math.floor(artist.rating))].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                        {artist.rating % 1 > 0 && (
                          <i className="fas fa-star-half-alt"></i>
                        )}
                      </div>
                      <span className="text-xs ml-1 text-gray-500">
                        ({artist.reviewCount} yorum)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="text-gray-400 hover:text-[#F9E0E7]">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Galeri Sekmesi */}
        <TabsContent value="gallery" className="px-4 py-3">
          <h3 className="font-bold mb-3">Salon Galerisi</h3>
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((image, index) => (
              <div key={index} className={index === 0 ? "col-span-2" : ""}>
                <img
                  src={image}
                  alt={`Salon image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alt Navigasyon */}
      <BottomNavigation />
    </div>
  );
}
