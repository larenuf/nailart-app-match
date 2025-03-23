import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Settings, Users, ShoppingBag, BarChart2, Tag, Store } from "lucide-react";
import SalonDetailsForm from "@/components/admin/SalonDetailsForm";
import ArtistManagement from "@/components/admin/ArtistManagement";
import ServiceManagement from "@/components/admin/ServiceManagement";
import AppointmentManagement from "@/components/admin/AppointmentManagement";
import PromotionManagement from "@/components/admin/PromotionManagement";
import SalonAnalytics from "@/components/admin/SalonAnalytics";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [_, navigate] = useLocation();

  // Salon sahibinin salonunu getir
  const { data: salon, isLoading, error } = useQuery({
    queryKey: ["/api/my-salon"],
  });

  // Oturum kontrolü
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Oturum yoksa giriş sayfasına yönlendir
  if (!isLoading && !user) {
    navigate("/auth");
    return null;
  }

  // Kullanıcı salon sahibi değilse ana sayfaya yönlendir
  if (user && user.role !== "salon_owner" && user.role !== "admin") {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Hata</CardTitle>
            <CardDescription>
              Salon bilgileriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Eğer salon bilgilerinizi kaydetmediyseniz, öncelikle salon bilgilerinizi oluşturmanız gerekmektedir.
            </p>
            <button 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/admin/create-salon")}
            >
              Salon Oluştur
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Salon Yönetim Paneli</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {salon ? salon.name : "Yeni Salon"} - Salon bilgilerinizi, çalışanlarınızı ve hizmetlerinizi yönetin
        </p>
      </header>

      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-7 w-full mb-4">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Genel Bakış</span>
          </TabsTrigger>
          <TabsTrigger value="salon" className="flex items-center">
            <Store className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Salon</span>
          </TabsTrigger>
          <TabsTrigger value="artists" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Artistler</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Hizmetler</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Randevular</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Promosyonlar</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ayarlar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SalonAnalytics salon={salon} />
        </TabsContent>

        <TabsContent value="salon">
          <SalonDetailsForm salon={salon} />
        </TabsContent>

        <TabsContent value="artists">
          <ArtistManagement salonId={salon?.id} />
        </TabsContent>

        <TabsContent value="services">
          <ServiceManagement salonId={salon?.id} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentManagement salonId={salon?.id} />
        </TabsContent>

        <TabsContent value="promotions">
          <PromotionManagement salonId={salon?.id} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Salon Ayarları</CardTitle>
              <CardDescription>
                Salon hesap ayarlarınızı düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Yakında...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}