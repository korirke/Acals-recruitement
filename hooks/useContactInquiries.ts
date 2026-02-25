"use client";

import { useState, useEffect } from "react";
import { contactService } from "@/services/contactService";
import { useErrorHandler } from "./useErrorHandler";
import type {
  ContactInquiry,
  ContactInquiryFilters,
  ContactStats,
} from "@/types";

export function useContactInquiries(filters?: ContactInquiryFilters) {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const result = await contactService.getAllInquiries(filters);
        setInquiries(result.items);
        setPagination(result.pagination);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [filters?.status, filters?.search, filters?.page, filters?.limit]);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await contactService.getAllInquiries(filters);
      setInquiries(result.items);
      setPagination(result.pagination);
    } catch (error: any) {
      handleError(error, false);
    } finally {
      setLoading(false);
    }
  };

  return { inquiries, pagination, loading, refetch };
}

export function useContactStats() {
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await contactService.getStats();
        setStats(data);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

export function useContactInquiry(id: string) {
  const [inquiry, setInquiry] = useState<ContactInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const data = await contactService.getInquiryById(id);
        setInquiry(data);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInquiry();
    }
  }, [id]);

  const updateInquiry = async (data: {
    status?: string;
    notes?: string;
  }): Promise<boolean> => {
    try {
      setUpdating(true);
      const success = await contactService.updateInquiry(id, data);

      if (success) {
        handleSuccess("Inquiry updated successfully");
        // Refetch inquiry
        const updated = await contactService.getInquiryById(id);
        setInquiry(updated);
        return true;
      }

      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteInquiry = async (): Promise<boolean> => {
    try {
      const success = await contactService.deleteInquiry(id);

      if (success) {
        handleSuccess("Inquiry deleted successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    }
  };

  return { inquiry, loading, updating, updateInquiry, deleteInquiry };
}
