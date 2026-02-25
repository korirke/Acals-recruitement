/**
 * 🗂️ Client-Side Cache Manager
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Set cache entry with TTL (time to live in milliseconds)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cache = new CacheManager();

// Cache keys constants
export const CACHE_KEYS = {
  NAVIGATION: 'navigation',
  HERO: 'hero',
  FOOTER: 'footer',
  FEATURES: 'features',
  STATS: 'stats',
  TESTIMONIALS: 'testimonials',
  CLIENTS: 'clients',
  SERVICES: 'services',
  SERVICES_FEATURED: 'services_featured',
  SERVICES_QUOTE: 'services_quote',
  SERVICES_CATEGORIES: 'services_categories',
  CONTACT_INFO: 'contact_info',
  SOCIAL_LINKS: 'social_links',
  SECTIONS: 'sections',
  SECTION: (key: string) => `section_${key}`,
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  EXTRA_LONG: 60 * 60 * 1000, // 1 hour
} as const;