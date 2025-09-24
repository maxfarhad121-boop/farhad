import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, languages, Locale } from '../translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
        try {
            const savedLocale = localStorage.getItem('locale');
            if (savedLocale && Object.keys(languages).includes(savedLocale)) {
                return savedLocale as Locale;
            }
        } catch (e) {
            console.error("Could not access localStorage:", e);
        }
    }
    return 'en'; // Default to English
  });

  useEffect(() => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', locale);
        }
    } catch (e) {
        console.error("Could not access localStorage:", e);
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };
  
  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = (translations[locale] && translations[locale][key]) || translations['en'][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};