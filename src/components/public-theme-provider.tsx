"use client";

import { useReducer, createContext, useContext, useEffect } from "react";
import { setThemeCookie } from "@/app/admin/_actions/set-theme-cookie";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function PublicThemeProvider({
  defaultDark,
  hasCookie,
  children,
}: {
  defaultDark: boolean; // viene de la cookie server-side
  hasCookie: boolean; // si NO hay cookie, detectamos system preference
  children: React.ReactNode;
}) {
  const [isDark, dispatch] = useReducer(
    (state: boolean) => !state,
    defaultDark,
  );

  // Primera visita — sin cookie → detectar sistema y guardar cookie
  useEffect(() => {
    if (!hasCookie) {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (systemDark !== isDark) {
        // Sincronizar el estado con el sistema
        dispatch();
        document.documentElement.classList.toggle("dark", systemDark);
        setThemeCookie(systemDark ? "dark" : "light");
      }
    }
    // Solo en mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !isDark;
    dispatch();
    document.documentElement.classList.toggle("dark", next);
    setThemeCookie(next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
