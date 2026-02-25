/**
 * 🔐 Authentication API Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  token: string;
  admin: AdminUser;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
