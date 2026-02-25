// src/services/contactService.ts
/**
 * 📧 Contact Service
 * Handles contact form submissions and inquiry management
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  ContactFormData,
  ContactInquiry,
  ContactStats,
  ContactInquiryFilters,
  ApiResponse,
  ContactInquiryFormData,
} from "@/types";

export const contactService = {
  /**
   * Submit contact form (Public)
   */
  async submitContact(data: ContactInquiryFormData): Promise<boolean> {
    try {
      const response = await api.post<{ id: string; submittedAt: string }>(
        ENDPOINTS.PUBLIC.CONTACT_SUBMIT,
        data,
      );

      return response.success;
    } catch (error) {
      console.error("Contact submission error:", error);
      throw error;
    }
  },

  /**
   * Get all inquiries (Admin)
   */
  async getAllInquiries(filters?: ContactInquiryFilters): Promise<{
    items: ContactInquiry[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const url = `${ENDPOINTS.ADMIN.CONTACT}${params.toString() ? `?${params}` : ""}`;
      const response = await api.get<{
        items: ContactInquiry[];
        pagination: any;
      }>(url);

      if (response.success && response.data) {
        return response.data;
      }

      return {
        items: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    } catch (error) {
      console.error("Get inquiries error:", error);
      return {
        items: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    }
  },

  /**
   * Get inquiry by ID (Admin)
   */
  async getInquiryById(id: string): Promise<ContactInquiry | null> {
    try {
      const response = await api.get<ContactInquiry>(
        `${ENDPOINTS.ADMIN.CONTACT}/${id}`,
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Get inquiry error:", error);
      return null;
    }
  },

  /**
   * Update inquiry (Admin)
   */
  async updateInquiry(
    id: string,
    data: { status?: string; notes?: string },
  ): Promise<boolean> {
    try {
      const response = await api.put(`${ENDPOINTS.ADMIN.CONTACT}/${id}`, data);
      return response.success;
    } catch (error) {
      console.error("Update inquiry error:", error);
      throw error;
    }
  },

  /**
   * Delete inquiry (Admin)
   */
  async deleteInquiry(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`${ENDPOINTS.ADMIN.CONTACT}/${id}`);
      return response.success;
    } catch (error) {
      console.error("Delete inquiry error:", error);
      throw error;
    }
  },

  /**
   * Get contact stats (Admin)
   */
  async getStats(): Promise<ContactStats | null> {
    try {
      const response = await api.get<ContactStats>(
        `${ENDPOINTS.ADMIN.CONTACT}/stats`,
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Get contact stats error:", error);
      return null;
    }
  },
};
