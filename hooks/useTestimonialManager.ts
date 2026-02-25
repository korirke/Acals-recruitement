"use client";

import { useState } from "react";
import { testimonialService } from "@/services/testimonialService";
import { useErrorHandler } from "./useErrorHandler";
import type { Testimonial } from "@/types";

export function useTestimonialManager() {
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);
  const { handleError, handleSuccess } = useErrorHandler();

  const saveTestimonials = async (
    testimonials: Testimonial[],
  ): Promise<boolean> => {
    try {
      setSaving(true);

      if (!Array.isArray(testimonials) || testimonials.length === 0) {
        throw new Error("No testimonials to save");
      }

      const cleaned = testimonials.map(({ createdAt, updatedAt, ...t }) => {
        const name = (t.name || "").trim();
        const role = (t.role || "").trim();
        const company = (t.company || "").trim();
        const content = (t.content || "").trim();

        if (!name || !role || !company || !content) {
          throw new Error(
            "Each testimonial must have name, role, company, and content.",
          );
        }

        const payload: any = {
          name,
          role,
          company,
          content,
          rating: t.rating || 5,
          avatar: (t.avatar || "").trim(),
          results: Array.isArray(t.results) ? t.results : [],
          service: (t.service || "").trim() || undefined,
          isActive: t.isActive !== false,
          isFeatured: !!t.isFeatured,
          position: t.position || 0,
        };

        if (t.id && !t.id.startsWith("temp-")) payload.id = t.id;

        return payload;
      });

      const ok = await testimonialService.updateTestimonials({
        testimonials: cleaned,
      });
      if (ok) {
        handleSuccess("Testimonials saved successfully");
        return true;
      }

      throw new Error("Failed to save testimonials");
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      if (!id) throw new Error("Testimonial id is required");
      if (id.startsWith("temp-")) return true;

      const ok = await testimonialService.deleteTestimonial(id);
      if (ok) {
        handleSuccess("Testimonial deleted");
        return true;
      }
      throw new Error("Failed to delete testimonial");
    } catch (error: any) {
      handleError(error);
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setUploadingAvatar("uploading");
      return await testimonialService.uploadAvatar(file);
    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setUploadingAvatar(null);
    }
  };

  return {
    saving,
    uploadingAvatar,
    saveTestimonials,
    deleteTestimonial,
    uploadAvatar,
  };
}
