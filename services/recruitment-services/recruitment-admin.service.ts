import { api } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api/common.types';

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  registeredCandidates: number;
  activeEmployers: number;
  pendingModeration: number;
  avgTimeToHire: number;
  successRate: number;
  trends?: {
    jobs: number;
    applications: number;
  };
}

export interface TopPerformers {
  topJobs: Array<{
    id: string;
    title: string;
    applicationCount: number;
    views: number;
    company: {
      name: string;
      logo?: string;
    };
  }>;
  topEmployers: Array<{
    id: string;
    name: string;
    logo?: string;
    _count: {
      jobs: number;
    };
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    jobCount: number;
  }>;
}

export interface Activity {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  _count?: {
    applications: number;
    postedJobs: number;
  };
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: any;
  defaultCurrency: string;
  timezone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  jobApprovalRequired: boolean;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  email: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  status: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
  _count?: {
    jobs: number;
    employerProfiles: number;
  };
  employerProfiles?: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  }>;
}


export const recruitmentAdminService = {
  // Dashboard & Analytics
  async getDashboardStats(period?: string, startDate?: string, endDate?: string): Promise<ApiResponse<DashboardStats>> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/recruitment-admin/dashboard/stats?${params.toString()}`);
  },

  async getTopPerformers(): Promise<ApiResponse<TopPerformers>> {
    return api.get('/recruitment-admin/dashboard/top-performers');
  },

  async getRecentActivities(limit?: number): Promise<ApiResponse<Activity[]>> {
    return api.get(`/recruitment-admin/dashboard/recent-activities${limit ? `?limit=${limit}` : ''}`);
  },

  async generateReport(period?: string, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/recruitment-admin/reports/generate?${params.toString()}`);
  },

  // User Management
  async getAllUsers(role?: string, status?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    return api.get(`/recruitment-admin/users${params.toString() ? '?' + params.toString() : ''}`);
  },

  // Candidates
  async filterCandidates(domainId?: string): Promise<ApiResponse<any[]>> {
    return api.get(`/recruitment-admin/candidates${domainId ? `?domainId=${domainId}` : ''}`);
  },

  // Categories
  async createCategory(data: any): Promise<ApiResponse<any>> {
    return api.post('/recruitment-admin/categories', data);
  },

  async updateCategory(categoryId: string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/recruitment-admin/categories/${categoryId}`, data);
  },

  async deleteCategory(categoryId: string): Promise<ApiResponse<any>> {
    return api.delete(`/recruitment-admin/categories/${categoryId}`);
  },

  // Settings
  async getSettings(): Promise<ApiResponse<any>> {
    return api.get('/recruitment-admin/settings');
  },

  async updateSettings(data: any): Promise<ApiResponse<any>> {
    return api.put('/recruitment-admin/settings', data);
  },
    async exportAnalyticsReport(period?: string, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/recruitment-admin/reports/export?${params.toString()}`);
  },
    async changeUserRole(userId: string, data: { newRole: string; reason?: string }): Promise<ApiResponse<any>> {
    return api.patch(`/recruitment-admin/users/${userId}/role`, data);
  },

  async getActivityLogs(limit?: number): Promise<ApiResponse<any[]>> {
    return api.get(`/recruitment-admin/logs/activity${limit ? `?limit=${limit}` : ''}`);
  },

  async getAuditLogs(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams(filters || {});
    return api.get(`/recruitment-admin/logs/audit${params.toString() ? '?' + params.toString() : ''}`);
  },


};
