// src/services/mediaService.ts
/**
 * 📁 Media Service
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { MediaFile, MediaStats, MediaFilters } from '@/types';

export const mediaService = {
  /**
   * Get all media files with filters
   */
  async getMediaFiles(filters?: MediaFilters): Promise<MediaFile[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.fileType && filters.fileType !== 'all') {
        params.set('fileType', filters.fileType);
      }
      if (filters?.search) {
        params.set('search', filters.search);
      }
      if (filters?.uploadedBy) {
        params.set('uploadedBy', filters.uploadedBy);
      }

      const url = params.toString() 
        ? `${ENDPOINTS.MEDIA.LIST}?${params.toString()}` 
        : ENDPOINTS.MEDIA.LIST;

      const response = await api.get<MediaFile[]>(url);

      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }

      console.warn('Media files response invalid');
      return [];
    } catch (error) {
      console.error('Media files fetch error:', error);
      return [];
    }
  },

  /**
   * Get media statistics
   */
  async getMediaStats(): Promise<MediaStats | null> {
    try {
      const response = await api.get<MediaStats>(ENDPOINTS.MEDIA.STATS);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Media stats fetch error:', error);
      return null;
    }
  },

  /**
   * Get single file info
   */
  async getFile(id: string): Promise<MediaFile | null> {
    try {
      const response = await api.get<MediaFile>(ENDPOINTS.MEDIA.GET(id));

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('File fetch error:', error);
      return null;
    }
  },

  /**
   * Delete file
   */
  async deleteFile(id: string): Promise<boolean> {
    try {
      const response = await api.delete(ENDPOINTS.MEDIA.DELETE(id));
      return response.success;
    } catch (error) {
      console.error('File delete error:', error);
      throw error;
    }
  },

  /**
   * Bulk delete files
   */
  async bulkDeleteFiles(ids: string[]): Promise<boolean> {
    try {
      await Promise.all(ids.map(id => this.deleteFile(id)));
      return true;
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  },
};
