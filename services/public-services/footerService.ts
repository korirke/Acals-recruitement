/**
 * 🦶 Footer Service
 * Handles footer data with fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type { FooterResponse } from "@/types";
import { fallbackData } from "@/lib/dummyData";

export const footerService = {
  /**
   * Get complete footer data
   */
  async getFooter(): Promise<FooterResponse> {
    try {
      const response = await api.get<FooterResponse>(ENDPOINTS.PUBLIC.FOOTER);

      if (response.success && response.data) {
        return response.data;
      }

      console.warn("Footer fetch failed, using fallback data");
      return fallbackData.footer as FooterResponse;
    } catch (error) {
      console.error("Footer fetch error:", error);
      return fallbackData.footer as FooterResponse;
    }
  },
};
