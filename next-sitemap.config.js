/** @type {import('next-sitemap').IConfig} */

export default {
  siteUrl: 'https://fortunekenya.com',
  generateRobotsTxt: false,
  outDir: './out',
  generateIndexSitemap: false,
  
  // Exclude all admin and auth routes
  exclude: [
    '/api/*',
    '/dashboard',
    '/about-mgmt',
    '/audit-logs',
    '/call-to-actions',
    '/clients',
    '/consultations',
    '/contact-info',
    '/contacts',
    '/content/*',
    '/crm/*',
    '/faqs-mgmt',
    '/footer',
    '/hero-dashboards',
    '/marketing/*',
    '/media',
    '/navigation',
    '/pages',
    '/products',
    '/quote-requests',
    '/recruitment/*',
    '/roles',
    '/section-contents',
    '/service-mgmt',
    '/servicess',
    '/settings',
    '/social-links',
    '/stats',
    '/theme',
    '/users',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
  
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  
  additionalPaths: async (config) => {
    return [];
  },
  
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};