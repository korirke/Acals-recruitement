/**
 * API service for database backup management
 */

import { api } from '@/lib/apiClient';
import type {
  Backup,
  BackupSettings,
  BackupStats,
  BackupTestResult,
  CreateBackupRequest,
  BackupListResponse,
} from '@/types';
import { getToken } from '@/lib/auth';

const ENDPOINTS = {
  LIST: '/backup',
  CREATE: '/backup/create',
  DOWNLOAD: '/backup/download',
  RESTORE: '/backup/restore',
  DELETE: '/backup',
  SETTINGS: '/backup/settings',
  STATS: '/backup/stats',
  TEST_CONFIG: '/backup/test-config',
} as const;

export const backupService = {
  /**
   * Get all backups with pagination and filters
   */
  async getBackups(params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'completed' | 'failed';
    type?: 'manual' | 'scheduled' | 'auto';
  }): Promise<BackupListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);

      const response = await api.get<BackupListResponse>(
        `${ENDPOINTS.LIST}?${queryParams.toString()}`
      );
      
      return response.data || { 
        backups: [], 
        pagination: { page: 1, limit: 20, total: 0, pages: 0 } 
      };
    } catch (error: any) {
      console.error('Get backups error:', error);
      throw new Error(error.message || 'Failed to fetch backups');
    }
  },

  /**
   * Create a new backup
   */
  async createBackup(data: CreateBackupRequest): Promise<Backup> {
    try {
      const response = await api.post<Backup>(ENDPOINTS.CREATE, data);
      return response.data as Backup;
    } catch (error: any) {
      console.error('Create backup error:', error);
      throw new Error(error.message || 'Failed to create backup');
    }
  },

  /**
   * Download a backup file
   */
  async downloadBackup(backupId: string): Promise<Blob> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ENDPOINTS.DOWNLOAD}/${backupId}`;
      
      console.log('Downloading backup from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Download response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        } else if (response.status === 404) {
          throw new Error('Backup file not found');
        } else {
          throw new Error(errorText || 'Failed to download backup');
        }
      }

      return response.blob();
    } catch (error: any) {
      console.error('Download backup error:', error);
      throw new Error(error.message || 'Failed to download backup');
    }
  },

  /**
   * Restore a backup
   */
  async restoreBackup(backupId: string, password: string): Promise<void> {
    try {
      console.log('Restoring backup:', backupId);
      
      const response = await api.post<void>(
        `${ENDPOINTS.RESTORE}/${backupId}`,
        { password }
      );
      
      console.log('Restore response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Restore failed');
      }
    } catch (error: any) {
      console.error('Restore backup error:', error);
      throw new Error(error.message || 'Failed to restore backup');
    }
  },

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINTS.DELETE}/${backupId}`);
    } catch (error: any) {
      console.error('Delete backup error:', error);
      throw new Error(error.message || 'Failed to delete backup');
    }
  },

  /**
   * Get backup settings
   */
  async getSettings(): Promise<BackupSettings> {
    try {
      const response = await api.get<BackupSettings>(ENDPOINTS.SETTINGS);
      return response.data || getDefaultSettings();
    } catch (error: any) {
      console.error('Get settings error:', error);
      return getDefaultSettings();
    }
  },

  /**
   * Update backup settings
   */
  async updateSettings(settings: Partial<BackupSettings>): Promise<BackupSettings> {
    try {
      const response = await api.put<BackupSettings>(ENDPOINTS.SETTINGS, settings);
      return response.data as BackupSettings;
    } catch (error: any) {
      console.error('Update settings error:', error);
      throw new Error(error.message || 'Failed to update settings');
    }
  },

  /**
   * Get backup statistics
   */
  async getStats(): Promise<BackupStats> {
    try {
      const response = await api.get<BackupStats>(ENDPOINTS.STATS);
      return response.data as BackupStats;
    } catch (error: any) {
      console.error('Get stats error:', error);
      throw new Error(error.message || 'Failed to fetch statistics');
    }
  },

  /**
   * Test backup configuration
   */
  async testConfiguration(): Promise<BackupTestResult> {
    try {
      const response = await api.get<BackupTestResult>(ENDPOINTS.TEST_CONFIG);
      return response.data as BackupTestResult;
    } catch (error: any) {
      console.error('Test configuration error:', error);
      throw new Error(error.message || 'Failed to test configuration');
    }
  },

  /**
   * Get default settings
   */
  getDefaults(): BackupSettings {
    return getDefaultSettings();
  },
};

function getDefaultSettings(): BackupSettings {
  return {
    auto_backup_enabled: false,
    backup_frequency: 'daily',
    backup_time: '02:00',
    max_backups: 30,
    cloud_storage_enabled: false,
    cloud_storage_type: null,
    cloud_storage_config: null,
    retention_days: 90,
  };
}
