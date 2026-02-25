/**
 * Backup Types
 * Type definitions for database backup management
 */

export interface Backup {
  id: string;
  file_name: string;
  file_size: number;
  backup_type: 'manual' | 'scheduled' | 'auto';
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  database_name?: string;
  tables_count?: number;
  created_by?: string;
  created_at: string;
  last_downloaded_at?: string;
  download_count: number;
  last_restored_at?: string;
  restore_count: number;
}

export interface BackupSettings {
  auto_backup_enabled: boolean;
  backup_frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  backup_time: string; // HH:mm format
  max_backups: number;
  cloud_storage_enabled: boolean;
  cloud_storage_type: 's3' | 'google_drive' | 'dropbox' | null;
  cloud_storage_config: CloudStorageConfig | null;
  retention_days: number;
}

export interface CloudStorageConfig {
  // AWS S3
  s3_bucket?: string;
  s3_region?: string;
  s3_access_key?: string;
  s3_secret_key?: string;

  // Google Drive
  google_client_id?: string;
  google_client_secret?: string;
  google_refresh_token?: string;

  // Dropbox
  dropbox_access_token?: string;
}

export interface BackupStats {
  total_backups: number;
  completed_backups: number;
  failed_backups: number;
  total_size: number;
  total_size_formatted: string;
  last_backup?: Backup;
  disk_space_free: number;
  disk_space_free_formatted: string;
  disk_space_total: number;
  disk_space_total_formatted: string;
  disk_usage_percent: number;
}

export interface BackupTestResult {
  success: boolean;
  message: string;
  data?: {
    mysqldump: {
      success: boolean;
      path: string;
      version: string;
    };
    mysql: {
      success: boolean;
      path: string;
      version: string;
    };
    database: {
      success: boolean;
      database?: string;
      hostname?: string;
      error?: string;
    };
    backup_directory: {
      success: boolean;
      path: string;
      writable: boolean;
      exists: boolean;
    };
  };
}

export interface CreateBackupRequest {
  type?: 'manual' | 'scheduled' | 'auto';
  description?: string;
}

export interface RestoreBackupRequest {
  password: string;
}

export interface BackupListResponse {
  backups: Backup[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BackupFrequency {
  value: 'hourly' | 'daily' | 'weekly' | 'monthly';
  label: string;
  description: string;
}

export const BACKUP_FREQUENCIES: BackupFrequency[] = [
  {
    value: 'hourly',
    label: 'Every Hour',
    description: 'Backup runs every hour',
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Backup runs once per day',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Backup runs once per week',
  },
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'Backup runs once per month',
  },
];

export interface CloudStorageOption {
  value: 's3' | 'google_drive' | 'dropbox';
  label: string;
  icon: string;
}

export const CLOUD_STORAGE_OPTIONS: CloudStorageOption[] = [
  {
    value: 's3',
    label: 'Amazon S3',
    icon: 'Cloud',
  },
  {
    value: 'google_drive',
    label: 'Google Drive',
    icon: 'HardDrive',
  },
  {
    value: 'dropbox',
    label: 'Dropbox',
    icon: 'Droplet',
  },
];