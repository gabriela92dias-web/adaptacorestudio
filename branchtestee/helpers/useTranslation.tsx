import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Locale = "pt" | "en";

interface GoogleTranslateContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const GoogleTranslateContext = createContext<GoogleTranslateContextType | null>(null);

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export const GoogleTranslateProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("adapta-locale");
        if (saved === "pt" || saved === "en") return saved as Locale;
      } catch (e) {}
    }
    return "pt";
  });

  useEffect(() => {
    // Check initial cookie, but respect localStorage if present
    const saved = typeof window !== "undefined" ? localStorage.getItem("adapta-locale") : null;
    if (!saved) {
      const googtrans = getCookie("googtrans");
      if (googtrans) {
        if (googtrans.endsWith("/en")) setLocaleState("en");
        else if (googtrans.endsWith("/pt")) setLocaleState("pt");
      }
    }

    // Define the init callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'en,pt',
          autoDisplay: false,
        },
        'google_translate_element'
      );
      
      const savedLocale = typeof window !== "undefined" ? localStorage.getItem("adapta-locale") : null;
      if (savedLocale && savedLocale !== "pt") {
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = savedLocale;
            selectElement.dispatchEvent(new Event('change'));
          }
        }, 1000);
      }
    };

    // Load the script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    
    if (typeof window !== "undefined") {
      try { localStorage.setItem("adapta-locale", newLocale); } catch (e) {}
    }

    const domain = window.location.hostname;
    if (newLocale === "pt") {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      try {
        const iframe = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement;
        if (iframe) {
           const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
           const restoreBtn = innerDoc?.getElementById(':1.restore') as HTMLElement;
           if (restoreBtn) restoreBtn.click();
        }
      } catch(e){}
    } else {
      document.cookie = `googtrans=/pt/${newLocale}; path=/;`;
      document.cookie = `googtrans=/pt/${newLocale}; path=/; domain=${domain};`;
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = newLocale;
        select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      }
    }

    setTimeout(() => {
       const htmlTag = document.querySelector('html');
       const isTranslated = htmlTag && htmlTag.classList.contains('translated-ltr');
       if ((newLocale === 'en' && !isTranslated) || (newLocale === 'pt' && isTranslated)) {
           window.location.reload();
       }
    }, 250);
  }, []);

  return (
    <GoogleTranslateContext.Provider value={{ locale, setLocale }}>
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }}
      ></div>
      <style>{`
        body, html {
          top: 0px !important;
          margin-top: 0px !important; 
        }
        iframe.goog-te-banner-frame {
            position: fixed !important;
            top: -10000px !important;
            left: -10000px !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            display: none !important; /* Safest hiding */
        }
        .goog-te-banner-frame.skiptranslate, .skiptranslate > iframe.goog-te-banner-frame {
            display: none !important;
        }
        .goog-te-gadget {
            display: none !important;
            font-size: 0 !important;
            color: transparent !important;
        }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; } 
        /* Disables the yellow hover highlight on translated texts entirely */
        .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
        }
      `}</style>
      {children}
    </GoogleTranslateContext.Provider>
  );
};

export const useGoogleTranslate = (): GoogleTranslateContextType => {
  const context = useContext(GoogleTranslateContext);
  if (!context) {
    throw new Error("useGoogleTranslate must be used within a GoogleTranslateProvider");
  }
  return context;
};