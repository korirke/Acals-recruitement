/**
 * Call to Action Types
 * Type definitions for CTA management
 */

import { PositionedEntity } from './common.types';

export interface CallToAction extends PositionedEntity {
  pageKey: string;
  title: string;
  description?: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  bgColor?: string;
  textColor?: string;
}

export interface CallToActionFormData {
  pageKey: string;
  title: string;
  description?: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  bgColor?: string;
  textColor?: string;
  position?: number;
  isActive?: boolean;
}

export interface PageKeyOption {
  key: string;
  name: string;
}

export interface CTAStylePreset {
  name: string;
  bgColor: string;
  textColor: string;
}

export const PAGE_KEYS: PageKeyOption[] = [
  { key: 'services', name: 'Services Page' },
  { key: 'payroll', name: 'Payroll Service' },
  { key: 'recruitment', name: 'Recruitment Service' },
  { key: 'attendance', name: 'Attendance Service' },
  { key: 'consulting', name: 'HR Consulting' },
  { key: 'outsourcing', name: 'Staff Outsourcing' },
  { key: 'homepage', name: 'Homepage' },
  { key: 'about', name: 'About Page' },
  { key: 'contact', name: 'Contact Page' }
];

export const PRESET_STYLES: CTAStylePreset[] = [
  { name: 'Primary Blue', bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500', textColor: 'text-white' },
  { name: 'Success Green', bgColor: 'bg-gradient-to-r from-green-600 to-green-500', textColor: 'text-white' },
  { name: 'Warning Orange', bgColor: 'bg-gradient-to-r from-orange-600 to-orange-500', textColor: 'text-white' },
  { name: 'Purple Gradient', bgColor: 'bg-gradient-to-r from-purple-600 to-pink-500', textColor: 'text-white' },
  { name: 'Dark Theme', bgColor: 'bg-gradient-to-r from-gray-900 to-gray-800', textColor: 'text-white' },
  { name: 'Light Gray', bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200', textColor: 'text-gray-900' }
];
