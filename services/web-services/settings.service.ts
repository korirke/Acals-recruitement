/**
 * Settings Service
 * API service for website settings management
 */

import { api } from "@/lib/apiClient";
import type { SiteSettings } from "@/types/admin";

const ENDPOINTS = {
  GET: "/admin/settings",
  UPDATE: "/admin/settings",
  TEST_SMTP: "/admin/settings/test-smtp",
} as const;

export const settingsService = {
  /**
   * Fetch site settings
   */
  async get(): Promise<SiteSettings> {
    const response = await api.get<SiteSettings>(ENDPOINTS.GET);
    return response.data || getDefaultSettings();
  },

  /**
   * Update site settings
   */
  async update(settings: Partial<SiteSettings>): Promise<void> {
    await api.put(ENDPOINTS.UPDATE, settings);
  },

  /**
   * Test SMTP connection
   */
  async testSmtp(): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      ENDPOINTS.TEST_SMTP,
    );
    return response.data || { success: false, message: "No response" };
  },

  /**
   * Get default settings
   */
  getDefaults(): SiteSettings {
    return getDefaultSettings();
  },
};

function getDefaultSettings(): SiteSettings {
  return {
    siteName: "Fortune Technologies",
    siteTagline: "AI-powered HR solutions for modern businesses",
    siteUrl: "https://fortune.co.ke",
    adminEmail: "admin@fortune.co.ke",
    companyName: "Fortune Technologies Limited",
    tradingName: "Fortune Tech",
    registrationNumber: "",
    foundedYear: 2018,
    employeeCount: "50-100",
    companyDescription: "",
    primaryPhone: "+254 712 345 678",
    secondaryPhone: "",
    supportEmail: "support@fortune.co.ke",
    salesEmail: "sales@fortune.co.ke",
    physicalAddress: "",
    googleMapsUrl: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpFromName: "Fortune Technologies",
    smtpFromEmail: "noreply@fortune.co.ke",
    primaryColor: "#3B82F6",
    secondaryColor: "#F59E0B",
    accentColor: "#10B981",
    headingFont: "Inter",
    bodyFont: "Inter",
    metaTitle: "Fortune Technologies - AI-Powered HR Solutions",
    metaDescription:
      "Transform your HR processes with Fortune's cutting-edge AI solutions.",
    metaKeywords: "HR software, recruitment, AI, employee management",
    googleAnalyticsId: "",
    googleSearchConsole: "",
    notifyOnContact: true,
    notifyOnQuote: true,
    notifyOnConsultation: true,
    weeklyReports: false,
  };
}
