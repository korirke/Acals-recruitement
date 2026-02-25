// src/lib/uploadUtils.ts
/**
 * 📤 File Upload Utilities
 */

import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '@/types';
import type { UploadResponse } from '@/types/api/media.types';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload single file with progress
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const axiosResponse = await apiClient.post<ApiResponse<UploadResponse>>(
      ENDPOINTS.MEDIA.UPLOAD,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    const response = axiosResponse.data;

    if (response) {
      // If response has success property, it's wrapped
      if (response?.success && response?.data) {
        return response.data;
      }

      if ('url' in response || 'id' in response) {
        return response as unknown as UploadResponse;
      }
    }

    throw new Error('Invalid upload response');
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResponse[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    
    const axiosResponse = await apiClient.post<ApiResponse<UploadResponse[]> | UploadResponse[]>(
      ENDPOINTS.MEDIA.UPLOAD_MULTIPLE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const response = axiosResponse.data;

    if (response) {
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response?.success === true && Array.isArray(response?.data)) {
        return response.data;
      }
    }

    // Debug: log what we actually received
    console.warn('Unexpected upload response format:', { 
      response, 
      isArray: Array.isArray(response),
      isWrapped: response?.success,
      keys: Object.keys(response || {})
    });
    
    throw new Error('Invalid upload response format');
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10, allowedTypes = [] } = options;

  if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.startsWith(type))) {
    return {
      valid: false,
      error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize}MB`,
    };
  }

  return { valid: true };
}