"use client";

import { useEffect, useState, useRef } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Eye,
  GripVertical,
  Briefcase,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useServicesManagement } from "@/hooks/useServicesManagement";
import { useUpload } from "@/hooks/useUpload";
import { ImagePreviewModal } from "@/components/admin/ImagePreviewModal";
import { getIconComponent } from "@/components/icons/IconRegistry";
import { normalizeImageUrl } from "@/lib/imageUtils";
import type { ServiceImageType } from "@/types/api/services.types";

// Constants
const ICON_OPTIONS = [
  "Shield",
  "Users",
  "Globe",
  "TrendingUp",
  "Clock",
  "Monitor",
  "Zap",
  "Star",
  "CheckCircle",
  "BarChart",
  "Settings",
  "Database",
  "Cloud",
  "Lock",
];

const COLOR_OPTIONS = [
  {
    value:
      "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
    label: "Primary Blue",
  },
  {
    value:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    label: "Orange",
  },
  {
    value:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    label: "Green",
  },
  {
    value:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    label: "Purple",
  },
  {
    value: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    label: "Pink",
  },
  {
    value:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    label: "Indigo",
  },
];

const CATEGORY_OPTIONS = [
  "HR Solutions",
  "Technology",
  "Security",
  "Consulting",
  "Custom",
];

const IMAGE_TYPES: Array<{ key: ServiceImageType; label: string }> = [
  { key: "imageUrl", label: "Card Image" },
  { key: "heroImageUrl", label: "Hero Image" },
  { key: "processImageUrl", label: "Process Image" },
  { key: "complianceImageUrl", label: "Compliance Image" },
];

