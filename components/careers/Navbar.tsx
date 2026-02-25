"use client";

import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/careers/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  Briefcase,
  Moon,
  Sun,
  FileText,
} from "lucide-react";

const BASE = "/careers-portal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isCandidate = user?.role === "CANDIDATE";
  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "WEBSITE_ADMIN";

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-neutral-900/60 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`${BASE}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Briefcase className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold text-primary-500">
              CareerHub ACAL
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`${BASE}/jobs`}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Jobs
            </Link>

            {isCandidate && (
              <>
                <Link
                  href={`${BASE}/applications`}
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  My Applications
                </Link>
                <Link
                  href={`${BASE}/profile`}
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  Profile
                </Link>
              </>
            )}
            <Link
              href={`${BASE}/about-us`}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              About
            </Link>
            <Link
              href={`${BASE}/contact-us`}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600" />
              )}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <Link href={`/recruitment-portal/dashboard`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />

                    {isCandidate && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`${BASE}/profile`}
                            className="cursor-pointer text-neutral-700 dark:text-neutral-300"
                          >
                            <User className="mr-2 h-4 w-4" />
                            My Profile
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`${BASE}/applications`}
                            className="cursor-pointer text-neutral-700 dark:text-neutral-300"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            My Applications
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Link href={`/login`}>Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  <Link href={`/register`}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
