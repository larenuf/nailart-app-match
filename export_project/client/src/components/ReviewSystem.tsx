import { useEffect, useState } from "react";
import { Star, MessageSquare, Upload, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  userId: number;
  artistId: number;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
  createdAt: Date;
  userName: string;
  userImage: string | null;
}

interface ReviewSystemProps {
  artistId: number;
}

export default function ReviewSystem({ artistId }: ReviewSystemProps) {
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/artists", artistId, "reviews"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/artists/${artistId}/reviews`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      
      const reviewsData = await res.json();
      
      // For demo purposes, we'll add some mock user data since we're not 
      // doing a join on the backend
      return reviewsData.map((review: any) => ({
        ...review,
        userName: `User ${review.userId}`,
        userImage: null
      }));
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { userId: number; artistId: number; rating: number; comment: string; imageUrl: string | null }) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      if (!res.ok) {
        throw new Error("Failed to create review");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists", artistId, "reviews"] });
      setComment("");
      setSelectedRating(5);
      setImageUrl(null);
      toast({
        title: "Success",
        description: "Your review has been posted!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    // For demo purposes, we're using a hardcoded user ID (1)
    // In a real app, this would come from auth state
    createReviewMutation.mutate({
      userId: 1, 
      artistId: artistId,
      rating: selectedRating,
      comment,
      imageUrl
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server and get a URL back
      // For demo purposes, we'll use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h3 className="text-xl font-semibold">Değerlendirmeler & Puanlar</h3>
      
      {/* Rating overview */}
      <div className="bg-accent/30 p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold">
              {reviews && reviews.length > 0
                ? (reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </span>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      reviews && reviews.length > 0 && 
                      star <= Math.round(reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews ? reviews.length : 0} değerlendirme)
              </span>
            </div>
          </div>
          
          <div className="hidden sm:block text-sm font-medium text-primary cursor-pointer">
            Tümünü Gör
          </div>
        </div>
        
        {/* Rating histogram */}
        {reviews && reviews.length > 0 && (
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((review: Review) => review.rating === rating).length;
              const percentage = (count / reviews.length) * 100;
              
              return (
                <div key={rating} className="flex items-center text-sm">
                  <div className="w-8 text-muted-foreground">{rating}</div>
                  <div className="w-6">
                    <Star className={`h-3.5 w-3.5 ${percentage > 0 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  </div>
                  <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-9 text-right text-muted-foreground text-xs">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-white hover:bg-pink-50">
            Tüm Yorumlar
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-white hover:bg-pink-50">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            5 yıldız
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-white hover:bg-pink-50">
            Fotoğraflı
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-white hover:bg-pink-50">
            Son eklenenler
          </Button>
        </div>
      </div>

      {/* Write a review */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Değerlendirme Yap</h4>
        
        <div className="border-b pb-3">
          <div className="text-sm text-muted-foreground mb-2">Puanınız</div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  star <= selectedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {selectedRating === 1 && "Kötü"}
              {selectedRating === 2 && "Yeterli"}
              {selectedRating === 3 && "İyi"}
              {selectedRating === 4 && "Çok İyi"}
              {selectedRating === 5 && "Mükemmel"}
            </span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground mb-2">Yorumunuz</div>
          <Textarea
            placeholder="Deneyiminizi paylaşın..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] bg-gray-50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 20 karakter (şu an: {comment.length})
          </p>
        </div>
        
        <div className="border-t pt-3">
          <div className="text-sm text-muted-foreground mb-2">Fotoğraf Ekle</div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="flex items-center space-x-1 bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                <span>Fotoğraf Ekle</span>
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              {imageUrl && (
                <div className="relative h-14 w-14">
                  <img
                    src={imageUrl}
                    alt="Review"
                    className="h-full w-full object-cover rounded"
                  />
                  <button
                    onClick={() => setImageUrl(null)}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSubmitReview} 
              className="bg-[#F9E0E7] hover:bg-[#F9E0E7]/90 text-[#333333] w-full sm:w-auto" 
              disabled={comment.length < 20 || createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Yorumu Gönder
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Title and sorting */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Değerlendirmeler ({reviews ? reviews.length : 0})</h4>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground mr-2">Sırala:</span>
          <select className="bg-white border rounded py-1 px-2 text-sm">
            <option>En yeni</option>
            <option>En yüksek puan</option>
            <option>En düşük puan</option>
          </select>
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div key={review.id} className="border rounded-lg p-4 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {review.userImage ? (
                      <img
                        src={review.userImage}
                        alt={review.userName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-medium text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{review.userName}</div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {review.rating === 5 && "Mükemmel"}
                  {review.rating === 4 && "Çok İyi"}
                  {review.rating === 3 && "İyi"}
                  {review.rating === 2 && "Yeterli"}
                  {review.rating === 1 && "Kötü"}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-foreground/80">{review.comment}</p>
                
                {review.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={review.imageUrl}
                      alt="Review"
                      className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-95"
                    />
                  </div>
                )}
                
                <div className="flex items-center mt-3 space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground cursor-pointer hover:text-primary">
                    <i className="far fa-thumbs-up"></i>
                    <span>Yararlı (0)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground cursor-pointer hover:text-primary">
                    <i className="far fa-comment"></i>
                    <span>Yanıtla</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border rounded-lg">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="far fa-comments text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Henüz Değerlendirme Yok</h3>
            <p className="mt-1 text-sm text-gray-500">
              İlk değerlendirmeyi siz yapın!
            </p>
          </div>
        )}
        
        {reviews && reviews.length > 4 && (
          <div className="flex justify-center">
            <Button variant="outline" className="mt-4">
              Daha Fazla Yorum Göster
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}