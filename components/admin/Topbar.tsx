'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Settings, 
  ChevronDown,
  Menu as MenuIcon,
  PanelLeftClose,
  PanelLeft,
  Grid3X3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';

interface TopbarProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Topbar({ onMenuClick, isCollapsed, onToggleCollapse }: TopbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if user is SUPER_ADMIN
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <header className="h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:block p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          )}
        </button>

        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Switch Portal Button - Only for SUPER_ADMIN */}
        {isSuperAdmin && (
          <Link
            href="/select-portal"
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium border border-primary-200 dark:border-primary-800"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Switch Portal</span>
          </Link>
        )}

        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-600" />
          )}
        </button>

        <button
          className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name ? getInitials(user.name) : 'AD'}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                {user?.role || 'admin'}
              </p>
            </div>
            <ChevronDown className="hidden lg:block w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user?.email}
                  </p>
                </div>

                {/* Switch Portal in Mobile Dropdown */}
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => {
                        router.push('/select-portal');
                        setShowUserMenu(false);
                      }}
                      className="sm:hidden w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-primary-600 dark:text-primary-400"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span className="text-sm font-medium">Switch Portal</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    router.push('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>

                <hr className="my-2 border-neutral-200 dark:border-neutral-700" />

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
