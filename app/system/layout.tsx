"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Activity,
  Settings,
  Globe,
  Briefcase,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SystemLayoutProps {
  children: ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("portals");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only SUPER_ADMIN can access system portal
  if (!user || user.role !== "SUPER_ADMIN") {
    router.push("/select-portal");
    return null;
  }

  const navigation = [
    {
      name: "System Overview",
      href: "/system/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Audit Logs",
      href: "/system/audit-logs",
      icon: Activity,
    },
    {
      name: "Backups",
      href: "/system/backup",
      icon: Database,
    },
    {
      name: "User Management",
      href: "/system/users",
      icon: Users,
    },
    {
      name: "System Settings",
      href: "/system/settings",
      icon: Settings,
    },
    {
      name: "Portals",
      icon: Globe,
      key: "portals",
      submenu: [
        {
          name: "Website CMS",
          href: "/dashboard",
          icon: Globe,
          description: "Manage website content",
        },
        {
          name: "Recruitment",
          href: "/recruitment-portal/dashboard",
          icon: Briefcase,
          description: "Manage jobs & applications",
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen bg-white dark:bg-neutral-900 
          border-r border-neutral-200 dark:border-neutral-800 
          flex flex-col z-50 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div>
                <h2 className="font-bold text-lg text-neutral-900 dark:text-white">
                  System Admin
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Master Control
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openSubmenu === item.key;
            const active = item.href && isActive(item.href);

            if (hasSubmenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenSubmenu(isOpen ? null : item.key!)}
                    className="w-full flex items-center justify-between px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.submenu!.map((subitem) => {
                        const SubIcon = subitem.icon;
                        return (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                          >
                            <SubIcon className="w-4 h-4 mt-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">
                                {subitem.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                {subitem.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href!}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                  ${
                    active
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              System Administration
            </h1>
          </div>
          <Link
            href="/select-portal"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            Switch Portal
          </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
