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
  comment: string;
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
      <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
      
      {/* Rating overview */}
      <div className="bg-accent/30 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">
            {reviews && reviews.length > 0
              ? (reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length).toFixed(1)
              : "0.0"}
          </span>
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
          <span className="text-muted-foreground">
            ({reviews ? reviews.length : 0} reviews)
          </span>
        </div>
      </div>

      {/* Write a review */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Write a Review</h4>
        
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
        </div>
        
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="flex items-center space-x-1"
            >
              <Upload className="h-4 w-4" />
              <span>Add Photo</span>
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {imageUrl && (
              <div className="relative h-10 w-10">
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
            className="bg-primary" 
            disabled={comment.trim() === "" || createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Post Review
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div key={review.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {review.userImage ? (
                      <img
                        src={review.userImage}
                        alt={review.userName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-medium">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{review.userName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-foreground/80">{review.comment}</p>
              
              {review.imageUrl && (
                <div className="mt-2">
                  <img
                    src={review.imageUrl}
                    alt="Review"
                    className="rounded max-h-40 object-cover"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to leave a review!
          </div>
        )}
      </div>
    </div>
  );
}