import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomeView />
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AppProvider>
            <Router />
            <AiChat />
            <Toaster />
          </AppProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
