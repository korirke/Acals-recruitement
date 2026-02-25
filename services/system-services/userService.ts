import { api } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { User, Pagination, CreateUserData, UpdateUserData, SuspendUserData, ChangeRoleData} from '@/types/system/user.types';

export const userService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    scope?: 'website' | 'recruitment';
  }): Promise<{ users: User[]; pagination: Pagination }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.limit) queryParams.set('limit', String(params.limit));
      if (params?.search) queryParams.set('search', params.search);
      if (params?.role) queryParams.set('role', params.role);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.scope) queryParams.set('scope', params.scope);

      const response = await api.get(`${ENDPOINTS.ADMIN.USERS}?${queryParams.toString()}`);

      if (response.success) {
        return {
          users: response.data || [],
          pagination: response.pagination || {
            total: 0,
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: 0,
          },
        };
      }

      return {
        users: [],
        pagination: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.USERS}/${id}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  async create(data: CreateUserData): Promise<boolean> {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.USERS, data);
      return response.success;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async update(id: string, data: UpdateUserData): Promise<boolean> {
    try {
      const response = await api.put(`${ENDPOINTS.ADMIN.USERS}/${id}`, data);
      return response.success;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  async suspend(id: string, data?: SuspendUserData): Promise<boolean> {
    try {
      const response = await api.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/suspend`, data || {});
      return response.success;
    } catch (error) {
      console.error('Failed to suspend user:', error);
      throw error;
    }
  },

  async activate(id: string): Promise<boolean> {
    try {
      const response = await api.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/activate`);
      return response.success;
    } catch (error) {
      console.error('Failed to activate user:', error);
      throw error;
    }
  },

  async changeRole(id: string, data: ChangeRoleData): Promise<boolean> {
    try {
      const response = await api.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/role`, data);
      return response.success;
    } catch (error) {
      console.error('Failed to change role:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`${ENDPOINTS.ADMIN.USERS}/${id}`);
      return response.success;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      const response = await api.post(`${ENDPOINTS.ADMIN.USERS}/bulk-delete`, { ids });
      return response.success;
    } catch (error) {
      console.error('Failed to bulk delete users:', error);
      throw error;
    }
  },

  async getStats(scope?: 'website' | 'recruitment'): Promise<any> {
    try {
      const queryParams = scope ? `?scope=${scope}` : '';
      const response = await api.get(`${ENDPOINTS.ADMIN.USERS}/stats${queryParams}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  },
};
