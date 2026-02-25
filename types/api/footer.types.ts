/**
 * 🦶 Footer API Types
 */

import { ContactInfo, SocialLink } from "./contact.types";
export interface FooterResponse {
  sections: FooterSection[];
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
}

export interface FooterSection {
  id: string;
  title: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  footerSectionId: string;
  name: string;
  href: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
