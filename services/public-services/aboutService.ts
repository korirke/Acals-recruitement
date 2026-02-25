// src/services/aboutService.ts
/**
 * 📄 About Service
 * Handles About page content with fallback support
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { AboutContent, AboutResponse } from '@/types';

export const aboutService = {
  /**
   * Get About page content
   */
  async getAboutContent(): Promise<AboutContent | null> {
    try {
      const response = await api.get<AboutResponse>('/about');
      
      if (response.success && response.data?.content) {
        return response.data.content;
      }
      
      console.warn('About content response invalid, using null');
      return null;
    } catch (error) {
      console.error('About content fetch error:', error);
      return null;
    }
  },

  /**
   * Update About page content (Admin only)
   */
  async updateAboutContent(content: AboutContent): Promise<boolean> {
    try {
      const response = await api.put('/about', { content });
      return response.success;
    } catch (error) {
      console.error('About content update error:', error);
      throw error;
    }
  },

  /**
   * Create About page content (Admin only)
   */
  async createAboutContent(content: AboutContent): Promise<boolean> {
    try {
      const response = await api.post('/about', { content });
      return response.success;
    } catch (error) {
      console.error('About content create error:', error);
      throw error;
    }
  },
};
