// src/services/pricingService.ts
/**
 * 💰 Pricing Service
 * Handles pricing and quote requests
 */

import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';

export interface PricingRequestData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  country: string;
  teamSize: string;
  services: string[];
  message: string;
  files?: File[];
}

export const pricingService = {
  /**
   * Submit pricing request with file uploads
   */
  async submitPricingRequest(data: PricingRequestData): Promise<boolean> {
    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('company', data.company);
      formData.append('industry', data.industry);
      formData.append('country', data.country);
      formData.append('teamSize', data.teamSize);
      formData.append('services', JSON.stringify(data.services));
      formData.append('message', data.message);

      // Append files if any
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // Use the api helper which already handles unwrapping
      // The response interceptor returns response.data directly
      const response = await api.post<{ success: boolean; message: string }>(
        ENDPOINTS.PUBLIC.PRICING_REQUEST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Response is already unwrapped by interceptor
      // response = { success: true, message: '...', data: {...} }
      return response.success;
    } catch (error) {
      console.error('Pricing request submission error:', error);
      throw error;
    }
  },
};
