import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SalonDetail from "@/pages/SalonDetail";
import ArtistDetail from "@/pages/ArtistDetail";
import Booking from "@/pages/Booking";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/salons/:id" component={SalonDetail} />
      <Route path="/artists/:id" component={ArtistDetail} />
      <Route path="/booking/:id" component={Booking} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
