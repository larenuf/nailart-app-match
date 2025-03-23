import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Salon oluşturma form şeması
const createSalonSchema = z.object({
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
});

// Form için varsayılan değerler
const defaultValues = {
  name: "",
  address: "",
  phoneNumber: "",
  openTime: "09:00",
  closeTime: "18:00",
  description: "",
  city: "İstanbul",
  email: "",
  website: "",
  latitude: 41.0082,
  longitude: 28.9784
};

export default function CreateSalon() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mapCenter, setMapCenter] = useState({ lat: 41.0082, lng: 28.9784 }); // İstanbul
  
  // Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Kullanıcı bilgisini al
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Form oluştur
  const form = useForm<z.infer<typeof createSalonSchema>>({
    resolver: zodResolver(createSalonSchema),
    defaultValues,
  });

  // Salon oluşturma mutasyonu
  const createSalonMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createSalonSchema>) => {
      const response = await apiRequest("POST", "/api/salons", values);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-salon"] });
      toast({
        title: "Başarılı!",
        description: "Salonunuz başarıyla oluşturuldu.",
      });
      navigate("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Salon oluşturulurken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Form gönderme işlemi
  const onSubmit = (values: z.infer<typeof createSalonSchema>) => {
    createSalonMutation.mutate(values);
  };

  // Oturum yoksa giriş sayfasına yönlendir
  if (!userLoading && !user) {
    navigate("/auth");
    return null;
  }

  // Kullanıcı salon sahibi değilse ana sayfaya yönlendir
  if (user && user.role !== "salon_owner" && user.role !== "admin") {
    navigate("/");
    return null;
  }

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
    <div className="container max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Salon Oluştur</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Yeni bir salon eklemek için aşağıdaki formu doldurun
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Salon Bilgileri</CardTitle>
          <CardDescription>
            Müşterilerin göreceği temel salon bilgilerini girin
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

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSalonMutation.isPending}
                >
                  {createSalonMutation.isPending ? "Oluşturuluyor..." : "Salon Oluştur"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}