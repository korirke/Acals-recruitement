"use client";

import { useEffect, useState, useRef } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Save,
  Edit3,
  Upload,
  FileText,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useUpload } from "@/hooks/useUpload";
import { ImagePreviewModal } from "@/components/admin/ui/ImagePreviewModal";
import { normalizeImageUrl } from "@/lib/imageUtils";
import type {
  PageInfo,
  PageImageType,
} from "@/types/api/page-content.types";

const PAGE_KEYS: PageInfo[] = [
  {
    key: "services",
    name: "Services Page",
    description: "Main services overview page content",
  },
  {
    key: "about",
    name: "About Page",
    description: "Company about page content",
  },
  {
    key: "contact",
    name: "Contact Page",
    description: "Contact page content",
  },
  {
    key: "home",
    name: "Home Page",
    description: "Homepage content and hero sections",
  },
  {
    key: "payroll",
    name: "Payroll Service",
    description: "Payroll service detail page content",
  },
  {
    key: "recruitment",
    name: "Recruitment Service",
    description: "Recruitment service detail page content",
  },
  {
    key: "attendance",
    name: "Attendance Service",
    description: "Time & attendance service page content",
  },
  {
    key: "consulting",
    name: "HR Consulting",
    description: "HR consulting service page content",
  },
  {
    key: "outsourcing",
    name: "Staff Outsourcing",
    description: "Staff outsourcing service page content",
  },
  {
    key: "technology",
    name: "Technology Solutions",
    description: "Technology solutions page content",
  },
  {
    key: "security",
    name: "Security Solutions",
    description: "CCTV and security solutions page content",
  },
];

const IMAGE_TYPES: Array<{ key: PageImageType; label: string }> = [
  { key: "heroImageUrl", label: "Hero Background Image" },
  { key: "processImageUrl", label: "Process/Features Image" },
  { key: "complianceImageUrl", label: "Secondary Content Image" },
];

