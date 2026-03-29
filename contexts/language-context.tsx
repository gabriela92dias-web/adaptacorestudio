/**
 * ═══════════════════════════════════════════════════════════════════
 * LANGUAGE CONTEXT - ADAPTA CORE STUDIO
 * ═══════════════════════════════════════════════════════════════════
 * Build: v0.0.15-HOTFIX
 * Context for managing language state (PT/EN) across the application
 * ⚡ OPTIMIZED: useCallback for stable function references
 * ═══════════════════════════════════════════════════════════════════
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type Language = 'pt' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, translations: Record<Language, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Load language from localStorage on mount
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('adapta-language');
      return (saved === 'en' || saved === 'pt' || saved === 'de') ? saved as Language : 'pt';
    } catch {
      return 'pt';
    }
  });

  // ⚡ Memoize setLanguage to prevent unnecessary re-renders
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('adapta-language', lang);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // ⚡ Memoize translation function
  const t = useCallback((key: string, translations: Record<Language, string>) => {
    return translations[language] || translations.pt || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Re-export Language type para uso em outros lugares
export type { Language };