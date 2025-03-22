import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Review {
  id: number;
  userId: number;
  artistId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
  userImage: string | null;
}

interface ReviewSystemProps {
  artistId: number;
}

export default function ReviewSystem({ artistId }: ReviewSystemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch existing reviews
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/artists/${artistId}/reviews`],
    // This endpoint doesn't exist yet, so we'll just return an empty array for now
    enabled: false,
  });

  // Submit a new review
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      return apiRequest("POST", `/api/artists/${artistId}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/artists/${artistId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/artists/${artistId}`] });
      
      toast({
        title: "Değerlendirme Gönderildi",
        description: "Değerlendirmeniz için teşekkür ederiz!",
      });
      
      // Reset form
      setRating(0);
      setComment("");
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Değerlendirme gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Yıldız Seçiniz",
        description: "Lütfen bir yıldız değerlendirmesi seçin.",
        variant: "destructive",
      });
      return;
    }
    
    createReviewMutation.mutate({ rating, comment });
  };

  // This would use real data in a complete implementation
  const mockReviews: Review[] = [
    {
      id: 1,
      userId: 1,
      artistId,
      rating: 5,
      comment: "Harika bir deneyimdi! Tırnaklar mükemmel oldu ve sanatçı çok profesyoneldi.",
      createdAt: new Date(),
      userName: "Ayşe Y.",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    },
    {
      id: 2,
      userId: 2,
      artistId,
      rating: 4,
      comment: "Çok güzel bir iş çıkardı, çok memnun kaldım. Sadece biraz gecikmeli başladık.",
      createdAt: new Date(Date.now() - 86400000),
      userName: "Melis K.",
      userImage: null,
    },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Değerlendirmeler ve Yorumlar</h3>
      
      {/* Submit Review Form */}
      <div className="bg-[#F5F1EB] bg-opacity-30 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Değerlendirme Yap</h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl mr-1 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                {(hoveredRating || rating) >= star ? (
                  <i className="fas fa-star text-yellow-400"></i>
                ) : (
                  <i className="far fa-star text-yellow-400"></i>
                )}
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating}/5 yıldız` : "Yıldız seçiniz"}
            </span>
          </div>
          
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-[#D6C3E5] focus:border-[#D6C3E5]"
            placeholder="Yorumunuzu yazın (opsiyonel)"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          
          <button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="bg-[#D6C3E5] text-white py-2 px-4 rounded-md font-medium hover:bg-[#D6C3E5]/90 transition disabled:opacity-70"
          >
            {createReviewMutation.isPending ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden mr-3">
                {review.userImage ? (
                  <img
                    src={review.userImage}
                    alt={review.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{review.userName}</h4>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`${
                            i < review.rating ? "fas fa-star" : "far fa-star"
                          } mr-0.5`}
                        ></i>
                      ))}
                      <span className="text-gray-500 ml-1 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}