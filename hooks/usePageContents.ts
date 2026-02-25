import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { PageContent, CallToAction } from "@/types";

export const usePageContent = (pageKey: string) => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [ctas, setCtas] = useState<CallToAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);

        const [pageContentRes, ctasRes] = await Promise.allSettled([
          api.get<PageContent>(`/page-content/${pageKey}`),
          api.get<CallToAction[]>(`/call-to-actions/${pageKey}`),
        ]);

        // Handle page content
        if (
          pageContentRes.status === "fulfilled" &&
          pageContentRes.value.data
        ) {
          setPageContent(pageContentRes.value.data);
        }

        // Handle CTAs
        if (ctasRes.status === "fulfilled") {
          const ctasData = Array.isArray(ctasRes.value.data)
            ? ctasRes.value.data
            : [];
          setCtas(
            ctasData
              .filter((c) => c.isActive)
              .sort((a, b) => a.position - b.position),
          );
        } else {
          setCtas([]);
        }
      } catch (err) {
        console.error("Failed to fetch page content:", err);
      } finally {
        setLoading(false);
      }
    };

    if (pageKey) fetchPageContent();
  }, [pageKey]);

  return { pageContent, ctas, loading };
};
