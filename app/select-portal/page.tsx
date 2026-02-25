"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Globe,
  Briefcase,
  Shield,
  LogOut,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";

export default function SelectPortalPage() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-5 h-5 border border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "SUPER_ADMIN") return null;

  const portals = [
    {
      id: "website",
      label: "Website",
      tagline: "Content, pages & public materials",
      detail:
        "Manage your public-facing presence — edit pages, publish content, update the media library, and control SEO settings across the entire site.",
      icon: Globe,
      href: "/dashboard",
    },
    {
      id: "recruitment",
      label: "Recruitment",
      tagline: "Jobs, candidates & hiring",
      detail:
        "Post new roles, track applicants through the hiring pipeline, schedule interviews, and manage every stage of the recruitment process in one place.",
      icon: Briefcase,
      href: "/recruitment-portal/dashboard",
    },
    {
      id: "system",
      label: "System",
      tagline: "Users, roles & platform settings",
      detail:
        "Full control over the platform — manage user accounts, configure permissions and roles, review audit logs, and adjust system-wide security settings.",
      icon: Shield,
      href: "/system/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Top-right controls */}
      <div className="fixed top-5 right-5 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>
      </div>

      {/* Centered layout — wider to accommodate detail text */}
      <div className="min-h-screen flex flex-col justify-center max-w-xl mx-auto px-6 py-16 animate-fade-in-up">
        {/* Greeting */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 dark:text-neutral-600 mb-3">
            Super Admin
          </p>
          <h1
            className="text-5xl leading-tight text-neutral-900 dark:text-neutral-50 mb-4"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontWeight: 400,
            }}
          >
            Good to see
            <br />
            <em className="gradient-text" style={{ fontStyle: "italic" }}>
              you, {user.firstName || user.lastName}.
            </em>
          </h1>
          <p className="text-sm text-neutral-400 dark:text-neutral-600 leading-relaxed max-w-sm">
            You have full access to all portals. Choose where you'd like to work
            today.
          </p>
        </div>

        {/* Portal list */}
        <div className="flex flex-col gap-2">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={() => router.push(portal.href)}
                className="group flex items-start gap-5 px-5 py-5 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-200 text-left w-full"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary-50 dark:group-hover:bg-primary-950 transition-colors">
                  <Icon
                    className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                      {portal.label}
                    </p>
                    <ArrowRight
                      className="w-4 h-4 text-neutral-300 dark:text-neutral-700 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-2">
                    {portal.tagline}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-600 leading-relaxed">
                    {portal.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-10" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-widest uppercase text-neutral-300 dark:text-neutral-700">
            SUPER_ADMIN
          </span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
