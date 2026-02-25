"use client";

import { useState, useEffect } from "react";
import { navigationService } from "@/services/public-services";
import { useErrorHandler } from "./useErrorHandler";
import type { NavigationResponse } from "@/types";

export function useNavigation() {
  const [data, setData] = useState<NavigationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const navData = await navigationService.getNavigation();
        setData(navData);
      } catch (error: any) {
        handleError(error, false); // Don't show toast, fail silently with fallback
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, [handleError]);

  return {
    navItems: data?.navItems || [],
    dropdownData: data?.dropdownData || {},
    themeConfig: data?.themeConfig || null,
    loading,
  };
}
