import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Story } from "@/types";

export default function StorySection() {
  // Sorunun kaynağı: StorySection'ın yüksek z-index'i ve tam sayfa overlay yapısı
  // Tüm tıklamaları yakalayan bir yapı var - bunu düzelteceğiz
  
  // Başka yerlere tıklama olaylarını izole edecek yardımcı
  const stopClickPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Olay durduruldu, burada bitecek
    console.log("Tıklama olayı StorySection'da durduruldu");
  };
  
  // Bileşene özel tıklama olayı (scope)
  const [isStoryClicked, setIsStoryClicked] = useState(false);
  
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Story'ye tıklandığında çağrılacak fonksiyon - tamamen izole
  const handleStoryClick = (e: React.MouseEvent, story: Story) => {
    // Çok önemli: Bunu son derece sağlam şekilde durduruyoruz
    e.preventDefault(); 
    e.stopPropagation();
    
    // Tıklanan element izole ediliyor
    setIsStoryClicked(true);
    setSelectedStory(story);
    setIsStoryOpen(true);
    
    // Başka bir eleman tıklanma olasılığını önlemek için
    e.currentTarget.classList.add('clicked');
  };

  // Story modalını kapatan fonksiyon
  const closeStoryModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsStoryOpen(false);
    setIsStoryClicked(false);
    
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Tıklanan eleman işaretini kaldır
    document.querySelectorAll('.clicked').forEach(el => {
      el.classList.remove('clicked');
    });
  };
  
  // Video açıldığında oynatmayı başlat
  useEffect(() => {
    if (isStoryOpen && videoRef.current && selectedStory?.videoUrl) {
      videoRef.current.play().catch(error => {
        console.error("Video otomatik olarak oynatılamadı:", error);
      });
    }
  }, [isStoryOpen, selectedStory]);

  if (isLoading) {
    return (
      <div className="px-4 py-3 bg-[#FAFAFA] dark:bg-gray-800">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="story-circle border-2 border-[#FF5864] p-0.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full w-[70px] h-[70px]"></div>
              <div className="mt-1 w-16 h-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="px-4 py-3 bg-[#FAFAFA] dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
        onClick={stopClickPropagation}
      >
        <div 
          className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar"
          onClick={stopClickPropagation}
        >
          {stories?.map((story) => (
            <div 
              key={story.id} 
              className="cursor-pointer flex flex-col items-center story-item"
              data-story-id={story.id}
              onClick={(e) => {
                if (!isStoryClicked) {
                  handleStoryClick(e, story);
                }
              }}
            >
              <div
                className={`w-[70px] h-[70px] rounded-full overflow-hidden ${
                  story.highlighted 
                    ? "ring-2 ring-[#FF5864] ring-offset-1" 
                    : "border-2 border-gray-200 dark:border-gray-600"
                } p-0.5`}
                onClick={stopClickPropagation}
              >
                <img
                  src={story.videoUrl ? (story.imageUrl || "https://placekitten.com/70/70") : 
                       (story.id === 1 ? "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80" : 
                       story.id === 2 ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80" : 
                       story.id === 3 ? "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80" : 
                       story.id === 4 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80" : 
                       "https://placekitten.com/70/70")}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-full"
                  onClick={stopClickPropagation}
                  onError={(e) => {
                    console.error("Resim yüklenemedi:", story.imageUrl);
                    // Yedek resim göster
                    (e.target as HTMLImageElement).src = 'https://placekitten.com/70/70';
                  }}
                />
                {story.videoUrl && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={stopClickPropagation}
                  >
                    <div 
                      className="bg-black/30 rounded-full p-1"
                      onClick={stopClickPropagation}
                    >
                      <i className="fas fa-play text-white text-xs"></i>
                    </div>
                  </div>
                )}
              </div>
              <p 
                className="text-xs font-medium text-center mt-1 dark:text-white"
                onClick={stopClickPropagation}
              >
                {story.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Story Modal - Daha düşük z-index ve doğrudan tıklandığında kapatılıyor */}
      {isStoryOpen && selectedStory && (
        <div 
          className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center" 
          onClick={(e) => {
            // Doğrudan tıklama
            e.preventDefault();
            e.stopPropagation();
            closeStoryModal(e);
          }}
        >
          <div 
            className="relative h-[80vh] w-full max-w-md bg-black rounded-xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Üst Bilgi */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center">
                <img 
                  src={selectedStory.imageUrl} 
                  alt={selectedStory.title}
                  className="w-10 h-10 rounded-full object-cover border border-white" 
                />
                <div className="ml-2">
                  <p className="text-white font-medium text-sm">{selectedStory.title}</p>
                  <p className="text-white/70 text-xs">Şimdi</p>
                </div>
              </div>
            </div>
            
            {/* Ana İçerik */}
            {selectedStory.videoUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={selectedStory.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
            ) : (
              <img 
                src={selectedStory.imageUrl} 
                alt={selectedStory.title}
                className="w-full h-full object-cover" 
              />
            )}
            
            {/* Alt Bilgi */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  placeholder="Mesaj gönder..." 
                  className="bg-white/20 text-white rounded-full px-4 py-2 text-sm w-full" 
                  onClick={(e) => e.stopPropagation()} 
                />
                <button 
                  onClick={(e) => closeStoryModal(e)} 
                  className="ml-2 bg-white/20 rounded-full p-2"
                  type="button"
                >
                  <i className="fas fa-times text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}