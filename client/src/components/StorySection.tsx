import { useQuery } from "@tanstack/react-query";
import { Story } from "@/types";

export default function StorySection() {
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  if (isLoading) {
    return (
      <div className="px-4 py-3 bg-[#FAFAFA]">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="story-circle border-2 border-[#FF5864] p-0.5 bg-gray-200 animate-pulse rounded-full w-[70px] h-[70px]"></div>
              <div className="mt-1 w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-[#FAFAFA] border-b border-gray-100">
      <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
        {stories?.map((story) => (
          <div key={story.id} className="flex flex-col items-center">
            <div
              className={`w-[70px] h-[70px] rounded-full overflow-hidden ${
                story.highlighted 
                  ? "ring-2 ring-[#FF5864] ring-offset-1" 
                  : "border-2 border-gray-200"
              } p-0.5`}
            >
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="text-xs font-medium text-center mt-1">{story.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
