"use client";

import { useReducer, createContext, useContext } from "react";
import { setThemeCookie } from "../_actions/set-theme-cookie";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export default function AdminThemeProvider({
  defaultDark,
  children,
}: {
  defaultDark: boolean;
  children: React.ReactNode;
}) {
  const [isDark, dispatch] = useReducer(
    (state: boolean) => !state,
    defaultDark,
  );

  const toggle = () => {
    const next = !isDark;
    dispatch();
    // Aplica .dark en <html> — así todos los portales de Radix (Dialog, Popover, Sheet)
    // lo heredan correctamente ya que se montan en document.body
    document.documentElement.classList.toggle("dark", next);
    setThemeCookie(next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
