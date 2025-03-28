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
  const refreshKey = Date.now();
  
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
