/**
 * Upload Service
 * API service for file uploads
 */

import { api } from "@/lib/apiClient";
import type { UploadResponse } from "@/types/admin";

const ENDPOINTS = {
  SINGLE: "/admin/upload",
  MULTIPLE: "/admin/upload/multiple",
} as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const uploadService = {
  /**
   * Validate a file before upload
   */
  validateFile(
    file: File,
    options?: { maxSize?: number; allowedTypes?: string[] },
  ): {
    valid: boolean;
    error?: string;
  } {
    const maxSize = options?.maxSize || MAX_FILE_SIZE;
    const allowedTypes = options?.allowedTypes || ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`,
      };
    }

    return { valid: true };
  },

  /**
   * Upload a single file
   */
  async uploadSingle(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>(
      ENDPOINTS.SINGLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.success && response.data?.url) {
      return response.data;
    }

    throw new Error("Upload failed: Invalid response");
  },

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<UploadResponse[]>(
      ENDPOINTS.MULTIPLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error("Upload failed: Invalid response");
  },

  /**
   * Upload an image with validation
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return this.uploadSingle(file);
  },
};
