/**
 * Section Content API Types
 */

export interface SectionContent {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionContentsResponse {
  features?: SectionContent;
  testimonials?: SectionContent;
  stats?: SectionContent;
  ourClients?: SectionContent;
  [key: string]: SectionContent | undefined;
}