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

  // Gelişmiş animasyonlar
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -15 : 15
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15
    })
  };

  const currentStep = steps[step];
  const direction = 1;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white via-[#f8fdfe] to-white overflow-hidden relative">
      {/* Dekoratif arka plan desenleri */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#30AAB9] bg-opacity-5 -mr-32 -mt-32"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0], 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#30AAB9] bg-opacity-5 -ml-32 -mb-32"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 0], 
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-[#30AAB9] bg-opacity-10"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      {/* Progress indicators with animations */}
      <div className="px-4 pt-10 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <motion.div 
              key={index} 
              className={`h-1.5 w-12 rounded-full ${index === step ? "bg-[#30AAB9]" : "bg-gray-200"}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                backgroundColor: index === step ? "#30AAB9" : "#e5e7eb" 
              }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.3,
                backgroundColor: { duration: 0.3 }
              }}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>
      </div>

      {/* Content with card effect */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-6 relative z-10"
        >
          <motion.div 
            className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl" 
            style={{ width: '90%', height: '90%', margin: 'auto' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          />
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
          
          {/* Image with animation */}
          <motion.div 
            className="w-full max-w-xs mb-8"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.5, 
              type: "spring", 
              stiffness: 200 
            }}
          >
            <motion.img 
              src={currentStep.image} 
              alt={currentStep.title} 
              className="w-full h-auto drop-shadow-lg"
              whileHover={{ 
                scale: 1.05, 
                rotate: [0, 2, 0, -2, 0],
                transition: { duration: 0.5 } 
              }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
            />
          </motion.div>

          {/* Text with animations */}
          <motion.h1 
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {currentStep.title}
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-xs mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {currentStep.description}
          </motion.p>
          
          {/* Animated Buttons */}
          {currentStep.showGenderButtons ? (
            <motion.div 
              className="w-full max-w-xs space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button 
                onClick={() => handleGenderSelection("women")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4"
                whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Kadınlar için
              </motion.button>
              <motion.button 
                onClick={() => handleGenderSelection("men")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4"
                whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Erkekler için
              </motion.button>
              <motion.button 
                onClick={currentStep.buttonAction}
                className="w-full border border-[#30AAB9] text-[#30AAB9] hover:bg-gray-50 font-medium rounded-md py-3 px-4 mt-2"
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(48, 170, 185, 0.05)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {currentStep.buttonText}
              </motion.button>
            </motion.div>
          ) : (
            <motion.button 
              onClick={currentStep.buttonAction}
              className="w-full max-w-xs bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep.buttonText}
            </motion.button>
          )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Animated Bottom indicator */}
      <motion.div 
        className="w-full flex justify-center pb-8 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <motion.div 
          className="w-12 h-1.5 bg-[#30AAB9] bg-opacity-40 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </div>
  );
}