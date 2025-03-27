import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { Story } from "@/types";

export default function StorySection() {
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Story'ye tıklandığında çağrılacak basitleştirilmiş fonksiyon
  const handleStoryClick = useCallback((story: Story) => {
    console.log("Story seçildi:", story.title);
    setSelectedStory(story);
    setIsStoryOpen(true);
  }, []);

  // Story modalını kapatan fonksiyon
  const closeStoryModal = useCallback(() => {
    setIsStoryOpen(false);
    
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);
  
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
              className="cursor-pointer flex flex-col items-center story-item"
              onClick={() => handleStoryClick(story)}
            >
              <div className={`w-[70px] h-[70px] rounded-full overflow-hidden ${
                story.highlighted 
                  ? "ring-2 ring-[#FF5864] ring-offset-1" 
                  : "border-2 border-gray-200 dark:border-gray-600"
              } p-0.5`}>
                <img
                  src={story.imageUrl?.includes("cloudinary") 
                    ? story.imageUrl.replace("/upload/", "/upload/c_fill,g_face,w_70,h_70,q_auto/") 
                    : (story.imageUrl || `https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80`)}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    console.error("Resim yüklenemedi:", story.imageUrl);
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80';
                  }}
                />
                {story.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-1 w-6 h-6 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-center mt-1 dark:text-white">
                {story.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Story Modal */}
      {isStoryOpen && selectedStory && (
        <div 
          className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center" 
          onClick={closeStoryModal}
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placekitten.com/70/70';
                  }}
                />
                <div className="ml-2">
                  <p className="text-white font-medium text-sm">{selectedStory.title}</p>
                  <p className="text-white/70 text-xs">Şimdi</p>
                </div>
              </div>
            </div>
            
            {/* Ana İçerik */}
            {selectedStory.videoUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={selectedStory.videoUrl}
                  className="w-full h-full max-h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  muted={false}
                >
                  <source src={selectedStory.videoUrl} type="video/mp4" />
                  Video formatı desteklenmiyor.
                </video>
              </div>
            ) : (
              <img 
                src={selectedStory.imageUrl?.includes("cloudinary") 
                  ? selectedStory.imageUrl.replace("/upload/", "/upload/q_auto,f_auto,w_1080/") 
                  : (selectedStory.imageUrl || "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=1080&fit=crop&q=80")} 
                alt={selectedStory.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Ana hikaye resmi yüklenemedi:", selectedStory.imageUrl);
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=1080&fit=crop&q=80';
                }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    closeStoryModal();
                  }} 
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