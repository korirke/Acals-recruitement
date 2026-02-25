/**
 * Testimonial Service
 * Handles testimonial data with caching and fallback support
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { fallbackData } from '@/lib/dummyData';
import type { Testimonial } from '@/types';

export interface TestimonialFilters {
  featured?: boolean;
  service?: string;
  category?: string;
  limit?: number;
}

export const testimonialService = {
  /**
   * Get testimonials with optional filters
   */
  async getTestimonials(filters?: TestimonialFilters): Promise<Testimonial[]> {
    try {
      // Build cache key based on filters
      const cacheKey = filters?.featured 
        ? `${CACHE_KEYS.TESTIMONIALS}_featured`
        : CACHE_KEYS.TESTIMONIALS;
      
      // Check cache first
      const cached = cache.get<Testimonial[]>(cacheKey);
      if (cached) {
        console.log('✅ Testimonials loaded from cache');
        return cached;
      }

      // Build query params
      const queryParams = new URLSearchParams();
      if (filters?.featured) queryParams.append('featured', 'true');
      if (filters?.service) queryParams.append('service', filters.service);
      if (filters?.category) queryParams.append('category', filters.category);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.PUBLIC.TESTIMONIALS}?${queryParams}` 
        : ENDPOINTS.PUBLIC.TESTIMONIALS;

      // Fetch from API
      console.log('🌐 Fetching testimonials from API...');
      const response = await api.get<Testimonial[]>(url);
      
      if (response.success && response.data) {
        const testimonials = Array.isArray(response.data) ? response.data : [];
        const activeTestimonials = testimonials.filter(t => t.isActive);
        
        // Apply limit if specified
        const limitedTestimonials = filters?.limit 
          ? activeTestimonials.slice(0, filters.limit)
          : activeTestimonials;
        
        cache.set(cacheKey, limitedTestimonials, CACHE_TTL.LONG);
        console.log('✅ Testimonials fetched and cached:', limitedTestimonials.length);
        return limitedTestimonials;
      }
      
      console.warn('⚠️ Testimonials fetch failed, using fallback data');
      return fallbackData.testimonials || [];
    } catch (error) {
      console.error('❌ Testimonials fetch error:', error);
      return fallbackData.testimonials || [];
    }
  },

  /**
   * Get featured testimonials only
   */
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.getTestimonials({ featured: true });
  },

  /**
   * Get testimonials by service
   */
  async getTestimonialsByService(service: string): Promise<Testimonial[]> {
    return this.getTestimonials({ service });
  },

  /**
   * Get testimonials by category
   */
  async getTestimonialsByCategory(category: string): Promise<Testimonial[]> {
    return this.getTestimonials({ category });
  },

  /**
   * Clear testimonials cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.TESTIMONIALS);
    cache.delete(`${CACHE_KEYS.TESTIMONIALS}_featured`);
    console.log('🗑️ Testimonials cache cleared');
  },
};