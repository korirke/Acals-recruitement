"use client";

import { useState, useEffect } from "react";
import RoleGuard from "@/components/guards/RoleGuard";
import AdminErrorBoundary from "@/components/errors/AdminErrorBoundary";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  return (
    <AdminErrorBoundary>
      <RoleGuard allowedRoles={["SUPER_ADMIN", "WEBSITE_ADMIN"]}>
        <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
          <Sidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isCollapsed={isSidebarCollapsed}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar
              onMenuClick={() => setIsMobileMenuOpen(true)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleToggleCollapse}
            />
            <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </RoleGuard>
    </AdminErrorBoundary>
  );
}
