/**
 * Hero Service
 * Handles hero section data with caching and fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import { fallbackData } from "@/lib/dummyData";
import type { HeroResponse } from "@/types";

export const heroService = {
  /**
   * Get complete hero data (dashboards + content)
   * Uses cache to prevent unnecessary API calls
   */
  async getHero(): Promise<HeroResponse> {
    try {
      // Check cache first
      const cached = cache.get<HeroResponse>(CACHE_KEYS.HERO);
      if (cached) {
        console.log("✅ Hero loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching hero from API...");
      const response = await api.get<HeroResponse>(ENDPOINTS.PUBLIC.HERO);

      if (response.success && response.data) {
        // Cache the successful response
        cache.set(CACHE_KEYS.HERO, response.data, CACHE_TTL.LONG);
        console.log("✅ Hero fetched and cached");
        return response.data;
      }

      console.warn("⚠️ Hero fetch failed, using fallback data");
      return fallbackData.hero as HeroResponse;
    } catch (error) {
      console.error("❌ Hero fetch error:", error);

      // Try to return stale cache if available
      const staleCache = cache.get<HeroResponse>(CACHE_KEYS.HERO);
      if (staleCache) {
        console.log("⚠️ Using stale cache for hero");
        return staleCache;
      }

      // Last resort: fallback data
      return fallbackData.hero as HeroResponse;
    }
  },

  /**
   * Clear hero cache (useful for admin updates)
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.HERO);
    console.log("🗑️ Hero cache cleared");
  },
};
