import { useState, MouseEvent, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n";

interface Step {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonAction: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
  showGenderButtons?: boolean;
}

interface OnboardingProps {
  onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  console.log("Onboarding component rendered");
  const [step, setStep] = useState(0);
  const [_, navigate] = useLocation();
  const { t } = useI18n();
  
  // Bileşen her yüklendiğinde konsola bir log yazdıralım
  useEffect(() => {
    console.log("Onboarding flow başlatıldı, adım:", step);
  }, [step]);

  const steps: (Step & { showGenderButtons?: boolean })[] = [
    // Welcome step
    {
      title: "Nail Art Match'e Hoş Geldin!",
      description: "En iyi stüdyoları keşfet, yorumları oku ve telefon görüşmesine gerek kalmadan kolayca randevu al.",
      image: "/images/onboarding/welcome.svg",
      buttonText: "Başla",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(1)
    },
    // Location step
    {
      title: "Yakındakileri Keşfet",
      description: "Sana en uygun stüdyoları bulabilmemiz için konum servislerini aç.",
      image: "/images/onboarding/location.svg",
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(2)
    },
    // Notifications step
    {
      title: "Randevularını Kaçırma",
      description: "Hatırlatmalar ve önemli güncellemeler için bildirimlere izin ver.",
      image: "/images/onboarding/notifications.svg",
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(3)
    },
    // Preferences step
    {
      title: "Senin İçin Doğru Hizmetleri Keşfet",
      description: "Sana özel hizmetleri gösterelim...",
      image: "/images/onboarding/preferences.svg",
      buttonText: "Atla",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => {
        if (onComplete) {
          onComplete();
        } else {
          localStorage.setItem('firstVisit', 'false');
          navigate("/");
        }
      },
      showGenderButtons: true
    }
  ];

  const handleGenderSelection = (gender: string) => {
    // Seçilen cinsiyeti ve onboarding tamamlama durumunu saklayalım
    localStorage.setItem("preferredGender", gender);
    
    if (onComplete) {
      onComplete(); // App.tsx'deki completeOnboarding işlevini çağır
    } else {
      localStorage.setItem("firstVisit", "false");
      navigate("/");
    }
  };

  // Swiping animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentStep = steps[step];
  const direction = 1;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Progress indicators */}
      <div className="px-4 pt-10 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 w-10 rounded-full ${index === step ? "bg-[#30AAB9]" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-6"
        >
          {/* Image */}
          <div className="w-full max-w-xs mb-8">
            <img src={currentStep.image} alt={currentStep.title} className="w-full h-auto" />
          </div>

          {/* Text */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{currentStep.title}</h1>
          <p className="text-gray-600 max-w-xs mb-6">{currentStep.description}</p>
          
          {/* Buttons */}
          {currentStep.showGenderButtons ? (
            <div className="w-full max-w-xs space-y-3">
              <button 
                onClick={() => handleGenderSelection("women")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4 transition"
              >
                Kadınlar için
              </button>
              <button 
                onClick={() => handleGenderSelection("men")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4 transition"
              >
                Erkekler için
              </button>
              <button 
                onClick={currentStep.buttonAction}
                className="w-full border border-[#30AAB9] text-[#30AAB9] hover:bg-gray-50 font-medium rounded-md py-3 px-4 transition mt-2"
              >
                {currentStep.buttonText}
              </button>
            </div>
          ) : (
            <button 
              onClick={currentStep.buttonAction}
              className="w-full max-w-xs bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4 transition"
            >
              {currentStep.buttonText}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom indicator */}
      <div className="w-full flex justify-center pb-8 pt-4">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}