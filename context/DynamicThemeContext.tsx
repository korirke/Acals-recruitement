"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNavigationContext } from "./NavigationContext";
import type { ThemeConfig } from "@/types";

interface DynamicThemeContextType {
  themeConfig: ThemeConfig | null;
}

const DynamicThemeContext = createContext<DynamicThemeContextType | null>(null);

export const DynamicThemeProvider = ({ children }: { children: ReactNode }) => {
  const { themeConfig } = useNavigationContext();

  return (
    <DynamicThemeContext.Provider value={{ themeConfig: themeConfig || null }}>
      {children}
    </DynamicThemeContext.Provider>
  );
};

export const useDynamicTheme = () => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error("useDynamicTheme must be used within DynamicThemeProvider");
  }
  return context;
};
