import React, { createContext, useState, useContext, useCallback } from 'react';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';

type Locale = 'en' | 'fr';

// Helper to access nested keys string 'cart.title'
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

// Helper for interpolation
const interpolate = (text: string, params?: Record<string, string | number>) => {
  if (!params) return text;
  return Object.keys(params).reduce((acc, key) => {
    return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(params[key]));
  }, text);
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const dict = locale === 'fr' ? fr : en;
    const text = getNestedValue(dict, key);
    return interpolate(text, params);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);