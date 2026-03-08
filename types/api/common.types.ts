/**
 * 📝 Common API Types
 * Shared types for all API responses
 */

export interface ApiResponse<T = any> {
  messages: any;
  headers: any;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
