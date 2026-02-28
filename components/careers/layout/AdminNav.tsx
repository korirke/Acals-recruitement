"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Building2,
  Settings,
  BarChart3,
  Shield,
  Tags,
  Mail,
  Activity,
  TrendingUp,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: any;
  roles: string[];
}

interface AdminNavProps {
  onNavigate?: () => void;
}

export default function AdminNav({ onNavigate }: AdminNavProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const allLinks: NavLink[] = [
    {
      href: "/recruitment-portal/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["EMPLOYER", "MODERATOR", "HR_MANAGER", "SUPER_ADMIN"],
    },
    // {
    //   href: "/recruitment-portal/analytics",
    //   label: "Analytics",
    //   icon: BarChart3,
    //   roles: ["HR_MANAGER", "SUPER_ADMIN"],
    // },
    {
      href: "/recruitment-portal/jobs",
      label: "Jobs",
      icon: Briefcase,
      roles: ["EMPLOYER", "MODERATOR", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/moderation",
      label: "Moderation Queue",
      icon: Shield,
      roles: ["MODERATOR", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/applications",
      label: "Applications",
      icon: FileText,
      roles: ["EMPLOYER", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/interviews",
      label: "Interviews",
      icon: FileText,
      roles: ["EMPLOYER", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/shortlist",
      label: "Shortlist",
      icon: TrendingUp,
      roles: ["EMPLOYER", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/candidates",
      label: "Candidates",
      icon: Users,
      roles: ["EMPLOYER", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/companies",
      label: "Employer Companies",
      icon: Building2,
      roles: ["MODERATOR", "HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/users",
      label: "Users",
      icon: Users,
      roles: ["HR_MANAGER", "SUPER_ADMIN"],
    },
    {
      href: "/recruitment-portal/categories",
      label: "Categories",
      icon: Tags,
      roles: ["HR_MANAGER", "SUPER_ADMIN"],
    },
    // {
    //   href: "/recruitment-portal/communications",
    //   label: "Communications",
    //   icon: Mail,
    //   roles: ["HR_MANAGER", "SUPER_ADMIN"],
    // },
    {
      href: "/recruitment-portal/audit-logs",
      label: "Audit Logs",
      icon: Activity,
      roles: ["HR_MANAGER", "SUPER_ADMIN"],
    },

    {
      href:
        user?.role === "EMPLOYER"
          ? "/recruitment-portal/company/edit"
          : "/recruitment-portal/settings",
      label: user?.role === "EMPLOYER" ? "Company Profile" : "Settings",
      icon: Settings,
      roles: ["EMPLOYER", "HR_MANAGER", "SUPER_ADMIN"],
    },
  ];

  const visibleLinks = allLinks.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <nav className="space-y-1">
      {visibleLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname?.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive
                ? "bg-linear-to-r from-primary-500 to-orange-500 text-white shadow-md"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
          >
            <link.icon
              className={cn(
                "h-4 w-4 transition-transform duration-200 shrink-0",
                isActive ? "scale-110" : "group-hover:scale-110",
              )}
            />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
