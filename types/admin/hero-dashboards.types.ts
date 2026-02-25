/**
 * Hero Dashboard Types
 * Type definitions for hero section management
 */

import { PositionedEntity } from './common.types';

export type DashboardType = 'content' | 'image';
export type StatColor = 'primary' | 'accent';

export interface StatItem {
  label: string;
  value: string;
  color: StatColor;
}

export interface HeroDashboard extends PositionedEntity {
  title: string;
  description: string;
  type: DashboardType;
  stats?: StatItem[];
  features?: string[];
  imageUrl?: string;
}

export interface HeroContent {
  id?: string;
  trustBadge: string;
  mainHeading: string;
  subHeading: string;
  tagline: string;
  description: string;
  trustPoints: string[];
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText: string;
  secondaryCtaLink?: string;
  phoneNumber: string;
  chatWidgetUrl: string;
}

export interface HeroDashboardFormData {
  title: string;
  description: string;
  type: DashboardType;
  stats?: StatItem[];
  features?: string[];
  imageUrl?: string;
  position?: number;
  isActive?: boolean;
}

export interface HeroDataResponse {
  heroDashboards: HeroDashboard[];
  heroContent: HeroContent | null;
}

export type PreviewMode = 'desktop' | 'mobile';
export type ActiveTab = 'dashboards' | 'content';
