// src/types/api/faq.types.ts
/**
 * 📋 FAQ API Types
 */

export interface FaqCategory {
  id: string;
  name: string;
  key: string;
  icon: string;
  description?: string;
  faqCount: number;
  position: number;
  isActive: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: {
    id: string;
    name: string;
    key: string;
    icon: string;
  };
  isPopular: boolean;
  tags: string[];
  views: number;
  helpfulCount: number;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqStats {
  totalFaqs: number;
  popularFaqs: number;
  totalViews: number;
  categories: number;
  topFaqs: Array<{
    id: string;
    question: string;
    views: number;
    helpfulCount: number;
  }>;
}
