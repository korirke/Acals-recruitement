"use client";

import { useState, useCallback } from "react";
import { contactSubmissionService } from "@/services/web-services";
import { useErrorHandler } from "./useErrorHandler";
import type {
  ContactSubmission,
  ContactStatus,
} from "@/types/api/contact-submissions.types";

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { handleError, handleSuccess } = useErrorHandler();

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactSubmissionService.getAll();
      setSubmissions(data);
    } catch (error: any) {
      handleError(error.message || "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateStatus = useCallback(
    async (id: string, newStatus: ContactStatus) => {
      setUpdatingStatus(id);
      try {
        await contactSubmissionService.updateStatus(id, newStatus);
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, status: newStatus } : sub,
          ),
        );
        handleSuccess("Status updated successfully");
      } catch (error: any) {
        handleError(error.message || "Failed to update status");
      } finally {
        setUpdatingStatus(null);
      }
    },
    [handleSuccess, handleError],
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await contactSubmissionService.delete(id);
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        handleSuccess("Submission deleted successfully");
      } catch (error: any) {
        handleError(error.message || "Failed to delete submission");
      } finally {
        setDeletingId(null);
      }
    },
    [handleSuccess, handleError],
  );

  return {
    submissions,
    loading,
    updatingStatus,
    deletingId,
    fetchSubmissions,
    updateStatus,
    deleteSubmission,
  };
}
