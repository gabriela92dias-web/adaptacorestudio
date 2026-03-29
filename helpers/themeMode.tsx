import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "auto";

// Event mechanism to sync standalone functions with React Context
type ThemeChangeListener = (mode: ThemeMode) => void;
const listeners = new Set<ThemeChangeListener>();

function notifyThemeChange() {
  const mode = getCurrentThemeMode();
  listeners.forEach((listener) => listener(mode));
}

function subscribeToThemeChange(listener: ThemeChangeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function updateTheme(darkPreferred: boolean): void {
  if (darkPreferred) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

let currentMediaQuery: MediaQueryList | null = null;

/**
 * Switch to dark mode by adding the "dark" class to document.body.
 */
function saveThemeToLocalStorage(mode: ThemeMode) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("adapta-theme-mode", mode);
    } catch (e) {}
  }
}

function getThemeFromLocalStorage(): ThemeMode | null {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("adapta-theme-mode") as ThemeMode | null;
    } catch (e) {}
  }
  return null;
}

/**
 * Switch to dark mode by adding the "dark" class to document.body.
 */
export function switchToDarkMode(): void {
  // Clear any auto mode listener if present.
  if (currentMediaQuery) {
    currentMediaQuery.onchange = null;
    currentMediaQuery = null;
  }
  document.body.classList.add("dark");
  saveThemeToLocalStorage("dark");
  notifyThemeChange();
}

/**
 * Switch to light mode by removing the "dark" class from document.body.
 */
export function switchToLightMode(): void {
  // Clear any auto mode listener if present.
  if (currentMediaQuery) {
    currentMediaQuery.onchange = null;
    currentMediaQuery = null;
  }
  document.body.classList.remove("dark");
  saveThemeToLocalStorage("light");
  notifyThemeChange();
}

/**
 * Switch to auto mode. This function immediately applies the user's color scheme preference
 * and listens for system preference changes to update the theme automatically.
 * It uses the onchange property instead of addEventListener to avoid TypeScript issues.
 */
export function switchToAutoMode(): void {
  if (currentMediaQuery) {
    currentMediaQuery.onchange = null;
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.onchange = (e: MediaQueryListEvent) => {
    updateTheme(e.matches);
  };
  currentMediaQuery = mediaQuery;
  updateTheme(mediaQuery.matches);
  saveThemeToLocalStorage("auto");
  notifyThemeChange();
}

/**
 * Returns the current theme mode:
 * - "auto" if auto mode is enabled,
 * - "dark" if the document body has the "dark" class,
 * - "light" otherwise.
 */
export function getCurrentThemeMode(): ThemeMode {
  if (currentMediaQuery) {
    return "auto";
  }
  return document.body.classList.contains("dark") ? "dark" : "light";
}

// -- React Context & Provider --

interface ThemeModeContextValue {
  mode: ThemeMode;
  switchToDarkMode: () => void;
  switchToLightMode: () => void;
  switchToAutoMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => getCurrentThemeMode());

  useEffect(() => {
    // On mount, restore the user's theme preference if available.
    const savedMode = getThemeFromLocalStorage();
    if (savedMode === "light") {
      switchToLightMode();
    } else if (savedMode === "auto") {
      switchToAutoMode();
    } else if (savedMode === "dark") {
      switchToDarkMode();
    } else {
      switchToDarkMode();
    }

    // Subscribe to changes triggered by standalone functions
    const unsubscribe = subscribeToThemeChange((newMode) => {
      setMode(newMode);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      mode,
      switchToDarkMode,
      switchToLightMode,
      switchToAutoMode,
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
}
