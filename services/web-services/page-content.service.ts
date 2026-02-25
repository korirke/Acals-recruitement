// services/web-services/page-content.service.ts
/**
 * Page Content Service
 * API service for page content management
 */

import { api } from "@/lib/apiClient";
import type {
  PageContent,
  PageContentFormData,
  PageContentBatchRequest,
  PageContentBatchResponse,
} from "@/types/api/page-content.types";

const ENDPOINTS = {
  GET_SINGLE: (pageKey: string) => `/admin/page-content/${pageKey}`,
  BATCH: "/admin/page-content/batch",
  UPDATE: "/admin/page-content",
} as const;

export const pageContentService = {
  /**
   * Fetch single page content
   */
  async getPageContent(pageKey: string): Promise<PageContent | null> {
    try {
      const response = await api.get<PageContent>(
        ENDPOINTS.GET_SINGLE(pageKey)
      );
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch page content for ${pageKey}:`, error);
      return null;
    }
  },

  /**
   * Fetch multiple page contents in a single batch request
   */
  async getAllPageContentsBatch(
    pageKeys: string[]
  ): Promise<PageContentBatchResponse> {
    try {
      const payload: PageContentBatchRequest = { pageKeys };
      const response = await api.post<PageContentBatchResponse>(
        ENDPOINTS.BATCH,
        payload
      );
      return response.data || {};
    } catch (error) {
      console.error("Batch fetch failed:", error);
      throw error;
    }
  },

  /**
   * Update page content
   */
  async updatePageContent(data: PageContentFormData): Promise<PageContent> {
    try {
      if (!data.pageKey) {
        throw new Error("Page key is required");
      }

      // Clean data - remove system fields
      const cleanData: PageContentFormData = { ...data };
      delete (cleanData as any).id;
      delete (cleanData as any).createdAt;
      delete (cleanData as any).updatedAt;

      const response = await api.put<PageContent>(ENDPOINTS.UPDATE, cleanData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Failed to update page content:", error);
      throw error;
    }
  },

  /**
   * Validate image URL
   */
  isValidImageUrl(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    } catch {
      return false;
    }
  },

  /**
   * Create default page content structure
   */
  createDefault(pageKey: string): Partial<PageContent> {
    return {
      pageKey,
      title: "",
      subtitle: "",
      description: "",
      heroTitle: "",
      heroSubtitle: "",
      heroDescription: "",
      heroImageUrl: "",
      processImageUrl: "",
      complianceImageUrl: "",
      ctaText: "",
      ctaLink: "",
      ctaSecondaryText: "",
      ctaSecondaryLink: "",
      isActive: true,
    };
  },
};