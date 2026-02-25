"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get saved theme or system preference
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const initialTheme = savedTheme || systemTheme;

      setThemeState(initialTheme);
      applyTheme(initialTheme);
    } catch (e) {
      // Silently fail if localStorage is not available
      console.warn("Theme initialization failed:", e);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    try {
      const root = document.documentElement;

      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      localStorage.setItem("theme", newTheme);
    } catch (e) {
      console.warn("Failed to apply theme:", e);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
