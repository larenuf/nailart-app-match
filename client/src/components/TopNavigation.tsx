import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Settings, ArrowLeft, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import LocationPicker from "./LocationPicker";
import { LanguageSelector } from "./LanguageSelector";
import { CurrencySelector } from "./CurrencySelector";

export default function TopNavigation({ title, showBackButton }: { title?: string; showBackButton?: boolean }) {
  const { userLocation } = useAppContext();
  const displayLocation = userLocation || "İstanbul";
  const { darkMode, toggleDarkMode } = useTheme();
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [_, navigate] = useLocation();
  
  // Kullanıcı bilgisini al
  const { data: user } = useQuery<{ id: number; username: string; email: string; role?: string }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Dark mode toggle butonu için click handler
  const handleToggleDarkMode = useCallback((e: React.MouseEvent) => {
    // Çok önemli: Olayın yayılmasını engelle
    e.preventDefault();
    e.stopPropagation();
    toggleDarkMode();
  }, [toggleDarkMode]);

  // Arama butonuna tıklama işleyicisi
  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Arama butonuna tıklandı");
  }, []);

  // Bildirim butonuna tıklama işleyicisi
  const handleNotificationClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Bildirim butonuna tıklandı");
  }, []);
  
  // Yönetim paneli butonuna tıklama işleyicisi
  const handleAdminClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/admin/dashboard");
  }, [navigate]);

  // Konum seçimine tıklama işleyicisi
  const handleLocationClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Konum seçimine tıklandı");
    setLocationPickerOpen(true);
  }, []);

  // Geri butonu için handler
  const handleBackButtonClick = useCallback(() => {
    window.history.back();
  }, []);
  
  // Onboarding'i sıfırlama butonu için handler
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem('firstVisit');
    window.location.href = '/';
  }, []);

  return (
    <>
      <div className="px-4 py-4 bg-gradient-to-r from-[#FAFAFA] to-[#F5F5F5] dark:from-gray-900 dark:to-gray-800 transition-all duration-300 shadow-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          {showBackButton ? (
            <div className="flex items-center">
              <button
                onClick={handleBackButtonClick}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm mr-3 dark:bg-gray-700 dark:text-white hover:scale-105 transition-transform duration-200"
              >
                <ArrowLeft size={18} />
              </button>
              {title && <h2 className="text-lg font-semibold dark:text-white">{title}</h2>}
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5864] to-[#FF9494]">NAM</h1>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 -mt-1">NailArtMatch</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button 
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white hover:scale-105 transition-all duration-200 hover:shadow-md"
              onClick={handleToggleDarkMode}
              aria-label={darkMode ? "Açık moda geç" : "Koyu moda geç"}
              type="button"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white hover:scale-105 transition-all duration-200 hover:shadow-md"
              onClick={handleSearchClick}
              type="button"
            >
              <i className="fas fa-search"></i>
            </button>
            <button 
              className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm dark:bg-gray-700 dark:text-white hover:scale-105 transition-all duration-200 hover:shadow-md"
              onClick={handleNotificationClick}
              type="button"
            >
              <i className="fas fa-bell text-[#333333] dark:text-white"></i>
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FF5864] to-[#FF9494] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                2
              </span>
            </button>
            {/* Salon sahipleri ve yöneticiler için yönetim paneli butonu */}
            {user && user.role && (user.role === "salon_owner" || user.role === "admin") && (
              <button 
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white hover:scale-105 transition-all duration-200"
                onClick={handleAdminClick}
                aria-label="Yönetim Paneli"
                type="button"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>
        
        {!title && (
          <div className="flex mt-4 gap-2">
            <div 
              className="flex-1 flex items-center text-sm bg-white p-3 rounded-xl shadow-sm dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md group"
              onClick={handleLocationClick}
            >
              <i className="fas fa-map-marker-alt text-[#FF5864] mr-2 group-hover:scale-110 transition-transform duration-200"></i>
              <span className="font-medium">{displayLocation}</span>
              <i className="fas fa-chevron-down text-xs ml-1 text-gray-400 dark:text-gray-500 group-hover:rotate-180 transition-transform duration-300"></i>
            </div>
            <div className="flex gap-1 items-center">
              <button
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-3 py-2 rounded-xl text-xs flex items-center mr-1 shadow-sm hover:shadow transition-all duration-200"
                onClick={resetOnboarding}
                type="button"
              >
                <RefreshCw size={12} className="mr-1 animate-pulse" />
                Intro
              </button>
              <LanguageSelector />
              <CurrencySelector />
            </div>
          </div>
        )}
      </div>

      {/* Konum Seçici */}
      <LocationPicker 
        open={locationPickerOpen} 
        onClose={() => setLocationPickerOpen(false)} 
      />
    </>
  );
}