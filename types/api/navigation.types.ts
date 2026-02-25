/**
 * 🧭 Navigation API Types
 */

export interface NavigationResponse {
  navItems: NavItem[];
  dropdownData: Record<string, DropdownData>;
  themeConfig: ThemeConfig;
}

export interface NavItem {
  id: string;
  name: string;
  key: string;
  href: string | null;
  position: number;
  isActive: boolean;
  hasDropdown: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DropdownData {
  title: string;
  items: DropdownItem[];
}

export interface DropdownItem {
  id: string;
  dropdownDataId: string;
  name: string;
  href: string;
  description: string;
  features: string[];
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  id: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
