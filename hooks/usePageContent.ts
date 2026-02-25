"use client";

import { useState, useCallback } from "react";
import { pageContentService } from "@/services/web-services";
import { useErrorHandler } from "./useErrorHandler";
import type {
  PageContent,
  PageContentFormData,
  PageImageType,
} from "@/types/api/page-content.types";

export function usePageContent() {
  const [pageContents, setPageContents] = useState<
    Record<string, PageContent>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const { handleError, handleSuccess } = useErrorHandler();

  const fetchPageContents = useCallback(
    async (pageKeys: string[]) => {
      setLoading(true);
      try {
        const contentData = await pageContentService.getAllPageContentsBatch(
          pageKeys
        );
        setPageContents(contentData);

        const loadedKeys = Object.keys(contentData);
        const missingKeys = pageKeys.filter((key) => !loadedKeys.includes(key));

        if (missingKeys.length > 0) {
          handleError(
            `Failed to load some page contents: ${missingKeys.join(", ")}`
          );
        }

        return contentData;
      } catch (error: any) {
        handleError(error.message || "Failed to load page contents");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const updatePageContent = useCallback(
    (pageKey: string, updates: Partial<PageContent>) => {
      setPageContents((prev) => ({
        ...prev,
        [pageKey]: {
          ...prev[pageKey],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const savePageContent = useCallback(
    async (pageKey: string) => {
      setSaving(pageKey);
      try {
        const pageData = pageContents[pageKey];

        if (!pageData) {
          throw new Error("Page content not found");
        }

        const updatedContent = await pageContentService.updatePageContent(
          pageData as PageContentFormData
        );

        setPageContents((prev) => ({
          ...prev,
          [pageKey]: updatedContent,
        }));

        handleSuccess(`${pageKey} content updated successfully!`);
        return true;
      } catch (error: any) {
        handleError(error.message || "Failed to save page content");
        return false;
      } finally {
        setSaving(null);
      }
    },
    [pageContents, handleSuccess, handleError]
  );

  return {
    pageContents,
    loading,
    saving,
    fetchPageContents,
    updatePageContent,
    savePageContent,
  };
}

