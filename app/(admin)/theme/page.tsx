"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Save,
  Palette,
  RefreshCw,
  Eye,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "@/lib/apiClient";
import { useDynamicTheme } from "@/context/DynamicThemeContext";

interface ColorScheme {
  name: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}

const presetSchemes: ColorScheme[] = [
  {
    name: "Fortune Primary",
    primaryColor: "#3b82f6",
    accentColor: "#f97316",
    description: "Default Fortune Technologies brand colors",
  },
  {
    name: "Professional Green",
    primaryColor: "#059669",
    accentColor: "#dc2626",
    description: "Professional green with red accents",
  },
  {
    name: "Corporate Purple",
    primaryColor: "#7c3aed",
    accentColor: "#f59e0b",
    description: "Modern purple with amber accents",
  },
  {
    name: "Tech Teal",
    primaryColor: "#0d9488",
    accentColor: "#e11d48",
    description: "Tech-focused teal with pink accents",
  },
  {
    name: "Elegant Rose",
    primaryColor: "#e11d48",
    accentColor: "#6366f1",
    description: "Rose with indigo accents",
  },
  {
    name: "Nature Green",
    primaryColor: "#16a34a",
    accentColor: "#ca8a04",
    description: "Natural green with yellow accents",
  },
  {
    name: "Ocean Blue",
    primaryColor: "#0284c7",
    accentColor: "#f97316",
    description: "Ocean blue with orange accents",
  },
  {
    name: "Sunset Orange",
    primaryColor: "#ea580c",
    accentColor: "#7c3aed",
    description: "Warm orange with purple accents",
  },
];

