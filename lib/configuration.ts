/**
 * Application Configuration
 * Centralized config for environment variables and constants
 */

// Get API base URL from environment with fallback
const getApiBaseUrl = (): string => {
  // Check if we're in browser or server
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_ variable
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  }
  // Server-side: can use either
  return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_URL || 'http://localhost:5000/api';
};

export const config = {
  // API Configuration
  apiBaseUrl: getApiBaseUrl(),
  apiTimeout: 30000,

  // Get backend base URL (without /api suffix) for file downloads
  backendBaseUrl: getApiBaseUrl().replace('/api', ''),

  // Environment
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // App Info
  appName: 'Fortune Technologies',
  appVersion: '1.0.0',
} as const;

// Helper function to construct full file URLs
export const getFileUrl = (relativePath: string | null): string | null => {
  if (!relativePath) return null;
  
  // If already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // If relative path, prepend backend base URL
  // Remove leading slash from relative path if present
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${config.backendBaseUrl}${cleanPath}`;
};
