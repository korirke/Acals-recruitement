"use client";

import { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/admin/ui/Toast';
import { 
  Mail, 
  Bell, 
  Globe,
  Building2,
  Palette,
  Search as SearchIcon,
  Save,
  RefreshCw,
  CheckCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

// Services and Types
import { settingsService } from '@/services/web-services/settings.service';
import type { SiteSettings, SettingsTab, FontOption } from '@/types/admin/settings.types';
import { SETTINGS_TABS, FONT_OPTIONS } from '@/types/admin/settings.types';

export default function WebsiteSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings>(settingsService.getDefaults());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Use defaults if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(settings);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(settingsService.getDefaults());
    showToast({
      type: 'info',
      title: 'Reset',
      message: 'Settings reset to defaults'
    });
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleTestSmtp = async () => {
    try {
      const result = await settingsService.testSmtp();
      showToast({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'Success' : 'Failed',
        message: result.message
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to test SMTP connection'
      });
    }
  };

  const tabs = SETTINGS_TABS.map(tab => ({
    ...tab,
    icon: {
      Globe,
      Building2,
      Phone,
      LinkIcon,
      Mail,
      Palette,
      Search: SearchIcon,
      Bell,
    }[tab.icon] || Globe,
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Basic Site Information
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Configure your website's basic details and metadata
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    label="Site Name"
                    value={settings.siteName}
                    onChange={(e) => updateSettings({ siteName: e.target.value })}
                    placeholder="Enter site name"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Displayed in browser tabs and search results
                  </p>
                </div>
                <Input
                  label="Site Tagline"
                  value={settings.siteTagline}
                  onChange={(e) => updateSettings({ siteTagline: e.target.value })}
                  placeholder="Enter site tagline"
                />
                <Input
                  label="Site URL"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => updateSettings({ siteUrl: e.target.value })}
                  placeholder="https://example.com"
                />
                <div>
                  <Input
                    label="Admin Email"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => updateSettings({ adminEmail: e.target.value })}
                    placeholder="admin@example.com"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Receives site notifications and admin alerts
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Site Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                      <ImageIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Upload Logo</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Company Information
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Business details displayed on your website
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Legal Company Name"
                  value={settings.companyName}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                  placeholder="Enter legal company name"
                />
                <Input
                  label="Trading Name"
                  value={settings.tradingName || ''}
                  onChange={(e) => updateSettings({ tradingName: e.target.value })}
                  placeholder="Enter trading name"
                />
                <Input
                  label="Registration Number"
                  value={settings.registrationNumber || ''}
                  onChange={(e) => updateSettings({ registrationNumber: e.target.value })}
                  placeholder="Enter company registration"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Founded Year"
                    type="number"
                    value={settings.foundedYear?.toString() || ''}
                    onChange={(e) => updateSettings({ foundedYear: parseInt(e.target.value) || undefined })}
                    placeholder="2018"
                  />
                  <Input
                    label="Number of Employees"
                    value={settings.employeeCount || ''}
                    onChange={(e) => updateSettings({ employeeCount: e.target.value })}
                    placeholder="e.g., 50-100"
                  />
                </div>
                <div className="pt-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Company Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    value={settings.companyDescription || ''}
                    onChange={(e) => updateSettings({ companyDescription: e.target.value })}
                    placeholder="Enter company description"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Contact Information
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Primary contact details for your business
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Primary Phone
                  </label>
                  <Input
                    type="tel"
                    value={settings.primaryPhone || ''}
                    onChange={(e) => updateSettings({ primaryPhone: e.target.value })}
                    placeholder="+254 712 345 678"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Secondary Phone
                  </label>
                  <Input
                    type="tel"
                    value={settings.secondaryPhone || ''}
                    onChange={(e) => updateSettings({ secondaryPhone: e.target.value })}
                    placeholder="+254 712 345 679"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={settings.supportEmail || ''}
                    onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Sales Email
                  </label>
                  <Input
                    type="email"
                    value={settings.salesEmail || ''}
                    onChange={(e) => updateSettings({ salesEmail: e.target.value })}
                    placeholder="sales@example.com"
                  />
                </div>
                <div className="pt-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Physical Address
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    value={settings.physicalAddress || ''}
                    onChange={(e) => updateSettings({ physicalAddress: e.target.value })}
                    placeholder="Enter physical address"
                  />
                </div>
                <div>
                  <Input
                    label="Google Maps Embed URL"
                    type="url"
                    value={settings.googleMapsUrl || ''}
                    onChange={(e) => updateSettings({ googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Used for location map on contact page
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Social Media Links
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Connect your social media profiles
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </label>
                  <Input
                    type="url"
                    value={settings.facebook || ''}
                    onChange={(e) => updateSettings({ facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter / X
                  </label>
                  <Input
                    type="url"
                    value={settings.twitter || ''}
                    onChange={(e) => updateSettings({ twitter: e.target.value })}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </label>
                  <Input
                    type="url"
                    value={settings.instagram || ''}
                    onChange={(e) => updateSettings({ instagram: e.target.value })}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </label>
                  <Input
                    type="url"
                    value={settings.linkedin || ''}
                    onChange={(e) => updateSettings({ linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <Input
                  label="YouTube"
                  type="url"
                  value={settings.youtube || ''}
                  onChange={(e) => updateSettings({ youtube: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                />
                <Input
                  label="TikTok"
                  type="url"
                  value={settings.tiktok || ''}
                  onChange={(e) => updateSettings({ tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  SMTP Configuration
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Configure email sending for contact forms and notifications
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="SMTP Host"
                    value={settings.smtpHost || ''}
                    onChange={(e) => updateSettings({ smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                  <Input
                    label="SMTP Port"
                    type="number"
                    value={settings.smtpPort?.toString() || ''}
                    onChange={(e) => updateSettings({ smtpPort: parseInt(e.target.value) || undefined })}
                    placeholder="587"
                  />
                </div>
                <Input
                  label="SMTP Username"
                  value={settings.smtpUsername || ''}
                  onChange={(e) => updateSettings({ smtpUsername: e.target.value })}
                  placeholder="your-email@example.com"
                />
                <Input
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPassword || ''}
                  onChange={(e) => updateSettings({ smtpPassword: e.target.value })}
                  placeholder="Enter SMTP password"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="From Name"
                    value={settings.smtpFromName || ''}
                    onChange={(e) => updateSettings({ smtpFromName: e.target.value })}
                    placeholder="Your Company Name"
                  />
                  <Input
                    label="From Email"
                    type="email"
                    value={settings.smtpFromEmail || ''}
                    onChange={(e) => updateSettings({ smtpFromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" onClick={handleTestSmtp}>
                    <Mail className="w-4 h-4 mr-2" />
                    Test Email Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Brand Colors
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Customize your website's color scheme
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor || '#3B82F6'}
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                        className="w-12 h-10 rounded border border-neutral-300 dark:border-neutral-600"
                      />
                      <Input 
                        value={settings.primaryColor || '#3B82F6'} 
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor || '#F59E0B'}
                        onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                        className="w-12 h-10 rounded border border-neutral-300 dark:border-neutral-600"
                      />
                      <Input 
                        value={settings.secondaryColor || '#F59E0B'} 
                        onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.accentColor || '#10B981'}
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="w-12 h-10 rounded border border-neutral-300 dark:border-neutral-600"
                      />
                      <Input 
                        value={settings.accentColor || '#10B981'} 
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Typography
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Heading Font
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={settings.headingFont || 'Inter'}
                      onChange={(e) => updateSettings({ headingFont: e.target.value })}
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Body Font
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={settings.bodyFont || 'Inter'}
                      onChange={(e) => updateSettings({ bodyFont: e.target.value })}
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Default SEO Settings
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Default metadata for pages without specific SEO settings
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    label="Default Meta Title"
                    value={settings.metaTitle || ''}
                    onChange={(e) => updateSettings({ metaTitle: e.target.value })}
                    placeholder="Your Company Name - What You Do"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    value={settings.metaDescription || ''}
                    onChange={(e) => updateSettings({ metaDescription: e.target.value })}
                    placeholder="Brief description of your website"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>
                <Input
                  label="Default Keywords"
                  value={settings.metaKeywords || ''}
                  onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                  placeholder="Comma-separated keywords"
                />
                <Input
                  label="Google Analytics ID"
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) => updateSettings({ googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                <Input
                  label="Google Search Console"
                  value={settings.googleSearchConsole || ''}
                  onChange={(e) => updateSettings({ googleSearchConsole: e.target.value })}
                  placeholder="Verification code"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Email Notifications
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Choose which events trigger email notifications
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      New Contact Form Submissions
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Get notified when someone submits a contact form
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnContact}
                    onChange={(e) => updateSettings({ notifyOnContact: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      New Quote Requests
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Receive alerts for quote requests
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnQuote}
                    onChange={(e) => updateSettings({ notifyOnQuote: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      New Consultation Bookings
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Get notified about consultation requests
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnConsultation}
                    onChange={(e) => updateSettings({ notifyOnConsultation: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Weekly Summary Reports
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Receive weekly activity summaries
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => updateSettings({ weeklyReports: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                </label>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={Globe} />
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={Globe} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-primary-500" />
            Website Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Configure your public website and CMS preferences
          </p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="font-medium">Saving...</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <nav className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-2 space-y-1 sticky top-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
          
          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 mt-6 p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
