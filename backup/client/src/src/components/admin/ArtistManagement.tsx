import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Star, 
  User,
  Image
} from "lucide-react";

// Artist ekleme/düzenleme form şeması
const artistSchema = z.object({
  name: z.string().min(3, { message: "İsim en az 3 karakter olmalıdır" }),
  specialty: z.string().min(3, { message: "Uzmanlık alanı en az 3 karakter olmalıdır" }),
  experience: z.string().min(1, { message: "Deneyim süresi gereklidir" }),
  bio: z.string().min(10, { message: "Biyografi en az 10 karakter olmalıdır" }).optional(),
  imageUrl: z.string().url({ message: "Geçerli bir URL girmelisiniz" }).optional(),
});

type ArtistManagementProps = {
  salonId: number;
};

export default function ArtistManagement({ salonId }: ArtistManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // Artist listesini getir
  const { data: artists, isLoading } = useQuery({
    queryKey: ["/api/artists", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/artists?salonId=${salonId}`);
      if (!response.ok) throw new Error("Artistler yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId
  });

  // Artist Form
  const form = useForm<z.infer<typeof artistSchema>>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: "",
      specialty: "",
      experience: "",
      bio: "",
      imageUrl: "",
    }
  });

  // Artist ekleme mutasyonu
  const addArtistMutation = useMutation({
    mutationFn: async (values: z.infer<typeof artistSchema>) => {
      const artistData = { ...values, salonId };
      const response = await apiRequest("POST", "/api/artists", artistData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists", salonId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı!",
        description: "Artist başarıyla eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Artist eklenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Artist güncelleme mutasyonu
  const updateArtistMutation = useMutation({
    mutationFn: async (values: z.infer<typeof artistSchema>) => {
      const response = await apiRequest("PATCH", `/api/artists/${selectedArtist.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists", salonId] });
      setIsEditDialogOpen(false);
      setSelectedArtist(null);
      toast({
        title: "Başarılı!",
        description: "Artist bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Artist güncellenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Artist silme mutasyonu
  const deleteArtistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/artists/${selectedArtist.id}`);
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists", salonId] });
      setIsDeleteDialogOpen(false);
      setSelectedArtist(null);
      toast({
        title: "Başarılı!",
        description: "Artist başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Artist silinirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Form gönderme işlemi - Ekleme
  const onSubmitAdd = (values: z.infer<typeof artistSchema>) => {
    addArtistMutation.mutate(values);
  };

  // Form gönderme işlemi - Güncelleme
  const onSubmitEdit = (values: z.infer<typeof artistSchema>) => {
    updateArtistMutation.mutate(values);
  };

  // Düzenleme modalını aç
  const handleEdit = (artist: any) => {
    setSelectedArtist(artist);
    form.reset({
      name: artist.name,
      specialty: artist.specialty,
      experience: artist.experience,
      bio: artist.bio || "",
      imageUrl: artist.imageUrl || "",
    });
    setIsEditDialogOpen(true);
  };

  // Silme modalını aç
  const handleDelete = (artist: any) => {
    setSelectedArtist(artist);
    setIsDeleteDialogOpen(true);
  };

  // Yeni artist ekleme modalını aç
  const handleAddNew = () => {
    form.reset({
      name: "",
      specialty: "",
      experience: "",
      bio: "",
      imageUrl: "",
    });
    setIsAddDialogOpen(true);
  };

  // Loading durumu
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Artistler</CardTitle>
          <CardDescription>
            Salonunuzda çalışan nail artistleri yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Artistler</CardTitle>
            <CardDescription>
              Salonunuzda çalışan nail artistleri yönetin
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Artist
          </Button>
        </CardHeader>
        <CardContent>
          {artists && artists.length > 0 ? (
            <Table>
              <TableCaption>Toplam {artists.length} artist</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Uzmanlık</TableHead>
                  <TableHead>Deneyim</TableHead>
                  <TableHead>Değerlendirme</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.map((artist: any) => (
                  <TableRow key={artist.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {artist.imageUrl ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={artist.imageUrl} 
                              alt={artist.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <User className="w-8 h-8 p-1 rounded-full bg-gray-100" />
                        )}
                        <span>{artist.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{artist.specialty}</TableCell>
                    <TableCell>{artist.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{artist.rating || 0}</span>
                        <span className="text-gray-400 text-sm ml-1">
                          ({artist.reviewCount || 0} değerlendirme)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(artist)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(artist)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <User className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium">Henüz Artist Yok</h3>
              <p className="text-gray-500 mb-4">
                Salonunuza artist ekleyerek başlayın
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Artist Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Artist Ekleme Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Artist Ekle</DialogTitle>
            <DialogDescription>
              Salonunuza yeni bir nail artist ekleyin
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input placeholder="Ayşe Demir" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uzmanlık Alanı</FormLabel>
                    <FormControl>
                      <Input placeholder="Jel Tırnak, Nail Art" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deneyim</FormLabel>
                    <FormControl>
                      <Input placeholder="3 Yıl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biyografi (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Artist hakkında kısa bir açıklama..." 
                        {...field} 
                      />
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
                    <FormLabel>Profil Fotoğrafı URL (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Artist için bir profil fotoğrafı URL'si girin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={addArtistMutation.isPending}
                >
                  {addArtistMutation.isPending ? "Ekleniyor..." : "Artist Ekle"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Artist Düzenleme Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Artist Düzenle</DialogTitle>
            <DialogDescription>
              Artist bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input placeholder="Ayşe Demir" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uzmanlık Alanı</FormLabel>
                    <FormControl>
                      <Input placeholder="Jel Tırnak, Nail Art" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deneyim</FormLabel>
                    <FormControl>
                      <Input placeholder="3 Yıl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biyografi (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Artist hakkında kısa bir açıklama..." 
                        {...field} 
                      />
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
                    <FormLabel>Profil Fotoğrafı URL (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Artist için bir profil fotoğrafı URL'si girin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateArtistMutation.isPending}
                >
                  {updateArtistMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Artist Silme Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Artist Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu artist kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteArtistMutation.mutate()}
              disabled={deleteArtistMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteArtistMutation.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}