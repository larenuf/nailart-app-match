import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import trTranslations from './tr.json';
import enTranslations from './en.json';
import arTranslations from './ar.json';

export type SupportedLocale = 'tr' | 'en' | 'ar';
export type SupportedCurrency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'SAR';

// Map locale to currency default
const localeCurrencyMap: Record<SupportedLocale, SupportedCurrency> = {
  tr: 'TRY',
  en: 'USD',
  ar: 'AED'
};

const translations: Record<SupportedLocale, any> = {
  tr: trTranslations,
  en: enTranslations,
  ar: arTranslations
};

// Exchange rates compared to USD (approximate values, should use real API in production)
const exchangeRates: Record<SupportedCurrency, number> = {
  USD: 1,
  TRY: 31.5, // 1 USD = 31.5 TRY
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.78, // 1 USD = 0.78 GBP
  JPY: 150.5, // 1 USD = 150.5 JPY
  AED: 3.67, // 1 USD = 3.67 AED
  SAR: 3.75  // 1 USD = 3.75 SAR
};

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number, options?: { showSymbol?: boolean }) => string;
  convertPrice: (amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency) => number;
  currencySymbol: string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to get saved locale/currency from localStorage, default to tr
  const savedLocale = typeof window !== 'undefined' 
    ? (localStorage.getItem('locale') as SupportedLocale || 'tr')
    : 'tr';
  
  const savedCurrency = typeof window !== 'undefined'
    ? (localStorage.getItem('currency') as SupportedCurrency || localeCurrencyMap[savedLocale])
    : localeCurrencyMap[savedLocale];

  const [locale, setLocaleState] = useState<SupportedLocale>(savedLocale);
  const [currency, setCurrencyState] = useState<SupportedCurrency>(savedCurrency);

  // Determine text direction
  const isRTL = locale === 'ar';

  // Update HTML dir attribute when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  // Save locale and currency to localStorage when they change
  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const setCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  // Translate function
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = translations[locale];
    
    // Navigate through the nested objects
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key if translation not found
        return key;
      }
    }

    // Replace parameters in the translation string
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      }, value);
    }

    return typeof value === 'string' ? value : key;
  };

  // Get currency symbol
  const currencySymbol = t(`currency.${currency}`);

  // Format price with currency
  const formatPrice = (amount: number, options?: { showSymbol?: boolean }): string => {
    const showSymbol = options?.showSymbol !== undefined ? options.showSymbol : true;
    const formatter = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-AE' : 'en-US', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  };

  // Convert price between currencies
  const convertPrice = (amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number => {
    // First convert to USD (base currency)
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    
    // Then convert from USD to target currency
    return toCurrency === 'USD' ? amountInUSD : amountInUSD * exchangeRates[toCurrency];
  };

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    currency,
    setCurrency,
    t,
    formatPrice,
    convertPrice,
    currencySymbol,
    isRTL
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}