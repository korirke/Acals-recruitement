'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Zap,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Palette,
  Server,
  Key,
  Activity,
  HardDrive,
  Cpu,
  Wifi,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export default function SystemSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Platform-wide configuration',
      icon: Settings,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Admin theme preferences',
      icon: Palette,
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Authentication & permissions',
      icon: Shield,
    },
    {
      id: 'api',
      title: 'API & Integrations',
      description: 'API keys and services',
      icon: Zap,
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Connections and backups',
      icon: Database,
    },
    {
      id: 'server',
      title: 'Server & Performance',
      description: 'System resources',
      icon: Server,
    },
    {
      id: 'notifications',
      title: 'System Notifications',
      description: 'Platform alerts',
      icon: Bell,
    },
  ];

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Fortune Platform',
    platformUrl: 'https://platform.fortune.co.ke',
    timezone: 'Africa/Nairobi',
    language: 'en',
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableTwoFactor: false,
    ipWhitelist: '',
    allowedDomains: 'fortune.co.ke',
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'ft_live_1234567890abcdefghijklmnop',
    webhookUrl: 'https://platform.fortune.co.ke/api/webhooks',
    rateLimitPerMinute: 60,
    enableCors: true,
    apiVersion: 'v1',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              Platform Configuration
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Core system settings that affect the entire platform
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Platform Name
          </label>
          <input
            type="text"
            value={generalSettings.platformName}
            onChange={(e) =>
              setGeneralSettings({ ...generalSettings, platformName: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Platform URL
          </label>
          <input
            type="url"
            value={generalSettings.platformUrl}
            onChange={(e) =>
              setGeneralSettings({ ...generalSettings, platformUrl: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            System Timezone
          </label>
          <select
            value={generalSettings.timezone}
            onChange={(e) =>
              setGeneralSettings({ ...generalSettings, timezone: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Log Level
          </label>
          <select
            value={generalSettings.logLevel}
            onChange={(e) =>
              setGeneralSettings({ ...generalSettings, logLevel: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          System Modes
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Maintenance Mode
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Temporarily disable all portals for system maintenance
              </div>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.maintenanceMode}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Debug Mode
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Enable detailed error logging and debugging information
              </div>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.debugMode}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  debugMode: e.target.checked,
                })
              }
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              Admin Interface Theme
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
              Customize how the admin dashboard looks and feels
            </p>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Color Theme
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              theme === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-neutral-200">
                  <Sun className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Light Mode
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Bright and clean
                  </div>
                </div>
              </div>
              {theme === 'light' && (
                <CheckCircle className="w-6 h-6 text-primary-500" />
              )}
            </div>
            
            {/* Preview */}
            <div className="bg-linear-to-br from-neutral-50 to-neutral-100 rounded-lg p-4 space-y-2">
              <div className="h-2 bg-neutral-300 rounded w-3/4"></div>
              <div className="h-2 bg-neutral-300 rounded w-1/2"></div>
              <div className="h-2 bg-primary-400 rounded w-2/3"></div>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              theme === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-800 rounded-lg shadow-sm">
                  <Moon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Dark Mode
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Easy on the eyes
                  </div>
                </div>
              </div>
              {theme === 'dark' && (
                <CheckCircle className="w-6 h-6 text-primary-500" />
              )}
            </div>
            
            {/* Preview */}
            <div className="bg-linear-to-br from-neutral-900 to-neutral-950 rounded-lg p-4 space-y-2">
              <div className="h-2 bg-neutral-700 rounded w-3/4"></div>
              <div className="h-2 bg-neutral-700 rounded w-1/2"></div>
              <div className="h-2 bg-primary-500 rounded w-2/3"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Additional Display Settings */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Display Options
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Reduce Motion
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Minimize animations and transitions
              </div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Compact Mode
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Reduce spacing for more content density
              </div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Show Sidebar by Default
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Keep navigation sidebar expanded on load
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 dark:text-red-100">
              Security & Access Control
            </h4>
            <p className="text-sm text-red-800 dark:text-red-200 mt-1">
              Platform-wide security policies and authentication settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={securitySettings.sessionTimeout}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                sessionTimeout: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={securitySettings.maxLoginAttempts}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                maxLoginAttempts: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Password Min Length
          </label>
          <input
            type="number"
            value={securitySettings.passwordMinLength}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                passwordMinLength: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Allowed Domains
          </label>
          <input
            type="text"
            value={securitySettings.allowedDomains}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                allowedDomains: e.target.value,
              })
            }
            placeholder="example.com, company.com"
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
          IP Whitelist (comma-separated)
        </label>
        <textarea
          rows={3}
          value={securitySettings.ipWhitelist}
          onChange={(e) =>
            setSecuritySettings({
              ...securitySettings,
              ipWhitelist: e.target.value,
            })
          }
          placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Security Features
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Require Strong Passwords
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Enforce uppercase, lowercase, numbers, and symbols
              </div>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.requireStrongPassword}
              onChange={(e) =>
                setSecuritySettings({
                  ...securitySettings,
                  requireStrongPassword: e.target.checked,
                })
              }
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Enable Two-Factor Authentication
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Require 2FA for all admin and super admin accounts
              </div>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.enableTwoFactor}
              onChange={(e) =>
                setSecuritySettings({
                  ...securitySettings,
                  enableTwoFactor: e.target.checked,
                })
              }
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Security Warning
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              Keep your API keys secure. Never share them publicly or commit to version control.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiSettings.apiKey}
              readOnly
              className="w-full px-4 py-2.5 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-sm"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              {showApiKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={apiSettings.webhookUrl}
            onChange={(e) =>
              setApiSettings({ ...apiSettings, webhookUrl: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Rate Limit (requests/minute)
            </label>
            <input
              type="number"
              value={apiSettings.rateLimitPerMinute}
              onChange={(e) =>
                setApiSettings({
                  ...apiSettings,
                  rateLimitPerMinute: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              API Version
            </label>
            <select
              value={apiSettings.apiVersion}
              onChange={(e) =>
                setApiSettings({ ...apiSettings, apiVersion: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="v1">v1 (Current)</option>
              <option value="v2">v2 (Beta)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
          <div>
            <div className="font-medium text-neutral-900 dark:text-white">
              Enable CORS
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Allow cross-origin requests to API endpoints
            </div>
          </div>
          <input
            type="checkbox"
            checked={apiSettings.enableCors}
            onChange={(e) =>
              setApiSettings({ ...apiSettings, enableCors: e.target.checked })
            }
            className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerate API Key
        </button>
        <button className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
          <Key className="w-4 h-4" />
          Copy API Key
        </button>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              Database Management
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Monitor database health and manage backups
            </p>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Database Size
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            2.4 GB
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Active Connections
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            47
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Query Performance
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            98.2%
          </div>
        </div>
      </div>

      {/* Backup Management */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Backup Management
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Last Backup
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                2 hours ago • 2.4 GB
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Automatic Backups
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Daily at 2:00 AM
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2">
            <Database className="w-4 h-4" />
            Create Backup Now
          </button>
          <button className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium">
            View Backup History
          </button>
        </div>
      </div>
    </div>
  );

  const renderServerSettings = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
              Server & Performance
            </h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 mt-1">
              Monitor system resources and performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Server Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-neutral-900 dark:text-white">
                CPU Usage
              </span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              32%
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-green-500" />
              <span className="font-medium text-neutral-900 dark:text-white">
                Memory Usage
              </span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              68%
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-neutral-900 dark:text-white">
                Disk Space
              </span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              45%
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-neutral-900 dark:text-white">
                Network I/O
              </span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              127 MB/s
            </span>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            ↓ 89 MB/s • ↑ 38 MB/s
          </div>
        </div>
      </div>

      {/* Performance Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Performance Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-medium">
            Clear Cache
          </button>
          <button className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-medium">
            Optimize Database
          </button>
          <button className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-medium">
            Restart Services
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-900 dark:text-orange-100">
              System Notifications
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
              Configure platform-wide alert preferences
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Admin Notifications
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                System Errors
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Critical system errors and failures
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Security Alerts
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Suspicious activity and login attempts
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                Database Backups
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Backup completion and failure alerts
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                User Activity
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                New registrations and role changes
              </div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div>
              <div className="font-medium text-neutral-900 dark:text-white">
                System Updates
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Platform updates and maintenance windows
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary-500" />
            System Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Configure platform-wide settings and infrastructure
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Settings saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-2 sticky top-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {section.title}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        activeSection === section.id
                          ? 'text-white/80'
                          : 'text-neutral-500 dark:text-neutral-500'
                      }`}
                    >
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            {activeSection === 'general' && renderGeneralSettings()}
            {activeSection === 'appearance' && renderAppearanceSettings()}
            {activeSection === 'security' && renderSecuritySettings()}
            {activeSection === 'api' && renderApiSettings()}
            {activeSection === 'database' && renderDatabaseSettings()}
            {activeSection === 'server' && renderServerSettings()}
            {activeSection === 'notifications' && renderNotificationSettings()}

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <button className="px-6 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
