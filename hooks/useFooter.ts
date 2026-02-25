"use client";

import { useState, useEffect } from "react";
import { footerService } from "@/services/public-services";
import { useErrorHandler } from "./useErrorHandler";
import type { FooterResponse } from "@/types";

export function useFooter() {
  const [data, setData] = useState<FooterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setLoading(true);
        const footerData = await footerService.getFooter();
        setData(footerData);
      } catch (error: any) {
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, [handleError]);

  return {
    sections: data?.sections || [],
    contactInfo: data?.contactInfo || [],
    socialLinks: data?.socialLinks || [],
    loading,
  };
}
