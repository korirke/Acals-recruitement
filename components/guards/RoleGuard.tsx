"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        router.push(redirectTo || getDefaultRedirect(user.role));
      }
    }
  }, [user, loading, router, allowedRoles, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

function getDefaultRedirect(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "WEBSITE_ADMIN":
      return "/dashboard";
    case "HR_MANAGER":
    case "MODERATOR":
      return "/recruitment-portal/dashboard";
    case "EMPLOYER":
      return "/recruitment-portal/jobs";
    case "CANDIDATE":
      return "/careers-portal/jobs";
    default:
      return "/";
  }
}