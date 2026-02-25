/**
 * 💬 Testimonial Service
 * Handles testimonial data with fallback support
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  Testimonial,
  UpdateTestimonialsDto,
  TestimonialFilters,
} from "@/types";

export const testimonialService = {
  /**
   * Get all testimonials with optional filters
   */
  async getTestimonials(filters?: TestimonialFilters): Promise<Testimonial[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.service) params.append("service", filters.service);
      if (filters?.featured !== undefined)
        params.append("featured", String(filters.featured));
      if (filters?.active !== undefined)
        params.append("active", String(filters.active));

      const url = `${ENDPOINTS.PUBLIC.TESTIMONIALS}${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await api.get<Testimonial[]>(url);

      if (response.success && Array.isArray(response.data)) {
        return response.data
          .filter((t: Testimonial) => t.isActive)
          .sort((a, b) => a.position - b.position);
      }

      console.warn("Testimonials response invalid, using empty array");
      return [];
    } catch (error) {
      console.error("Testimonials fetch error:", error);
      return [];
    }
  },

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.getTestimonials({ featured: true });
  },

  /**
   * Update all testimonials (Admin)
   */
  async updateTestimonials(data: UpdateTestimonialsDto): Promise<boolean> {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.TESTIMONIALS, data);
      return response.success;
    } catch (error) {
      console.error("Testimonials update error:", error);
      throw error;
    }
  },

  /**
   * Delete testimonial (Admin)
   */
  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const response = await api.delete(
        `${ENDPOINTS.ADMIN.TESTIMONIALS}/${id}`,
      );
      return response.success;
    } catch (error) {
      console.error("Testimonial delete error:", error);
      throw error;
    }
  },

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{ url: string }>(
        ENDPOINTS.MEDIA.UPLOAD,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.success && response.data?.url) {
        return response.data.url;
      }

      throw new Error("Upload failed: missing URL in response");
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  },
};
