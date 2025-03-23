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
  CardTitle 
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { 
  PlusCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Clock, 
  ShoppingBag
} from "lucide-react";

// Hizmet ekleme/düzenleme form şeması
const serviceSchema = z.object({
  name: z.string().min(3, { message: "İsim en az 3 karakter olmalıdır" }),
  price: z.coerce.number().min(0, { message: "Geçerli bir fiyat giriniz" }),
  durationMinutes: z.coerce.number().min(5, { message: "Süre en az 5 dakika olmalıdır" }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır" }),
  artistId: z.coerce.number().optional(),
  category: z.string().optional(),
});

type ServiceManagementProps = {
  salonId: number;
};

export default function ServiceManagement({ salonId }: ServiceManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Salon artistlerini getir
  const { data: artists } = useQuery({
    queryKey: ["/api/artists", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/artists?salonId=${salonId}`);
      if (!response.ok) throw new Error("Artistler yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId
  });

  // Hizmet listesini getir
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/services?salonId=${salonId}`);
      if (!response.ok) throw new Error("Hizmetler yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId
  });

  // Hizmet Form
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      price: 0,
      durationMinutes: 30,
      description: "",
      artistId: undefined,
      category: "",
    }
  });

  // Hizmet ekleme mutasyonu
  const addServiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof serviceSchema>) => {
      const serviceData = { ...values, salonId };
      const response = await apiRequest("POST", "/api/services", serviceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services", salonId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı!",
        description: "Hizmet başarıyla eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Hizmet eklenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Hizmet güncelleme mutasyonu
  const updateServiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof serviceSchema>) => {
      const response = await apiRequest("PATCH", `/api/services/${selectedService.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services", salonId] });
      setIsEditDialogOpen(false);
      setSelectedService(null);
      toast({
        title: "Başarılı!",
        description: "Hizmet bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Hizmet güncellenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Hizmet silme mutasyonu
  const deleteServiceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/services/${selectedService.id}`);
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services", salonId] });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      toast({
        title: "Başarılı!",
        description: "Hizmet başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Hizmet silinirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Form gönderme işlemi - Ekleme
  const onSubmitAdd = (values: z.infer<typeof serviceSchema>) => {
    addServiceMutation.mutate(values);
  };

  // Form gönderme işlemi - Güncelleme
  const onSubmitEdit = (values: z.infer<typeof serviceSchema>) => {
    updateServiceMutation.mutate(values);
  };

  // Düzenleme modalını aç
  const handleEdit = (service: any) => {
    setSelectedService(service);
    form.reset({
      name: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes,
      description: service.description || "",
      artistId: service.artistId || undefined,
      category: service.category || "",
    });
    setIsEditDialogOpen(true);
  };

  // Silme modalını aç
  const handleDelete = (service: any) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  // Yeni hizmet ekleme modalını aç
  const handleAddNew = () => {
    form.reset({
      name: "",
      price: 0,
      durationMinutes: 30,
      description: "",
      artistId: undefined,
      category: "",
    });
    setIsAddDialogOpen(true);
  };

  // Artist adını bul
  const getArtistName = (artistId: number | undefined) => {
    if (!artistId || !artists) return "Tüm artistler";
    const artist = artists.find((a: any) => a.id === artistId);
    return artist ? artist.name : "Bilinmeyen artist";
  };

  // Loading durumu
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hizmetler</CardTitle>
          <CardDescription>
            Salonunuzda sunulan hizmetleri yönetin
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
            <CardTitle>Hizmetler</CardTitle>
            <CardDescription>
              Salonunuzda sunulan hizmetleri yönetin
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Hizmet
          </Button>
        </CardHeader>
        <CardContent>
          {services && services.length > 0 ? (
            <Table>
              <TableCaption>Toplam {services.length} hizmet</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Hizmet Adı</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service: any) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                      {service.category && (
                        <span className="text-xs ml-2 text-gray-500">
                          {service.category}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{service.price} ₺</TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {service.durationMinutes} dk.
                    </TableCell>
                    <TableCell>{getArtistName(service.artistId)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(service)}
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
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium">Henüz Hizmet Yok</h3>
              <p className="text-gray-500 mb-4">
                Salonunuza hizmet ekleyerek başlayın
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Hizmet Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hizmet Ekleme Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Hizmet Ekle</DialogTitle>
            <DialogDescription>
              Salonunuza yeni bir hizmet ekleyin
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hizmet Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Oje Uygulaması" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiyat (₺)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="150" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Süre (Dakika)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="Manikür, Jel Tırnak, vb." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist (İsteğe Bağlı)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm artistler" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Tüm artistler</SelectItem>
                        {artists && artists.map((artist: any) => (
                          <SelectItem key={artist.id} value={artist.id.toString()}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Eğer hizmet belirli bir artiste özelse seçin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hizmet hakkında kısa bir açıklama..." 
                        {...field} 
                      />
                    </FormControl>
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
                  disabled={addServiceMutation.isPending}
                >
                  {addServiceMutation.isPending ? "Ekleniyor..." : "Hizmet Ekle"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Hizmet Düzenleme Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hizmet Düzenle</DialogTitle>
            <DialogDescription>
              Hizmet bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hizmet Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Oje Uygulaması" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiyat (₺)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="150" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Süre (Dakika)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="Manikür, Jel Tırnak, vb." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist (İsteğe Bağlı)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm artistler" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Tüm artistler</SelectItem>
                        {artists && artists.map((artist: any) => (
                          <SelectItem key={artist.id} value={artist.id.toString()}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Eğer hizmet belirli bir artiste özelse seçin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hizmet hakkında kısa bir açıklama..." 
                        {...field} 
                      />
                    </FormControl>
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
                  disabled={updateServiceMutation.isPending}
                >
                  {updateServiceMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Hizmet Silme Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hizmet Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu hizmet kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteServiceMutation.mutate()}
              disabled={deleteServiceMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteServiceMutation.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}