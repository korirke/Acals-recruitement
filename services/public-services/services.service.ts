/**
 * Services Service
 * Handles service data with caching and fallback support
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { fallbackData } from '@/lib/dummyData';
import type { Service, QuoteService } from '@/types';

export const servicesService = {
  /**
   * Get all services with optional filters
   */
  async getServices(params?: {
    featured?: boolean;
    onQuote?: boolean;
    category?: string;
  }): Promise<Service[]> {
    try {
      // Build cache key
      const cacheKey = params?.featured 
        ? CACHE_KEYS.SERVICES_FEATURED 
        : CACHE_KEYS.SERVICES;
      
      // Check cache first
      const cached = cache.get<Service[]>(cacheKey);
      if (cached) {
        console.log('✅ Services loaded from cache');
        return cached;
      }

      // Build query params
      const queryParams = new URLSearchParams();
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.onQuote) queryParams.append('onQuote', 'true');
      if (params?.category) queryParams.append('category', params.category);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.PUBLIC.SERVICES}?${queryParams}` 
        : ENDPOINTS.PUBLIC.SERVICES;

      // Fetch from API
      console.log('🌐 Fetching services from API...');
      const response = await api.get<Service[]>(url);
      
      if (response.success && response.data) {
        const services = Array.isArray(response.data) ? response.data : [];
        const activeServices = services.filter(s => s.isActive);
        
        cache.set(cacheKey, activeServices, CACHE_TTL.LONG);
        console.log('✅ Services fetched and cached:', activeServices.length);
        return activeServices;
      }
      
      console.warn('⚠️ Services fetch failed, using fallback data');
      return fallbackData.services || [];
    } catch (error) {
      console.error('❌ Services fetch error:', error);
      return fallbackData.services || [];
    }
  },

  /**
   * Get services available for quotes
   */
  async getQuoteServices(): Promise<QuoteService[]> {
    try {
      // Check cache first
      const cached = cache.get<QuoteService[]>(CACHE_KEYS.SERVICES_QUOTE);
      if (cached) {
        console.log('✅ Quote services loaded from cache');
        return cached;
      }

      // Fetch from API
      console.log('🌐 Fetching quote services from API...');
      const response = await api.get<QuoteService[]>(
        `${ENDPOINTS.PUBLIC.SERVICES}/quote-options`
      );
      
      if (response.success && response.data) {
        const services = Array.isArray(response.data) ? response.data : [];
        
        cache.set(CACHE_KEYS.SERVICES_QUOTE, services, CACHE_TTL.LONG);
        console.log('✅ Quote services fetched and cached:', services.length);
        return services;
      }
      
      console.warn('⚠️ Quote services fetch failed');
      return [];
    } catch (error) {
      console.error('❌ Quote services fetch error:', error);
      return [];
    }
  },

  /**
   * Get service categories
   */
  async getServiceCategories(): Promise<string[]> {
    try {
      // Check cache first
      const cached = cache.get<string[]>(CACHE_KEYS.SERVICES_CATEGORIES);
      if (cached) {
        console.log('✅ Service categories loaded from cache');
        return cached;
      }

      // Fetch from API
      console.log('🌐 Fetching service categories from API...');
      const response = await api.get<string[]>(
        `${ENDPOINTS.PUBLIC.SERVICES}/categories`
      );
      
      if (response.success && response.data) {
        const categories = Array.isArray(response.data) ? response.data : [];
        
        cache.set(CACHE_KEYS.SERVICES_CATEGORIES, categories, CACHE_TTL.LONG);
        console.log('✅ Service categories fetched and cached:', categories.length);
        return categories;
      }
      
      console.warn('⚠️ Service categories fetch failed');
      return [];
    } catch (error) {
      console.error('❌ Service categories fetch error:', error);
      return [];
    }
  },

  /**
   * Clear services cache
   */
  clearCache(): void {
    cache.delete(CACHE_KEYS.SERVICES);
    cache.delete(CACHE_KEYS.SERVICES_FEATURED);
    cache.delete(CACHE_KEYS.SERVICES_QUOTE);
    cache.delete(CACHE_KEYS.SERVICES_CATEGORIES);
    console.log('🗑️ Services cache cleared');
  },
};