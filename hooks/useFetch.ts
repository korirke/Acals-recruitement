"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/apiClient";

interface UseFetchOptions {
  skip?: boolean;
  fallbackData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(endpoint: string, options: UseFetchOptions = {}) {
  const { skip = false, fallbackData, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (skip) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get<T>(endpoint);

      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      const error =
        err instanceof Error ? err : new Error(err.message || "Unknown error");
      setError(error);
      onError?.(error);

      // Use fallback data if provided
      if (fallbackData) {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, skip, fallbackData, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
