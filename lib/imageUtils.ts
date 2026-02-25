// src/lib/imageUtils.ts
/**
 * 🖼️ Image URL Utilities
 * Handles image URL resolution and optimization
 */

import { config } from './config';

/**
 * Normalize image URL to absolute URL
 * Handles relative paths, absolute paths, and full URLs
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '/logo.png'; // Fallback image

  // Already a full URL (http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Data URL (base64 encoded image)
  if (url.startsWith('data:')) {
    return url;
  }

  // Remove leading slash if present
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

  // ✅ Use mediaBaseUrl instead of apiBaseUrl
  return `${config.mediaBaseUrl}/${cleanUrl}`;
}

/**
 * Get optimized image URL with Next.js Image Optimization
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width?: number,
  quality?: number
): string {
  const normalizedUrl = normalizeImageUrl(url);
  
  // If it's an external URL, return as-is
  if (normalizedUrl.startsWith('http')) {
    return normalizedUrl;
  }

  return normalizedUrl;
}

/**
 * Get image with fallback
 */
export function getImageWithFallback(
  url: string | null | undefined,
  fallback: string = '/logo.png'
): string {
  if (!url) return fallback;
  return normalizeImageUrl(url);
}

/**
 * Preload image
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = normalizeImageUrl(url);
  });
}

/**
 * Check if image URL is valid
 */
export async function isImageValid(url: string): Promise<boolean> {
  try {
    await preloadImage(url);
    return true;
  } catch {
    return false;
  }
}
