/**
 * 🎯 API Endpoints
 * Centralized API endpoint definitions
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  PUBLIC: {
    NAVIGATION: "/navigation",
    HERO: "/hero",
    STATS: "/stats",
    FEATURES: "/features",
    TESTIMONIALS: "/testimonials",
    CLIENTS: "/clients",
    FOOTER: "/footer",
    CONTACT_INFO: "/contact-info",
    SOCIAL_LINKS: "/social-links",
    SERVICES: "/services",
    CONTACT: "/contact",
    PRICING_REQUEST: "/pricing-request",
    CONTACT_SUBMIT: "/contact/submit",
    FAQS: "/faq",
    FAQ_CATEGORIES: "/faq/categories",
    FAQ_STATS: "/faq/stats",
    SECTION_CONTENTS: "/section-contents",
    SECTION_CONTENT: "/section-content",
    PAGE_CONTENT: (pageKey: string) => `/page-content/${pageKey}`,
  },

  ADMIN: {
    USERS: "/users",
    ROLES: "/admin/roles",
    SETTINGS: "/admin/settings",
    AUDIT_LOGS: "/audit-logs",
    FAQ: "/faq",
    FAQ_CATEGORIES: "/faq/categories",
    QUOTE_REQUESTS: "/pricing-request",
    SERVICES: "/admin/services",
    TESTIMONIALS: "/admin/testimonials",
    CONTACT: "/contact",
    ABOUT: "/about",
  },

  MEDIA: {
    UPLOAD: "/admin/upload",
    UPLOAD_MULTIPLE: "/admin/upload/multiple",
    LIST: "/admin/upload",
    STATS: "/admin/upload/stats",
    GET: (id: string) => `/admin/upload/${id}`,
    DELETE: (id: string) => `/admin/upload/${id}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITIES: "/dashboard/activities",
    NOTIFICATIONS: "/dashboard/notifications",
  },

  // Users Management
  USERS: {
    LIST: "/users",
    GET: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Roles & Permissions
  ROLES: {
    LIST: "/roles",
    GET: (id: string) => `/roles/${id}`,
    CREATE: "/roles",
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
  },

  // Content Management
  CONTENT: {
    PAGES: "/content/pages",
    BLOG: "/content/blog",
    SERVICES: "/content/services",
    TESTIMONIALS: "/content/testimonials",
  },

  // CRM
  CRM: {
    LEADS: "/crm/leads",
    CONTACTS: "/crm/contacts",
  },

  // Settings
  SETTINGS: {
    GENERAL: "/settings/general",
    THEME: "/settings/theme",
    NAVIGATION: "/settings/navigation",
  },

  CANDIDATE: {
    PROFILE: "/candidate/profile",
    RESUME_UPLOAD: "/candidate/resume/upload",
    SKILLS: "/candidate/skills",
    REMOVE_SKILL: (skillId: string) => `/candidate/skills/${skillId}`,
    AVAILABLE_SKILLS: "/candidate/skills/available",
    DOMAINS: "/candidate/domains",
    REMOVE_DOMAIN: (domainId: string) => `/candidate/domains/${domainId}`,
    AVAILABLE_DOMAINS: "/candidate/domains/available",
    EDUCATION: "/candidate/education",
    UPDATE_EDUCATION: (id: string) => `/candidate/education/${id}`,
    DELETE_EDUCATION: (id: string) => `/candidate/education/${id}`,
    EXPERIENCE: "/candidate/experience",
    UPDATE_EXPERIENCE: (id: string) => `/candidate/experience/${id}`,
    DELETE_EXPERIENCE: (id: string) => `/candidate/experience/${id}`,
    APPLY: "/candidate/applications/apply",
    APPLICATIONS: "/candidate/applications",
    APPLICATION: (id: string) => `/candidate/applications/${id}`,
    WITHDRAW: (id: string) => `/candidate/applications/${id}/withdraw`,
  },

  COMPANIES: {
    // Public routes (no auth)
    PUBLIC_LIST: "/companies",
    PUBLIC_DETAIL: (slug: string) => `/companies/${slug}`,

    // Employer routes (Auth + EMPLOYER)
    SETUP: "/companies/setup",
    MY_PROFILE: "/companies/me/profile",
    MY_UPDATE: "/companies/me",
    MY_STATS: "/companies/me/stats",

    // Admin routes (Auth + ADMIN roles)
    ADMIN_ALL: "/companies/admin/all",
    ADMIN_PENDING: "/companies/admin/pending",
    ADMIN_DETAIL: (id: string) => `/companies/admin/${id}`,
    ADMIN_VERIFY: (id: string) => `/companies/admin/${id}/verify`,
    ADMIN_SUSPEND: (id: string) => `/companies/admin/${id}/suspend`,
    ADMIN_UPDATE: (id: string) => `/companies/admin/${id}`,
    ADMIN_STATUS: (id: string) => `/companies/admin/${id}/status`,
  },

  JOBS: {
    BASE: "/jobs",
    SEARCH: "/jobs/search",
    GET_BY_ID: (id: string) => `/jobs/${id}`,
    NEWEST: "/jobs/newest",
    CATEGORIES: "/jobs/categories",
    CREATE: "/jobs",
    MANAGE: (id: string) => `/jobs/manage/${id}`,
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    MY_JOBS: "/jobs/employer/my-jobs", //Employer uses this
    ADMIN_ALL: "/jobs/admin/all", // Only for admins
    CHANGE_STATUS: (id: string, status: string) =>
      `/jobs/${id}/status/${status}`,
    MODERATION_QUEUE: "/jobs/admin/moderation-queue",
    MODERATE: (id: string) => `/jobs/${id}/moderate`,
    BULK_STATUS: "/jobs/admin/bulk-status",
  },

  APPLICATIONS: {
    JOB_APPLICATIONS: (jobId: string) => `/applications/job/${jobId}`,
    FILTER: "/applications/filter",
    DETAILS: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    BULK_UPDATE: "/applications/bulk-update",
    DASHBOARD_STATS: "/applications/stats/dashboard",
    EXPORT_CSV: "/applications/export/csv",
    ADD_NOTE: (id: string) => `/applications/${id}/notes`,
    CANDIDATE_PROFILE: (candidateId: string) =>
      `/applications/candidate/${candidateId}/profile`,
  },

  RECRUITMENT: {
    ADMIN: "/recruitment-admin",
    USERS: "/recruitment-admin/users",
  },

  INTERVIEWS: {
    BASE: "/interviews",
    CREATE: "/interviews",
    SEARCH: "/interviews",
    GET_BY_ID: (id: string) => `/interviews/${id}`,
    UPDATE: (id: string) => `/interviews/${id}`,
    DELETE: (id: string) => `/interviews/${id}`,
    UPCOMING: "/interviews/upcoming",
    STATISTICS: "/interviews/statistics",
    BULK_UPDATE: "/interviews/bulk-update",
    SEND_REMINDER: (id: string) => `/interviews/${id}/send-reminder`,
  },

  RECRUITMENT_ADMIN: {
    // Dashboard & Analytics
    DASHBOARD_STATS: "/recruitment-admin/dashboard/stats",
    TOP_PERFORMERS: "/recruitment-admin/dashboard/top-performers",
    RECENT_ACTIVITIES: "/recruitment-admin/dashboard/recent-activities",
    GENERATE_REPORT: "/recruitment-admin/reports/generate",
    // Candidates
    FILTER_CANDIDATES: "/recruitment-admin/candidates",

    // Categories
    CATEGORIES: "/recruitment-admin/categories",
    UPDATE_CATEGORY: (categoryId: string) =>
      `/recruitment-admin/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId: string) =>
      `/recruitment-admin/categories/${categoryId}`,

    // Settings
    SETTINGS: "/recruitment-admin/settings",
  },

  AUDIT: {
    LOGS: "/audit/logs",
  },
} as const;

export default ENDPOINTS;