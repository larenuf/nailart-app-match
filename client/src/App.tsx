import { Switch, Route } from "wouter";
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
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import VirtualConsultation from "@/pages/VirtualConsultation";
import ColorMatcher from "@/pages/ColorMatcher";
// Trending Designs sayfası tamamen kaldırıldı
import Dashboard from "@/pages/admin/Dashboard";
import CreateSalon from "@/pages/admin/CreateSalonNew";
import AiChat from "@/components/AiChat";
import Onboarding from "@/pages/Onboarding";
import { PageTransition } from "@/components/PageTransition";
import { ThemeSelector } from "@/components/ThemeSelector";

function Router() {
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
  
  return (
    <PageTransition>
      <Switch>
        <Route path="/auth">
          <Onboarding onComplete={completeOnboarding} />
        </Route>
        <Route path="/onboarding">
          <Onboarding onComplete={completeOnboarding} />
        </Route>
        <Route path="/home">
          <HomeView />
        </Route>
        <Route path="/">
          {isFirstVisit ? 
            <Onboarding onComplete={completeOnboarding} /> : 
            <HomeView />
          }
        </Route>
        <Route path="/salons" component={SalonList} />
        <Route path="/salons/:id" component={SalonDetail} />
        <Route path="/artists/:id" component={ArtistDetail} />
        <Route path="/booking/:id" component={Booking} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/profile" component={Profile} />
        <Route path="/search" component={Search} />
        <Route path="/virtual-consultation" component={VirtualConsultation} />
        <Route path="/color-matcher" component={ColorMatcher} />
        {/* Trend Tasarımlar sayfası tamamen kaldırıldı */}
        
        {/* Salon Yönetim Sayfaları - Tam eşleşme kullan */}
        <Route path="/admin" children={<Dashboard />} />
        <Route path="/admin/dashboard" children={<Dashboard />} />
        <Route path="/admin/create-salon" children={<CreateSalon />} />
        
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
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
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AppProvider>
            <Router key={refreshKey} />
            <AiChat />
            
            {/* Tema seçici */}
            <ThemeSelector onThemeChange={handleThemeChange} />
            
            <Toaster />
          </AppProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
