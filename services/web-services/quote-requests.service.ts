// services/web-services/quote-requests.service.ts
/**
 * Quote Requests Service
 * API service for quote request management
 */

import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { config } from "@/lib/config";
import type {
  QuoteRequest,
  QuoteAttachment,
  QuoteStatus,
  QuoteRequestsParams,
  QuoteRequestsResponse,
  SendQuotePayload,
  QuoteStats,
} from "@/types/api/quote-requests.types";

export const quoteRequestsService = {
  /**
   * Get all quote requests with optional filtering
   */
  async getRequests(
    params?: QuoteRequestsParams
  ): Promise<QuoteRequestsResponse> {
    const query = new URLSearchParams();

    if (params?.status && params.status !== "all")
      query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const url = query.toString()
      ? `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}?${query.toString()}`
      : ENDPOINTS.ADMIN.QUOTE_REQUESTS;

    const res = await api.get<any>(url);

    if (!res.success)
      throw new Error(res.message || "Failed to fetch quote requests");

    const data = res.data;

    // Handle different response formats
    if (Array.isArray(data)) {
      return { items: data };
    }

    if (data && Array.isArray(data.items)) {
      return { items: data.items, meta: data.meta ?? data };
    }

    return { items: [] };
  },

  /**
   * Get single quote request details
   */
  async getRequestDetails(id: string): Promise<QuoteRequest> {
    const res = await api.get<QuoteRequest>(
      `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}`
    );
    if (!res.success || !res.data)
      throw new Error(res.message || "Failed to load request");
    return res.data;
  },

  /**
   * Update quote request status
   */
  async updateStatus(
    id: string,
    status: QuoteStatus,
    notes?: string
  ): Promise<boolean> {
    const res = await api.put(
      `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}/status`,
      { status, notes }
    );
    return !!res.success;
  },

  /**
   * Get attachments for a quote request
   */
  async getAttachments(id: string): Promise<QuoteAttachment[]> {
    const res = await api.get<QuoteAttachment[]>(
      `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}/attachments`
    );
    if (!res.success)
      throw new Error(res.message || "Failed to fetch attachments");
    return Array.isArray(res.data) ? res.data : [];
  },

  /**
   * Upload attachment for quote
   */
  async uploadAttachment(id: string, file: File): Promise<QuoteAttachment> {
    const form = new FormData();
    form.append("file", file);

    const res = await api.post<QuoteAttachment>(
      `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}/upload-attachment`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!res.success || !res.data)
      throw new Error(res.message || "Upload failed");
    return res.data;
  },

  /**
   * Send quote email to customer
   */
  async sendQuote(id: string, payload: SendQuotePayload): Promise<boolean> {
    const res = await api.post(
      `${ENDPOINTS.ADMIN.QUOTE_REQUESTS}/${id}/send-quote`,
      payload
    );
    return !!res.success;
  },

  /**
   * Calculate statistics from requests
   */
  calculateStats(requests: QuoteRequest[]): QuoteStats {
    return {
      new: requests.filter((r) => r.status === "new").length,
      contacted: requests.filter((r) => r.status === "contacted").length,
      quoted: requests.filter((r) => r.status === "quoted").length,
      closed: requests.filter((r) => r.status === "closed").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
      total: requests.length,
    };
  },

  /**
   * Filter requests by search term
   */
  filterRequests(
    requests: QuoteRequest[],
    searchTerm: string
  ): QuoteRequest[] {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter((r) =>
      [r.name, r.email, r.company, r.industry].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  },

  /**
   * Generate download URL for attachment
   */
  getDownloadUrl(fileUrl?: string, fileName?: string): string {
    if (fileUrl) return fileUrl;
    if (!fileName) return "#";
    return `${config.mediaBaseUrl}/v1/uploads/Quotes/${fileName}`;
  },

  /**
   * Generate email template
   */
  generateEmailTemplate(request: QuoteRequest): {
    subject: string;
    body: string;
  } {
    return {
      subject: `Quote for ${request.services.join(", ")} - ${request.company}`,
      body: `Dear ${request.name},

Thank you for your interest in our services. Based on your requirements for ${request.services.join(", ")}, we have prepared a custom quote for ${request.company}.

Team Size: ${request.teamSize}
Industry: ${request.industry}
Location: ${request.country}

Please find the detailed quotation attached to this email.

Best regards,
Fortune Technologies Sales Team`,
    };
  },
};
