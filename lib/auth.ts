/**
 * 🔐 Authentication Utilities
 * Token storage and management
 */

import { config } from "./config";

const TOKEN_KEY = config.tokenKey;

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Save JWT token to localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Decode JWT token (basic decode, not verified)
 */
export const decodeToken = (token: string): any => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};
