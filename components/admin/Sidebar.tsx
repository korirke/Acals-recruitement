"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Package,
  MessageSquare,
  UserCheck,
  Building2,
  MapPin,
  FolderOpen,
  Settings,
  Shield,
  Palette,
  Menu,
  ChevronDown,
  ChevronRight,
  X,
  Mail,
  FormInput,
  TrendingUp,
  BarChart,
  MousePointerClick,
  Type,
  LinkIcon,
  Clock,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  // {
  //   title: "Users",
  //   icon: Users,
  //   href: "/users",
  // },
  // {
  //   title: "Reports",
  //   icon: BarChart,
  //   children: [
  //     { title: "Audit Logs", icon: Clock, href: "/audit-logs" },
  //     { title: "Usage", icon: TrendingUp, href: "/reports/usage" },
  //   ],
  // },
  {
    title: "Appearance",
    icon: Palette,
    children: [
      { title: "Navigation", icon: Menu, href: "/navigation" },
      { title: "Hero Sections", icon: FileText, href: "/hero-dashboards" },
      { title: "Theme Settings", icon: Palette, href: "/theme" },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      { title: "Pages", icon: FileText, href: "/pages" },
      { title: "About", icon: FileText, href: "/about-mgmt" },
      { title: "FAQs", icon: FileText, href: "/faqs-mgmt" },
      { title: "Statistics", href: "/stats", icon: BarChart },
      {
        title: "Call To Actions",
        href: "/call-to-actions",
        icon: MousePointerClick,
      },
      { title: "Page Sections", href: "/section-contents", icon: FileText },
      { title: "Footer", href: "/footer", icon: Type },

      // { title: 'Blog Posts', icon: FileText, href: '/content/blog/posts' },
      // { title: 'Categories', icon: FolderOpen, href: '/content/blog/categories' },
      // { title: 'Authors', icon: Users, href: '/content/blog/authors' },
    ],
  },
  {
    title: "Services",
    icon: Briefcase,
    href: "/services-mgmt",
  },
  // {
  //   title: 'Products',
  //   icon: Package,
  //   href: '/products',
  // },
  {
    title: "Marketing",
    icon: MessageSquare,
    children: [
      {
        title: "Testimonials",
        icon: MessageSquare,
        href: "/marketing/testimonials",
      },
      // { title: 'Case Studies', icon: FileText, href: '/marketing/case-studies' },
      // { title: 'Newsletter', icon: MessageSquare, href: '/marketing/newsletter' },
    ],
  },
  {
    title: "CRM",
    icon: UserCheck,
    children: [
      // { title: 'Leads', icon: UserCheck, href: '/crm/leads' },
      { title: "Contact Inquiries", icon: MessageSquare, href: "/contacts" },
      { title: "Quote Requests", href: "/quote-requests", icon: FormInput },
      { title: "Consultations", href: "/consultations", icon: TrendingUp },
      { title: "Clients", href: "/clients", icon: Users },
      // { title: 'Contact Submissions', href: '/contact-submissions', icon: Mail },
    ],
  },
  {
    title: "Media Library",
    icon: FolderOpen,
    href: "/media",
  },
  {
    title: "Contact Info",
    href: "/contact-info",
    icon: Mail,
  },
  {
    title: "Social Links",
    href: "/social-links",
    icon: LinkIcon,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.href);

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
              "text-neutral-700 dark:text-neutral-300",
              "hover:bg-neutral-100 dark:hover:bg-neutral-700/50",
              level > 0 && "pl-8",
              isCollapsed && level === 0 && "justify-center px-2"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left font-medium text-sm">
                  {item.title}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
              </>
            )}
          </button>

          {isExpanded && !isCollapsed && item.children && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href || "#"}
        onClick={() => {
          if (window.innerWidth < 1024) {
            onClose();
          }
        }}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all mb-1",
          active
            ? "bg-primary-500 text-white font-semibold shadow-lg"
            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50",
          level > 0 && "pl-8",
          isCollapsed && level === 0 && "justify-center px-2"
        )}
        title={isCollapsed ? item.title : undefined}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium text-sm">{item.title}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto z-50 transition-all duration-300",
          // Mobile
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile width
          "w-64"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold gradient-text">Fortune</h1>
          )}
          {isCollapsed && (
            <h1 className="text-2xl font-bold gradient-text mx-auto">F</h1>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </aside>
    </>
  );
}
