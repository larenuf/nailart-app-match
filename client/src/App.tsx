import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { I18nProvider } from "./i18n";
import NotFound from "@/pages/not-found";
import HomeView from "@/components/HomeView";
import SalonDetail from "@/pages/SalonDetail";
import ArtistDetail from "@/pages/ArtistDetail";
import SalonList from "@/pages/SalonList";
import Booking from "@/pages/Booking";
import BookingWizard from "@/pages/BookingWizard";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import NailArtPreview from "@/pages/NailArtPreview";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import VirtualConsultation from "@/pages/VirtualConsultation";
import ColorMatcher from "@/pages/ColorMatcher";
import Bookings from "@/pages/Bookings";
import Test from "@/pages/Test";
import ComponentTestPage from "@/pages/ComponentTestPage";
// Trending Designs sayfası tamamen kaldırıldı
import Dashboard from "@/pages/admin/Dashboard";
import CreateSalon from "@/pages/admin/CreateSalonNew";
import AiChat from "@/components/AiChat";
import Onboarding from "@/pages/Onboarding";
import { PageTransition } from "@/components/PageTransition";
import { ThemeSelector } from "@/components/ThemeSelector";
import { navigationHistory } from "./lib/navigationHistory";

function Router() {
  // Geçerli konum
  const [location] = useLocation();
  
  // İlk ziyareti kontrol et, localStorage'da saklayalım
  // Oturum kontrolü için useState hook kullanıyoruz
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    try {
      // Lokasyon /auth ise ve local storage'da firstVisit değerini true olarak ayarla
      const path = window.location.pathname;
      if (path === "/auth") {
        localStorage.removeItem('firstVisit');
        return true;
      }
      
      // Önbellek sorunlarını gidermek için anasayfada query cache'i temizleyelim
      if (path === "/" || path === "/home") {
        // Mevcut URL'yi al ve önbelleği geçersiz kılmak için zaman damgası ekle
        window.history.replaceState(
          null, 
          document.title, 
          window.location.pathname + "?t=" + Date.now()
        );
        
        // React Query önbelleğini temizle
        queryClient.clear();
        queryClient.invalidateQueries();
      }
      
      // localStorage içinde firstVisit değerini kontrol et
      const visited = localStorage.getItem('firstVisit');
      console.log("İlk ziyaret durumu:", visited);
      
      // Eğer değer yoksa veya boşsa, ilk ziyaret olarak kabul et
      return visited === null || visited !== 'false';
    } catch (e) {
      console.error("localStorage erişim hatası:", e);
      return true; // Hata durumunda ilk ziyaret olarak kabul et
    }
  });
  
  // Ana sayfaya ilk girişte çalışacak handler
  const completeOnboarding = () => {
    localStorage.setItem('firstVisit', 'false');
    setIsFirstVisit(false);
  };
  
  // Her yol değişikliğinde gezinme geçmişini güncelle
  useEffect(() => {
    // URL sorgu parametrelerini temizleme (cache busting parametreleri gibi)
    const cleanPath = location.split('?')[0];
    console.log('Sayfa değişti, gezinme geçmişine ekleniyor:', cleanPath);
    navigationHistory.push(cleanPath);
  }, [location]);
  
  // PWA için meta tagları ayarla
  useEffect(() => {
    // Set up PWA meta tags dynamically
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.content = '#f472b6'; // Default theme color (pink)
      document.head.appendChild(themeColorMeta);
    }
    
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const appleMeta = document.createElement('meta');
      appleMeta.name = 'apple-mobile-web-app-capable';
      appleMeta.content = 'yes';
      document.head.appendChild(appleMeta);
    }
  }, []);
  
  // Her rota için uygun geçiş tipini belirle
  const getTransitionTypeForRoute = (path: string): any => {
    // Ana sayfa için elastic geçiş
    if (path === '/' || path === '/home') {
      return {
        type: 'elastic',
        duration: 0.5
      };
    }
    
    // Onboarding için fade 
    if (path === '/auth' || path === '/onboarding') {
      return {
        type: 'fade',
        duration: 0.4
      };
    }
    
    // Salon listeleri için staggered geçiş
    if (path === '/salons') {
      return {
        type: 'staggered',
        duration: 0.4,
        delayChildren: 0.05,
        staggerChildren: 0.03
      };
    }
    
    // Salon detayları için slide-left
    if (path.startsWith('/salons/')) {
      return {
        type: 'slide-left',
        duration: 0.4
      };
    }
    
    // Sanatçı detayları için slide-up
    if (path.startsWith('/artists/')) {
      return {
        type: 'slide-up',
        duration: 0.4
      };
    }
    
    // Randevu sayfaları için bounce
    if (path.startsWith('/booking') || path === '/bookings' || path === '/checkout' || path === '/payment-success') {
      return {
        type: 'bounce',
        duration: 0.5
      };
    }
    
    // Özel sayfalar için özel geçişler
    if (path === '/nail-art-preview') {
      return {
        type: 'scale',
        duration: 0.5
      };
    }
    
    // Admin sayfaları için hızlı slide-down
    if (path.startsWith('/admin')) {
      return {
        type: 'slide-down',
        duration: 0.3
      };
    }
    
    // Diğer tüm sayfalar için standart fade geçişi
    return {
      type: 'fade',
      duration: 0.3
    };
  };
  
  // Mevcut konum için geçiş türünü al
  const transitionProps = getTransitionTypeForRoute(location);
  
  return (
    <Switch>
      <Route path="/auth">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Onboarding onComplete={completeOnboarding} />
        </PageTransition>
      </Route>
      <Route path="/onboarding">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Onboarding onComplete={completeOnboarding} />
        </PageTransition>
      </Route>
      <Route path="/home">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <HomeView />
        </PageTransition>
      </Route>
      <Route path="/">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          {isFirstVisit ? 
            <Onboarding onComplete={completeOnboarding} /> : 
            <HomeView />
          }
        </PageTransition>
      </Route>
      <Route path="/salons">
        <PageTransition 
          type={transitionProps.type} 
          duration={transitionProps.duration}
          delayChildren={transitionProps.delayChildren}
          staggerChildren={transitionProps.staggerChildren}
        >
          <SalonList />
        </PageTransition>
      </Route>
      <Route path="/salons/:id">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <SalonDetail />
        </PageTransition>
      </Route>
      <Route path="/artists/:id">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <ArtistDetail />
        </PageTransition>
      </Route>
      <Route path="/booking/:id">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Booking />
        </PageTransition>
      </Route>
      <Route path="/booking-wizard/:id">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <BookingWizard />
        </PageTransition>
      </Route>
      <Route path="/checkout">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Checkout />
        </PageTransition>
      </Route>
      <Route path="/payment-success">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <PaymentSuccess />
        </PageTransition>
      </Route>
      <Route path="/profile">
        <PageTransition type="slide-left" duration={0.4}>
          <Profile />
        </PageTransition>
      </Route>
      <Route path="/search">
        <PageTransition type="slide-down" duration={0.3}>
          <Search />
        </PageTransition>
      </Route>
      <Route path="/virtual-consultation">
        <PageTransition type="scale" duration={0.4}>
          <VirtualConsultation />
        </PageTransition>
      </Route>
      <Route path="/color-matcher">
        <PageTransition type="fade" duration={0.4}>
          <ColorMatcher />
        </PageTransition>
      </Route>
      <Route path="/nail-art-preview">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <NailArtPreview />
        </PageTransition>
      </Route>
      <Route path="/bookings">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Bookings />
        </PageTransition>
      </Route>
      <Route path="/test">
        <PageTransition type="wave" duration={0.4} delayChildren={0.05} staggerChildren={0.05}>
          <Test />
        </PageTransition>
      </Route>
      <Route path="/component-test">
        <PageTransition type="fade" duration={0.4}>
          <ComponentTestPage />
        </PageTransition>
      </Route>
      {/* Trend Tasarımlar sayfası tamamen kaldırıldı */}
      
      {/* Salon Yönetim Sayfaları - Tam eşleşme kullan */}
      <Route path="/admin">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Dashboard />
        </PageTransition>
      </Route>
      <Route path="/admin/dashboard">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <Dashboard />
        </PageTransition>
      </Route>
      <Route path="/admin/create-salon">
        <PageTransition type={transitionProps.type} duration={transitionProps.duration}>
          <CreateSalon />
        </PageTransition>
      </Route>
      
      <Route>
        <PageTransition type="fade" duration={0.3}>
          <NotFound />
        </PageTransition>
      </Route>
    </Switch>
  );
}

