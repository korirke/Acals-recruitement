// src/types/api/media.types.ts
/**
 * 📁 Media Library API Types
 */

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  fileType: "image" | "video" | "document" | "other";
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaStats {
  total: number;
  images: number;
  documents: number;
  videos: number;
  totalSize: number;
}

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  fileType: string;
}

export interface MediaFilters {
  fileType?: "all" | "image" | "video" | "document";
  search?: string;
  uploadedBy?: string;
}
