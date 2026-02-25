"use client";

import { useState, useEffect, useCallback } from "react";
import { backupService } from "@/services/system-services/backupService";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Shield,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  FileArchive,
  Info,
} from "lucide-react";
import type {
  Backup,
  BackupSettings,
  BackupStats,
} from "@/types/system/backup.types";

export default function DatabaseBackupPage() {
  const [activeTab, setActiveTab] = useState<"backups" | "settings" | "stats">(
    "backups",
  );
  const [backups, setBackups] = useState<Backup[]>([]);
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [restorePassword, setRestorePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inlineMessage, setInlineMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const { handleError, handleSuccess } = useErrorHandler();

  const showInlineMessage = (
    type: "success" | "error" | "info",
    text: string,
  ) => {
    setInlineMessage({ type, text });
    setTimeout(() => setInlineMessage(null), 6000);
  };

  const loadBackups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await backupService.getBackups({ page, limit: 20 });
      setBackups(response.backups || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error: any) {
      handleError(error.message || "Failed to load backups");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadSettings = useCallback(async () => {
    try {
      const data = await backupService.getSettings();
      setSettings(data);
    } catch (error: any) {
      console.error("Failed to load settings:", error);
      setSettings(backupService.getDefaults());
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await backupService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  useEffect(() => {
    loadBackups();
    loadSettings();
    loadStats();
  }, [page]);

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      showInlineMessage("info", "Creating backup... this may take a moment.");
      await backupService.createBackup({
        type: "manual",
        description: "Manual backup created from admin panel",
      });
      handleSuccess(
        "Backup created successfully! Database and files are included.",
      );
      showInlineMessage("success", "Backup created successfully!");
      await loadBackups();
      await loadStats();
    } catch (error: any) {
      const msg = error.message || "Failed to create backup";
      handleError(msg);
      showInlineMessage("error", msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDownloadBackup = async (backup: Backup) => {
    if (downloadingId) return; // Prevent double-click
    try {
      setDownloadingId(backup.id);
      showInlineMessage("info", "Preparing download...");
      const blob = await backupService.downloadBackup(backup.id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backup.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      handleSuccess(`Downloaded: ${backup.file_name}`);
      showInlineMessage("success", "Backup downloaded successfully!");
      await loadBackups();
    } catch (error: any) {
      const msg = error.message || "Failed to download backup";
      handleError(msg);
      showInlineMessage("error", msg);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup || !restorePassword) {
      showInlineMessage("error", "Please enter your superadmin password");
      return;
    }

    try {
      setRestoring(true);
      showInlineMessage("info", "Restoring database... please wait.");
      await backupService.restoreBackup(selectedBackup.id, restorePassword);
      handleSuccess("Database restored successfully!");
      showInlineMessage("success", "Database restored successfully!");
      setShowRestoreDialog(false);
      setRestorePassword("");
      setSelectedBackup(null);
      await loadBackups();
    } catch (error: any) {
      const msg = error.message || "Failed to restore backup";
      handleError(msg);
      showInlineMessage("error", msg);
    } finally {
      setRestoring(false);
    }
  };

  const handleDeleteBackup = async (backup: Backup) => {
    if (
      !confirm(
        `Are you sure you want to delete "${backup.file_name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(backup.id);
      await backupService.deleteBackup(backup.id);
      handleSuccess("Backup deleted successfully!");
      showInlineMessage("success", "Backup deleted.");
      await loadBackups();
      await loadStats();
    } catch (error: any) {
      const msg = error.message || "Failed to delete backup";
      handleError(msg);
      showInlineMessage("error", msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      await backupService.updateSettings(settings);
      handleSuccess("Settings saved successfully!");
      showInlineMessage("success", "Settings saved!");
    } catch (error: any) {
      const msg = error.message || "Failed to save settings";
      handleError(msg);
      showInlineMessage("error", msg);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-neutral-100 text-neutral-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderInlineMessage = () => {
    if (!inlineMessage) return null;
    const colors = {
      success:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
      error:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
    };
    const icons = {
      success: <CheckCircle className="w-5 h-5 shrink-0" />,
      error: <AlertCircle className="w-5 h-5 shrink-0" />,
      info: <Info className="w-5 h-5 shrink-0" />,
    };
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[inlineMessage.type]}`}
      >
        {icons[inlineMessage.type]}
        <span className="font-medium text-sm">{inlineMessage.text}</span>
      </div>
    );
  };

  const renderBackupsList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Database Backups
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and restore database backups.
          </p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              Create Backup
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-16">
            <Database className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">
              No backups found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
              Click "Create Backup" to create your first backup
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {backups.map((backup) => (
                  <tr
                    key={backup.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        {getStatusBadge(backup.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileArchive className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white font-mono">
                            {backup.file_name || "—"}
                          </div>
                          {backup.description && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {backup.description}
                            </div>
                          )}
                          {backup.error_message && (
                            <div className="text-xs text-red-500 mt-0.5 max-w-xs truncate">
                              {backup.error_message}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {backup.file_size ? formatBytes(backup.file_size) : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize">
                        {backup.backup_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(backup.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {backup.download_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {backup.status === "completed" && backup.file_name && (
                          <>
                            <button
                              onClick={() => handleDownloadBackup(backup)}
                              disabled={downloadingId === backup.id}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download backup (ZIP with DB + files)"
                            >
                              {downloadingId === backup.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBackup(backup);
                                setShowRestoreDialog(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Restore this backup"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteBackup(backup)}
                          disabled={deletingId === backup.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete backup"
                        >
                          {deletingId === backup.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => {
    if (!settings) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Backup Settings
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Configure automated backup schedules and retention policies
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
          {/* Auto Backup Toggle */}
          <div>
            <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">
                  Enable Automatic Backups
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Run backups automatically on a schedule
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_backup_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    auto_backup_enabled: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {settings.auto_backup_enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backup_frequency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backup_frequency: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Backup Time (24-hour format)
                </label>
                <input
                  type="time"
                  value={settings.backup_time}
                  onChange={(e) =>
                    setSettings({ ...settings, backup_time: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Maximum Backups to Keep
            </label>
            <input
              type="number"
              value={settings.max_backups}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  max_backups: parseInt(e.target.value) || 30,
                })
              }
              min="1"
              max="100"
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Older backups will be automatically deleted when limit is reached
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Retention Period (days)
            </label>
            <input
              type="number"
              value={settings.retention_days}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  retention_days: parseInt(e.target.value) || 90,
                })
              }
              min="1"
              max="365"
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Backups older than this number of days will be deleted
              automatically
            </p>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <label className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">
                  Enable Cloud Storage
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Upload backups to cloud storage (Coming soon)
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.cloud_storage_enabled}
                disabled
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 opacity-50 cursor-not-allowed"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={loadSettings}
              className="px-6 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!stats) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Backup Statistics
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Overview of backup system health and usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Database className="w-5 h-5 text-blue-500" />,
              label: "Total Backups",
              value: stats.total_backups,
            },
            {
              icon: <CheckCircle className="w-5 h-5 text-green-500" />,
              label: "Completed",
              value: stats.completed_backups,
            },
            {
              icon: <XCircle className="w-5 h-5 text-red-500" />,
              label: "Failed",
              value: stats.failed_backups,
            },
            {
              icon: <HardDrive className="w-5 h-5 text-purple-500" />,
              label: "Total Size",
              value: stats.total_size_formatted,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {item.label}
                </span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Disk Space Usage
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">
                Used Space
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {stats.disk_usage_percent}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  stats.disk_usage_percent > 90
                    ? "bg-red-500"
                    : stats.disk_usage_percent > 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, stats.disk_usage_percent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Free / Total
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {stats.disk_space_free_formatted} /{" "}
                {stats.disk_space_total_formatted}
              </span>
            </div>
          </div>
        </div>

        {stats.last_backup && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Last Backup
            </h3>
            <div className="space-y-3">
              {[
                { label: "Filename", value: stats.last_backup.file_name },
                {
                  label: "Size",
                  value: formatBytes(stats.last_backup.file_size),
                },
                {
                  label: "Created",
                  value: formatDate(stats.last_backup.created_at),
                },
                {
                  label: "Status",
                  value: getStatusBadge(stats.last_backup.status),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.label}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Database className="w-8 h-8 text-primary-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Database Backup
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-0.5">
            Create, download, and restore full backups (database + uploaded
            files)
          </p>
        </div>
      </div>

      {/* Inline Status Message */}
      {renderInlineMessage()}

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-1">
          {(["backups", "settings", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "backups" && renderBackupsList()}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "stats" && renderStats()}
      </div>

      {/* Restore Confirmation Dialog */}
      {showRestoreDialog && selectedBackup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Restore Database
              </h3>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>⚠ Warning:</strong> This will completely replace the
                current database with the backup. All data created after this
                backup was made will be lost. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  Restoring backup:
                </p>
                <p className="font-medium text-neutral-900 dark:text-white text-sm font-mono">
                  {selectedBackup.file_name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Created: {formatDate(selectedBackup.created_at)} • Size:{" "}
                  {formatBytes(selectedBackup.file_size)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={restorePassword}
                    onChange={(e) => setRestorePassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      restorePassword &&
                      handleRestoreBackup()
                    }
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowRestoreDialog(false);
                  setRestorePassword("");
                  setSelectedBackup(null);
                  setShowPassword(false);
                }}
                disabled={restoring}
                className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreBackup}
                disabled={restoring || !restorePassword.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {restoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Restore Database
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
