"use client";

import { useState, useEffect } from "react";
import { testimonialService } from "@/services/testimonialService";
import { useErrorHandler } from "./useErrorHandler";
import type { Testimonial, TestimonialFilters } from "@/types";

export function useTestimonials(filters?: TestimonialFilters, p0?: number) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialService.getTestimonials(filters);
        setTestimonials(data);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [filters?.service, filters?.featured, filters?.active, handleError]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getTestimonials(filters);
      setTestimonials(data);
    } catch (error: any) {
      handleError(error, false);
    } finally {
      setLoading(false);
    }
  };

  return { testimonials, loading, refetch };
}

export function useFeaturedTestimonials() {
  return useTestimonials({ featured: true });
}
