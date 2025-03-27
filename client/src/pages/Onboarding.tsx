import { useState, MouseEvent, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n";

interface Step {
  title: string;
  description: string;
  image: JSX.Element;
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

  // SVG içerikleri direkt olarak React bileşenleri şeklinde tanımlayalım
  const WelcomeSvg = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d)">
        <rect x="50" y="50" width="300" height="200" rx="20" fill="#FFE4E1" />
        <rect x="90" y="80" width="220" height="140" rx="10" fill="#FFFFFF" />
        <circle cx="200" cy="100" r="30" fill="#30AAB9" />
        <path d="M190 100L198 108L210 95" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="100" y="150" width="200" height="10" rx="5" fill="#F3F4F6" />
        <rect x="100" y="170" width="150" height="10" rx="5" fill="#F3F4F6" />
        <rect x="100" y="190" width="100" height="10" rx="5" fill="#F3F4F6" />
        <circle cx="130" cy="220" r="15" fill="#30AAB9" opacity="0.3" />
        <circle cx="170" cy="220" r="15" fill="#30AAB9" opacity="0.5" />
        <circle cx="210" cy="220" r="15" fill="#30AAB9" opacity="0.7" />
        <circle cx="250" cy="220" r="15" fill="#30AAB9" />
      </g>
      <defs>
        <filter id="filter0_d" x="0" y="0" width="400" height="300" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="25" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  const LocationSvg = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_loc)">
        <circle cx="200" cy="150" r="100" fill="#F0FBFC" />
        <path d="M200 100C178.954 100 162 116.954 162 138C162 167.167 200 200 200 200C200 200 238 167.167 238 138C238 116.954 221.046 100 200 100ZM200 152C192.268 152 186 145.732 186 138C186 130.268 192.268 124 200 124C207.732 124 214 130.268 214 138C214 145.732 207.732 152 200 152Z" fill="#30AAB9" />
        <circle cx="200" cy="138" r="8" fill="white" />
        <path d="M240 140C240 140 260 145 280 160" stroke="#30AAB9" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M160 140C160 140 140 145 120 160" stroke="#30AAB9" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="120" cy="160" r="10" fill="#30AAB9" opacity="0.3" />
        <circle cx="280" cy="160" r="10" fill="#30AAB9" opacity="0.3" />
        <circle cx="140" cy="200" r="15" fill="#30AAB9" opacity="0.2" />
        <circle cx="260" cy="200" r="15" fill="#30AAB9" opacity="0.2" />
      </g>
      <defs>
        <filter id="filter0_d_loc" x="50" y="0" width="300" height="300" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="25" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  const NotificationsSvg = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_notif)">
        <path d="M240 140C240 117.909 222.091 100 200 100C177.909 100 160 117.909 160 140V160L140 180V190H260V180L240 160V140Z" fill="#30AAB9" opacity="0.1" />
        <path d="M200 210C209.941 210 218 201.941 218 192H182C182 201.941 190.059 210 200 210Z" fill="#30AAB9" opacity="0.2" />
        <path d="M240 140C240 117.909 222.091 100 200 100C177.909 100 160 117.909 160 140V160L140 180V190H260V180L240 160V140Z" stroke="#30AAB9" strokeWidth="2" />
        <path d="M200 210C209.941 210 218 201.941 218 192H182C182 201.941 190.059 210 200 210Z" stroke="#30AAB9" strokeWidth="2" />
        <circle cx="200" cy="80" r="10" fill="#30AAB9" />
        <path d="M240 100L250 90" stroke="#30AAB9" strokeWidth="2" />
        <path d="M250 160L260 170" stroke="#30AAB9" strokeWidth="2" />
        <path d="M150 160L140 170" stroke="#30AAB9" strokeWidth="2" />
        <path d="M150 100L140 90" stroke="#30AAB9" strokeWidth="2" />
        <circle cx="260" cy="170" r="5" fill="#30AAB9" opacity="0.5" />
        <circle cx="140" cy="170" r="5" fill="#30AAB9" opacity="0.5" />
        <circle cx="140" cy="90" r="5" fill="#30AAB9" opacity="0.5" />
        <circle cx="250" cy="90" r="5" fill="#30AAB9" opacity="0.5" />
      </g>
      <defs>
        <filter id="filter0_d_notif" x="85" y="25" width="230" height="230" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="25" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  const PreferencesSvg = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_pref)">
        <rect x="150" y="70" width="100" height="160" rx="10" fill="#F0FBFC" />
        <circle cx="160" cy="100" r="5" fill="#30AAB9" opacity="0.5" />
        <circle cx="180" cy="100" r="5" fill="#30AAB9" opacity="0.7" />
        <circle cx="200" cy="100" r="5" fill="#30AAB9" />
        <rect x="160" y="120" width="80" height="10" rx="5" fill="#30AAB9" opacity="0.2" />
        <rect x="160" y="140" width="60" height="10" rx="5" fill="#30AAB9" opacity="0.2" />
        <rect x="160" y="160" width="80" height="10" rx="5" fill="#30AAB9" opacity="0.2" />
        <rect x="160" y="180" width="70" height="10" rx="5" fill="#30AAB9" opacity="0.2" />
        <rect x="160" y="200" width="50" height="10" rx="5" fill="#30AAB9" opacity="0.2" />
        <circle cx="240" cy="120" r="5" stroke="#30AAB9" strokeWidth="1.5" />
        <circle cx="240" cy="140" r="5" fill="#30AAB9" />
        <circle cx="240" cy="160" r="5" stroke="#30AAB9" strokeWidth="1.5" />
        <circle cx="240" cy="180" r="5" fill="#30AAB9" />
        <circle cx="240" cy="200" r="5" stroke="#30AAB9" strokeWidth="1.5" />
        
        <circle cx="140" cy="160" r="20" fill="#30AAB9" opacity="0.1" />
        <path d="M135 160L140 165L145 155" stroke="#30AAB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        <circle cx="260" cy="160" r="20" fill="#30AAB9" opacity="0.1" />
        <path d="M255 160L260 165L265 155" stroke="#30AAB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <filter id="filter0_d_pref" x="70" y="0" width="260" height="300" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="25" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  const steps: (Step & { showGenderButtons?: boolean })[] = [
    // Welcome step
    {
      title: "Nail Art Match'e Hoş Geldin!",
      description: "En iyi stüdyoları keşfet, yorumları oku ve telefon görüşmesine gerek kalmadan kolayca randevu al.",
      image: <WelcomeSvg />,
      buttonText: "Başla",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(1)
    },
    // Location step
    {
      title: "Yakındakileri Keşfet",
      description: "Sana en uygun stüdyoları bulabilmemiz için konum servislerini aç.",
      image: <LocationSvg />,
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(2)
    },
    // Notifications step
    {
      title: "Randevularını Kaçırma",
      description: "Hatırlatmalar ve önemli güncellemeler için bildirimlere izin ver.",
      image: <NotificationsSvg />,
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(3)
    },
    // Preferences step
    {
      title: "Senin İçin Doğru Hizmetleri Keşfet",
      description: "Sana özel hizmetleri gösterelim...",
      image: <PreferencesSvg />,
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
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                rotate: [0, 2, 0, -2, 0],
                transition: { duration: 0.5 } 
              }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              className="w-full h-auto drop-shadow-lg"
            >
              {currentStep.image}
            </motion.div>
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