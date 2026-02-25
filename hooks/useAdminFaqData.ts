'use client';

import { useState, useEffect } from 'react';
import { faqService } from '@/services/public-services/faqService';
import { useErrorHandler } from './useErrorHandler';
import type { Faq, FaqCategory, FaqStats } from '@/types';

/**
 * Admin FAQ hook - NO fallback data,
 */
export function useAdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFaqs(true); 
        
        // Only show backend data, no fallback
        setFaqs(data || []);
      } catch (error: any) {
        console.error('FAQ fetch error:', error);
        handleError(error, true);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [handleError]);

  const refetch = async () => {
    const data = await faqService.getFaqs(true); // includeInactive for admin
    setFaqs(data || []);
  };

  return { faqs, loading, refetch };
}

export function useAdminFaqCategories() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFaqCategories(true); // includeInactive for admin
        
        // Only show backend data, no fallback
        setCategories(data || []);
      } catch (error: any) {
        console.error('FAQ categories fetch error:', error);
        handleError(error, true);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [handleError]);

  const refetch = async () => {
    const data = await faqService.getFaqCategories(true);
    setCategories(data || []);
  };

  return { categories, loading, refetch };
}

export function useAdminFaqStats(faqs: Faq[], categories: FaqCategory[]) {
  const [stats, setStats] = useState<FaqStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const generateStats = (faqList: Faq[], catList: FaqCategory[]): FaqStats => {
      const safeFaqs = Array.isArray(faqList) ? faqList : [];
      const safeCats = Array.isArray(catList) ? catList : [];
      return {
        totalFaqs: safeFaqs.length,
        popularFaqs: safeFaqs.filter(f => f?.isPopular).length,
        totalViews: safeFaqs.reduce((sum, f) => sum + (f?.views || 0), 0),
        categories: safeCats.length,
        topFaqs: [...safeFaqs]
          .sort((a, b) => (b?.views || 0) - (a?.views || 0))
          .slice(0, 10)
          .map(f => ({
            id: f?.id || '',
            question: f?.question || '',
            views: f?.views || 0,
            helpfulCount: f?.helpfulCount || 0,
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
          // Generate stats from local data
          setStats(generateStats(faqs, categories));
        }
      } catch (error: any) {
        console.error('FAQ stats fetch error:', error);
        handleError(error, false);
        // Generate stats from local data on error
        setStats(generateStats(faqs, categories));
      } finally {
        setLoading(false);
      }
    };

    const safeFaqs = Array.isArray(faqs) ? faqs : [];
    const safeCats = Array.isArray(categories) ? categories : [];
    
    if (safeFaqs.length >= 0 || safeCats.length >= 0) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [faqs, categories, handleError]);

  return { stats, loading };
}
