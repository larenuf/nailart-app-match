// Basitleştirilmiş CreateSalon bileşeni
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateSalon() {

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