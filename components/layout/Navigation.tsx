"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { useTheme } from "@/context/ThemeContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import { PricingDialog } from "../ui/PricingDialog";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigationContext } from "@/context/NavigationContext";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/public-services/searchService";
import type { NavItem, DropdownItem } from "@/types/api/navigation.types";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const router = useRouter();

  const { navItems, dropdownData, themeConfig } = useNavigationContext();

  useEffect(() => {
    setMounted(true);
    searchService.getPopularSearches(5).then(setPopularSearches);
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2 && isSearchOpen) {
      setLoadingSuggestions(true);
      searchService
        .getSuggestions(debouncedSearchQuery, 5)
        .then(setSearchSuggestions)
        .catch((err) => {
          console.error("Failed to get suggestions:", err);
          setSearchSuggestions([]);
        })
        .finally(() => setLoadingSuggestions(false));
    } else {
      setSearchSuggestions([]);
    }
  }, [debouncedSearchQuery, isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setHoveredItem(null);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchSuggestions([]);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setHoveredItem(null);
        setIsOpen(false);
        setExpandedMobile(null);
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setActiveDropdown(null);
        setHoveredItem(null);
        setExpandedMobile(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDropdownEnter = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(key);
    const firstItem = dropdownData[key]?.items[0];
    if (firstItem) {
      setHoveredItem(firstItem.name);
    }
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
      setHoveredItem(null);
    }, 150);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setActiveDropdown(null);
    setHoveredItem(null);
    setIsOpen(false);
    setExpandedMobile(null);
  };

  const handleMobileToggle = (key: string) => {
    setExpandedMobile(expandedMobile === key ? null : key);
  };

  const handleGetStarted = () => {
    setShowPricingDialog(true);
    setIsOpen(false);
    setActiveDropdown(null);
    setHoveredItem(null);
    setExpandedMobile(null);
  };

  const handleSupport = () => {
    router.push("/support");
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsSearchOpen(false);
    setSearchSuggestions([]);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const getCurrentDescription = () => {
    if (!activeDropdown || !hoveredItem) return null;

    const dropdown = dropdownData[activeDropdown];
    const item = dropdown?.items.find(
      (item: DropdownItem) => item.name === hoveredItem,
    );
    return item || dropdown?.items[0] || null;
  };

  if (!mounted || !navItems) {
    return (
      <nav className="bg-white dark:bg-neutral-900 shadow-sm border-b border-gray-100 dark:border-neutral-800 sticky top-0 z-50 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <div className="w-32 h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            <div className="hidden lg:flex space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-6 bg-gray-200 dark:bg-neutral-700 rounded"
                ></div>
              ))}
            </div>
            <div className="flex space-x-2">
              <div className="w-20 h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white dark:bg-neutral-900 shadow-sm border-b border-gray-100 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <div className="flex items-center">
              <Link href="/" className="shrink-0 flex items-center">
                <img
                  src={themeConfig?.logoUrl || "/logo.png"}
                  alt={themeConfig?.companyName || "Fortune Technologies"}
                  className="h-10 w-auto sm:h-12 lg:h-14"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo.png";
                  }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block" ref={dropdownRef}>
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item: NavItem) => (
                  <div key={item.id} className="relative">
                    {dropdownData[item.key] ? (
                      <div className="relative">
                        <button
                          onMouseEnter={() => handleDropdownEnter(item.key)}
                          onMouseLeave={handleDropdownLeave}
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                            activeDropdown === item.key
                              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                              : "text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                          style={{
                            color:
                              activeDropdown === item.key
                                ? themeConfig?.primaryColor
                                : undefined,
                            backgroundColor:
                              activeDropdown === item.key
                                ? `${themeConfig?.primaryColor}10`
                                : undefined,
                          }}
                        >
                          {item.name}
                          <ChevronDown
                            className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === item.key ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 block"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-600" />
                )}
              </button>

              {/* Search Icon */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-neutral-700 dark:text-neutral-300 p-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-800 p-4 z-50">
                    <form onSubmit={handleSearch} className="w-full">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                          style={{
                            borderColor: searchQuery
                              ? themeConfig?.primaryColor || "#1b90ba"
                              : undefined,
                            outlineColor:
                              themeConfig?.primaryColor || "#1b90ba",
                          }}
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          disabled={!searchQuery.trim()}
                        >
                          {loadingSuggestions ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-3">
                          Suggestions
                        </p>
                        <div className="space-y-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors flex items-center"
                            >
                              <Search className="w-3 h-3 mr-2 text-neutral-400" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches (when no query or no suggestions) */}
                    {!searchQuery && popularSearches.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-3">
                          Popular Searches
                        </p>
                        <div className="space-y-1">
                          {popularSearches.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(item)}
                              className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors flex items-center"
                            >
                              <Search className="w-3 h-3 mr-2 text-neutral-400" />
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {loadingSuggestions && searchQuery.length >= 2 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                          Loading suggestions...
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-sm transition-all duration-200"
                onClick={handleSupport}
              >
                Support
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="text-sm transition-all duration-200"
                style={{
                  backgroundColor: themeConfig?.primaryColor || "#1b90ba",
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-600" />
                )}
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-neutral-700 dark:text-neutral-300 p-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-neutral-700 dark:text-neutral-300 p-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle Menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  disabled={!searchQuery.trim()}
                >
                  {loadingSuggestions ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>

            {/* Mobile Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
                  Suggestions
                </p>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors flex items-center"
                  >
                    <Search className="w-3 h-3 mr-2 text-neutral-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Popular Searches */}
            {!searchQuery && popularSearches.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
                  Popular Searches
                </p>
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors flex items-center"
                  >
                    <Search className="w-3 h-3 mr-2 text-neutral-400" />
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Two-Panel Dropdown - Desktop Only */}
        {activeDropdown && dropdownData[activeDropdown] && (
          <div
            ref={dropdownContentRef}
            className="hidden lg:block absolute left-0 w-full bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 shadow-xl z-40"
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex">
                {/* Left Panel - Menu Items */}
                <div className="w-80 bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                      {dropdownData[activeDropdown].title}
                    </h3>
                    <ul className="space-y-1">
                      {dropdownData[activeDropdown].items.map(
                        (item: DropdownItem) => (
                          <li key={item.id}>
                            <button
                              onClick={() => handleNavigation(item.href)}
                              onMouseEnter={() => setHoveredItem(item.name)}
                              className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                                hoveredItem === item.name
                                  ? "text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 shadow-sm"
                                  : "text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-neutral-700"
                              }`}
                              style={{
                                color:
                                  hoveredItem === item.name
                                    ? themeConfig?.primaryColor
                                    : undefined,
                                backgroundColor:
                                  hoveredItem === item.name
                                    ? "rgba(255,255,255,1)"
                                    : undefined,
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span>{item.name}</span>
                                <ArrowRight
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    hoveredItem === item.name
                                      ? "translate-x-1"
                                      : ""
                                  }`}
                                />
                              </div>
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                {/* Right Panel - Description Box */}
                <div className="flex-1 p-6 min-h-80">
                  {(() => {
                    const currentItem = getCurrentDescription();
                    if (!currentItem) {
                      return (
                        <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
                          <p>Hover over an item to see details</p>
                        </div>
                      );
                    }

                    return (
                      <div className="h-full flex flex-col">
                        <div className="mb-4">
                          <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                            {currentItem.name}
                          </h4>
                          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6">
                            {currentItem.description}
                          </p>
                        </div>

                        {currentItem.features && (
                          <div className="mb-6">
                            <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                              Key Features:
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              {currentItem.features.map((feature: string) => (
                                <div
                                  key={feature}
                                  className="flex items-center text-neutral-700 dark:text-neutral-300"
                                >
                                  <span
                                    className="w-2 h-2 rounded-full mr-3 shrink-0"
                                    style={{
                                      backgroundColor:
                                        themeConfig?.primaryColor || "#1b90ba",
                                    }}
                                  ></span>
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto">
                          <Button
                            onClick={() => handleNavigation(currentItem.href)}
                            size="sm"
                            className="inline-flex items-center"
                            style={{
                              backgroundColor:
                                themeConfig?.primaryColor || "#1b90ba",
                            }}
                          >
                            Learn More
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
            <div className="max-h-96 overflow-y-auto">
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item: NavItem) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-50 dark:border-neutral-800 last:border-b-0"
                  >
                    {dropdownData[item.key] ? (
                      <div className="py-2">
                        {/* Parent Item */}
                        <button
                          onClick={() => handleMobileToggle(item.key)}
                          className="flex items-center justify-between w-full text-left px-4 py-4 text-base font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                        >
                          <span className="flex items-center">
                            <span
                              className="w-2 h-2 rounded-full mr-3"
                              style={{
                                backgroundColor:
                                  themeConfig?.primaryColor || "#1b90ba",
                              }}
                            ></span>
                            {item.name}
                          </span>
                          <ChevronRight
                            className={`w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ${
                              expandedMobile === item.key ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Child Items */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedMobile === item.key
                              ? "max-h-screen opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {expandedMobile === item.key && (
                            <div className="ml-6 mt-2 space-y-1">
                              {dropdownData[item.key].items.map(
                                (subItem: DropdownItem, index: number) => (
                                  <button
                                    key={subItem.id}
                                    onClick={() =>
                                      handleNavigation(subItem.href)
                                    }
                                    className="group block w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 animate-fade-in"
                                    style={{
                                      animationDelay: `${index * 50}ms`,
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 text-sm mb-1">
                                          {subItem.name}
                                        </div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                                          {subItem.description}
                                        </div>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-2 mt-1" />
                                    </div>
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-4 text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                      >
                        <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full mr-3"></span>
                        {item.name}
                        <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 dark:text-neutral-500" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="px-4 pb-6 pt-4 border-t border-gray-100 dark:border-neutral-800 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm py-3"
                  onClick={handleSupport}
                >
                  Support
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-center text-sm py-3"
                  style={{
                    backgroundColor: themeConfig?.primaryColor || "#1b90ba",
                  }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* PricingDialog */}
      <PricingDialog
        isOpen={showPricingDialog}
        onClose={() => setShowPricingDialog(false)}
        businessSize={null}
      />
    </>
  );
};

export default Navigation;
