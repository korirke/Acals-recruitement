"use client";

import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { Briefcase, Bell, Moon, Sun, LogOut, User, Grid3X3, Menu } from "lucide-react";
import { Badge } from "@/components/careers/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/careers/ui/dropdown-menu";

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <Button
              onClick={onMobileMenuToggle}
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            </Button>

            {/* Logo */}
            <Link href="/recruitment-portal/dashboard" className="flex items-center space-x-2 group shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-linear-to-r from-primary-500 to-orange-500">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-bold text-primary-500 group-hover:text-primary-600 transition-colors">
                  CareerHub
                </span>
                <span className="block text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                  Recruitment Portal
                </span>
              </div>
              <span className="sm:hidden text-base font-bold text-primary-500">CareerHub</span>
            </Link>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Switch Portal - Desktop & Tablet */}
            {isSuperAdmin && (
              <Link href="/select-portal" className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="items-center gap-2 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden lg:inline">Switch Portal</span>
                </Button>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-600" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 relative hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-600 dark:text-neutral-400" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-[10px] sm:text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 pr-2 sm:pr-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all h-8 sm:h-9"
                >
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name}
                        className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </div>
                  <span className="hidden md:inline text-xs sm:text-sm font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.role}</p>
                </div>

                <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />

                {/* Switch Portal in Mobile/Tablet Dropdown */}
                {isSuperAdmin && (
                  <>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link
                        href="/select-portal"
                        className="cursor-pointer text-primary-600 dark:text-primary-400"
                      >
                        <Grid3X3 className="mr-2 h-4 w-4" />
                        Switch Portal
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="md:hidden bg-neutral-200 dark:bg-neutral-700" />
                  </>
                )}

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-orange-600 dark:text-orange-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
