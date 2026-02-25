/**
 * 🍞 AdminBreadcrumb Component
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface AdminBreadcrumbProps {
  /** Custom page title (overrides auto-generated) */
  title?: string;
  /** Custom breadcrumb items (overrides auto-generated path) */
  items?: BreadcrumbItem[];
  /** Additional custom icon for the page */
  icon?: LucideIcon;
  /** Show home link */
  showHome?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Path label mappings for better readability
 */
const PATH_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  'call-to-actions': 'Call to Actions',
  'hero-dashboards': 'Hero Dashboards',
  'section-contents': 'Section Contents',
  'services-mgmt': 'Services',
  settings: 'Settings',
  media: 'Media Library',
  users: 'Users',
  products: 'Products',
  faqs: 'FAQs',
  'faqs-mgmt': 'FAQs',
  testimonials: 'Testimonials',
  navigation: 'Navigation',
  footer: 'Footer',
  'social-links': 'Social Links',
  'contact-info': 'Contact Info',
  stats: 'Statistics',
  theme: 'Theme',
  marketing: 'Marketing',
  content: 'Content',
  crm: 'CRM',
  leads: 'Leads',
  contacts: 'Contacts',
  recruitment: 'Recruitment',
  jobs: 'Jobs',
  applications: 'Applications',
  departments: 'Departments',
  locations: 'Locations',
  blog: 'Blog',
  posts: 'Posts',
  categories: 'Categories',
  authors: 'Authors',
  pages: 'Pages',
  consultations: 'Consultations',
  'quote-requests': 'Quote Requests',
  'case-studies': 'Case Studies',
  newsletter: 'Newsletter',
  'about-mgmt': 'About Page',
};

/**
 * Format path segment to readable label
 */
function formatPathLabel(segment: string): string {
  if (PATH_LABELS[segment]) {
    return PATH_LABELS[segment];
  }
  
  // Convert kebab-case to Title Case
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Build breadcrumb items from pathname
 */
function buildBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Skip dashboard as it's the home
    if (segment === 'dashboard' && i === 0) {
      continue;
    }

    const isLast = i === segments.length - 1;
    
    items.push({
      label: formatPathLabel(segment),
      href: isLast ? undefined : currentPath,
    });
  }

  return items;
}

export function AdminBreadcrumb({
  title,
  items,
  icon: PageIcon,
  showHome = true,
  className = '',
}: AdminBreadcrumbProps) {
  const pathname = usePathname();
  
  // Use custom items or build from path
  const breadcrumbItems = items || buildBreadcrumbsFromPath(pathname);
  
  // Get the last item for title if not provided
  const pageTitle = title || (breadcrumbItems.length > 0 
    ? breadcrumbItems[breadcrumbItems.length - 1].label 
    : 'Dashboard');

  return (
    <nav 
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Breadcrumb Trail */}
      <ol className="flex items-center flex-wrap text-sm text-neutral-600 dark:text-neutral-400">
        {showHome && (
          <li className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </li>
        )}
        
        {breadcrumbItems.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />
              
              {isLast || !item.href ? (
                <span className="flex items-center text-neutral-900 dark:text-white font-medium">
                  {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Optional: Current Page Title with Icon */}
      {PageIcon && (
        <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <PageIcon className="w-4 h-4" />
          <span>{pageTitle}</span>
        </div>
      )}
    </nav>
  );
}

/**
 * Hook to generate breadcrumb items with custom configuration
 */
export function useBreadcrumbs(
  customItems?: BreadcrumbItem[],
  additionalItems?: BreadcrumbItem[]
): BreadcrumbItem[] {
  const pathname = usePathname();
  
  if (customItems) {
    return additionalItems 
      ? [...customItems, ...additionalItems] 
      : customItems;
  }
  
  const autoItems = buildBreadcrumbsFromPath(pathname);
  
  return additionalItems 
    ? [...autoItems.slice(0, -1), ...additionalItems, autoItems[autoItems.length - 1]] 
    : autoItems;
}

export default AdminBreadcrumb;
