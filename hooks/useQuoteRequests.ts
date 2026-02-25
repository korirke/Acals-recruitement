"use client";

import { useCallback, useMemo, useState } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { quoteRequestsService } from "@/services/web-services";
import type {
  QuoteRequest,
  QuoteAttachment,
  QuoteStatus,
} from "@/types/api/quote-requests.types";

export function useQuoteRequests() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(
    null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [quoteAmount, setQuoteAmount] = useState<string>("");

  const [attachments, setAttachments] = useState<QuoteAttachment[]>([]);
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>(
    []
  );
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const { handleError, handleSuccess } = useErrorHandler();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await quoteRequestsService.getRequests({
        status: filterStatus,
        page: 1,
        limit: 100,
      });
      setRequests(items);
    } catch (e: any) {
      handleError(e.message || "Failed to fetch quote requests");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, handleError]);

  const openDetails = useCallback(
    async (id: string) => {
      try {
        const details = await quoteRequestsService.getRequestDetails(id);
        setSelectedRequest(details);
        setDetailsOpen(true);
      } catch (e: any) {
        handleError(e.message || "Failed to load request details");
      }
    },
    [handleError]
  );

  const updateStatus = useCallback(
    async (id: string, status: QuoteStatus) => {
      try {
        await quoteRequestsService.updateStatus(id, status);
        handleSuccess("Status updated successfully");
        await fetchRequests();
      } catch (e: any) {
        handleError(e.message || "Failed to update status");
      }
    },
    [fetchRequests, handleSuccess, handleError]
  );

  const openQuote = useCallback(async (req: QuoteRequest) => {
    setSelectedRequest(req);

    const template = quoteRequestsService.generateEmailTemplate(req);
    setEmailSubject(template.subject);
    setEmailBody(template.body);

    setQuoteAmount("");
    setSelectedAttachmentIds([]);
    setAttachments([]);

    setQuoteOpen(true);
  }, []);

  const toggleAttachment = useCallback((id: string) => {
    setSelectedAttachmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const uploadAttachment = useCallback(
    async (quoteId: string, file: File) => {
      setUploading(true);
      try {
        const saved = await quoteRequestsService.uploadAttachment(
          quoteId,
          file
        );
        setAttachments((prev) => [saved, ...prev]);
        setSelectedAttachmentIds((prev) => [saved.id, ...prev]);
        handleSuccess("File uploaded successfully");
      } catch (e: any) {
        handleError(e.message || "Failed to upload file");
      } finally {
        setUploading(false);
      }
    },
    [handleSuccess, handleError]
  );

  const sendQuote = useCallback(async () => {
    if (!selectedRequest) return;

    setSending(true);
    try {
      const amount = quoteAmount.trim() ? Number(quoteAmount) : null;

      await quoteRequestsService.sendQuote(selectedRequest.id, {
        subject: emailSubject,
        body: emailBody,
        quoteAmount: Number.isFinite(amount as any) ? amount : null,
        attachmentIds: selectedAttachmentIds,
      });

      handleSuccess("Quote sent successfully!");
      setQuoteOpen(false);
      setSelectedRequest(null);
      setSelectedAttachmentIds([]);
      setAttachments([]);
      await fetchRequests();
    } catch (e: any) {
      handleError(e.message || "Failed to send quote");
    } finally {
      setSending(false);
    }
  }, [
    selectedRequest,
    quoteAmount,
    emailSubject,
    emailBody,
    selectedAttachmentIds,
    fetchRequests,
    handleSuccess,
    handleError,
  ]);

  const filteredRequests = useMemo(() => {
    return quoteRequestsService.filterRequests(requests, searchTerm);
  }, [requests, searchTerm]);

  const stats = useMemo(() => {
    return quoteRequestsService.calculateStats(requests);
  }, [requests]);

  return {
    requests,
    filteredRequests,
    stats,
    loading,

    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,

    selectedRequest,
    setSelectedRequest,
    detailsOpen,
    setDetailsOpen,
    quoteOpen,
    setQuoteOpen,

    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    quoteAmount,
    setQuoteAmount,

    attachments,
    selectedAttachmentIds,
    toggleAttachment,
    uploading,
    uploadAttachment,

    fetchRequests,
    openDetails,
    openQuote,
    updateStatus,

    sendQuote,
    sending,
  };
}