import { useState, MouseEvent } from "react";
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

export default function Onboarding() {
  console.log("Onboarding component rendered");
  const [step, setStep] = useState(0);
  const [_, navigate] = useLocation();
  const { t } = useI18n();

  const steps: (Step & { showGenderButtons?: boolean })[] = [
    // Welcome step
    {
      title: "NailBook'a Hoş Geldiniz!",
      description: "En iyi nail artistleri bulun, yorumları görün ve istediğiniz zaman randevu alın - telefon aramaya gerek yok.",
      image: "/images/onboarding/welcome.svg",
      buttonText: "Başlayalım",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(1)
    },
    // Location step
    {
      title: "Yakınınızdakileri Keşfedin",
      description: "Konum servislerini açarak tarzınıza uyan yerel işletmeleri bulun.",
      image: "/images/onboarding/location.svg",
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(2)
    },
    // Notifications step
    {
      title: "Hiçbir Randevuyu Kaçırmayın",
      description: "Hatırlatıcılar ve önemli güncellemeler için bildirimlere izin verin.",
      image: "/images/onboarding/notifications.svg",
      buttonText: "Devam Et",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => setStep(3)
    },
    // Preferences step
    {
      title: "Size Özel Hizmetleri Keşfedin",
      description: "Size uygun hizmetleri gösterelim...",
      image: "/images/onboarding/preferences.svg",
      buttonText: "Atla",
      buttonAction: (e: MouseEvent<HTMLButtonElement>) => {
        localStorage.setItem('firstVisit', 'false');
        navigate("/");
      },
      showGenderButtons: true
    }
  ];

  const handleGenderSelection = (gender: string) => {
    // Seçilen cinsiyeti ve onboarding tamamlama durumunu saklayalım
    localStorage.setItem("preferredGender", gender);
    localStorage.setItem("firstVisit", "false");
    navigate("/");
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
                Kadın
              </button>
              <button 
                onClick={() => handleGenderSelection("men")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4 transition"
              >
                Erkek
              </button>
              <button 
                onClick={() => handleGenderSelection("both")}
                className="w-full bg-[#30AAB9] hover:bg-[#2A99A7] text-white font-medium rounded-md py-3 px-4 transition"
              >
                Her İkisi
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