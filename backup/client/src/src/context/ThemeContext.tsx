import { createContext, useState, useContext, useEffect, ReactNode } from "react";

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Local storage'dan dark mode durumunu al, yoksa sistem tercihine bak
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // localStorage'dan kaydedilmiş tercihi kontrol et
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    
    // Sistem tercihini kontrol et
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Dark mode değiştiğinde document'e dark class'ı ekle/çıkar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Sistem teması değişikliğini takip et
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Eğer kullanıcı manuel bir seçim yapmamışsa, sistem tercihine uy
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}