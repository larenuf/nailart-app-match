import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  CalendarClock, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Clock,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, subMonths } from "date-fns";
import { tr } from "date-fns/locale";

type SalonAnalyticsProps = {
  salon: any;
};

// Renk paletleri
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const RADIAN = Math.PI / 180;

// Özel pasta grafiği etiketi
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SalonAnalytics({ salon }: SalonAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("bar");
  
  // Tarih aralığını hesapla
  const getDateRange = () => {
    const today = new Date();
    
    if (timeRange === "week") {
      const startDate = startOfWeek(today, { locale: tr });
      const endDate = endOfWeek(today, { locale: tr });
      return { startDate, endDate };
    } else if (timeRange === "month") {
      const startDate = subDays(today, 30);
      return { startDate, endDate: today };
    } else {
      const startDate = subMonths(today, 3);
      return { startDate, endDate: today };
    }
  };

  // Randevu analizi verilerini getir
  const { data: bookingStats, isLoading: bookingStatsLoading } = useQuery({
    queryKey: ["/api/analytics/bookings", salon?.id, timeRange],
    queryFn: async () => {
      if (!salon?.id) return null;
      const { startDate, endDate } = getDateRange();
      const response = await fetch(`/api/analytics/bookings?salonId=${salon.id}&startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error("Randevu istatistikleri yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salon?.id
  });

  // En popüler hizmetleri getir
  const { data: popularServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/analytics/popular-services", salon?.id],
    queryFn: async () => {
      if (!salon?.id) return null;
      const response = await fetch(`/api/analytics/popular-services?salonId=${salon.id}`);
      if (!response.ok) throw new Error("Popüler hizmetler yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salon?.id
  });

  // Değerlendirme analizlerini getir
  const { data: reviewStats, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/analytics/reviews", salon?.id],
    queryFn: async () => {
      if (!salon?.id) return null;
      const response = await fetch(`/api/analytics/reviews?salonId=${salon.id}`);
      if (!response.ok) throw new Error("Değerlendirme istatistikleri yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salon?.id
  });

  // Demo verileri
  const getBookingDemoData = () => {
    const { startDate, endDate } = getDateRange();
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dates.map(date => {
      const weekday = format(date, 'EEE', { locale: tr });
      const fullDate = format(date, 'dd/MM');
      const bookings = Math.floor(Math.random() * 10);
      const revenue = bookings * (Math.floor(Math.random() * 200) + 100);
      
      return {
        date: fullDate,
        weekday,
        bookings,
        revenue,
        completed: Math.floor(bookings * 0.8),
        cancelled: Math.floor(bookings * 0.2),
      };
    });
  };

  const getPopularServicesDemoData = () => {
    return [
      { name: "Jel Tırnak", value: 40 },
      { name: "Manikür", value: 25 },
      { name: "Pedikür", value: 15 },
      { name: "Kalıcı Oje", value: 12 },
      { name: "Protez Tırnak", value: 8 },
    ];
  };

  const getReviewStatsDemoData = () => {
    return {
      averageRating: 4.3,
      totalReviews: 125,
      ratingDistribution: [
        { rating: 5, count: 60 },
        { rating: 4, count: 40 },
        { rating: 3, count: 15 },
        { rating: 2, count: 7 },
        { rating: 1, count: 3 },
      ],
      recentTrend: [
        { date: "Ocak", rating: 4.1 },
        { date: "Şubat", rating: 4.2 },
        { date: "Mart", rating: 4.3 },
        { date: "Nisan", rating: 4.4 },
        { date: "Mayıs", rating: 4.5 },
      ]
    };
  };

  // Demo verileri veya API'den gelen verileri kullan
  const bookingData = bookingStats || getBookingDemoData();
  const servicesData = popularServices || getPopularServicesDemoData();
  const reviewsData = reviewStats || getReviewStatsDemoData();

  // Kart bilgileri
  const getOverviewStats = () => {
    // Demo verilerden hesaplama
    const totalBookings = bookingData.reduce((sum: number, item: any) => sum + item.bookings, 0);
    const totalRevenue = bookingData.reduce((sum: number, item: any) => sum + item.revenue, 0);
    const completionRate = bookingData.reduce((sum: number, item: any) => sum + item.completed, 0) / totalBookings * 100;
    
    return [
      {
        title: "Toplam Randevu",
        value: totalBookings,
        icon: <CalendarClock className="h-4 w-4" />,
        change: "+12%",
        positive: true,
      },
      {
        title: "Tahmini Gelir",
        value: `${totalRevenue.toLocaleString()} ₺`,
        icon: <DollarSign className="h-4 w-4" />,
        change: "+8%",
        positive: true,
      },
      {
        title: "Tamamlanma Oranı",
        value: `${completionRate.toFixed(1)}%`,
        icon: <TrendingUp className="h-4 w-4" />,
        change: "+3%",
        positive: true,
      },
      {
        title: "Ortalama Değerlendirme",
        value: reviewsData.averageRating.toFixed(1),
        icon: <Star className="h-4 w-4" />,
        change: "Sabit",
        positive: null,
      },
    ];
  };

  // İndir düğmesine tıklama işlemi
  const handleDownload = () => {
    console.log("Raporlar indiriliyor...");
    // Gerçek bir uygulamada burada bir CSV veya PDF raporu oluşturulur
  };

  return (
    <div className="space-y-6">
      {/* Üst Genel Bakış Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getOverviewStats().map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index % 4 === 0 ? 'bg-blue-100' : 
                  index % 4 === 1 ? 'bg-green-100' : 
                  index % 4 === 2 ? 'bg-purple-100' : 
                  'bg-orange-100'
                }`}>
                  {stat.icon}
                </div>
              </div>
              {stat.change && (
                <div className="mt-2">
                  <span className={`text-xs ${
                    stat.positive === true ? 'text-green-600' : 
                    stat.positive === false ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change} {timeRange === "week" ? "geçen haftaya göre" : timeRange === "month" ? "geçen aya göre" : "önceki döneme göre"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ana Grafikler */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Randevu Analizi</CardTitle>
            <CardDescription>
              Zaman içinde randevu sayıları ve gelir değişimi
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Zaman Aralığı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Haftalık</SelectItem>
                <SelectItem value="month">Aylık</SelectItem>
                <SelectItem value="quarter">3 Aylık</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grafik Türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar" className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span>Sütun</span>
                </SelectItem>
                <SelectItem value="line" className="flex items-center">
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  <span>Çizgi</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={bookingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={timeRange === "week" ? "weekday" : "date"} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" name="Randevu Sayısı" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="completed" name="Tamamlanan" fill="#82ca9d" />
                <Bar yAxisId="left" dataKey="cancelled" name="İptal Edilen" fill="#ff8042" />
                <Bar yAxisId="right" dataKey="revenue" name="Gelir (₺)" fill="#ffc658" />
              </BarChart>
            ) : (
              <LineChart
                data={bookingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={timeRange === "week" ? "weekday" : "date"} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="bookings" name="Randevu Sayısı" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="completed" name="Tamamlanan" stroke="#82ca9d" />
                <Line yAxisId="left" type="monotone" dataKey="cancelled" name="İptal Edilen" stroke="#ff8042" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Gelir (₺)" stroke="#ffc658" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </CardFooter>
      </Card>

      {/* Alt Sıra Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* En Popüler Hizmetler Pastası */}
        <Card>
          <CardHeader>
            <CardTitle>En Popüler Hizmetler</CardTitle>
            <CardDescription>
              En çok randevu alınan hizmetlerin dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {servicesData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Değerlendirme İstatistikleri */}
        <Card>
          <CardHeader>
            <CardTitle>Değerlendirme Analizi</CardTitle>
            <CardDescription>
              Müşteri değerlendirmeleri ve memnuniyet analizi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="text-3xl font-bold">{reviewsData.averageRating.toFixed(1)}</div>
                  <div className="flex items-center ml-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(reviewsData.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{reviewsData.totalReviews} değerlendirme</div>
              </div>
              <div className="flex-1">
                {reviewsData.ratingDistribution.map((item: any) => (
                  <div key={item.rating} className="flex items-center text-sm mb-1">
                    <div className="w-8 text-right mr-2">{item.rating}★</div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full rounded-full" 
                        style={{ width: `${(item.count / reviewsData.totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-right ml-2 text-gray-500">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-40 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reviewsData.recentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[3, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" name="Ortalama Puan" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diğer İstatistikler */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Metrikleri</CardTitle>
          <CardDescription>
            Çeşitli salon performans metrikleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="time">
            <TabsList className="mb-4">
              <TabsTrigger value="time">
                <Clock className="h-4 w-4 mr-2" />
                Zaman Metrikleri
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Users className="h-4 w-4 mr-2" />
                Müşteri Metrikleri
              </TabsTrigger>
            </TabsList>
            <TabsContent value="time">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Ortalama Randevu Süresi</div>
                  <div className="text-2xl font-bold mt-1">45 dk</div>
                  <div className="text-sm text-green-600 mt-1">%5 daha hızlı</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Randevu Doluluğu</div>
                  <div className="text-2xl font-bold mt-1">%78</div>
                  <div className="text-sm text-green-600 mt-1">%12 daha yüksek</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">En Yoğun Saat</div>
                  <div className="text-2xl font-bold mt-1">15:00-17:00</div>
                  <div className="text-sm text-gray-500 mt-1">%90 doluluk</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="customers">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Tekrar Eden Müşteriler</div>
                  <div className="text-2xl font-bold mt-1">%64</div>
                  <div className="text-sm text-green-600 mt-1">%8 artış</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Ortalama Harcama</div>
                  <div className="text-2xl font-bold mt-1">185 ₺</div>
                  <div className="text-sm text-green-600 mt-1">%15 artış</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Yeni Müşteriler</div>
                  <div className="text-2xl font-bold mt-1">32</div>
                  <div className="text-sm text-gray-500 mt-1">Bu ay</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}