/**
 * Clients Service
 * Handles client data with caching and fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import { fallbackData } from "@/lib/dummyData";
import type { Client, ClientsResponse } from "@/types";

export const clientsService = {
  /**
   * Get all active clients
   */
  async getClients(): Promise<Client[]> {
    try {
      // Check cache first
      const cached = cache.get<Client[]>(CACHE_KEYS.CLIENTS);
      if (cached) {
        console.log("✅ Clients loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching clients from API...");
      const response = await api.get<ClientsResponse>(ENDPOINTS.PUBLIC.CLIENTS);

      if (response.success && response.data) {
        const clients = response.data.clients || [];
        const activeClients = clients.filter((c) => c.isActive);

        // If no clients from API, use fallback from central source
        if (activeClients.length === 0) {
          console.warn("⚠️ No clients from API, using fallback data");
          const fallbackClients = fallbackData.clients || [];
          cache.set(CACHE_KEYS.CLIENTS, fallbackClients, CACHE_TTL.LONG);
          return fallbackClients;
        }

        cache.set(CACHE_KEYS.CLIENTS, activeClients, CACHE_TTL.LONG);
        console.log("✅ Clients fetched and cached:", activeClients.length);
        return activeClients;
      }

      console.warn("⚠️ Clients fetch failed, using fallback data");
      return fallbackData.clients || [];
    } catch (error) {
      console.error("❌ Clients fetch error:", error);
      return fallbackData.clients || [];
    }
  },

  /**
   * Clear clients cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.CLIENTS);
    console.log("🗑️ Clients cache cleared");
  },
};
