/**
 * Services API Types
 */

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  icon: string;
  color: string;
  category: string;
  features: string[];
  benefits?: string[];
  processSteps?: ProcessStep[];
  complianceItems?: ComplianceItem[];
  imageUrl: string;
  heroImageUrl: string;
  processImageUrl: string;
  complianceImageUrl: string;
  onQuote: boolean;
  hasProcess: boolean;
  hasCompliance: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  position: number;
  price: string;
  buttonText: string;
  buttonLink: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ComplianceItem {
  title: string;
  description: string;
}

export interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  icon?: string;
  color?: string;
  category?: string;
  features?: string[];
  benefits?: string[];
  processSteps?: ProcessStep[];
  complianceItems?: ComplianceItem[];
  imageUrl?: string;
  heroImageUrl?: string;
  processImageUrl?: string;
  complianceImageUrl?: string;
  onQuote?: boolean;
  hasProcess?: boolean;
  hasCompliance?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  position: number;
  price?: string;
  buttonText?: string;
  buttonLink?: string;
  metadata?: Record<string, any> | null;
}

export interface ServiceUpdatePayload {
  services: ServiceFormData[];
}

export interface QuoteService {
  id: string;
  title: string;
  slug: string;
  category: string;
  position: number;
}

export interface ServiceCategory {
  name: string;
  count?: number;
}

export interface ServiceStats {
  total: number;
  active: number;
  featured: number;
  popular: number;
}

export type ServiceImageType =
  | "imageUrl"
  | "heroImageUrl"
  | "processImageUrl"
  | "complianceImageUrl";
