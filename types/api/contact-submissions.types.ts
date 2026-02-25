// types/api/contact.types.ts
/**
 * Contact Submissions API Types
 */

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  status: ContactStatus;
  source: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type ContactStatus = 'pending' | 'contacted' | 'closed';

export interface ContactStatusUpdate {
  status: ContactStatus;
}

export interface ContactStats {
  total: number;
  pending: number;
  contacted: number;
  closed: number;
}

export interface ContactStatusOption {
  value: ContactStatus | 'all';
  label: string;
  color: string;
  bgColor: string;
  icon: any;
}