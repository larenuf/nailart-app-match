import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, AlertTriangle, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// WebSocket bağlantısı için
let socket: WebSocket | null = null;

const setupWebSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu");
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket hatası:", error);
    };
    
    socket.onclose = () => {
      console.log("WebSocket bağlantısı kapandı");
      setTimeout(setupWebSocket, 3000); // Yeniden bağlanmayı dene
    };
  }
};

// Yorum form şeması
const commentFormSchema = z.object({
  comment: z.string().min(1, "Yorum gereklidir"),
  adminResponse: z.string().optional(),
  adminApproved: z.boolean().default(false),
  adminRejected: z.boolean().default(false),
  adminReviewed: z.boolean().default(false),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

type Review = {
  id: number;
  userId: number;
  artistId: number;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
  createdAt: Date;
  userName: string;
  userImage: string | null;
  adminResponse?: string | null;
  adminApproved?: boolean;
  adminRejected?: boolean;
  adminReviewed?: boolean;
};

export default function CommentManagement() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  // Yorum verilerini getir
  const { 
    data: reviews, 
    isLoading,
    refetch
  } = useQuery<Review[]>({
    queryKey: ['/api/admin/reviews'],
    refetchOnWindowFocus: false
  });
  
  // Form ayarları
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
      adminResponse: "",
      adminApproved: false,
      adminRejected: false,
      adminReviewed: false
    }
  });
  
  // Yorum güncelleme mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Review> }) => {
      const response = await apiRequest("PUT", `/api/admin/reviews/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Başarılı",
        description: "Yorum başarıyla güncellendi",
      });
      form.reset();
      setSelectedReview(null);
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Yorum güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Yorum silme mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Başarılı",
        description: "Yorum başarıyla silindi",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Yorum silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    // WebSocket bağlantısını kur
    setupWebSocket();
    
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Review güncellemelerini dinle
          if (data.type === 'review_update') {
            console.log('Yorum güncellemesi algılandı:', data);
            queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
            
            // Bildirim göster
            if (data.data.action === 'update') {
              toast({
                title: "Yorum Güncellendi",
                description: "Bir yorum güncellendi",
              });
            } else if (data.data.action === 'delete') {
              toast({
                title: "Yorum Silindi",
                description: "Bir yorum silindi",
              });
            }
          }
        } catch (error) {
          console.error('WebSocket mesajı işlenirken hata:', error);
        }
      };
    }
    
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [toast]);
  
  useEffect(() => {
    if (selectedReview) {
      form.reset({
        comment: selectedReview.comment || "",
        adminResponse: selectedReview.adminResponse || "",
        adminApproved: selectedReview.adminApproved || false,
        adminRejected: selectedReview.adminRejected || false,
        adminReviewed: true
      });
    }
  }, [selectedReview, form]);
  
  const onSubmit = (data: CommentFormValues) => {
    if (selectedReview) {
      updateMutation.mutate({ 
        id: selectedReview.id, 
        data: {
          ...data,
          adminReviewed: true
        } 
      });
    }
  };
  
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };
  
  const handleApprove = (id: number) => {
    updateMutation.mutate({ 
      id, 
      data: {
        adminApproved: true,
        adminRejected: false,
        adminReviewed: true
      } 
    });
  };
  
  const handleReject = (id: number) => {
    updateMutation.mutate({ 
      id, 
      data: {
        adminApproved: false,
        adminRejected: true,
        adminReviewed: true
      } 
    });
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    form.reset();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  // Yorumları en yeniden eskiye sırala
  const sortedReviews = reviews 
    ? [...reviews].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  
  // İncelenmemiş yorumları filtrele
  const unreviewed = sortedReviews.filter(review => !review.adminReviewed);
  const reviewedApproved = sortedReviews.filter(review => review.adminReviewed && review.adminApproved);
  const reviewedRejected = sortedReviews.filter(review => review.adminReviewed && review.adminRejected);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yorum Yönetimi</CardTitle>
        <CardDescription>
          Kullanıcı yorumlarını gözden geçirin ve onaylayın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <Badge variant="outline" className="text-sm">
            Toplam: {sortedReviews.length}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-sm">
            İncelenmemiş: {unreviewed.length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-sm">
            Onaylanmış: {reviewedApproved.length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-sm">
            Reddedilmiş: {reviewedRejected.length}
          </Badge>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>Yorum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReviews.map((review) => (
              <TableRow key={review.id} className={!review.adminReviewed ? "bg-yellow-50" : ""}>
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.userName || `Kullanıcı ${review.userId}`}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {review.rating}
                    <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {review.comment || "Yorum yok"}
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {!review.adminReviewed ? (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      İncelenmedi
                    </Badge>
                  ) : review.adminApproved ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Onaylandı
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Reddedildi
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReview(review)}
                  >
                    Detay
                  </Button>
                  {!review.adminReviewed && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100"
                        onClick={() => handleApprove(review.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100"
                        onClick={() => handleReject(review.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100"
                    onClick={() => handleDelete(review.id)}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedReviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Henüz yorum bulunmuyor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Yorum Detay Dialog */}
      <Dialog open={openDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yorum Detayı</DialogTitle>
            <DialogDescription>
              Yorumu gözden geçirin ve yanıtlayın.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="mb-4 p-4 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-medium">
                  {selectedReview.userName || `Kullanıcı ${selectedReview.userId}`}
                </div>
                <div className="flex items-center">
                  {selectedReview.rating}
                  <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="text-sm mb-2">
                {new Date(selectedReview.createdAt).toLocaleString()}
              </div>
              <div className="py-2 text-sm">
                {selectedReview.comment || "Yorum metni yok"}
              </div>
              {selectedReview.imageUrl && (
                <img 
                  src={selectedReview.imageUrl} 
                  alt="Yorum görseli" 
                  className="w-full h-32 object-cover rounded-md mt-2" 
                />
              )}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="adminResponse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Yanıtı</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Yoruma yanıt verin (opsiyonel)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Bu yanıt kullanıcıya görüntülenecektir
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="adminApproved"
                  render={({ field }) => (
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      className={field.value ? "bg-green-600 hover:bg-green-700" : "bg-green-50 hover:bg-green-100"}
                      onClick={() => {
                        form.setValue("adminApproved", true);
                        form.setValue("adminRejected", false);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Onayla
                    </Button>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminRejected"
                  render={({ field }) => (
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      className={field.value ? "bg-red-600 hover:bg-red-700" : "bg-red-50 hover:bg-red-100"}
                      onClick={() => {
                        form.setValue("adminRejected", true);
                        form.setValue("adminApproved", false);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reddet
                    </Button>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  İptal
                </Button>
                <Button 
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}