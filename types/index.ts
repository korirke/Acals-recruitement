/**
 * 📦 Type Exports
 * Central export point for all types
 */

export interface Metadata {
  [key: string]: unknown;
}
// ========================================
// API Types
// ========================================
export * from './api/common.types';
export * from './api/auth.types';
// export * from './api/dashboard.types';
export * from './api/navigation.types';
export * from './api/hero.types';
export * from './api/footer.types';
export * from './api/sections.types';
export * from './api/stats.types';
export * from './api/clients.types';
export * from './api/services.types';
export * from './api/contact.types';
export * from './api/about.types';
export * from './api/media.types';
export * from './api/testimonial.types';
export * from './api/faq.types';
export * from './api/search.types';


// ========================================
// Model Types
// ========================================
// export * from './models/admin.types';



// ========================================
// Recruitment Types
// ========================================
export * from './recruitment/application.types';
export * from './recruitment/job.types';
export * from './recruitment/candidate.types';
export * from './recruitment/interview.types';
export * from './recruitment/job.types';
export * from './recruitment/profileRequirements.types';
export * from './recruitment/company.types';
export * from './recruitment/profileFieldSettings.types';
export * from './recruitment/shortlist.types';

// ========================================
// System Types
// ========================================
export * from './system/backup.types';
export * from './system/user.types';


export interface PageContent {
  id: string;
  pageKey: string;
  title: string;
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
  metadata?: Metadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface CallToAction {
  id: string;
  pageKey: string;
  title: string;
  description?: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  bgColor?: string;
  textColor?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}