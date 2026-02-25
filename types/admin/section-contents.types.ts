/**
 * Section Content Types
 * Type definitions for section content management
 */

import { BaseEntity } from './common.types';

export interface SectionContent extends BaseEntity {
  sectionKey: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface SectionContentFormData {
  sectionKey: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface SectionContentData {
  [key: string]: SectionContent;
}

export interface PredefinedSection {
  key: string;
  title: string;
  description: string;
}

export const PREDEFINED_SECTIONS: PredefinedSection[] = [
  {
    key: 'ourClients',
    title: 'Our Clients Section',
    description: 'Content for the client showcase section',
  },
  {
    key: 'features',
    title: 'Features Section',
    description: 'Content for the features section',
  },
  {
    key: 'aboutUs',
    title: 'About Us Section',
    description: 'Content for the about us section',
  },
  {
    key: 'whyChooseUs',
    title: 'Why Choose Us Section',
    description: 'Content for the why choose us section',
  },
  {
    key: 'ourServices',
    title: 'Our Services Section',
    description: 'Content for the services overview section',
  },
  {
    key: 'testimonials',
    title: 'Testimonials Section',
    description: 'Content for the testimonials section',
  },
  {
    key: 'stats',
    title: 'Stats Section',
    description: 'Content for the statistics section',
  },
  {
    key: 'contactUs',
    title: 'Contact Us Section',
    description: 'Content for the contact section',
  },
];
