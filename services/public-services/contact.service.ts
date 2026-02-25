/**
 * Contact Service
 * Handles contact form submissions and contact info with caching
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";
import { fallbackData } from "@/lib/dummyData";
import type { ContactFormData, ContactInfo, SocialLink } from "@/types";

export const contactService = {
  /**
   * Submit contact form
   */
  async submitContact(data: ContactFormData): Promise<boolean> {
    try {
      console.log("📤 Submitting contact form...");
      const response = await api.post(ENDPOINTS.PUBLIC.CONTACT, {
        ...data,
        source: data.source || "website",
      });

      if (response.success) {
        console.log("✅ Contact form submitted successfully");
        return true;
      }

      console.warn("⚠️ Contact form submission failed");
      return false;
    } catch (error) {
      console.error("❌ Contact form submission error:", error);
      return false;
    }
  },

  /**
   * Get contact information
   */
  async getContactInfo(): Promise<ContactInfo[]> {
    try {
      // Check cache first
      const cached = cache.get<ContactInfo[]>(CACHE_KEYS.CONTACT_INFO);
      if (cached) {
        console.log("✅ Contact info loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching contact info from API...");
      const response = await api.get<ContactInfo[]>(
        ENDPOINTS.PUBLIC.CONTACT_INFO,
      );

      if (response.success && response.data) {
        const contactInfo = Array.isArray(response.data) ? response.data : [];
        const activeInfo = contactInfo
          .filter((c) => c.isActive)
          .sort((a, b) => a.position - b.position);

        // If no contact info from API, use fallback
        if (activeInfo.length === 0) {
          console.warn("⚠️ No contact info from API, using fallback data");
          const fallbackInfo = fallbackData.footer?.contactInfo || [];
          cache.set(
            CACHE_KEYS.CONTACT_INFO,
            fallbackInfo,
            CACHE_TTL.EXTRA_LONG,
          );
          return fallbackInfo;
        }

        cache.set(CACHE_KEYS.CONTACT_INFO, activeInfo, CACHE_TTL.EXTRA_LONG);
        console.log("✅ Contact info fetched and cached:", activeInfo.length);
        return activeInfo;
      }

      console.warn("⚠️ Contact info fetch failed, using fallback data");
      return fallbackData.footer?.contactInfo || [];
    } catch (error) {
      console.error("❌ Contact info fetch error:", error);
      return fallbackData.footer?.contactInfo || [];
    }
  },

  /**
   * Get social links
   */
  async getSocialLinks(): Promise<SocialLink[]> {
    try {
      // Check cache first
      const cached = cache.get<SocialLink[]>(CACHE_KEYS.SOCIAL_LINKS);
      if (cached) {
        console.log("✅ Social links loaded from cache");
        return cached;
      }

      // Fetch from API
      console.log("🌐 Fetching social links from API...");
      const response = await api.get<SocialLink[]>(
        ENDPOINTS.PUBLIC.SOCIAL_LINKS,
      );

      if (response.success && response.data) {
        const socialLinks = Array.isArray(response.data) ? response.data : [];
        const activeLinks = socialLinks
          .filter((s) => s.isActive)
          .sort((a, b) => a.position - b.position);

        cache.set(CACHE_KEYS.SOCIAL_LINKS, activeLinks, CACHE_TTL.EXTRA_LONG);
        console.log("✅ Social links fetched and cached:", activeLinks.length);
        return activeLinks;
      }

      console.warn("⚠️ Social links fetch failed, using fallback data");
      return fallbackData.footer?.socialLinks || [];
    } catch (error) {
      console.error("❌ Social links fetch error:", error);
      return fallbackData.footer?.socialLinks || [];
    }
  },

  /**
   * Clear contact cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.CONTACT_INFO);
    cache.delete(CACHE_KEYS.SOCIAL_LINKS);
    console.log("🗑️ Contact cache cleared");
  },
};
