// src/types/api/contact.types.ts
/**
 * 📧 Contact API Types
 */

import { Metadata } from "next";

export interface ContactInquiry {
  id: string;
  inquiry: string;
  fullName: string;
  lastName?: string;
  email: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  notes?: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referer?: string;
    submittedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}


export interface ContactInquiryFormData {
  inquiry: string;
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
}

export interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  recent: ContactInquiry[];
}

export interface ContactInquiryFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}


export interface ContactSubmission extends ContactFormData {
  source?: string;
  metadata?: Metadata;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  source?: string;
}

export interface ContactSubmitResponse {
  id: string;
}

export interface SocialLink {
  id: string;
  name: string;
  icon: string;
  href: string;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'hours';
  label: string;
  value: string;
  icon?: string | null;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}