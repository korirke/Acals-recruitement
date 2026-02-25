/**
 * Stats Service
 * Handles statistics data with caching and fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import { fallbackData } from "@/lib/dummyData";
import type { Stat } from "@/types";

export const statsService = {
  /**
   * Get all active statistics
   */
  async getStats(): Promise<Stat[]> {
    try {
      // Check cache first
      const cached = cache.get<Stat[]>(CACHE_KEYS.STATS);
      if (cached) {
        console.log("✅ Stats loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching stats from API...");
      const response = await api.get<Stat[]>(ENDPOINTS.PUBLIC.STATS);

      if (response.success && response.data) {
        const stats = Array.isArray(response.data) ? response.data : [];
        const activeStats = stats.filter((s) => s.isActive);

        cache.set(CACHE_KEYS.STATS, activeStats, CACHE_TTL.LONG);
        console.log("✅ Stats fetched and cached:", activeStats.length);
        return activeStats;
      }

      console.warn("⚠️ Stats fetch failed, using fallback data");
      return fallbackData.stats;
    } catch (error) {
      console.error("❌ Stats fetch error:", error);
      return fallbackData.stats || [];
    }
  },

  /**
   * Clear stats cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.STATS);
    console.log("🗑️ Stats cache cleared");
  },
};
