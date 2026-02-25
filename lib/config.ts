export const config = {
  // API Configuration
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://fortunekenya.com/v1/api"
      : "http://localhost:8080/api"),

  // Media/Upload Base URL (without /api)
  mediaBaseUrl:
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://fortunekenya.com/v1"
      : "http://localhost:8080"),

  // Site Configuration
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://fortunekenya.com"
      : "http://localhost:3000"),

  // Environment
  environment:
    process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // API Timeout
  apiTimeout: 10000, // 10 seconds

  // Token Configuration
  tokenKey: "fortune_admin_token",
  tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days

  // App Metadata
  appName: "Fortune Technologies Admin",
  appVersion: "1.0.0",
} as const;

export default config;
