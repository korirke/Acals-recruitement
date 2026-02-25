// services/web-services/contact-submissions.service.ts
/**
 * Contact Submissions Service
 * API service for contact submission management
 */

import { api } from "@/lib/apiClient";
import type {
  ContactSubmission,
  ContactStatusUpdate,
  ContactStats,
  ContactStatus,
} from "@/types/api/contact-submissions.types";

const ENDPOINTS = {
  LIST: "/admin/contact-submissions",
  UPDATE_STATUS: (id: string) => `/admin/contact-submissions/${id}/status`,
  DELETE: (id: string) => `/admin/contact-submissions/${id}`,
} as const;

export const contactSubmissionService = {
  /**
   * Fetch all contact submissions
   */
  async getAll(): Promise<ContactSubmission[]> {
    try {
      const response = await api.get<ContactSubmission[]>(ENDPOINTS.LIST);
      const submissions = Array.isArray(response.data)
        ? response.data
        : [];
      
      // Sort by creation date (newest first)
      return submissions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Failed to fetch contact submissions:", error);
      return [];
    }
  },

  /**
   * Update submission status
   */
  async updateStatus(id: string, status: ContactStatus): Promise<void> {
    try {
      const payload: ContactStatusUpdate = { status };
      await api.put(ENDPOINTS.UPDATE_STATUS(id), payload);
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  },

  /**
   * Delete submission
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(ENDPOINTS.DELETE(id));
    } catch (error) {
      console.error("Failed to delete submission:", error);
      throw error;
    }
  },

  /**
   * Calculate statistics
   */
  calculateStats(submissions: ContactSubmission[]): ContactStats {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      contacted: submissions.filter((s) => s.status === "contacted").length,
      closed: submissions.filter((s) => s.status === "closed").length,
    };
  },

  /**
   * Filter submissions
   */
  filterSubmissions(
    submissions: ContactSubmission[],
    statusFilter: ContactStatus | "all",
    searchTerm: string
  ): ContactSubmission[] {
    return submissions.filter((submission) => {
      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.service?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  },

  /**
   * Generate email reply template
   */
  generateEmailReply(submission: ContactSubmission): string {
    const subject = encodeURIComponent(
      `Re: ${submission.service} Inquiry`
    );
    const body = encodeURIComponent(
      `Hi ${submission.name},\n\nThank you for your interest in our ${submission.service} service.\n\nBest regards,\nFortune Technologies Team`
    );
    return `mailto:${submission.email}?subject=${subject}&body=${body}`;
  },
};