export default function AdminPageContentManager() {
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const {
    pageContents,
    loading,
    saving,
    fetchPageContents,
    updatePageContent,
    savePageContent,
  } = usePageContent();

  const { uploadSingleFile } = useUpload();

  const hasFetched = useRef(false);

  // Fetch page contents on mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      const pageKeys = PAGE_KEYS.map((page) => page.key);
      fetchPageContents(pageKeys).catch((err) => {
        setError(err.message || "Failed to load page contents");
      });
    }
  }, [fetchPageContents]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSavePageContent = async (pageKey: string) => {
    const success = await savePageContent(pageKey);
    if (success) {
      setEditingPage(null);
      setSuccessMessage(`${pageKey} content updated successfully!`);
    }
  };

  const handleImageUpload = async (
    pageKey: string,
    imageType: PageImageType,
    file: File,
  ) => {
    const uploadKey = `${pageKey}-${imageType}`;
    setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));
    setError(null);

    try {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      const result = await uploadSingleFile(file);

      if (result?.url) {
        const imageUrl = normalizeImageUrl(result.url);
        updatePageContent(pageKey, { [imageType]: imageUrl });
        setSuccessMessage("Image uploaded successfully!");
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      setError(error.message || "Failed to upload image");
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(normalizeImageUrl(imageUrl));
  };

  const handleRefresh = () => {
    hasFetched.current = false;
    const pageKeys = PAGE_KEYS.map((page) => page.key);
    fetchPageContents(pageKeys).catch((err) => {
      setError(err.message || "Failed to refresh page contents");
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={FileText} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={FileText} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Page Content Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center text-sm md:text-base">
            <FileText className="w-4 h-4 mr-2 text-primary-500" />
            Manage content for different pages across the website •{" "}
            {PAGE_KEYS.length} pages
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg animate-slide-down">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg animate-slide-down">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-500 hover:text-green-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Content Cards */}
      <div className="space-y-6">
        {PAGE_KEYS.map((page) => {
          const pageContent = pageContents[page.key];
          const isEditing = editingPage === page.key;
          const isSaving = saving === page.key;

          if (!pageContent) {
            return (
              <Card key={page.key} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                      <div className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                        No content found for {page.name}
                      </div>
                      <div className="text-sm text-neutral-400 dark:text-neutral-500">
                        Please run database seeding or check your backend
                      </div>
                      <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }

          return (
            <Card
              key={page.key}
              className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl"
            >
              {/* Card Header */}
              <div className="p-4 md:p-6 bg-linear-to-r from-primary-50/50 to-orange-50/50 dark:from-primary-900/10 dark:to-orange-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary-500 shrink-0" />
                      <span className="truncate">{page.name}</span>
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {page.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                      <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                        /{page.key}
                      </span>
                      {pageContent.updatedAt && (
                        <span>
                          • Last updated:{" "}
                          {new Date(pageContent.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPage(null)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSavePageContent(page.key)}
                          disabled={isSaving}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPage(page.key)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Content
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 md:p-6">
                {isEditing ? (
                  <div className="space-y-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 md:p-6">
                    {/* Basic Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Page Title *
                        </label>
                        <Input
                          value={pageContent.title}
                          onChange={(e) =>
                            updatePageContent(page.key, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Page title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Page Subtitle
                        </label>
                        <Input
                          value={pageContent.subtitle}
                          onChange={(e) =>
                            updatePageContent(page.key, {
                              subtitle: e.target.value,
                            })
                          }
                          placeholder="Page subtitle"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Page Description
                      </label>
                      <textarea
                        value={pageContent.description}
                        onChange={(e) =>
                          updatePageContent(page.key, {
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical min-h-20"
                        rows={3}
                        placeholder="Page description for meta tags and search results"
                      />
                    </div>

                    {/* Hero Section */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                        Hero Section Content
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Hero Title
                          </label>
                          <Input
                            value={pageContent.heroTitle}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                heroTitle: e.target.value,
                              })
                            }
                            placeholder="Main hero title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Hero Subtitle
                          </label>
                          <Input
                            value={pageContent.heroSubtitle}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                heroSubtitle: e.target.value,
                              })
                            }
                            placeholder="Hero subtitle (usually highlighted)"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Hero Description
                        </label>
                        <textarea
                          value={pageContent.heroDescription}
                          onChange={(e) =>
                            updatePageContent(page.key, {
                              heroDescription: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical min-h-20"
                          rows={3}
                          placeholder="Compelling description for the hero section"
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                        Page Images
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {IMAGE_TYPES.map(({ key, label }) => (
                          <div key={key} className="space-y-3">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {label}
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={pageContent[key] || ""}
                                onChange={(e) =>
                                  updatePageContent(page.key, {
                                    [key]: e.target.value,
                                  })
                                }
                                placeholder="https://example.com/image.jpg"
                                className="flex-1"
                                size="sm"
                              />
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[
                                      `${page.key}-${key}`
                                    ] = el;
                                  }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(page.key, key, file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    uploadingImages[`${page.key}-${key}`]
                                  }
                                  title="Upload Image"
                                >
                                  {uploadingImages[`${page.key}-${key}`] ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {pageContent[key] && (
                              <div className="flex items-center gap-2">
                                <div className="relative group">
                                  <img
                                    src={pageContent[key]}
                                    alt={label}
                                    className="w-24 h-16 object-cover rounded border border-neutral-200 dark:border-neutral-600 cursor-pointer hover:opacity-75 transition-opacity shadow-sm"
                                    onClick={() =>
                                      handleImagePreview(pageContent[key])
                                    }
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgMTJIMjhWMThIMTJWMTJaIiBmaWxsPSIjRDFENURCIi8+PC9zdmc+";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded">
                                    <Eye className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  Click to preview
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Call-to-Actions */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                        Call-to-Action Buttons
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Primary CTA Text
                          </label>
                          <Input
                            value={pageContent.ctaText}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                ctaText: e.target.value,
                              })
                            }
                            placeholder="Get Started"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Primary CTA Link
                          </label>
                          <Input
                            value={pageContent.ctaLink}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                ctaLink: e.target.value,
                              })
                            }
                            placeholder="/contact"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Secondary CTA Text
                          </label>
                          <Input
                            value={pageContent.ctaSecondaryText}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                ctaSecondaryText: e.target.value,
                              })
                            }
                            placeholder="Learn More"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Secondary CTA Link
                          </label>
                          <Input
                            value={pageContent.ctaSecondaryLink}
                            onChange={(e) =>
                              updatePageContent(page.key, {
                                ctaSecondaryLink: e.target.value,
                              })
                            }
                            placeholder="/about"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={pageContent.isActive}
                          onChange={(e) =>
                            updatePageContent(page.key, {
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Page Content Active
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pageContent.title && (
                      <div>
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Title:
                        </span>
                        <p className="text-neutral-900 dark:text-white">
                          {pageContent.title}
                        </p>
                      </div>
                    )}
                    {pageContent.heroTitle && (
                      <div>
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Hero:
                        </span>
                        <p className="text-neutral-900 dark:text-white">
                          {pageContent.heroTitle}
                          {pageContent.heroSubtitle && (
                            <span className="text-primary-600 dark:text-primary-400">
                              {" "}
                              {pageContent.heroSubtitle}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {pageContent.description && (
                      <div>
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Description:
                        </span>
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {pageContent.description}
                        </p>
                      </div>
                    )}
                    {(pageContent.ctaText || pageContent.ctaSecondaryText) && (
                      <div>
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          CTAs:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pageContent.ctaText && (
                            <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                              {pageContent.ctaText} → {pageContent.ctaLink}
                            </span>
                          )}
                          {pageContent.ctaSecondaryText && (
                            <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400 rounded-full">
                              {pageContent.ctaSecondaryText} →{" "}
                              {pageContent.ctaSecondaryLink}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          pageContent.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {pageContent.isActive ? "Active" : "Inactive"}
                      </span>
                      {pageContent.heroImageUrl && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Has Hero Image
                        </span>
                      )}
                      {pageContent.processImageUrl && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                          Has Process Image
                        </span>
                      )}
                      {pageContent.complianceImageUrl && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                          Has Compliance Image
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
