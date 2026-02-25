/**
 * 🦸 Hero API Types
 */

export interface HeroResponse {
  heroDashboards: HeroDashboard[];
  heroContent: HeroContent;
}

export interface HeroDashboard {
  id: string;
  title: string;
  description: string;
  type: "content" | "image";
  imageUrl?: string | null;
  stats?: HeroStat[];
  features?: string[];
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStat {
  color: "primary" | "accent";
  label: string;
  value: string;
}

export interface HeroContent {
  id: string;
  trustBadge: string;
  mainHeading: string;
  subHeading: string;
  tagline: string;
  description: string;
  trustPoints: string[];
  primaryCtaText: string;
  secondaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaLink: string;
  phoneNumber: string;
  chatWidgetUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
