/**
 * 🌐 Public API Types
 */

export interface Services {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDesc?: string;
  icon: string;
  color: string;
  features?: string[];
  buttonText: string;
  buttonLink?: string;
  isFeatured: boolean;
  onQuote: boolean;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stat {
  id: string;
  number: string;
  label: string;
  icon: string;
  color: string;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  results?: string[];
  service: string;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionContent {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address';
  label: string;
  value: string;
  icon: string;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteService {
  id: string;
  title: string;
  slug: string;
  category: string;
  position: number;
}

export interface SectionContentsResponse {
  features?: SectionContent;
  testimonials?: SectionContent;
  stats?: SectionContent;
  ourClients?: SectionContent;
}
