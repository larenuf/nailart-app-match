import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useCallback, useState } from "react";
import LocationPicker from "./LocationPicker";

export default function TopNavigation() {
  const { userLocation } = useAppContext();
  const { darkMode, toggleDarkMode } = useTheme();
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

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

  // Konum seçimine tıklama işleyicisi
  const handleLocationClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Konum seçimine tıklandı");
    setLocationPickerOpen(true);
  }, []);

  return (
    <>
      <div className="px-4 py-4 bg-[#FAFAFA] dark:bg-gray-900 transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#FF5864]">NAM <span className="text-xs font-medium align-text-top dark:text-gray-300">NailArtMatch</span></h1>
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
          </div>
        </div>
        <div 
          className="flex items-center text-sm mt-3 bg-white p-2.5 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200 cursor-pointer"
          onClick={handleLocationClick}
        >
          <i className="fas fa-map-marker-alt text-[#FF5864] mr-2"></i>
          <span className="font-medium">{userLocation}</span>
          <i className="fas fa-chevron-down text-xs ml-1 text-gray-400 dark:text-gray-500"></i>
        </div>
      </div>

      {/* Konum Seçici */}
      <LocationPicker 
        open={locationPickerOpen} 
        onClose={() => setLocationPickerOpen(false)} 
      />
    </>
  );
}