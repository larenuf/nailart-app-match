import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Story } from "@/types";

export default function StorySection() {
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  // Seçilen story'yi izlemek için state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  
  // Video referansı
  const videoRef = useRef<HTMLVideoElement>(null);

  // Story'ye tıklandığında çağrılacak fonksiyon
  const handleStoryClick = (e: React.MouseEvent, story: Story) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStory(story);
    setIsStoryOpen(true);
  };

  // Story modalını kapatan fonksiyon
  const closeStoryModal = () => {
    setIsStoryOpen(false);
    // Video oynatılıyorsa durdur
    if (videoRef.current) {
      videoRef.current.pause();
    }
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
      <div className="px-4 py-3 bg-[#FAFAFA] dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
          {stories?.map((story) => (
            <div 
              key={story.id} 
              className="cursor-pointer flex flex-col items-center"
              onClick={(e) => handleStoryClick(e, story)}
            >
              <div
                className={`w-[70px] h-[70px] rounded-full overflow-hidden ${
                  story.highlighted 
                    ? "ring-2 ring-[#FF5864] ring-offset-1" 
                    : "border-2 border-gray-200 dark:border-gray-600"
                } p-0.5`}
              >
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-full"
                />
                {story.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/30 rounded-full p-1">
                      <i className="fas fa-play text-white text-xs"></i>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-center mt-1 dark:text-white">{story.title}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Story Görüntüleme Modalı - Özel modal yapısı kullanıyoruz (Dialog yerine) */}
      {isStoryOpen && selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={closeStoryModal}>
          <div className="relative h-[80vh] w-full max-w-md bg-black rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Üst Bilgi Bölümü */}
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
            
            {/* Ana İçerik - Video veya Resim */}
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
                />
                <button 
                  onClick={closeStoryModal} 
                  className="ml-2 bg-white/20 rounded-full p-2"
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
