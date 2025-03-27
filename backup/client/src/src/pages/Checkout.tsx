import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import TopNavigation from '@/components/TopNavigation';
import BottomNavigation from '@/components/BottomNavigation';

// Load Stripe outside component rendering to avoid recreating Stripe object on each render
// Using a mock key for now
const stripePromise = loadStripe('pk_test_mock_key_for_development_only');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectedService, selectedArtist, setShowConfirmation } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);

    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return to booking confirmation when payment is complete
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: 'Ödeme Başarısız',
        description: error.message || 'Ödeme işlemi sırasında bir hata oluştu.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    } else {
      // Payment succeeded, show booking confirmation
      toast({
        title: 'Ödeme Başarılı',
        description: 'Rezervasyonunuz onaylandı.',
      });
      setShowConfirmation(true);
      setLocation('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#D6C3E5] text-white py-3 rounded-lg font-bold hover:bg-[#D6C3E5]/90 transition disabled:opacity-70"
      >
        {isProcessing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { selectedService } = useAppContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If no service is selected, redirect to home
    if (!selectedService) {
      setLocation('/');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: selectedService.price,
          serviceId: selectedService.id
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        // Use a mock client secret for development
        setClientSecret('mock_client_secret_for_development_only');
      }
    };

    createPaymentIntent();
  }, [selectedService, setLocation]);

  if (!clientSecret || !selectedService) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold font-playfair mb-6">Ödeme</h2>
        
        <div className="bg-[#F5F1EB] bg-opacity-30 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Hizmet:</p>
            <p className="font-medium">{selectedService.name}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Süre:</p>
            <p className="font-medium">{selectedService.durationMinutes} dakika</p>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <p className="text-gray-600">Toplam:</p>
            <p className="font-bold">${selectedService.price.toFixed(2)}</p>
          </div>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
      
      <BottomNavigation />
    </div>
  );
}