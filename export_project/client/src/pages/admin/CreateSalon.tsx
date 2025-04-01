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
                          <FormLabel>Açık Adres</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Bağdat Caddesi, No: 123, Kadıköy" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Müşterilerin salonu kolayca bulabilmeleri için tam adresi girin
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Harita Konumu</FormLabel>
                      <div className="h-60 mt-2 border rounded-md p-2 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            Salon konumu belirlemek için harita entegrasyonu burada gösterilecek
                          </p>
                          <p className="text-sm text-gray-500">
                            (Harita gösterimi geçici olarak devre dışı bırakılmıştır)
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                        <span>Enlem: {form.getValues("latitude")}</span>
                        <span>Boylam: {form.getValues("longitude")}</span>
                      </div>
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
                    
                    <div>
                      <FormLabel>Kapak Görseli</FormLabel>
                      <FormDescription className="mb-2">
                        Müşterilere gösterilecek ana görsel. Yüksek kaliteli ve salon içini gösteren bir fotoğraf seçin.
                      </FormDescription>
                      
                      {/* Görsel yükleme alanı */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded-md" 
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setSelectedImage(null);
                                setImagePreview(null);
                              }}
                            >
                              Kaldır
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48">
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">
                              Görsel yüklemek için tıklayın veya sürükleyin
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => alert("Dosya yükleme özelliği geçici olarak devre dışı bırakılmıştır. Lütfen aşağıdaki örnek görsellerden birini seçin.")}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Dosya Seç
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Örnek resimler */}
                      <div className="mt-4">
                        <FormLabel>Örnek Görsellerden Seçin</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          {sampleImages.map((image, index) => (
                            <div 
                              key={index} 
                              className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === image ? 'border-purple-500' : 'border-transparent'}`}
                              onClick={() => selectImage(image)}
                            >
                              <img 
                                src={image} 
                                alt={`Sample ${index + 1}`} 
                                className="w-full h-24 object-cover" 
                              />
                              {selectedImage === image && (
                                <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-0.5">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

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
                    <h3 className="text-lg font-medium mb-4">Diğer Bilgiler</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İndirim/Promosyon Bilgisi</FormLabel>
                            <FormControl>
                              <Input placeholder="Örn: %15 indirim, İlk ziyarette %20 indirim" {...field} />
                            </FormControl>
                            <FormDescription>
                              Salon için geçerli indirim veya promosyonlar
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="specialFeatures"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Özel Özellikler</FormLabel>
                            <FormControl>
                              <Input placeholder="Örn: Ücretsiz park, Wi-Fi, Çocuk oyun alanı" {...field} />
                            </FormControl>
                            <FormDescription>
                              Salonunuzu öne çıkaracak özel özellikler
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="isPremium"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Premium Salon</FormLabel>
                              <FormDescription>
                                Salon listelerde ön sıralarda gösterilir ve özel etiketler alır
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Salon Durumu</FormLabel>
                              <FormDescription>
                                Salon aktif olduğunda rezervasyona açıktır
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
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start mt-6">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-700">Salon Oluşturma İşlemi</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          Salon oluşturulduktan sonra, salon sahiplerinin hesap erişimlerini ayarlamak, hizmetleri tanımlamak ve takvim ayarlarını yapmak için ek adımlar gerekecektir.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("media")}
                      >
                        Geri: Medya
                      </Button>
                      
                      <div className="space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => navigate("/admin")}
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