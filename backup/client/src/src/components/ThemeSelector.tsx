import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Paintbrush, Check } from 'lucide-react';
import { useI18n } from '@/i18n';
import { motion } from 'framer-motion';

type ThemeColor = {
  name: string;
  color: string;
  value: string;
  textColor: string; // Color for text on the theme background
};

const themeColors: ThemeColor[] = [
  { name: 'Pink', color: '#f472b6', value: 'pink', textColor: 'white' },
  { name: 'Purple', color: '#a855f7', value: 'purple', textColor: 'white' },
  { name: 'Blue', color: '#3b82f6', value: 'blue', textColor: 'white' },
  { name: 'Teal', color: '#14b8a6', value: 'teal', textColor: 'white' },
  { name: 'Amber', color: '#f59e0b', value: 'amber', textColor: 'white' },
  { name: 'Rose', color: '#e11d48', value: 'rose', textColor: 'white' },
];

interface ThemeSelectorProps {
  onThemeChange?: (theme: string) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    // Get saved theme from localStorage or default to 'pink'
    return localStorage.getItem('theme-color') || 'pink';
  });
  const [open, setOpen] = useState(false);
  const { t, locale } = useI18n();
  
  useEffect(() => {
    // Update CSS variables when theme changes
    document.documentElement.style.setProperty(
      '--color-primary',
      themeColors.find(t => t.value === selectedTheme)?.color || '#f472b6'
    );
    
    // Save theme to localStorage
    localStorage.setItem('theme-color', selectedTheme);
    
    // Call onThemeChange callback if provided
    if (onThemeChange) {
      onThemeChange(selectedTheme);
    }
  }, [selectedTheme, onThemeChange]);
  
  const handleThemeSelect = (themeValue: string) => {
    setSelectedTheme(themeValue);
    setTimeout(() => setOpen(false), 500); // Close dialog after selection with a delay for animation
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="fixed bottom-32 right-4 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-20"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Paintbrush size={18} className="text-primary" />
        </motion.button>
      </DialogTrigger>
      
      <DialogContent className="w-[320px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {locale === 'tr' ? 'Tema Rengi Seç' : locale === 'en' ? 'Choose Theme Color' : 'اختر لون السمة'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 p-4">
          {themeColors.map((theme) => (
            <motion.button
              key={theme.value}
              className="relative h-20 rounded-md flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: theme.color }}
              onClick={() => handleThemeSelect(theme.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                {theme.name}
              </span>
              
              {selectedTheme === theme.value && (
                <motion.div
                  className="absolute top-2 right-2 bg-white rounded-full p-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <Check size={12} className="text-black" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}