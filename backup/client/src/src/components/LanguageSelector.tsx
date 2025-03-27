import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n, SupportedLocale } from '@/i18n';

type Language = {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
};

const languages: Language[] = [
  { 
    code: 'tr', 
    name: 'Turkish', 
    nativeName: 'Türkçe', 
    flag: '🇹🇷' 
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇬🇧' 
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇦🇪' 
  }
];

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {currentLanguage.nativeName}
          </span>
          <span className="md:hidden">
            {currentLanguage.flag}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLocale(language.code);
              setOpen(false);
            }}
            className={`flex items-center gap-2 ${locale === language.code ? 'font-medium' : ''}`}
          >
            <span>{language.flag}</span>
            <span>{language.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}