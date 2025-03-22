import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

export default function PaymentSuccess() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { setShowConfirmation } = useAppContext();

  useEffect(() => {
    // Show success message
    toast({
      title: 'Ödeme Başarılı',
      description: 'Ödeme işleminiz başarıyla tamamlandı ve rezervasyonunuz onaylandı.',
    });

    // Show booking confirmation modal
    setShowConfirmation(true);
    
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      setLocation('/');
    }, 500);

    return () => clearTimeout(timer);
  }, [toast, setLocation, setShowConfirmation]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D6C3E5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-2xl text-[#D6C3E5]"></i>
        </div>
        <h1 className="text-xl font-bold mb-2">Ödeme Başarılı</h1>
        <p className="text-gray-600">Rezervasyon sayfasına yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}