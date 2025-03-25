import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Settings, ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import LocationPicker from "./LocationPicker";

export default function TopNavigation({ title, showBackButton }: { title?: string; showBackButton?: boolean }) {
  const { userLocation } = useAppContext();
  const displayLocation = userLocation || "New York";
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
    navigate(-1);
  }, [navigate]);

  return (
    <>
      <div className="px-4 py-4 bg-[#FAFAFA] dark:bg-gray-900 transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          {showBackButton ? (
            <div className="flex items-center">
              <button
                onClick={handleBackButtonClick}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm mr-3 dark:bg-gray-700 dark:text-white"
              >
                <ArrowLeft size={18} />
              </button>
              {title && <h2 className="text-lg font-semibold dark:text-white">{title}</h2>}
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-[#FF5864]">NAM <span className="text-xs font-medium align-text-top dark:text-gray-300">NailArtMatch</span></h1>
          )}
          
          <div className="flex space-x-3">
            <button 
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white"
              onClick={handleToggleDarkMode}
              aria-label={darkMode ? "Açık moda geç" : "Koyu moda geç"}
              type="button"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white"
              onClick={handleSearchClick}
              type="button"
            >
              <i className="fas fa-search"></i>
            </button>
            <button 
              className="relative w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm dark:bg-gray-700 dark:text-white"
              onClick={handleNotificationClick}
              type="button"
            >
              <i className="fas fa-bell text-[#333333] dark:text-white"></i>
              <span className="absolute -top-1 -right-1 bg-[#FF5864] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            {/* Salon sahipleri ve yöneticiler için yönetim paneli butonu */}
            {user && user.role && (user.role === "salon_owner" || user.role === "admin") && (
              <button 
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333] dark:bg-gray-700 dark:text-white"
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
          <div 
            className="flex items-center text-sm mt-3 bg-white p-2.5 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200 cursor-pointer"
            onClick={handleLocationClick}
          >
            <i className="fas fa-map-marker-alt text-[#FF5864] mr-2"></i>
            <span className="font-medium">{displayLocation}</span>
            <i className="fas fa-chevron-down text-xs ml-1 text-gray-400 dark:text-gray-500"></i>
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