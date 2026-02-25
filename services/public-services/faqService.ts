// src/services/faqService.ts
/**
 * 📋 FAQ Service
 * Handles FAQ data with fallback support
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Faq, FaqCategory, FaqStats } from '@/types';

export const faqService = {
  /**
   * Get all FAQs
   * @param includeInactive - When true (admin), returns all FAQs including inactive
   */
  async getFaqs(includeInactive = false): Promise<Faq[]> {
    try {
      const response = await api.get<Faq[]>(ENDPOINTS.PUBLIC.FAQS);
      
      if (response.success && Array.isArray(response.data)) {
        return includeInactive
          ? response.data
          : response.data.filter((faq: Faq) => faq.isActive);
      }
      
      console.warn('FAQs response invalid, using empty array');
      return [];
    } catch (error) {
      console.error('FAQs fetch error:', error);
      return [];
    }
  },

  /**
   * Get FAQ categories
   * @param includeInactive - When true (admin), returns all categories including inactive
   */
  async getFaqCategories(includeInactive = false): Promise<FaqCategory[]> {
    try {
      const response = await api.get<FaqCategory[]>(ENDPOINTS.PUBLIC.FAQ_CATEGORIES);
      
      if (response.success && Array.isArray(response.data)) {
        return includeInactive
          ? response.data
          : response.data.filter((cat: FaqCategory) => cat.isActive);
      }
      
      console.warn('FAQ categories response invalid, using empty array');
      return [];
    } catch (error) {
      console.error('FAQ categories fetch error:', error);
      return [];
    }
  },

  /**
   * Get FAQ stats
   */
  async getFaqStats(): Promise<FaqStats | null> {
    try {
      const response = await api.get<FaqStats>(ENDPOINTS.PUBLIC.FAQ_STATS);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('FAQ stats fetch error:', error);
      return null;
    }
  },

  /**
   * Submit FAQ helpful feedback
   */
  async submitFeedback(faqId: string, helpful: boolean): Promise<boolean> {
    try {
      const response = await api.post(`${ENDPOINTS.PUBLIC.FAQS}/${faqId}/helpful`, { helpful });
      return response.success;
    } catch (error) {
      console.error('FAQ feedback submission error:', error);
      return false;
    }
  },
};
