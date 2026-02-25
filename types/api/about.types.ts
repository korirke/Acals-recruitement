// src/types/api/about.types.ts
/**
 * 📄 About Page API Types
 */

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
}

export interface MissionSection {
  title: string;
  content: string;
  icon?: string;
}

export interface VisionSection {
  title: string;
  content: string;
  icon?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface HistorySection {
  title: string;
  description: string;
  timeline: TimelineItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  specialties: string[];
}

export interface TeamSection {
  title: string;
  description: string;
  members: TeamMember[];
}

export interface CoreValue {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface AboutContent {
  hero: HeroSection;
  mission: MissionSection;
  vision: VisionSection;
  history: HistorySection;
  team: TeamSection;
  values: CoreValue[];
  seo: SeoSettings;
}

export interface AboutResponse {
  id?: string;
  content?: AboutContent;
  createdAt?: string;
  updatedAt?: string;
}
