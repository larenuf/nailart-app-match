import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SalonsList from "@/components/admin/SalonsList";
import StoryManagement from "@/components/admin/StoryManagement";
import CommentManagement from "@/components/admin/CommentManagement";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart2, 
  Users, 
  ShoppingBag, 
  CalendarDays, 
  MessageSquare, 
  Bell, 
  Settings, 
  Home,
  Store,
  Star,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
  Building2,
  Search
} from "lucide-react";

// Admin istatistikleri için tip tanımı
interface AdminStats {
  totalSalons: number;
  activeSalons: number;
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  totalReviews: number;
  unreviewedComments: number;
  averageRating: string | number;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    user: string;
    time: string;
  }>;
  topSalons: Array<{
    id: number;
    name: string;
    rating: number;
    bookings: number;
  }>;
  popularCategories: Array<{
    id: number;
    name: string;
    count: number;
  }>;
}

// Gelişmiş admin paneli bileşeni
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [_, navigate] = useLocation();

  // Platformu yönetmek için API istatistiklerini getir
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"]
  });

  // API hatası varsa logla
  useEffect(() => {
    if (error) {
      console.error("İstatistikler yüklenirken hata oluştu:", error);
    }
  }, [error]);

  // API henüz sonuç döndürmediyse veya hata olduysa demo verisi kullan
  const demoStats = {
    totalSalons: 24,
    activeSalons: 22,
    totalUsers: 1458,
    totalAppointments: 3782,
    pendingAppointments: 47,
    todayAppointments: 62,
    totalReviews: 1240,
    unreviewedComments: 14,
    averageRating: 4.7,
    recentActivity: [
      { id: 1, type: "appointment", message: "Yeni randevu oluşturuldu", user: "Ayşe K.", time: "10 dk önce" },
      { id: 2, type: "review", message: "Yeni yorum eklendi (5 yıldız)", user: "Mehmet S.", time: "32 dk önce" },
      { id: 3, type: "user", message: "Yeni kullanıcı kaydoldu", user: "Zeynep A.", time: "1 saat önce" },
      { id: 4, type: "salon", message: "Yeni salon kaydı", user: "Bella Nails", time: "3 saat önce" }
    ],
    topSalons: [
      { id: 1, name: "NAM Nail Studio", rating: 4.9, bookings: 427 },
      { id: 2, name: "Elite Nails", rating: 4.8, bookings: 356 },
      { id: 3, name: "Posh Nail Bar", rating: 4.7, bookings: 289 }
    ],
    popularCategories: [
      { id: 1, name: "Manikür", count: 1245 },
      { id: 2, name: "Pedikür", count: 832 },
      { id: 3, name: "Protez Tırnak", count: 678 }
    ]
  };

  // Gerçek veriler gelene kadar demo verilerini kullan
  const displayStats = stats || demoStats;

  // Yan menü seçenekleri
  const sidebarOptions = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "salons", name: "Salon Yönetimi", icon: Store },
    { id: "users", name: "Kullanıcı Yönetimi", icon: Users },
    { id: "appointments", name: "Randevu Yönetimi", icon: CalendarDays },
    { id: "reviews", name: "Yorum Yönetimi", icon: MessageSquare },
    { id: "notifications", name: "Bildirimler", icon: Bell },
    { id: "analytics", name: "Analitik", icon: BarChart2 },
    { id: "settings", name: "Ayarlar", icon: Settings }
  ];

  // İçerik bölümünün render edilmesi
  const renderContent = () => {
    if (activeSection === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Özet Metrikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Salon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{displayStats.totalSalons}</div>
                  <Badge variant="outline" className="ml-2">
                    <span className="text-green-600">+2</span> bu ay
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {displayStats.activeSalons} aktif salon
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Kullanıcı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{displayStats.totalUsers}</div>
                  <Badge variant="outline" className="ml-2">
                    <span className="text-green-600">+125</span> bu ay
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ortalama günlük artış: 12 kullanıcı
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Randevu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{displayStats.totalAppointments}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-orange-500">Bugün: {displayStats.todayAppointments}</span> | Bekleyen: {displayStats.pendingAppointments}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ortalama Değerlendirme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{displayStats.averageRating}</div>
                  <div className="ml-2 text-yellow-500 flex">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Toplam {displayStats.totalReviews} yorum | İncelenmemiş: {displayStats.unreviewedComments}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Son Aktiviteler ve Top Salonlar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>Platform üzerindeki son hareketler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activity.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'user' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'appointment' && <CalendarDays className="h-4 w-4" />}
                        {activity.type === 'review' && <MessageSquare className="h-4 w-4" />}
                        {activity.type === 'user' && <UserPlus className="h-4 w-4" />}
                        {activity.type === 'salon' && <Building2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.message}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Tüm Aktiviteleri Görüntüle
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>En İyi Salonlar</CardTitle>
                <CardDescription>Rezervasyon ve derecelendirmeye göre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayStats.topSalons.map((salon) => (
                    <div key={salon.id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <Store className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{salon.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span>{salon.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{salon.bookings} randevu</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveSection("salons")}>
                  Tüm Salonları Görüntüle
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Bugünkü Randevular ve Popüler Kategoriler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Bugünkü Randevular</CardTitle>
                <CardDescription>Bugün gerçekleşecek randevular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-md hover:bg-slate-50">
                    <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                      <img 
                        src="https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=1453&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">Ayşe K.</h3>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">10:30</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Manikür - NAM Nail Studio</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Onaylandı</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-md hover:bg-slate-50">
                    <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">Zeynep A.</h3>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">14:00</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Pedikür - Posh Nail Bar</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Onaylandı</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-md hover:bg-slate-50">
                    <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">Elif M.</h3>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">16:45</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Protez Tırnak - Elite Nails</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Bekleniyor</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveSection("appointments")}>
                  Tüm Randevuları Görüntüle
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popüler Kategoriler</CardTitle>
                <CardDescription>En çok tercih edilen hizmetler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayStats.popularCategories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{category.name}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full" 
                            style={{ width: `${(category.count / (displayStats.popularCategories[0].count || 1)) * 100}%` }} 
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{category.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Tüm Kategorileri Görüntüle
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    } else if (activeSection === "salons") {
      return <SalonsList />;
    } else {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                {sidebarOptions.find(opt => opt.id === activeSection)?.name}
              </CardTitle>
              <CardDescription className="text-center">
                Bu bölüm geliştirme aşamasındadır
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Activity className="h-16 w-16 text-muted-foreground" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setActiveSection("dashboard")}>
                Dashboard'a Dön
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Yan Menü */}
      <div className="w-64 hidden md:block bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">NAM Admin</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Yönetim Paneli</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          {sidebarOptions.map((option) => (
            <button
              key={option.id}
              className={`w-full flex items-center p-2 rounded-md transition-colors ${
                activeSection === option.id 
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              onClick={() => setActiveSection(option.id)}
            >
              <option.icon className="h-5 w-5 mr-3" />
              <span>{option.name}</span>
              
              {/* Bildirim sayısı (örnek görsel için) */}
              {option.id === "reviews" && (
                <Badge variant="destructive" className="ml-auto">14</Badge>
              )}
              {option.id === "appointments" && (
                <Badge variant="secondary" className="ml-auto">47</Badge>
              )}
            </button>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="pt-2">
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2">Yardım merkezi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Yönetim paneli hakkında yardım ve belgelendirmeye hızlıca erişin
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              <Search className="h-3 w-3 mr-2" />
              Yardım Dökümanları
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Üst Bar */}
        <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 md:pl-6">
              <h1 className="text-xl font-semibold">
                {sidebarOptions.find(opt => opt.id === activeSection)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                Siteye Dön
              </Button>
            </div>
          </div>
        </header>
        
        {/* İçerik Alanı */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
        
        {/* Alt Bilgi */}
        <footer className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 p-4">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>NailArtMatch Admin Panel v1.0.0 &copy; 2025</p>
          </div>
        </footer>
      </div>
    </div>
  );
}