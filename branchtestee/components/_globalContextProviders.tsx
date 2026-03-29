import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeModeProvider } from "../helpers/themeMode";
import { AuthProvider } from "../helpers/useAuth";
import { GoogleTranslateProvider } from "../helpers/useTranslation";
import { TooltipProvider } from "./Tooltip";
import { SonnerToaster } from "./SonnerToaster";
import { ScrollToHashElement } from "./ScrollToHashElement";
import { LanguageProvider as AdvancedLanguageProvider } from "../contexts/language-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute “fresh” window
    },
  },
});

export const GlobalContextProviders = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeModeProvider>
          <GoogleTranslateProvider>
            <AdvancedLanguageProvider>
              <ScrollToHashElement />
              <TooltipProvider>
                {children}
                <SonnerToaster />
              </TooltipProvider>
            </AdvancedLanguageProvider>
          </GoogleTranslateProvider>
        </ThemeModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
