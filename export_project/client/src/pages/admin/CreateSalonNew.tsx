import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Store, MapPin, Upload, Camera, Check, AlertCircle } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Gelişmiş salon oluşturma form şeması
const createSalonSchema = z.object({
  // Temel Bilgiler
  name: z.string().min(3, { message: "Salon adı en az 3 karakter olmalıdır" }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır" }),
  
  // İletişim Bilgileri
  phoneNumber: z.string().min(10, { message: "Geçerli bir telefon numarası giriniz" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  website: z.string().optional(),
  
  // Konum Bilgileri
  address: z.string().min(5, { message: "Adres en az 5 karakter olmalıdır" }),
  city: z.string().min(2, { message: "Şehir gereklidir" }),
  district: z.string().min(2, { message: "İlçe gereklidir" }),
  latitude: z.number(),
  longitude: z.number(),
  
  // Çalışma Saatleri
  openTime: z.string().min(1, { message: "Açılış saati gereklidir" }),
  closeTime: z.string().min(1, { message: "Kapanış saati gereklidir" }),
  
  // Diğer Bilgiler
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  discount: z.string().optional(),
  specialFeatures: z.string().optional(),
});

// Form için varsayılan değerler
const defaultValues = {
  name: "",
  description: "",
  phoneNumber: "",
  email: "",
  website: "",
  address: "",
  city: "İstanbul",
  district: "Kadıköy",
  latitude: 41.0082,
  longitude: 28.9784,
  openTime: "09:00",
  closeTime: "19:00",
  isPremium: false,
  isActive: true,
  discount: "",
  specialFeatures: ""
};

export default function CreateSalon() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number}>({
    lat: 41.0082,
    lng: 28.9784
  });
  
  // Google Maps API için loader
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  // Form oluştur
  const form = useForm<z.infer<typeof createSalonSchema>>({
    resolver: zodResolver(createSalonSchema),
    defaultValues,
  });

  // Form gönderme işlemi
  const onSubmit = (values: z.infer<typeof createSalonSchema>) => {
    createSalonMutation.mutate({
      ...values,
      imageUrl: selectedImage || "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    });
  };

  // Salon oluşturma mutasyonu
  const createSalonMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createSalonSchema> & { imageUrl: string }) => {
      // API için veri hazırlama
      const salonData = {
        ...values,
        rating: 0,       // Yeni salonlar için varsayılan değer
        reviewCount: 0,  // Yeni salonlar için varsayılan değer
        distance: 0      // Bu değer kullanıcının konumuna göre dinamik olarak hesaplanacak
      };
      
      // Gerçek API çağrısı yapılıyor
      const response = await apiRequest("POST", "/api/admin/salons", salonData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Salon oluşturulurken bir hata oluştu");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Başarılı!",
        description: "Salon başarıyla oluşturuldu.",
      });
      
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Salon oluşturulurken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Örnek resim seçimi (gerçek uygulamada dosya yükleme ile değiştirilecek)
  const sampleImages = [
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1604654894619-e47e30f5984c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1607779097134-523cec53d862?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];
  
  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImagePreview(imageUrl);
  };

  // İlerlemeyi kontrol et
  const validateCurrentTab = () => {
    let isValid = true;
    
    if (activeTab === "basic") {
      isValid = form.getValues("name") !== "" && 
                form.getValues("description") !== "";
    } else if (activeTab === "contact") {
      isValid = form.getValues("phoneNumber") !== "" && 
                form.getValues("email") !== "";
    } else if (activeTab === "location") {
      isValid = form.getValues("address") !== "" && 
                form.getValues("city") !== "" &&
                form.getValues("district") !== "";
    }
    
    return isValid;
  };
  
  // Sonraki sekmeye geç
  const goToNextTab = () => {
    if (activeTab === "basic") {
      setActiveTab("contact");
    } else if (activeTab === "contact") {
      setActiveTab("location");
    } else if (activeTab === "location") {
      setActiveTab("media");
    } else if (activeTab === "media") {
      setActiveTab("other");
    }
  };
  
  // Harita için tıklama işleyicisi
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPos);
      form.setValue("latitude", newPos.lat);
      form.setValue("longitude", newPos.lng);
    }
  }, [form]);

  return (
    <div className="container max-w-5xl mx-auto p-4 pb-16">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Yeni Salon Oluştur</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Platformunuza yeni bir salon ekleyin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Store className="h-5 w-5 mr-2 text-purple-600" />
            <CardTitle>Salon Kayıt Formu</CardTitle>
          </div>
          <CardDescription>
            Yeni salon için tüm gerekli bilgileri eksiksiz doldurun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="basic" className="relative">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${activeTab === "basic" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center mb-1`}>
                    <span>1</span>
                  </div>
                  <span className="text-xs">Temel Bilgiler</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="contact">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${activeTab === "contact" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center mb-1`}>
                    <span>2</span>
                  </div>
                  <span className="text-xs">İletişim</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="location">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${activeTab === "location" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center mb-1`}>
                    <span>3</span>
                  </div>
                  <span className="text-xs">Konum</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="media">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${activeTab === "media" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center mb-1`}>
                    <span>4</span>
                  </div>
                  <span className="text-xs">Medya</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="other">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${activeTab === "other" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center mb-1`}>
                    <span>5</span>
                  </div>
                  <span className="text-xs">Diğer</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Temel Salon Bilgileri</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salon Adı</FormLabel>
                          <FormControl>
                            <Input placeholder="NAM Nail Studio" {...field} />
                          </FormControl>
                          <FormDescription>
                            Salon adı uygulamada ve arama sonuçlarında görünecektir
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
                          <FormLabel>Salon Açıklaması</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Salonunuzun sunduğu hizmetler ve özellikler hakkında bilgi verin" 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Detaylı bir açıklama, müşterilerin salonunuzu seçme olasılığını artırır
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!validateCurrentTab()}
                      >
                        İleri: İletişim Bilgileri
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">İletişim Bilgileri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <FormLabel>E-posta Adresi</FormLabel>
                            <FormControl>
                              <Input placeholder="salon@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Web Sitesi (İsteğe Bağlı)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Salonun web sitesi varsa, müşterilerin ziyaret etmesine olanak tanır
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="openTime"
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
                            <FormLabel>Kapanış Saati</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("basic")}
                      >
                        Geri: Temel Bilgiler
                      </Button>
                      
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!validateCurrentTab()}
                      >
                        İleri: Konum Bilgileri
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="location">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Konum Bilgileri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şehir</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Şehir seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="İstanbul">İstanbul</SelectItem>
                                <SelectItem value="Ankara">Ankara</SelectItem>
                                <SelectItem value="İzmir">İzmir</SelectItem>
                                <SelectItem value="Antalya">Antalya</SelectItem>
                                <SelectItem value="Bursa">Bursa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İlçe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="İlçe seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kadıköy">Kadıköy</SelectItem>
                                <SelectItem value="Beşiktaş">Beşiktaş</SelectItem>
                                <SelectItem value="Şişli">Şişli</SelectItem>
                                <SelectItem value="Beyoğlu">Beyoğlu</SelectItem>
                                <SelectItem value="Bakırköy">Bakırköy</SelectItem>
                              </SelectContent>
                            </Select>
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
                              placeholder="Salonun tam adresi"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Müşterilerin salonu kolayca bulabilmesi için tam adresi giriniz
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Google Maps Haritası */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Konumu Haritada İşaretleyin</h4>
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          {isLoaded ? (
                            <div className="h-[300px] w-full">
                              <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={markerPosition}
                                zoom={14}
                                onClick={handleMapClick}
                              >
                                <Marker position={markerPosition} />
                              </GoogleMap>
                              <div className="p-2 text-xs text-muted-foreground bg-slate-50">
                                Haritada salon konumunu işaretlemek için tıklayın
                              </div>
                            </div>
                          ) : (
                            <div className="h-[300px] w-full flex items-center justify-center bg-slate-100">
                              <p className="text-muted-foreground">Harita yükleniyor...</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Enlem</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.000001"
                                onChange={(e) => {
                                  const lat = parseFloat(e.target.value);
                                  onChange(lat);
                                  setMarkerPosition(prev => ({ ...prev, lat }));
                                }}
                                {...field} 
                                value={field.value?.toString() || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Boylam</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.000001"
                                onChange={(e) => {
                                  const lng = parseFloat(e.target.value);
                                  onChange(lng);
                                  setMarkerPosition(prev => ({ ...prev, lng }));
                                }}
                                {...field} 
                                value={field.value?.toString() || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("contact")}
                      >
                        Geri: İletişim Bilgileri
                      </Button>
                      
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                        disabled={!validateCurrentTab()}
                      >
                        İleri: Medya
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="media">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Salon Görselleri</h3>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <h4 className="text-sm font-medium mb-2">Salon Kapak Resmi</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            Salon listesinde ve salon sayfasında gösterilecek ana görsel
                          </p>
                          
                          {imagePreview ? (
                            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                              <img 
                                src={imagePreview} 
                                alt="Salon cover preview" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setImagePreview(null);
                                }}
                                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                              >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 mb-4 flex flex-col items-center justify-center">
                              <Camera className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-muted-foreground">Henüz bir görsel seçilmedi</p>
                            </div>
                          )}
                          
                          <div className="flex flex-col items-center">
                            <div className="flex flex-wrap justify-center gap-3 mb-4">
                              {sampleImages.map((imageUrl) => (
                                <div 
                                  key={imageUrl}
                                  className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === imageUrl ? 'border-purple-500' : 'border-transparent'}`}
                                  onClick={() => selectImage(imageUrl)}
                                >
                                  <img 
                                    src={imageUrl} 
                                    alt="Sample salon" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <Button variant="outline" className="flex gap-2">
                              <Upload className="h-4 w-4" />
                              <span>Kendi Görselinizi Yükleyin</span>
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                              JPG, PNG veya WebP formatında, en fazla 5MB boyutunda
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("location")}
                      >
                        Geri: Konum Bilgileri
                      </Button>
                      
                      <Button 
                        type="button" 
                        onClick={goToNextTab}
                      >
                        İleri: Diğer Bilgiler
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="other">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Diğer Salon Bilgileri</h3>
                    
                    <FormField
                      control={form.control}
                      name="specialFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Özel Özellikler ve Hizmetler</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Salonunuzu öne çıkaran özellikleri belirtin (örn: ücretsiz park, wifi, çocuk oyun alanı, vb.)"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Salonunuzun sunduğu özel özellikleri virgülle ayırarak yazın
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İndirim Bilgisi (İsteğe Bağlı)</FormLabel>
                          <FormControl>
                            <Input placeholder="Örn: %15 indirim" {...field} />
                          </FormControl>
                          <FormDescription>
                            Eğer sunan bir indirim varsa, burada belirtin. Bu bilgi salon kartlarında görünecektir
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      <FormField
                        control={form.control}
                        name="isPremium"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Premium Salon</FormLabel>
                              <FormDescription>
                                Premium salonlar aramalarda ve listelerde öncelikli gösterilir
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
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Aktif Salon</FormLabel>
                              <FormDescription>
                                Aktif salonlar uygulamada görünür. Pasif salonlar listelenme
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
                    
                    <div className="pt-8 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("media")}
                      >
                        Geri: Medya
                      </Button>
                      
                      <Button 
                        type="submit"
                        disabled={createSalonMutation.isPending}
                        className="gap-2"
                      >
                        {createSalonMutation.isPending ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>İşleniyor...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Salon Oluştur</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}