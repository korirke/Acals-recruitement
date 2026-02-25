"use client";

import RoleGuard from "@/components/guards/RoleGuard";
import AdminNav from "@/components/careers/layout/AdminNav";
import AdminHeader from "@/components/careers/layout/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { X } from "lucide-react";

export default function RecruitmentPortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "HR_MANAGER", "MODERATOR", "EMPLOYER"]}>
      <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
        {/* Header with Mobile Menu Button */}
        <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-4 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm sticky top-24 transition-colors">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-1 text-neutral-900 dark:text-white">
                    Welcome back!
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Role: {user?.role}
                  </p>
                </div>
                <AdminNav onNavigate={() => {}} />
              </div>
            </aside>

            {/* Mobile Sidebar (Overlay) */}
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
                  onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Slide-in Menu */}
                <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto animate-slide-in-left">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white truncate">
                          Welcome back!
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                          Role: {user?.role}
                        </p>
                      </div>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </div>
                    <AdminNav onNavigate={() => setMobileMenuOpen(false)} />
                  </div>
                </aside>
              </>
            )}

            {/* Main Content */}
            <main className="min-h-[calc(100vh-12rem)] w-full overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </RoleGuard>
  );
}
