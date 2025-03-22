import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/AppContext";
import NotFound from "@/pages/not-found";
import HomeView from "@/components/HomeView";
import SalonDetail from "@/pages/SalonDetail";
import ArtistDetail from "@/pages/ArtistDetail";
import Booking from "@/pages/Booking";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomeView />
      </Route>
      <Route path="/salons/:id" component={SalonDetail} />
      <Route path="/artists/:id" component={ArtistDetail} />
      <Route path="/booking/:id" component={Booking} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/profile" component={Profile} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
