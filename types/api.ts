export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}
