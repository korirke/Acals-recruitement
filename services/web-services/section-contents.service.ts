/**
 * Section Contents Service
 * API service for section content management
 */

import { api } from "@/lib/apiClient";
import type {
  SectionContent,
  SectionContentData,
  SectionContentFormData,
} from "@/types/admin";

const ENDPOINTS = {
  GET_ALL: "/section-contents",
  UPDATE: "/admin/section-content",
} as const;

export const sectionContentsService = {
  /**
   * Fetch all section contents
   */
  async getAll(): Promise<SectionContentData> {
    const response = await api.get<SectionContentData>(ENDPOINTS.GET_ALL);
    return response.data || {};
  },

  /**
   * Update a section content
   */
  async update(data: SectionContentFormData): Promise<void> {
    await api.put(ENDPOINTS.UPDATE, {
      sectionKey: data.sectionKey,
      title: data.title || null,
      subtitle: data.subtitle || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== false,
    });
  },

  /**
   * Create or update a section locally
   */
  updateLocal(
    sections: SectionContentData,
    sectionKey: string,
    updates: Partial<SectionContent>,
  ): SectionContentData {
    const existingSection = sections[sectionKey];

    return {
      ...sections,
      [sectionKey]: {
        ...(existingSection || {
          id: `temp-${Date.now()}`,
          sectionKey,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        ...updates,
        sectionKey,
        title:
          updates.title !== undefined
            ? updates.title
            : existingSection?.title || "",
      } as SectionContent,
    };
  },

  /**
   * Calculate section statistics
   */
  calculateStats(sections: SectionContentData): {
    configured: number;
    withTitle: number;
    withImages: number;
  } {
    const values = Object.values(sections);
    return {
      configured: Object.keys(sections).length,
      withTitle: values.filter((s) => s?.title).length,
      withImages: values.filter((s) => s?.imageUrl).length,
    };
  },
};
