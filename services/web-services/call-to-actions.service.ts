/**
 * Call to Actions Service
 * API service for CTA management
 */

import { api } from "@/lib/apiClient";
import type { CallToAction } from "@/types/admin/call-to-actions.types";

const ENDPOINTS = {
  GET_BY_PAGE: (pageKey: string) => `/call-to-actions/${pageKey}`,
  UPDATE: "/admin/call-to-actions",
} as const;

export const callToActionsService = {
  /**
   * Fetch CTAs for a specific page
   */
  async getByPage(pageKey: string): Promise<CallToAction[]> {
    const response = await api.get<CallToAction[]>(
      ENDPOINTS.GET_BY_PAGE(pageKey),
    );
    const data = response.data || (response as unknown as CallToAction[]);
    return Array.isArray(data)
      ? data.sort((a, b) => a.position - b.position)
      : [];
  },

  /**
   * Update all CTAs (bulk update)
   */
  async updateAll(ctas: CallToAction[]): Promise<void> {
    const cleanedCTAs = ctas.map((cta) => {
      const { id, createdAt, updatedAt, ...ctaData } = cta;
      return {
        ...ctaData,
        ...(id.startsWith("temp-") ? {} : { id }),
      };
    });

    await api.put(ENDPOINTS.UPDATE, { ctas: cleanedCTAs });
  },

  /**
   * Create a new CTA object (local only)
   */
  createNew(pageKey: string, position: number): CallToAction {
    return {
      id: `temp-${Date.now()}`,
      pageKey,
      title: "Ready to Get Started?",
      description: "Join thousands of businesses who trust our solutions.",
      primaryText: "Get Free Consultation",
      primaryLink: "/contact",
      secondaryText: "Learn More",
      secondaryLink: "/about",
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-500",
      textColor: "text-white",
      position,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Move CTA in list
   */
  moveCTA(
    ctas: CallToAction[],
    id: string,
    direction: "up" | "down",
  ): CallToAction[] {
    const currentIndex = ctas.findIndex((c) => c.id === id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === ctas.length - 1)
    ) {
      return ctas;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedCTAs = [...ctas];

    [updatedCTAs[currentIndex], updatedCTAs[newIndex]] = [
      updatedCTAs[newIndex],
      updatedCTAs[currentIndex],
    ];

    updatedCTAs.forEach((cta, index) => {
      cta.position = index + 1;
    });

    return updatedCTAs;
  },
};
