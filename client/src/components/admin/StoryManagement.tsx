import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, Trash2, Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// Hikaye form şeması
const storyFormSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  imageUrl: z.string().url("Geçerli bir URL giriniz"),
  videoUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  highlighted: z.boolean().default(false),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;
type Story = StoryFormValues & { id: number };

export default function StoryManagement() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
  // Hikaye verilerini getir
  const { 
    data: stories, 
    isLoading,
    refetch
  } = useQuery<Story[]>({
    queryKey: ['/api/admin/stories'],
    refetchOnWindowFocus: false
  });
  
  // Form ayarları
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      videoUrl: "",
      highlighted: false
    }
  });
  
  // Hikaye oluşturma mutation
  const createMutation = useMutation({
    mutationFn: async (data: StoryFormValues) => {
      const response = await apiRequest("POST", "/api/admin/stories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stories'] });
      toast({
        title: "Başarılı",
        description: "Hikaye başarıyla oluşturuldu",
      });
      form.reset();
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Hikaye oluşturulurken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Hikaye güncelleme mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: StoryFormValues }) => {
      const response = await apiRequest("PUT", `/api/admin/stories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stories'] });
      toast({
        title: "Başarılı",
        description: "Hikaye başarıyla güncellendi",
      });
      form.reset();
      setEditingStory(null);
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Hikaye güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Hikaye silme mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stories'] });
      toast({
        title: "Başarılı",
        description: "Hikaye başarıyla silindi",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Hikaye silinirken bir hata oluştu: ${error.message}`,
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
          
          // Story güncellemelerini dinle
          if (data.type === 'story_update') {
            console.log('Story güncellemesi algılandı:', data);
            queryClient.invalidateQueries({ queryKey: ['/api/admin/stories'] });
            
            // Bildirim göster
            if (data.data.action === 'create') {
              toast({
                title: "Yeni Hikaye",
                description: "Yeni bir hikaye eklendi: " + data.data.story.title,
              });
            } else if (data.data.action === 'update') {
              toast({
                title: "Hikaye Güncellendi",
                description: "Hikaye güncellendi: " + data.data.story.title,
              });
            } else if (data.data.action === 'delete') {
              toast({
                title: "Hikaye Silindi",
                description: "Bir hikaye silindi",
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
    if (editingStory) {
      form.reset({
        title: editingStory.title,
        imageUrl: editingStory.imageUrl,
        videoUrl: editingStory.videoUrl || "",
        highlighted: editingStory.highlighted
      });
    } else {
      form.reset({
        title: "",
        imageUrl: "",
        videoUrl: "",
        highlighted: false
      });
    }
  }, [editingStory, form]);
  
  const onSubmit = (data: StoryFormValues) => {
    if (editingStory) {
      updateMutation.mutate({ id: editingStory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setOpenDialog(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Bu hikayeyi silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleAddNew = () => {
    setEditingStory(null);
    form.reset({
      title: "",
      imageUrl: "",
      videoUrl: "",
      highlighted: false
    });
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingStory(null);
    form.reset();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Hikaye Yönetimi</CardTitle>
            <CardDescription>
              Uygulamada gösterilen hikaye ve promosyonları yönetin
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Hikaye
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Resim</TableHead>
              <TableHead>Öne Çıkan</TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories && stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.id}</TableCell>
                <TableCell>{story.title}</TableCell>
                <TableCell>
                  <img 
                    src={story.imageUrl} 
                    alt={story.title} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                  {story.highlighted ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Evet
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Hayır
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {story.videoUrl ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Var
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Yok
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(story)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {stories && stories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Henüz hikaye bulunmuyor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Hikaye Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStory ? "Hikaye Düzenle" : "Yeni Hikaye Ekle"}
            </DialogTitle>
            <DialogDescription>
              Hikaye detaylarını düzenleyip kaydedebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input placeholder="Hikaye başlığı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resim URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Hikayelerde görüntülenecek resim
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormDescription>
                      Hikayeye tıklandığında açılacak video (isteğe bağlı)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="highlighted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Öne Çıkan</FormLabel>
                      <FormDescription>
                        Hikaye uygulamanın üst kısmında öne çıkarılacak
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {editingStory && editingStory.imageUrl && (
                <div className="border rounded-md p-2">
                  <p className="text-sm font-medium mb-2">Mevcut Resim</p>
                  <img 
                    src={editingStory.imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-md" 
                  />
                </div>
              )}
              
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingStory ? "Güncelle" : "Ekle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}