export default function ThemeColorManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    primaryColor: "#3b82f6",
    accentColor: "#f97316",
    logoUrl: "",
    companyName: "Fortune Technologies",
  });
  const [previewColors, setPreviewColors] = useState({
    primaryColor: "#3b82f6",
    accentColor: "#f97316",
  });

  const { themeConfig } = useDynamicTheme();
  const { showToast } = useToast();

  useEffect(() => {
    fetchThemeConfig();
  }, []);

  const fetchThemeConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      if (themeConfig) {
        setFormData({
          primaryColor: themeConfig.primaryColor,
          accentColor: themeConfig.accentColor,
          logoUrl: themeConfig.logoUrl || "",
          companyName: themeConfig.companyName,
        });
        setPreviewColors({
          primaryColor: themeConfig.primaryColor,
          accentColor: themeConfig.accentColor,
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch theme config:", error);
      const errorMessage =
        error?.message || "Failed to connect to backend server";
      setError(errorMessage);
      showToast({
        type: "error",
        title: "Connection Error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (
    field: "primaryColor" | "accentColor",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setPreviewColors((prev) => ({ ...prev, [field]: value }));

    // Update CSS variables for live preview
    document.documentElement.style.setProperty(
      field === "primaryColor" ? "--color-primary" : "--color-accent",
      value,
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (scheme: ColorScheme) => {
    const newColors = {
      primaryColor: scheme.primaryColor,
      accentColor: scheme.accentColor,
    };

    setFormData((prev) => ({ ...prev, ...newColors }));
    setPreviewColors(newColors);

    // Update CSS variables
    document.documentElement.style.setProperty(
      "--color-primary",
      scheme.primaryColor,
    );
    document.documentElement.style.setProperty(
      "--color-accent",
      scheme.accentColor,
    );

    showToast({
      type: "success",
      title: "Preset Applied",
      message: `${scheme.name} color scheme applied`,
    });
  };

  const resetToOriginal = () => {
    if (themeConfig) {
      const originalColors = {
        primaryColor: themeConfig.primaryColor,
        accentColor: themeConfig.accentColor,
      };

      setFormData((prev) => ({
        ...prev,
        ...originalColors,
        logoUrl: themeConfig.logoUrl || "",
        companyName: themeConfig.companyName,
      }));
      setPreviewColors(originalColors);

      // Reset CSS variables
      document.documentElement.style.setProperty(
        "--color-primary",
        themeConfig.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-accent",
        themeConfig.accentColor,
      );

      showToast({
        type: "success",
        title: "Reset Complete",
        message: "Colors reset to original theme",
      });
    }
  };

  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);

      showToast({
        type: "success",
        title: "Copied",
        message: `Color ${color} copied to clipboard`,
      });
    } catch (err) {
      console.error("Failed to copy color:", err);
      showToast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy color to clipboard",
      });
    }
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      await api.put("/admin/theme", formData);

      showToast({
        type: "success",
        title: "Success",
        message: "Theme updated successfully!",
      });
    } catch (error: any) {
      console.error("Failed to save theme:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: error?.message || "Failed to update theme",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <Card className="p-16 text-center border-2 border-red-200 dark:border-red-800">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Backend Connection Error
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {error}
            </p>
            <Button
              onClick={fetchThemeConfig}
              className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Theme Color Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-purple-500" />
            Customize your website&apos;s color scheme and branding
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={resetToOriginal}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            onClick={saveTheme}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Color Configuration - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Color Picker Card */}
          <Card className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
            <div className="p-6 bg-linear-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                Color Configuration
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                    Primary Color
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 shadow-lg cursor-pointer transition-transform hover:scale-105 relative overflow-hidden group"
                        style={{ backgroundColor: previewColors.primaryColor }}
                        onClick={() =>
                          document
                            .getElementById("primary-color-input")
                            ?.click()
                        }
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          id="primary-color-input"
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) =>
                            handleColorChange("primaryColor", e.target.value)
                          }
                          className="w-full h-12 p-1 border-0 cursor-pointer rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) =>
                              handleColorChange("primaryColor", e.target.value)
                            }
                            className="flex-1 font-mono text-sm"
                            placeholder="#3b82f6"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyColorToClipboard(formData.primaryColor)
                            }
                            className="px-3"
                            title="Copy color code"
                          >
                            {copiedColor === formData.primaryColor ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                    Accent Color
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 shadow-lg cursor-pointer transition-transform hover:scale-105 relative overflow-hidden group"
                        style={{ backgroundColor: previewColors.accentColor }}
                        onClick={() =>
                          document.getElementById("accent-color-input")?.click()
                        }
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          id="accent-color-input"
                          type="color"
                          value={formData.accentColor}
                          onChange={(e) =>
                            handleColorChange("accentColor", e.target.value)
                          }
                          className="w-full h-12 p-1 border-0 cursor-pointer rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) =>
                              handleColorChange("accentColor", e.target.value)
                            }
                            className="flex-1 font-mono text-sm"
                            placeholder="#f97316"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyColorToClipboard(formData.accentColor)
                            }
                            className="px-3"
                            title="Copy color code"
                          >
                            {copiedColor === formData.accentColor ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      placeholder="Fortune Technologies"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Logo URL (Optional)
                    </label>
                    <Input
                      value={formData.logoUrl}
                      onChange={(e) =>
                        handleInputChange("logoUrl", e.target.value)
                      }
                      placeholder="https://example.com/logo.png"
                      type="url"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Preset Color Schemes */}
          <Card className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
            <div className="p-6 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Preset Color Schemes
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Quick start with professionally designed color combinations
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presetSchemes.map((scheme) => (
                  <div
                    key={scheme.name}
                    className="group relative p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => applyPreset(scheme)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 shrink-0">
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-white dark:border-neutral-900 shadow-md"
                          style={{ backgroundColor: scheme.primaryColor }}
                          title="Primary Color"
                        ></div>
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-white dark:border-neutral-900 shadow-md"
                          style={{ backgroundColor: scheme.accentColor }}
                          title="Accent Color"
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-neutral-900 dark:text-white text-sm truncate">
                          {scheme.name}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                          {scheme.description}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md font-medium">
                        Apply
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview - 1/3 width */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <Card className="p-6 border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-500" />
                  Live Preview
                </h2>
                <div className="flex items-center border-2 border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`p-2 transition-colors ${
                      previewMode === "desktop"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`p-2 transition-colors ${
                      previewMode === "mobile"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className={`transition-all duration-300 space-y-4 ${
                  previewMode === "mobile" ? "max-w-xs mx-auto" : "w-full"
                }`}
              >
                {/* Navigation Preview */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 p-4 shadow-sm">
                  <div
                    className={`flex items-center justify-between ${
                      previewMode === "mobile" ? "flex-col gap-3" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 ${
                        previewMode === "mobile" ? "flex-col gap-2" : ""
                      }`}
                    >
                      <div
                        className={`font-bold text-neutral-900 dark:text-white ${
                          previewMode === "mobile" ? "text-sm" : "text-base"
                        }`}
                      >
                        {formData.companyName}
                      </div>
                      <div
                        className={`flex gap-4 text-sm ${
                          previewMode === "mobile" ? "gap-2 text-xs" : ""
                        }`}
                      >
                        <span
                          className="font-medium hover:underline cursor-pointer transition-colors"
                          style={{ color: previewColors.primaryColor }}
                        >
                          Services
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400 hover:underline cursor-pointer">
                          About
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex gap-2 ${previewMode === "mobile" ? "w-full" : ""}`}
                    >
                      <button
                        className={`px-4 py-2 text-sm font-medium border-2 rounded-lg transition-all hover:scale-105 ${
                          previewMode === "mobile"
                            ? "flex-1 px-3 py-1.5 text-xs"
                            : ""
                        }`}
                        style={{
                          borderColor: previewColors.primaryColor,
                          color: previewColors.primaryColor,
                        }}
                      >
                        Sign In
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:scale-105 shadow-md ${
                          previewMode === "mobile"
                            ? "flex-1 px-3 py-1.5 text-xs"
                            : ""
                        }`}
                        style={{ backgroundColor: previewColors.primaryColor }}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      previewMode === "mobile" ? "p-3" : ""
                    }`}
                    style={{
                      backgroundColor: `${previewColors.primaryColor}15`,
                      borderColor: `${previewColors.primaryColor}40`,
                    }}
                  >
                    <div
                      className={`font-bold mb-1 ${
                        previewMode === "mobile" ? "text-lg" : "text-2xl"
                      }`}
                      style={{ color: previewColors.primaryColor }}
                    >
                      2,847
                    </div>
                    <div
                      className={`text-neutral-600 dark:text-neutral-400 font-medium ${
                        previewMode === "mobile" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Active Users
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      previewMode === "mobile" ? "p-3" : ""
                    }`}
                    style={{
                      backgroundColor: `${previewColors.accentColor}15`,
                      borderColor: `${previewColors.accentColor}40`,
                    }}
                  >
                    <div
                      className={`font-bold mb-1 ${
                        previewMode === "mobile" ? "text-lg" : "text-2xl"
                      }`}
                      style={{ color: previewColors.accentColor }}
                    >
                      98.2%
                    </div>
                    <div
                      className={`text-neutral-600 dark:text-neutral-400 font-medium ${
                        previewMode === "mobile" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Satisfaction
                    </div>
                  </div>
                </div>

                {/* Buttons Preview */}
                <div className="space-y-3">
                  <button
                    className={`w-full rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg ${
                      previewMode === "mobile"
                        ? "text-sm py-2.5"
                        : "text-base py-3"
                    }`}
                    style={{ backgroundColor: previewColors.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className={`w-full rounded-xl font-semibold border-2 transition-all hover:scale-105 ${
                      previewMode === "mobile"
                        ? "text-sm py-2.5"
                        : "text-base py-3"
                    }`}
                    style={{
                      borderColor: previewColors.accentColor,
                      color: previewColors.accentColor,
                      backgroundColor: `${previewColors.accentColor}08`,
                    }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className={`w-full rounded-xl font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-2 border-neutral-300 dark:border-neutral-600 transition-all hover:scale-105 ${
                      previewMode === "mobile"
                        ? "text-sm py-2.5"
                        : "text-base py-3"
                    }`}
                  >
                    Neutral Button
                  </button>
                </div>

                {/* Feature Cards Preview */}
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-all hover:shadow-md"
                    >
                      <span
                        className={`text-neutral-700 dark:text-neutral-300 font-medium ${
                          previewMode === "mobile" ? "text-xs" : "text-sm"
                        }`}
                      >
                        Feature Item {item}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor:
                            item % 2 === 0
                              ? previewColors.primaryColor
                              : previewColors.accentColor,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Colors update in real-time
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
