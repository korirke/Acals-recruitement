/**
 * Settings Types
 * Type definitions for website settings management
 */

export interface SiteSettings {
  // General Site Info
  siteName: string;
  siteTagline: string;
  siteUrl: string;
  adminEmail: string;
  siteLogo?: string;

  // Company Details
  companyName: string;
  tradingName?: string;
  registrationNumber?: string;
  foundedYear?: number;
  employeeCount?: string;
  companyDescription?: string;

  // Contact Info
  primaryPhone?: string;
  secondaryPhone?: string;
  supportEmail?: string;
  salesEmail?: string;
  physicalAddress?: string;
  googleMapsUrl?: string;

  // Social Media
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;

  // SMTP Configuration
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromName?: string;
  smtpFromEmail?: string;

  // Theme & Branding
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;

  // SEO Defaults
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  googleSearchConsole?: string;

  // Notifications
  notifyOnContact?: boolean;
  notifyOnQuote?: boolean;
  notifyOnConsultation?: boolean;
  weeklyReports?: boolean;
}

export interface SettingsTab {
  id: string;
  label: string;
  icon: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: 'general', label: 'Site Information', icon: 'Globe' },
  { id: 'company', label: 'Company Details', icon: 'Building2' },
  { id: 'contact', label: 'Contact Info', icon: 'Phone' },
  { id: 'social', label: 'Social Media', icon: 'LinkIcon' },
  { id: 'email', label: 'Email (SMTP)', icon: 'Mail' },
  { id: 'appearance', label: 'Theme & Branding', icon: 'Palette' },
  { id: 'seo', label: 'SEO Defaults', icon: 'Search' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
];

export interface FontOption {
  value: string;
  label: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
];
