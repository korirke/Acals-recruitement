import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  module: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const auditLogService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    resource?: string;
    module?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ logs: AuditLog[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.limit) queryParams.set('limit', String(params.limit));
      if (params?.userId) queryParams.set('userId', params.userId);
      if (params?.action) queryParams.set('action', params.action);
      if (params?.resource) queryParams.set('resource', params.resource);
      if (params?.module) queryParams.set('module', params.module);
      if (params?.startDate) queryParams.set('startDate', params.startDate);
      if (params?.endDate) queryParams.set('endDate', params.endDate);

      const response = await api.get(`${ENDPOINTS.ADMIN.AUDIT_LOGS}?${queryParams.toString()}`);

      if (response.success) {
        return {
          logs: response.data || [],
          pagination: response.pagination || {},
        };
      }

      return { logs: [], pagination: {} };
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return { logs: [], pagination: {} };
    }
  },

  async getStats(module?: string): Promise<any> {
    try {
      const queryParams = module ? `?module=${module}` : '';
      const response = await api.get(`${ENDPOINTS.ADMIN.AUDIT_LOGS}/stats${queryParams}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch audit log stats:', error);
      return null;
    }
  },
};