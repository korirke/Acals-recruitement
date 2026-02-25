// src/hooks/useAbout.ts
'use client';

import { useState, useEffect } from 'react';
import { aboutService } from '@/services/public-services/aboutService';
import { useErrorHandler } from './useErrorHandler';
import type { AboutContent } from '@/types';
import {fallbackData } from '@/lib/dummyData';

export function useAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAboutContent();
        
        if (data) {
          setContent(data);
        } else {
          // Use fallback data
          console.warn('Using fallback about data');
          setContent(fallbackData.fallbackAboutData);
        } 
      } catch (error: any) {
        console.error('Failed to fetch about content, using fallback');
        setContent(fallbackData.fallbackAboutData);
        handleError(error, false);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, [handleError]);

  return { content, loading };
}

export function useAboutAdmin() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [originalContent, setOriginalContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAboutContent();
      
      if (data) {
        setContent(data);
        setOriginalContent(data);
      } else {
        // Initialize with fallback structure
        const emptyContent: AboutContent = {
          hero: { title: '', subtitle: '', description: '' },
          mission: { title: 'Our Mission', content: '' },
          vision: { title: 'Our Vision', content: '' },
          history: { title: 'Our Journey', description: '', timeline: [] },
          team: { title: 'Leadership Team', description: '', members: [] },
          values: [],
          seo: { metaTitle: '', metaDescription: '', keywords: [] }
        };
        setContent(emptyContent);
        setOriginalContent(emptyContent);
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveContent = async (updatedContent: AboutContent): Promise<boolean> => {
    try {
      setSaving(true);
      
      const success = originalContent?.hero?.title 
        ? await aboutService.updateAboutContent(updatedContent)
        : await aboutService.createAboutContent(updatedContent);

      if (success) {
        handleSuccess('About content saved successfully!');
        await fetchContent();
        return true;
      } else {
        handleError('Failed to save about content');
        return false;
      }
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = content && originalContent 
    ? JSON.stringify(content) !== JSON.stringify(originalContent)
    : false;

  return {
    content,
    setContent,
    loading,
    saving,
    hasChanges,
    saveContent,
    refetch: fetchContent,
  };
}
