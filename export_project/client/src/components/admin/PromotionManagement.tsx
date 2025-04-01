import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Tag,
  Calendar as CalendarIcon,
  Percent
} from "lucide-react";

// Promocyon Formu Şeması
const promotionSchema = z.object({
  code: z.string().min(3, { message: "Promosyon kodu en az 3 karakter olmalıdır" }),
  name: z.string().min(3, { message: "İsim en az 3 karakter olmalıdır" }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır" }),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(1, { message: "Geçerli bir indirim değeri giriniz" }),
  startDate: z.date(),
  endDate: z.date(),
  maxUsageCount: z.coerce.number().min(1, { message: "Maximum kullanım sayısı en az 1 olmalıdır" }),
  artistIds: z.array(z.coerce.number()).optional(),
  isActive: z.boolean().default(true),
  requiresFirstBooking: z.boolean().default(false),
});

type PromotionManagementProps = {
  salonId: number;
};

export default function PromotionManagement({ salonId }: PromotionManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

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

  // Promosyon listesini getir
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["/api/promotions", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/promotions?salonId=${salonId}`);
      if (!response.ok) throw new Error("Promosyonlar yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId
  });

  // Form
  const form = useForm<z.infer<typeof promotionSchema>>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxUsageCount: 100,
      artistIds: [],
      isActive: true,
      requiresFirstBooking: false,
    }
  });

  // Promosyon ekleme mutasyonu
  const addPromotionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof promotionSchema>) => {
      const promotionData = { ...values, salonId };
      const response = await apiRequest("POST", "/api/promotions", promotionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions", salonId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı!",
        description: "Promosyon başarıyla eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Promosyon eklenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Promosyon güncelleme mutasyonu
  const updatePromotionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof promotionSchema>) => {
      const response = await apiRequest("PATCH", `/api/promotions/${selectedPromotion.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions", salonId] });
      setIsEditDialogOpen(false);
      setSelectedPromotion(null);
      toast({
        title: "Başarılı!",
        description: "Promosyon başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Promosyon güncellenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Promosyon silme mutasyonu
  const deletePromotionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/promotions/${selectedPromotion.id}`);
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions", salonId] });
      setIsDeleteDialogOpen(false);
      setSelectedPromotion(null);
      toast({
        title: "Başarılı!",
        description: "Promosyon başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Promosyon silinirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Form gönderme işlemi - Ekleme
  const onSubmitAdd = (values: z.infer<typeof promotionSchema>) => {
    addPromotionMutation.mutate(values);
  };

  // Form gönderme işlemi - Güncelleme
  const onSubmitEdit = (values: z.infer<typeof promotionSchema>) => {
    updatePromotionMutation.mutate(values);
  };

  // Düzenleme modalını aç
  const handleEdit = (promotion: any) => {
    setSelectedPromotion(promotion);
    form.reset({
      code: promotion.code,
      name: promotion.name,
      description: promotion.description || "",
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      startDate: parseISO(promotion.startDate),
      endDate: parseISO(promotion.endDate),
      maxUsageCount: promotion.maxUsageCount,
      artistIds: promotion.artistIds || [],
      isActive: promotion.isActive,
      requiresFirstBooking: promotion.requiresFirstBooking || false,
    });
    setIsEditDialogOpen(true);
  };

  // Silme modalını aç
  const handleDelete = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  // Yeni promosyon ekleme modalını aç
  const handleAddNew = () => {
    form.reset({
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxUsageCount: 100,
      artistIds: [],
      isActive: true,
      requiresFirstBooking: false,
    });
    setIsAddDialogOpen(true);
  };

  // Promosyon durumunu kontrol et
  const getPromotionStatus = (promotion: any) => {
    const now = new Date();
    const startDate = parseISO(promotion.startDate);
    const endDate = parseISO(promotion.endDate);
    
    if (!promotion.isActive) {
      return "inactive";
    } else if (isBefore(now, startDate)) {
      return "scheduled";
    } else if (isAfter(now, endDate)) {
      return "expired";
    } else if (promotion.usageCount >= promotion.maxUsageCount) {
      return "depleted";
    } else {
      return "active";
    }
  };

  // Duruma göre badge rengi
  const getStatusBadgeClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-red-100 text-red-800",
      depleted: "bg-orange-100 text-orange-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  // Durum adını formatla
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Aktif",
      scheduled: "Planlandı",
      expired: "Süresi Doldu",
      depleted: "Tükendi",
      inactive: "Pasif",
    };
    return statusMap[status] || status;
  };

  // İndirim bilgisini formatla
  const formatDiscount = (type: string, value: number) => {
    return type === "percentage" ? `%${value}` : `${value} ₺`;
  };

  // Loading durumu
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Promosyonlar</CardTitle>
          <CardDescription>
            Salonunuzda kullanılan promosyon kodlarını yönetin
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
            <CardTitle>Promosyonlar</CardTitle>
            <CardDescription>
              Salonunuzda kullanılan promosyon kodlarını yönetin
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Promosyon
          </Button>
        </CardHeader>
        <CardContent>
          {promotions && promotions.length > 0 ? (
            <Table>
              <TableCaption>Toplam {promotions.length} promosyon</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>İndirim</TableHead>
                  <TableHead>Geçerlilik</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Kullanım</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion: any) => {
                  const status = getPromotionStatus(promotion);
                  return (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-mono uppercase">{promotion.code}</TableCell>
                      <TableCell>{promotion.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {formatDiscount(promotion.discountType, promotion.discountValue)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(parseISO(promotion.startDate), "d MMM", { locale: tr })} - {format(parseISO(promotion.endDate), "d MMM", { locale: tr })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(status)}>
                          {formatStatus(status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {promotion.usageCount || 0} / {promotion.maxUsageCount}
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
                            <DropdownMenuItem onClick={() => handleEdit(promotion)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(promotion)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <Tag className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium">Henüz Promosyon Yok</h3>
              <p className="text-gray-500 mb-4">
                Salonunuza özel promosyon kodları ekleyerek başlayın
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Promosyon Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promosyon Ekleme/Düzenleme Formu */}
      {(isAddDialogOpen || isEditDialogOpen) && (
        <Dialog 
          open={isAddDialogOpen || isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              isAddDialogOpen ? setIsAddDialogOpen(false) : setIsEditDialogOpen(false);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isAddDialogOpen ? "Yeni Promosyon Ekle" : "Promosyonu Düzenle"}
              </DialogTitle>
              <DialogDescription>
                {isAddDialogOpen 
                  ? "Salonunuza yeni bir promosyon kodu ekleyin" 
                  : "Promosyon bilgilerini güncelleyin"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(isAddDialogOpen ? onSubmitAdd : onSubmitEdit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promosyon Kodu</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="YENI10" 
                            {...field} 
                            className="uppercase"
                          />
                        </FormControl>
                        <FormDescription>
                          Müşterilerin gireceği kod
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promosyon Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Tanışma İndirimi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Promosyon hakkında kısa bir açıklama..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İndirim Türü</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="İndirim türü seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Yüzde (%)</SelectItem>
                            <SelectItem value="fixed">Sabit Tutar (₺)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İndirim Değeri</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              placeholder="10" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                            <div className="ml-2 flex items-center h-10 border rounded-md px-3">
                              {form.watch("discountType") === "percentage" ? (
                                <Percent className="h-4 w-4" />
                              ) : (
                                <span>₺</span>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Başlangıç Tarihi</FormLabel>
                        <FormControl>
                          <div className="border rounded-md p-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={{ before: new Date() }}
                              locale={tr}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <div className="border rounded-md p-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={{ before: form.watch("startDate") || new Date() }}
                              locale={tr}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxUsageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maksimum Kullanım Sayısı</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="100" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Bu değer aşıldığında promosyon otomatik olarak devre dışı kalır
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="artistIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geçerli Artistler (Opsiyonel)</FormLabel>
                      <FormDescription>
                        Promosyonun yalnızca belirli artistler için geçerli olmasını istiyorsanız seçin
                      </FormDescription>
                      <div className="space-y-2 mt-2">
                        {artists && artists.map((artist: any) => (
                          <div key={artist.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`artist-${artist.id}`}
                              checked={field.value?.includes(artist.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), artist.id]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((id) => id !== artist.id) || []
                                  );
                                }
                              }}
                            />
                            <label 
                              htmlFor={`artist-${artist.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {artist.name}
                            </label>
                          </div>
                        ))}
                        {(!artists || artists.length === 0) && (
                          <p className="text-sm text-gray-500">Henüz artist eklenmemiş</p>
                        )}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Aktif</FormLabel>
                          <FormDescription>
                            Promosyon aktif olarak kullanılabilir
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresFirstBooking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Sadece İlk Randevu</FormLabel>
                          <FormDescription>
                            Promosyon sadece müşterinin ilk randevusunda geçerli
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      isAddDialogOpen ? setIsAddDialogOpen(false) : setIsEditDialogOpen(false);
                    }}
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addPromotionMutation.isPending || updatePromotionMutation.isPending}
                  >
                    {isAddDialogOpen ? (
                      addPromotionMutation.isPending ? "Ekleniyor..." : "Promosyon Ekle"
                    ) : (
                      updatePromotionMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Silme Onay Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promosyon Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu promosyon kodunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePromotionMutation.mutate()}
              disabled={deletePromotionMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePromotionMutation.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}