export default function AdminServicesManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<
    Record<string, boolean>
  >({});

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const {
    services,
    loading,
    saving,
    fetchServices,
    saveServices,
    addService,
    deleteService,
    updateService,
    moveService,
    addProcessStep,
    updateProcessStep,
    removeProcessStep,
    addComplianceItem,
    updateComplianceItem,
    removeComplianceItem,
  } = useServicesManagement();

  const { uploadSingleFile, uploading: globalUploading } = useUpload();

  // Fetch services on mount
  useEffect(() => {
    fetchServices().catch((err) => {
      setError(err.message || "Failed to connect to backend server");
    });
  }, [fetchServices]);

  // Handlers
  const handleAddService = () => {
    const newId = addService();
    setEditingId(newId);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  const handleSaveAll = async () => {
    const success = await saveServices();
    if (success) {
      setEditingId(null);
    }
  };

  const handleImageUpload = async (
    serviceId: string,
    imageType: ServiceImageType,
    file: File,
  ) => {
    const uploadKey = `${serviceId}-${imageType}`;
    setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const result = await uploadSingleFile(file);
      if (result?.url) {
        const normalizedUrl = normalizeImageUrl(result.url);
        updateService(serviceId, { [imageType]: normalizedUrl });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(normalizeImageUrl(imageUrl));
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={Briefcase} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={Briefcase} />
        <Card className="p-8 md:p-16 text-center border-2 border-red-200 dark:border-red-800">
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
              onClick={() => {
                setError(null);
                fetchServices().catch((err) =>
                  setError(err.message || "Connection failed"),
                );
              }}
              className="flex items-center gap-2 mx-auto bg-linear-to-r from-primary-600 to-orange-600 hover:from-primary-700 hover:to-orange-700"
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
      <AdminBreadcrumb icon={Briefcase} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Services Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center text-sm md:text-base">
            <Briefcase className="w-4 h-4 mr-2 text-primary-500" />
            Manage service offerings and complete content • {
              services.length
            }{" "}
            services
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleAddService}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Service</span>
            <span className="sm:hidden">Add</span>
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        {services.map((service, index) => {
          const IconComponent = getIconComponent(service.icon);

          return (
            <Card
              key={service.id}
              className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl"
            >
              {/* Service Card Header */}
              <div className="p-4 md:p-6 bg-linear-to-r from-primary-50/50 to-orange-50/50 dark:from-primary-900/10 dark:to-orange-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                    <GripVertical className="w-5 h-5 text-neutral-400 shrink-0 mt-1 hidden sm:block" />

                    <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-mono bg-white dark:bg-neutral-800 px-2 md:px-3 py-1 rounded-full shrink-0">
                      #{service.position.toString().padStart(2, "0")}
                    </div>

                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${service.color} flex items-center justify-center shrink-0`}
                    >
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === service.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Service Title
                              </label>
                              <Input
                                value={service.title}
                                onChange={(e) =>
                                  updateService(service.id, {
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Service Title"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                URL Slug
                              </label>
                              <Input
                                value={service.slug}
                                onChange={(e) =>
                                  updateService(service.id, {
                                    slug: e.target.value,
                                  })
                                }
                                placeholder="service-slug"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white mb-1 truncate">
                            {service.title}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-mono truncate">
                            /services/{service.slug}
                          </p>
                          <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                            {service.shortDesc ||
                              service.description.substring(0, 120) + "..."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="hidden lg:flex flex-wrap gap-2 shrink-0">
                      {service.isActive && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
                          Active
                        </span>
                      )}
                      {!service.isActive && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium">
                          Inactive
                        </span>
                      )}
                      {service.isFeatured && (
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                      {service.isPopular && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                      {service.onQuote && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full font-medium">
                          Quote
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveService(service.id, "up")}
                      disabled={index === 0}
                      title="Move Up"
                      className="px-2"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveService(service.id, "down")}
                      disabled={index === services.length - 1}
                      title="Move Down"
                      className="px-2"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {editingId === service.id ? (
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 px-2"
                        title="Done Editing"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(service.id)}
                        title="Edit Service"
                        className="px-2"
                      >
                        <Briefcase className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Status Badges */}
                <div className="flex lg:hidden flex-wrap gap-2 mt-3">
                  {service.isActive && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
                      Active
                    </span>
                  )}
                  {!service.isActive && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium">
                      Inactive
                    </span>
                  )}
                  {service.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  {service.isPopular && (
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              {editingId === service.id && (
                <div className="p-4 md:p-6">
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 md:p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Category
                        </label>
                        <select
                          value={service.category}
                          onChange={(e) =>
                            updateService(service.id, {
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select Category</option>
                          {CATEGORY_OPTIONS.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Icon
                        </label>
                        <select
                          value={service.icon}
                          onChange={(e) =>
                            updateService(service.id, { icon: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Color Theme
                        </label>
                        <select
                          value={service.color}
                          onChange={(e) =>
                            updateService(service.id, { color: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {COLOR_OPTIONS.map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Short Description (Card View)
                        </label>
                        <textarea
                          value={service.shortDesc}
                          onChange={(e) =>
                            updateService(service.id, {
                              shortDesc: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                          rows={3}
                          placeholder="Brief description for service cards..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Button Configuration
                        </label>
                        <div className="space-y-2">
                          <Input
                            value={service.buttonText}
                            onChange={(e) =>
                              updateService(service.id, {
                                buttonText: e.target.value,
                              })
                            }
                            placeholder="Button Text (e.g., Learn More)"
                          />
                          <Input
                            value={service.buttonLink}
                            onChange={(e) =>
                              updateService(service.id, {
                                buttonLink: e.target.value,
                              })
                            }
                            placeholder="Button Link (e.g., /contact)"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Full Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          updateService(service.id, {
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                        rows={4}
                        placeholder="Complete service description for the service page..."
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Key Features
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const newFeatures = [
                              ...(service.features || []),
                              "",
                            ];
                            updateService(service.id, {
                              features: newFeatures,
                            });
                          }}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Feature
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {service.features && service.features.length > 0 ? (
                          service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updatedFeatures = [...service.features];
                                  updatedFeatures[featureIndex] =
                                    e.target.value;
                                  updateService(service.id, {
                                    features: updatedFeatures,
                                  });
                                }}
                                placeholder={`Feature ${featureIndex + 1}`}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedFeatures =
                                    service.features.filter(
                                      (_, i) => i !== featureIndex,
                                    );
                                  updateService(service.id, {
                                    features: updatedFeatures,
                                  });
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                              No features yet. Add your first feature.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Process Steps */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Process Steps (Optional)
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addProcessStep(service.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Step
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {service.processSteps &&
                        service.processSteps.length > 0 ? (
                          service.processSteps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="grid grid-cols-12 gap-2 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                            >
                              <div className="col-span-12 sm:col-span-2">
                                <Input
                                  value={step.step}
                                  onChange={(e) =>
                                    updateProcessStep(service.id, stepIndex, {
                                      step: e.target.value,
                                    })
                                  }
                                  placeholder="01"
                                  className="text-center"
                                  size="sm"
                                />
                              </div>
                              <div className="col-span-12 sm:col-span-4">
                                <Input
                                  value={step.title}
                                  onChange={(e) =>
                                    updateProcessStep(service.id, stepIndex, {
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Step Title"
                                  size="sm"
                                />
                              </div>
                              <div className="col-span-11 sm:col-span-5">
                                <Input
                                  value={step.description}
                                  onChange={(e) =>
                                    updateProcessStep(service.id, stepIndex, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Step Description"
                                  size="sm"
                                />
                              </div>
                              <div className="col-span-1 sm:col-span-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    removeProcessStep(service.id, stepIndex)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                              No process steps yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compliance Items */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Compliance Items (Optional)
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addComplianceItem(service.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {service.complianceItems &&
                        service.complianceItems.length > 0 ? (
                          service.complianceItems.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="grid grid-cols-12 gap-2 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                            >
                              <div className="col-span-12 sm:col-span-5">
                                <Input
                                  value={item.title}
                                  onChange={(e) =>
                                    updateComplianceItem(
                                      service.id,
                                      itemIndex,
                                      {
                                        title: e.target.value,
                                      },
                                    )
                                  }
                                  placeholder="Compliance Requirement"
                                  size="sm"
                                />
                              </div>
                              <div className="col-span-11 sm:col-span-6">
                                <Input
                                  value={item.description}
                                  onChange={(e) =>
                                    updateComplianceItem(
                                      service.id,
                                      itemIndex,
                                      {
                                        description: e.target.value,
                                      },
                                    )
                                  }
                                  placeholder="Description"
                                  size="sm"
                                />
                              </div>
                              <div className="col-span-1 sm:col-span-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    removeComplianceItem(service.id, itemIndex)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                              No compliance items yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Service Images
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {IMAGE_TYPES.map(({ key, label }) => (
                          <div key={key} className="space-y-3">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {label}
                            </label>

                            <div className="flex items-center gap-2">
                              <Input
                                value={service[key] || ""}
                                onChange={(e) =>
                                  updateService(service.id, {
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
                                      `${service.id}-${key}`
                                    ] = el;
                                  }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleImageUpload(service.id, key, file);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    uploadingImages[`${service.id}-${key}`]
                                  }
                                  title="Upload Image"
                                >
                                  {uploadingImages[`${service.id}-${key}`] ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {service[key] && (
                              <div className="flex items-center gap-2">
                                <div className="relative group">
                                  <img
                                    src={normalizeImageUrl(service[key])}
                                    alt={label}
                                    className="w-28 h-20 object-cover rounded-lg border-2 border-neutral-200 dark:border-neutral-600 cursor-pointer hover:opacity-75 transition-opacity shadow-sm"
                                    onClick={() =>
                                      handleImagePreview(service[key])
                                    }
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgMTJIMjhWMThIMTJWMTJaIiBmaWxsPSIjRDFENURCIi8+PC9zdmc+";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-lg">
                                    <Eye className="w-5 h-5 text-white" />
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

                    {/* Additional Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Additional Settings
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Pricing (Optional)
                          </label>
                          <Input
                            value={service.price}
                            onChange={(e) =>
                              updateService(service.id, {
                                price: e.target.value,
                              })
                            }
                            placeholder="e.g., Starting from $99/month"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.isActive}
                            onChange={(e) =>
                              updateService(service.id, {
                                isActive: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium">Active</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.isFeatured}
                            onChange={(e) =>
                              updateService(service.id, {
                                isFeatured: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium">Featured</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.isPopular}
                            onChange={(e) =>
                              updateService(service.id, {
                                isPopular: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium">Popular</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.onQuote}
                            onChange={(e) =>
                              updateService(service.id, {
                                onQuote: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium">Quote</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.hasProcess}
                            onChange={(e) =>
                              updateService(service.id, {
                                hasProcess: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium">Process</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={service.hasCompliance}
                            onChange={(e) =>
                              updateService(service.id, {
                                hasCompliance: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium">
                            Compliance
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {/* Empty State */}
        {services.length === 0 && (
          <Card className="p-8 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                No services yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Start building your service portfolio by adding your first
                service.
              </p>
              <Button
                onClick={handleAddService}
                className="flex items-center gap-2 mx-auto bg-linear-to-r from-primary-600 to-orange-600 hover:from-primary-700 hover:to-orange-700"
              >
                <Plus className="w-4 h-4" />
                Add First Service
              </Button>
            </div>
          </Card>
        )}
      </div>

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
