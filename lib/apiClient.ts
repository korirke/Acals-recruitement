/**
 * 🌐 API Client
 * Axios instance with request/response interceptors
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "./config";
import { getToken, removeToken } from "./auth";
import type { ApiResponse } from "@/types/api/common.types";

// Create Axios instance
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor - Attach JWT token
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = getToken();
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (config.isDev) {
      console.log("🚀 API Request:", {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
        data: requestConfig.data,
      });
    }

    return requestConfig;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// ✅ Response Interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (config.isDev) {
      console.log("✅ API Response:", {
        url: response.config.url,
        status: response.status,
        // Avoid logging massive blobs
        data:
          response.config.responseType === "blob" ? "[Blob]" : response.data,
      });
    }

    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    // Network Error
    if (!error.response) {
      console.error("🌐 Network Error:", error.message);
      throw new Error("Network error. Please check your internet connection.");
    }

    const { status, data } = error.response;

    // 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      console.warn("🔒 Unauthorized - Redirecting to login");
      removeToken();

      // Only redirect if not already on login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }

      throw new Error(data?.messages?.error ||data?.message || 'Unauthorized. Please log in again.');
    }

    // 403 Forbidden
    if (status === 403) {
      throw new Error(
        (data as any)?.message || "Access denied. You do not have permission.",
      );
    }

    // 404 Not Found
    if (status === 404) {
      throw new Error((data as any)?.message || "Resource not found.");
    }

    // 422 Validation Error
    if (status === 422) {
      throw new Error(
        (data as any)?.message || "Validation error. Please check your input.",
      );
    }

    // 500 Server Error
    if (status >= 500) {
      console.error("💥 Server Error:", data);
      throw new Error(
        (data as any)?.message || "Server error. Please try again later.",
      );
    }

    // Default error
    throw new Error(
      (data as any)?.message ||
        error.message ||
        "An unexpected error occurred.",
    );
  },
);

// ✅ Typed API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<any, ApiResponse<T>>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<any, ApiResponse<T>>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<any, ApiResponse<T>>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<any, ApiResponse<T>>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<any, ApiResponse<T>>(url, config),

  // ✅ Blob download (XLSX/PDF/etc) — returns AxiosResponse<Blob> (for headers + filename)
  getBlob: (url: string, config?: AxiosRequestConfig) =>
    apiClient.get(url, { ...(config ?? {}), responseType: "blob" }) as Promise<
      AxiosResponse<Blob>
    >,
};

export default apiClient;
