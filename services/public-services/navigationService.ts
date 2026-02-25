/**
 * Navigation Service
 * Handles navigation and theme data with caching and fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import { fallbackData } from "@/lib/dummyData";
import type { NavigationResponse } from "@/types";

export const navigationService = {
  /**
   * Get complete navigation data (nav items, dropdowns, theme)
   * Uses cache to prevent unnecessary API calls
   */
  async getNavigation(): Promise<NavigationResponse> {
    try {
      // Check cache first
      const cached = cache.get<NavigationResponse>(CACHE_KEYS.NAVIGATION);
      if (cached) {
        console.log("✅ Navigation loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching navigation from API...");
      const response = await api.get<NavigationResponse>(
        ENDPOINTS.PUBLIC.NAVIGATION,
      );

      if (response.success && response.data) {
        // Cache the successful response
        cache.set(CACHE_KEYS.NAVIGATION, response.data, CACHE_TTL.LONG);
        console.log("✅ Navigation fetched and cached");
        return response.data;
      }

      console.warn("⚠️ Navigation fetch failed, using fallback data");
      return fallbackData.navigation as NavigationResponse;
    } catch (error) {
      console.error("❌ Navigation fetch error:", error);

      // Try to return stale cache if available
      const staleCache = cache.get<NavigationResponse>(CACHE_KEYS.NAVIGATION);
      if (staleCache) {
        console.log("⚠️ Using stale cache for navigation");
        return staleCache;
      }

      // Last resort: fallback data
      return fallbackData.navigation as NavigationResponse;
    }
  },

  /**
   * Clear navigation cache (useful for admin updates)
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.NAVIGATION);
    console.log("🗑️ Navigation cache cleared");
  },
};
