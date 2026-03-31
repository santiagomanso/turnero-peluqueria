"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { setThemeCookie } from "@/app/admin/_actions/set-theme-cookie";

type ThemeMode = "system" | "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  isDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function systemIsDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function PublicThemeProvider({
  defaultTheme,
  children,
}: {
  defaultTheme: ThemeMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  // Resolve whether dark is active given current theme mode
  const resolveIsDark = (t: ThemeMode): boolean => {
    if (t === "dark") return true;
    if (t === "light") return false;
    return systemIsDark();
  };

  const [isDark, setIsDark] = useState(() => resolveIsDark(defaultTheme));

  // On mount: if system mode, sync with actual OS preference
  useEffect(() => {
    if (theme === "system") {
      const dark = systemIsDark();
      setIsDark(dark);
      applyDark(dark);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live matchMedia listener — only active in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    const dark = resolveIsDark(t);
    setIsDark(dark);
    applyDark(dark);
    setThemeCookie(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
