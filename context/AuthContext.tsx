"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { getToken, setToken, removeToken, isTokenExpired } from "@/lib/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role:
    | "SUPER_ADMIN"
    | "WEBSITE_ADMIN"
    | "HR_MANAGER"
    | "MODERATOR"
    | "EMPLOYER"
    | "CANDIDATE";
  status: string;
  emailVerified: boolean;
  avatar?: string;
  candidateProfile?: any;
  employerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "CANDIDATE" | "EMPLOYER";
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.warn("Token expired");
        removeToken();
        setLoading(false);
        return;
      }

      const response = await api.get(ENDPOINTS.AUTH.ME);

      if (response.success && response.data) {
        setUser(response.data);
        setError(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      setError(err.message);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);

      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);

        // Redirect based on role
        const redirectUrl = response.data.redirectUrl || "/careers-portal";
        router.push(redirectUrl);
        // setTimeout(() => {
        //   router.push(redirectUrl);
        // }, 100);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "CANDIDATE" | "EMPLOYER";
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(ENDPOINTS.AUTH.REGISTER, data);

      if (response.success) {
        // Show success message and redirect to login
        router.push("/login?registered=true");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
