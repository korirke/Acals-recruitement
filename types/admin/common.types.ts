/**
 * Common Admin Types
 * Shared types used across admin modules
 */

export interface AdminApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionedEntity extends BaseEntity {
  position: number;
  isActive: boolean;
}

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  affected: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  direction: SortDirection;
}

export interface FilterOptions {
  search?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}
