'use client';

import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { useErrorHandler } from './useErrorHandler';
import type { Faq, FaqCategory } from '@/types';

export function useAdminFaq() {
  const [loading, setLoading] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const createFaq = async (data: Partial<Faq>): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { isActive, ...createData } = data;
      
      const response = await api.post(ENDPOINTS.ADMIN.FAQ, createData);
      
      if (response.success) {
        handleSuccess('FAQ created successfully');
        return true;
      }
      
      handleError('Failed to create FAQ');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFaq = async (id: string, data: Partial<Faq>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.put(`${ENDPOINTS.ADMIN.FAQ}/${id}`, data);
      
      if (response.success) {
        handleSuccess('FAQ updated successfully');
        return true;
      }
      
      handleError('Failed to update FAQ');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.delete(`${ENDPOINTS.ADMIN.FAQ}/${id}`);
      
      if (response.success) {
        handleSuccess('FAQ deleted successfully');
        return true;
      }
      
      handleError('Failed to delete FAQ');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleFaqActive = async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.patch(`${ENDPOINTS.ADMIN.FAQ}/${id}`, { isActive });
      
      if (response.success) {
        handleSuccess(`FAQ ${isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      }
      
      handleError('Failed to update FAQ status');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderFaqs = async (faqs: Array<{ id: string; position: number }>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.put(`${ENDPOINTS.ADMIN.FAQ}/reorder`, { faqs });
      
      if (response.success) {
        handleSuccess('FAQ order updated successfully');
        return true;
      }
      
      handleError('Failed to reorder FAQs');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: Partial<FaqCategory>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // ✅ Remove isActive from create payload
      const { isActive, ...createData } = data;
      
      const response = await api.post(ENDPOINTS.ADMIN.FAQ_CATEGORIES, createData);
      
      if (response.success) {
        handleSuccess('Category created successfully');
        return true;
      }
      
      handleError('Failed to create category');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, data: Partial<FaqCategory>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.put(`${ENDPOINTS.ADMIN.FAQ_CATEGORIES}/${id}`, data);
      
      if (response.success) {
        handleSuccess('Category updated successfully');
        return true;
      }
      
      handleError('Failed to update category');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.delete(`${ENDPOINTS.ADMIN.FAQ_CATEGORIES}/${id}`);
      
      if (response.success) {
        handleSuccess('Category deleted successfully');
        return true;
      }
      
      handleError('Failed to delete category');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryActive = async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.patch(`${ENDPOINTS.ADMIN.FAQ_CATEGORIES}/${id}`, { isActive });
      
      if (response.success) {
        handleSuccess(`Category ${isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      }
      
      handleError('Failed to update category status');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderCategories = async (categories: Array<{ id: string; position: number }>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.put(`${ENDPOINTS.ADMIN.FAQ_CATEGORIES}/reorder`, { categories });
      
      if (response.success) {
        handleSuccess('Category order updated successfully');
        return true;
      }
      
      handleError('Failed to reorder categories');
      return false;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaqActive,
    reorderFaqs,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    reorderCategories,
  };
}