function App() {
  // Theme değişikliği için handler
  const handleThemeChange = (themeColor: string) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const themeColors: Record<string, string> = {
        pink: '#f472b6',
        purple: '#a855f7',
        blue: '#3b82f6',
        teal: '#14b8a6',
        amber: '#f59e0b',
        rose: '#e11d48',
      };
      meta.setAttribute('content', themeColors[themeColor] || '#f472b6');
    }
  };

  // Force a refresh timestamp to avoid caching issues
  // Caching sorunlarını düzeltmek için yeni bir refresh key oluşturalım
  const refreshKey = Date.now() + Math.random();
  
  // Replit Webview'da önbellek sorunlarını çözmek için useEffect hook kullanıyoruz
  useEffect(() => {
    // Bu sadece Replit webview'da çalışacak
    const isReplitWebview = window.location.host.includes('replit.dev');
    
    if (isReplitWebview) {
      console.log('Replit Webview algılandı, önbellek yenileniyor...');
      
      // Service worker'ı devre dışı bırakarak önbellek sorunlarını önleyelim
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for (let registration of registrations) {
            registration.unregister();
            console.log('Service worker kaydı silindi');
          }
        });
      }
      
      // Tüm kaynakları yeniden yüklemek için sayfayı yenilemek için bir buton oluşturalım
      const refreshButton = document.createElement('button');
      refreshButton.innerHTML = '🔄 Önbelleği Temizle';
      refreshButton.style.position = 'fixed';
      refreshButton.style.bottom = '70px';
      refreshButton.style.right = '10px';
      refreshButton.style.zIndex = '9999';
      refreshButton.style.backgroundColor = '#f472b6';
      refreshButton.style.color = 'white';
      refreshButton.style.padding = '8px 12px';
      refreshButton.style.borderRadius = '20px';
      refreshButton.style.border = 'none';
      refreshButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      refreshButton.style.cursor = 'pointer';
      
      refreshButton.onclick = () => {
        // Mevcut URL'yi al ve önbelleği geçersiz kılmak için zaman damgası ekle
        window.location.href = window.location.pathname + "?t=" + Date.now();
      };
      
      // Sayfaya butonu ekle
      setTimeout(() => {
        document.body.appendChild(refreshButton);
      }, 1000);
    }
  }, []);
  
  // React Router içinde değişiklik yapmadan basit bir TestApp bileşeni hazırlayalım
  const TestApp = () => {
    const refreshKey = Date.now() + Math.random();
    
    return (
      <div className="min-h-screen bg-white text-black p-6">
        <h1 className="text-2xl font-bold mb-4 text-pink-500">Nail Art Match</h1>
        <p className="mb-4">Geliştirilmiş Hata Ayıklama Modu</p>
        
        <div className="p-4 border border-gray-300 rounded mb-4">
          <h2 className="text-lg font-bold mb-2">Diagnostik Bilgileri</h2>
          <div>Sayfa Yüklenme Zamanı: {new Date().toLocaleTimeString()}</div>
          <div>Refresh Key: {refreshKey.toString().substring(0, 8)}</div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Test Sayfaları</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <a href="/debug" className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Tanı Sayfası</a>
              <a href="/simplified-app" className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Basitleştirilmiş Uygulama</a>
              <a href="/minimal-react-test" className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Minimal React Test</a>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Uygulama Rotaları</h3>
            <div className="flex flex-wrap gap-2">
              <a href="/" className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Anasayfa</a>
              <a href="/salons" className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Salonlar</a>
              <a href="/test" className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Test Sayfası</a>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Uygulama Durumu</h3>
          <p className="text-sm mb-2">Şu anda uygulama geliştirilmiş hata ayıklama modunda çalışıyor. Tam React uygulamasını çalıştırmaya çalışırken hatalar oluştuğu için bu basitleştirilmiş sürüme geçildi.</p>
        </div>
        
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
          onClick={() => window.location.reload()}
        >
          Sayfayı Yenile
        </button>
      </div>
    );
  };

  // Uygulamayı doğrudan çalıştır, hata ayıklama kodunu atla
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AppProvider>
            <Router />
            <Toaster />
          </AppProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
  
  // Hata yakalama kodunu tamamen kaldırdık
}

export default App;
