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
import type {
  HeroDashboard,
  HeroContent,
  HeroResponse,
} from "@/types/api/hero.types";
import { navigationService } from "@/services/public-services/navigationService";
import { heroService } from "@/services/public-services/heroService";

interface NavigationContextType {
  navItems: NavItem[];
  dropdownData: Record<string, DropdownData>;
  heroDashboards: HeroDashboard[];
  heroContent: HeroContent | undefined;
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
  initialHeroDashboards?: HeroDashboard[];
  initialHeroContent?: HeroContent;
  initialThemeConfig?: ThemeConfig;
}

export const NavigationProvider = ({
  children,
  initialNavItems = [],
  initialDropdownData = {},
  initialHeroDashboards = [],
  initialHeroContent,
  initialThemeConfig,
}: NavigationProviderProps) => {
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);
  const [dropdownData, setDropdownData] =
    useState<Record<string, DropdownData>>(initialDropdownData);
  const [heroDashboards, setHeroDashboards] = useState<HeroDashboard[]>(
    initialHeroDashboards,
  );
  const [heroContent, setHeroContent] = useState<HeroContent | undefined>(
    initialHeroContent,
  );
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | undefined>(
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

      const [navigationData, heroData] = await Promise.allSettled([
        navigationService.getNavigation(),
        heroService.getHero(),
      ]);

      if (navigationData.status === "fulfilled") {
        setNavItems(navigationData.value.navItems || []);
        setDropdownData(navigationData.value.dropdownData || {});
        setThemeConfig(navigationData.value.themeConfig);
      } else {
        console.error("Navigation fetch failed:", navigationData.reason);
      }

      if (heroData.status === "fulfilled") {
        const response: HeroResponse = heroData.value;
        setHeroDashboards(response.heroDashboards || []);
        setHeroContent(response.heroContent);
      } else {
        console.error("Hero fetch failed:", heroData.reason);
      }

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
      typeof window !== "undefined" &&
      !hasFetched &&
      (navItems.length === 0 || heroDashboards.length === 0);

    if (shouldFetch) {
      fetchNavigationData();
    }
  }, []);

  const refetch = useCallback(async () => {
    navigationService.clearCache();
    heroService.clearCache();
    setHasFetched(false);
    await fetchNavigationData();
  }, [fetchNavigationData]);

  return (
    <NavigationContext.Provider
      value={{
        navItems,
        dropdownData,
        heroDashboards,
        heroContent,
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
