/**
 * Sections Service
 * Handles section content data with caching and fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import type { SectionContent, SectionContentsResponse } from "@/types";

export const sectionsService = {
  /**
   * Get all section contents
   */
  async getSectionContents(): Promise<SectionContentsResponse> {
    try {
      // Check cache first
      const cached = cache.get<SectionContentsResponse>(CACHE_KEYS.SECTIONS);
      if (cached) {
        console.log("✅ Sections loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching sections from API...");
      const response = await api.get<SectionContentsResponse>(
        ENDPOINTS.PUBLIC.SECTION_CONTENTS,
      );

      if (response.success && response.data) {
        cache.set(CACHE_KEYS.SECTIONS, response.data, CACHE_TTL.LONG);
        console.log("✅ Sections fetched and cached");
        return response.data;
      }

      console.warn("⚠️ Sections fetch failed, using fallback data");
      return {};
    } catch (error) {
      console.error("❌ Sections fetch error:", error);
      return {};
    }
  },

  /**
   * Get single section content by key
   */
  async getSectionContent(sectionKey: string): Promise<SectionContent | null> {
    try {
      // Check cache first
      const cacheKey = CACHE_KEYS.SECTION(sectionKey);
      const cached = cache.get<SectionContent>(cacheKey);
      if (cached) {
        console.log(`✅ Section '${sectionKey}' loaded from cache`);
        return cached;
      }

      // Fetch from API
      console.log(`🌐 Fetching section '${sectionKey}' from API...`);
      const response = await api.get<SectionContent>(
        `${ENDPOINTS.PUBLIC.SECTION_CONTENT}/${sectionKey}`,
      );

      if (response.success && response.data) {
        cache.set(cacheKey, response.data, CACHE_TTL.LONG);
        console.log(`✅ Section '${sectionKey}' fetched and cached`);
        return response.data;
      }

      console.warn(`⚠️ Section '${sectionKey}' fetch failed`);
      return null;
    } catch (error) {
      console.error(`❌ Section '${sectionKey}' fetch error:`, error);
      return null;
    }
  },

  /**
   * Clear sections cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.SECTIONS);
    console.log("🗑️ Sections cache cleared");
  },

  /**
   * Clear specific section cache
   */
  clearSectionCache(sectionKey: string): void {
    cache.delete(CACHE_KEYS.SECTION(sectionKey));
    console.log(`🗑️ Section '${sectionKey}' cache cleared`);
  },
};
