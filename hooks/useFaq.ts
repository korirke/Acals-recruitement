"use client";

import { useState, useEffect } from "react";
import { faqService } from "@/services/public-services/faqService";
import { useErrorHandler } from "./useErrorHandler";
import type { Faq, FaqCategory, FaqStats } from "@/types";
import { fallbackData } from "@/lib/dummyData";

/**
 * Hook for fetching FAQs (with fallback for public pages only)
 */
export function useFaqs(useFallback = true) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFaqs();

        if (!data || data.length === 0) {
          // Only use fallback if explicitly allowed (public pages)
          if (useFallback) {
            console.log("No FAQs from API, using fallback data");
            setFaqs(fallbackData.faqs);
          } else {
            setFaqs([]);
          }
        } else {
          setFaqs(data);
        }
      } catch (error: any) {
        console.error("FAQ fetch error:", error);
        handleError(error, false);

        // Only use fallback if explicitly allowed
        if (useFallback) {
          setFaqs(fallbackData.faqs);
        } else {
          setFaqs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [useFallback, handleError]);

  return { faqs, loading };
}

/**
 * Hook for fetching FAQ categories (with fallback for public pages only)
 */
export function useFaqCategories(useFallback = true) {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFaqCategories();

        if (!data || data.length === 0) {
          // ✅ Only use fallback if explicitly allowed (public pages)
          if (useFallback) {
            console.log("No FAQ categories from API, using fallback data");
            setCategories(fallbackData.faqCategories);
          } else {
            setCategories([]);
          }
        } else {
          setCategories(data);
        }
      } catch (error: any) {
        console.error("FAQ categories fetch error:", error);
        handleError(error, false);

        // ✅ Only use fallback if explicitly allowed
        if (useFallback) {
          setCategories(fallbackData.faqCategories);
        } else {
          setCategories([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [useFallback, handleError]);

  return { categories, loading };
}

/**
 * Hook for fetching FAQ stats
 */
export function useFaqStats(faqs: Faq[], categories: FaqCategory[]) {
  const [stats, setStats] = useState<FaqStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const generateStats = (
      faqList: Faq[],
      catList: FaqCategory[],
    ): FaqStats => {
      return {
        totalFaqs: faqList.length,
        popularFaqs: faqList.filter((f) => f.isPopular).length,
        totalViews: faqList.reduce((sum, f) => sum + (f.views || 0), 0),
        categories: catList.length,
        topFaqs: faqList
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 10)
          .map((f) => ({
            id: f.id,
            question: f.question,
            views: f.views || 0,
            helpfulCount: f.helpfulCount || 0,
          })),
      };
    };

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFaqStats();

        if (data) {
          setStats(data);
        } else {
          setStats(generateStats(faqs, categories));
        }
      } catch (error: any) {
        console.error("FAQ stats fetch error:", error);
        handleError(error, false);
        setStats(generateStats(faqs, categories));
      } finally {
        setLoading(false);
      }
    };

    if (faqs.length > 0 || categories.length > 0) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [faqs, categories, handleError]);

  return { stats, loading };
}

/**
 * Hook for submitting FAQ feedback
 */
export function useFaqFeedback() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const { handleError, handleSuccess } = useErrorHandler();

  const submitFeedback = async (
    faqId: string,
    helpful: boolean,
  ): Promise<boolean> => {
    try {
      setSubmitting(true);
      const success = await faqService.submitFeedback(faqId, helpful);

      if (success) {
        setSubmitted((prev) => new Set(prev).add(faqId));
        handleSuccess("Thank you for your feedback!");
        return true;
      } else {
        handleError("Failed to submit feedback");
        return false;
      }
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, submitted, submitFeedback };
}
