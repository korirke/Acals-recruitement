"use client";

import { useState, useEffect } from "react";
import { auditLogService, AuditLog } from "@/services/system-services";
import { useErrorHandler } from "./useErrorHandler";

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const result = await auditLogService.getAll(params);
      setLogs(result.logs);
      setPagination(result.pagination);
    } catch (error: any) {
      handleError(error, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [
    params?.page,
    params?.limit,
    params?.userId,
    params?.action,
    params?.resource,
    params?.module,
    params?.startDate,
    params?.endDate,
  ]);

  return { logs, pagination, loading, refetch: fetchLogs };
}

export function useAuditLogStats(module?: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await auditLogService.getStats(module);
        setStats(result);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [module]);

  return { stats, loading };
}
