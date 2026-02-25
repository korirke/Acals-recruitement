// types/api/page-content.types.ts
/**
 * Page Content API Types
 */

export interface PageContent {
  id: string;
  pageKey: string;
  title: string;
  subtitle: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  processImageUrl: string;
  complianceImageUrl: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  keywords?: string;
  metaDescription?: string;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageContentFormData {
  pageKey: string;
  title?: string;
  subtitle?: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  processImageUrl?: string;
  complianceImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  keywords?: string;
  metaDescription?: string;
  metadata?: Record<string, unknown> | null;
  isActive?: boolean;
}

export interface PageContentBatchRequest {
  pageKeys: string[];
}

export interface PageContentBatchResponse {
  [pageKey: string]: PageContent;
}

export interface PageInfo {
  key: string;
  name: string;
  description: string;
}

export type PageImageType = 'heroImageUrl' | 'processImageUrl' | 'complianceImageUrl';