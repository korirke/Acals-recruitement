// types/api/quote-requests.types.ts
/**
 * Quote Requests API Types
 */

export interface QuoteAttachment {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface ClientAttachment {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface QuoteEmail {
  id: string;
  subject: string;
  body: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  industry: string;
  teamSize: string;
  services: string[];
  message: string;
  status: QuoteStatus;
  priority: QuotePriority;
  createdAt: string;
  updatedAt: string;
  quoteAmount: number | null;
  attachments?: QuoteAttachment[];
  clientAttachments?: ClientAttachment[];
  emails?: QuoteEmail[];
}

export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'closed' | 'rejected';
export type QuotePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface QuoteRequestsParams {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface QuoteRequestsResponse {
  items: QuoteRequest[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendQuotePayload {
  subject: string;
  body: string;
  quoteAmount: number | null;
  attachmentIds: string[];
}

export interface QuoteStats {
  new: number;
  contacted: number;
  quoted: number;
  closed: number;
  rejected: number;
  total: number;
}

export interface QuoteStatusOption {
  value: QuoteStatus | 'all';
  label: string;
  color: string;
  bgColor: string;
  icon: any;
}