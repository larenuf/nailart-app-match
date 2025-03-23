import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

// Salon güncelleme form şeması
const updateSalonSchema = z.object({
  name: z.string().min(3, { message: "Salon adı en az 3 karakter olmalıdır" }),
  address: z.string().min(5, { message: "Adres en az 5 karakter olmalıdır" }),
  phoneNumber: z.string().min(10, { message: "Geçerli bir telefon numarası giriniz" }),
  openTime: z.string().min(1, { message: "Açılış saati gereklidir" }),
  closeTime: z.string().min(1, { message: "Kapanış saati gereklidir" }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır" }),
  city: z.string().min(2, { message: "Şehir gereklidir" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  website: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  isPremium: z.boolean().optional(),
  discount: z.string().optional(),
  imageUrl: z.string().optional(),
});

type SalonDetailsFormProps = {
  salon: any;
};

export default function SalonDetailsForm({ salon }: SalonDetailsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mapCenter, setMapCenter] = useState({ 
    lat: salon?.latitude || 41.0082, 
    lng: salon?.longitude || 28.9784 
  });
  
  // Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Form oluştur
  const form = useForm<z.infer<typeof updateSalonSchema>>({
    resolver: zodResolver(updateSalonSchema),
    defaultValues: {
      name: salon?.name || "",
      address: salon?.address || "",
      phoneNumber: salon?.phoneNumber || "",
      openTime: salon?.openTime || "09:00",
      closeTime: salon?.closeTime || "18:00",
      description: salon?.description || "",
      city: salon?.city || "İstanbul",
      email: salon?.email || "",
      website: salon?.website || "",
      latitude: salon?.latitude || 41.0082,
      longitude: salon?.longitude || 28.9784,
      isPremium: salon?.isPremium || false,
      discount: salon?.discount || "",
      imageUrl: salon?.imageUrl || "",
    }
  });

  // Salon güncelleme mutasyonu
  const updateSalonMutation = useMutation({
    mutationFn: async (values: z.infer<typeof updateSalonSchema>) => {
      const response = await apiRequest("PATCH", `/api/salons/${salon.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-salon"] });
      toast({
        title: "Başarılı!",
        description: "Salon bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Salon güncellenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Form gönderme işlemi
  const onSubmit = (values: z.infer<typeof updateSalonSchema>) => {
    updateSalonMutation.mutate(values);
  };

  // Harita üzerinde konum seçimi
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
      
      setMapCenter({ lat, lng });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salon Bilgileri</CardTitle>
        <CardDescription>
          Salonunuzun temel bilgilerini düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salon Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="NAM Nail Studio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon Numarası</FormLabel>
                    <FormControl>
                      <Input placeholder="+90 212 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="salon@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web Sitesi (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="openTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Açılış Saati</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closeTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Kapanış Saati</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şehir</FormLabel>
                    <FormControl>
                      <Input placeholder="İstanbul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktif İndirim (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="%15 İndirim" {...field} />
                    </FormControl>
                    <FormDescription>
                      Örn: "%15 İndirim", "İlk Randevuda %20"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Görsel URL (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Bir görsel URL'si girin veya yükleyici yakında eklenecek
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Premium Salon</FormLabel>
                      <FormDescription>
                        Premium salonlar aramalarda ve listelerde öne çıkar
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Bağdat Caddesi, No: 123, Kadıköy" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salon Açıklaması</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Salonunuz hakkında kısa bir açıklama..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="mb-2 block">Konum</FormLabel>
              <FormDescription>
                Harita üzerinde salonunuzun konumunu seçin
              </FormDescription>
              <div className="mt-2 rounded-md overflow-hidden border h-64">
                {apiKey ? (
                  <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={13}
                      onClick={handleMapClick}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  </LoadScript>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center">
                      <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Google Maps API anahtarı eksik</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                <span>Enlem: {form.watch("latitude")}</span>
                <span>Boylam: {form.watch("longitude")}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateSalonMutation.isPending}
              >
                {updateSalonMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}