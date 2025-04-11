import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { Story } from "@/types";
import { useI18n } from "@/i18n";

export default function StorySection2() {
  const { locale } = useI18n();
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function called when a story is clicked
  const handleStoryClick = useCallback((story: Story) => {
    console.log("Story selected:", story.title, "ID:", story.id);
    setSelectedStory(story);
    setIsStoryOpen(true);
  }, []);

  // Function to close the story modal
  const closeStoryModal = useCallback(() => {
    setIsStoryOpen(false);
    
    // If video reference exists, pause the video
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);
  
  // Start playback when video is opened
  useEffect(() => {
    if (isStoryOpen && videoRef.current && selectedStory?.videoUrl) {
      videoRef.current.play().catch(error => {
        console.error("Video could not be played automatically:", error);
      });
    }
  }, [isStoryOpen, selectedStory]);

  // Alternative image sources
  const getAltImageUrl = (storyId: number) => {
    switch (storyId % 5) { // Use modulo 5 to distribute
      case 0:
        return "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80";
      case 1:
        return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80";
      case 2:
        return "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80";
      case 3:
        return "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80";
      case 4:
        return "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-1.2.1&w=70&h=70&fit=crop&q=80";
      default:
        return "https://placekitten.com/70/70";
    }
  };

  // This function is for larger images
  const getLargeImageUrl = (storyId: number) => {
    switch (storyId % 5) { 
      case 0:
        return "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&w=400&h=600&fit=crop&q=80";
      case 1:
        return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&w=400&h=600&fit=crop&q=80";
      case 2:
        return "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&w=400&h=600&fit=crop&q=80";
      case 3:
        return "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&w=400&h=600&fit=crop&q=80";
      case 4:
        return "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-1.2.1&w=400&h=600&fit=crop&q=80";
      default:
        return "https://placekitten.com/400/600";
    }
  };

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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStoryClick(story);
              }}
            >
              <div className={`w-[70px] h-[70px] rounded-full overflow-hidden ${
                story.highlighted 
                  ? "ring-2 ring-[#FF5864] ring-offset-1" 
                  : "border-2 border-gray-200 dark:border-gray-600"
              } p-0.5`}>
                <img
                  src={getAltImageUrl(story.id)}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    console.error("Image could not be loaded:", story.imageUrl);
                    (e.target as HTMLImageElement).src = 'https://placekitten.com/70/70';
                  }}
                />
                {story.videoUrl && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-black/30 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
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
          className="fixed inset-0 z-30 bg-black/90 flex items-center justify-center" 
          onClick={closeStoryModal}
        >
          <div 
            className="relative h-[80vh] w-full max-w-md bg-black rounded-xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Information */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={getAltImageUrl(selectedStory.id)}
                    alt={selectedStory.title}
                    className="w-10 h-10 rounded-full object-cover border border-white" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placekitten.com/70/70';
                    }}
                  />
                  <div className="ml-2">
                    <p className="text-white font-medium text-sm">{selectedStory.title}</p>
                    <p className="text-white/70 text-xs">{locale === 'en' ? 'Now' : locale === 'ar' ? 'الآن' : 'Şimdi'}</p>
                  </div>
                </div>
                <button 
                  onClick={closeStoryModal}
                  className="text-white/80 hover:text-white p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            {selectedStory.videoUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <iframe
                  src={selectedStory.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
            ) : (
              <img 
                src={getLargeImageUrl(selectedStory.id)} 
                alt={selectedStory.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placekitten.com/400/600';
                }}
              />
            )}
            
            {/* Footer Information */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex justify-between items-center">
                <input 
                  type="text" 
                  placeholder={locale === 'en' ? 'Send a message...' : locale === 'ar' ? 'إرسال رسالة...' : 'Mesaj gönder...'} 
                  className="bg-white/20 text-white rounded-full px-4 py-2 text-sm w-full" 
                  onClick={(e) => e.stopPropagation()} 
                />
                <button 
                  className="ml-2 bg-pink-500 hover:bg-pink-600 rounded-full p-2 text-white"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}