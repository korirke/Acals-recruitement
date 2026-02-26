"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import type {
  NavItem,
  DropdownData,
  ThemeConfig,
} from "@/types/api/navigation.types";

interface NavigationContextType {
  navItems: NavItem[];
  dropdownData: Record<string, DropdownData>;
  themeConfig: ThemeConfig | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);

interface NavigationProviderProps {
  children: ReactNode;
  initialNavItems?: NavItem[];
  initialDropdownData?: Record<string, DropdownData>;

  initialThemeConfig?: ThemeConfig;
}

export const NavigationProvider = ({
  children,
  initialNavItems = [],
  initialDropdownData = {},
  initialThemeConfig,
}: NavigationProviderProps) => {
  const [navItems] = useState<NavItem[]>(initialNavItems);
  const [dropdownData] =
    useState<Record<string, DropdownData>>(initialDropdownData);
  const [themeConfig] = useState<ThemeConfig | undefined>(
    initialThemeConfig,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchNavigationData = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      setHasFetched(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error("Navigation context error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const shouldFetch =
      typeof window !== "undefined" && !hasFetched && navItems.length === 0;

    if (shouldFetch) {
      fetchNavigationData();
    }
  }, []);

  const refetch = useCallback(async () => {
    setHasFetched(false);
    await fetchNavigationData();
  }, [fetchNavigationData]);

  return (
    <NavigationContext.Provider
      value={{
        navItems,
        dropdownData,
        themeConfig,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within NavigationProvider",
    );
  }
  return context;
};
