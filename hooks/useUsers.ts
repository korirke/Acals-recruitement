'use client';

import { useState, useEffect } from 'react';
import { userService} from '@/services/system-services';
import { User, Pagination, ChangeRoleData, SuspendUserData  } from '@/types';
import { useToast } from '@/components/admin/ui/Toast';

export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  scope?: 'website' | 'recruitment';
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await userService.getAll(params);
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params?.page, params?.limit, params?.search, params?.role, params?.status, params?.scope]);

  return { users, pagination, loading, refetch: fetchUsers };
}

export function useUserStats(scope?: 'website' | 'recruitment') {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await userService.getStats(scope);
      setStats(result);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to fetch stats',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [scope]);

  return { stats, loading, refetch: fetchStats };
}

export function useUserActions() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUser = async (data: any): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.create(data);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User created successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create user',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (id: string, data: any): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.update(id, data);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User updated successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update user',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const suspendUser = async (id: string, data?: SuspendUserData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.suspend(id, data);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User suspended successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to suspend user',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const activateUser = async (id: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.activate(id);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User activated successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to activate user',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeRole = async (id: string, data: ChangeRoleData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.changeRole(id, data);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User role changed successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to change role',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.delete(id);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'User deleted successfully',
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete user',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const bulkDelete = async (ids: string[]): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await userService.bulkDelete(ids);
      showToast({
        type: 'success',
        title: 'Success',
        message: `${ids.length} user(s) deleted successfully`,
      });
      return true;
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete users',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createUser,
    updateUser,
    suspendUser,
    activateUser,
    changeRole,
    deleteUser,
    bulkDelete,
    isSubmitting,
  };
}
