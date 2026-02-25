"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  Smartphone,
  Monitor,
  Upload,
  GripVertical,
  Image,
  LayoutDashboard,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Services and Types
import { heroDashboardsService } from "@/services/web-services/hero-dashboards.service";
import type { 
  HeroDashboard, 
  HeroContent, 
  PreviewMode, 
  ActiveTab,
  StatItem 
} from "@/types/admin/hero-dashboards.types";

export default function HeroDashboardManager() {
  const [dashboards, setDashboards] = useState<HeroDashboard[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editingDashboard, setEditingDashboard] = useState<string | null>(null);
  const [editingHeroContent, setEditingHeroContent] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboards");
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await heroDashboardsService.getHeroData();
      setDashboards(data.heroDashboards || []);
      setHeroContent(data.heroContent);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      const errorMessage = error?.message || "Failed to connect to backend server";
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

  const saveDashboards = async () => {
    setSaving(true);
    try {
      await heroDashboardsService.updateDashboards(dashboards);
      showToast({
        type: "success",
        title: "Success",
        message: "Hero dashboards updated successfully!",
      });
      setEditingDashboard(null);
      await fetchData();
    } catch (error: any) {
      console.error("Failed to save dashboards:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: error?.message || "Failed to update dashboards",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveHeroContent = async () => {
    if (!heroContent) return;

    setSaving(true);
    try {
      await heroDashboardsService.updateContent(heroContent);
      showToast({
        type: "success",
        title: "Success",
        message: "Hero content updated successfully!",
      });
      setEditingHeroContent(false);
      await fetchData();
    } catch (error: any) {
      console.error("Failed to save hero content:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: error?.message || "Failed to update hero content",
      });
    } finally {
      setSaving(false);
    }
  };

  const addDashboard = () => {
    const newDashboard = heroDashboardsService.createNew(dashboards.length + 1);
    setDashboards([...dashboards, newDashboard]);
    setEditingDashboard(newDashboard.id);
  };

  const updateDashboard = (id: string, updates: Partial<HeroDashboard>) => {
    setDashboards((dashboards) =>
      dashboards.map((dashboard) => {
        if (dashboard.id === id) {
          const updatedDashboard = { ...dashboard, ...updates };

          if (updatedDashboard.type === "image") {
            updatedDashboard.stats = undefined;
            updatedDashboard.features = undefined;
          } else if (updatedDashboard.type === "content") {
            updatedDashboard.imageUrl = undefined;
            if (!updatedDashboard.stats) {
              updatedDashboard.stats = [];
            }
            if (!updatedDashboard.features) {
              updatedDashboard.features = [];
            }
          }

          return updatedDashboard;
        }
        return dashboard;
      })
    );
  };

  const updateHeroContentField = (field: keyof HeroContent, value: string | string[]) => {
    if (!heroContent) return;
    setHeroContent({ ...heroContent, [field]: value });
  };

  const deleteDashboard = (id: string) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      setDashboards((dashboards) => dashboards.filter((dashboard) => dashboard.id !== id));
      showToast({
        type: "success",
        title: "Deleted",
        message: "Dashboard deleted successfully",
      });
    }
  };

  const moveDashboard = (id: string, direction: "up" | "down") => {
    const updatedDashboards = heroDashboardsService.moveDashboard(dashboards, id, direction);
    setDashboards(updatedDashboards);
  };

  const updateStat = (dashboardId: string, statIndex: number, updates: Partial<StatItem>) => {
    const updatedDashboards = heroDashboardsService.updateStat(dashboards, dashboardId, statIndex, updates);
    setDashboards(updatedDashboards);
  };

  const addStat = (dashboardId: string) => {
    const updatedDashboards = heroDashboardsService.addStat(dashboards, dashboardId);
    setDashboards(updatedDashboards);
  };

  const deleteStat = (dashboardId: string, statIndex: number) => {
    const updatedDashboards = heroDashboardsService.deleteStat(dashboards, dashboardId, statIndex);
    setDashboards(updatedDashboards);
  };

  const updateFeatures = (dashboardId: string, featuresText: string) => {
    updateDashboard(dashboardId, {
      features: featuresText.split(",").map((f) => f.trim()).filter(Boolean),
    });
  };

  const handleImageUpload = async (dashboardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(dashboardId);
    try {
      const imageUrl = await heroDashboardsService.uploadImage(file);
      updateDashboard(dashboardId, { imageUrl });
      showToast({
        type: "success",
        title: "Success",
        message: "Image uploaded successfully!",
      });
    } catch (error: any) {
      console.error("Image upload failed:", error);
      showToast({
        type: "error",
        title: "Upload Failed",
        message: error?.message || "Failed to upload image",
      });
    } finally {
      setUploading(null);
    }
  };

  const updateTrustPoints = (trustPointsText: string) => {
    const trustPoints = trustPointsText.split(",").map((point) => point.trim()).filter(Boolean);
    updateHeroContentField("trustPoints", trustPoints);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={LayoutDashboard} />
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

  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={LayoutDashboard} />
        <Card className="p-16 text-center border-2 border-red-200 dark:border-red-800">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Backend Connection Error
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <Button
              onClick={fetchData}
              className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const sortedDashboards = heroDashboardsService.sortByPosition(dashboards);
  const previewDashboard = sortedDashboards[previewIndex];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={LayoutDashboard} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hero Section Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
            Manage hero dashboards and content • {dashboards.length} dashboards
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("dashboards")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === "dashboards"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboards
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === "content"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Content
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => fetchData()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        {activeTab === "dashboards" && (
          <Button onClick={addDashboard} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Dashboard
          </Button>
        )}
        <Button
          onClick={activeTab === "dashboards" ? saveDashboards : saveHeroContent}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {activeTab === "dashboards" ? (
            <>
              {sortedDashboards.map((dashboard, index) => (
                <Card key={dashboard.id} className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
                  <div className="p-6 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <GripVertical className="w-5 h-5 text-neutral-400 shrink-0" />
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shrink-0">
                          #{dashboard.position}
                        </div>

                        {editingDashboard === dashboard.id ? (
                          <Input
                            value={dashboard.title}
                            onChange={(e) => updateDashboard(dashboard.id, { title: e.target.value })}
                            placeholder="Dashboard Title"
                            className="font-semibold text-lg max-w-md"
                          />
                        ) : (
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                              {dashboard.title}
                            </h3>
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                                dashboard.type === "image"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              }`}
                            >
                              {dashboard.type === "image" ? <Image className="w-3 h-3" /> : <LayoutDashboard className="w-3 h-3" />}
                              {dashboard.type === "image" ? "Image" : "Content"}
                            </div>
                          </div>
                        )}

                        <label className="flex items-center gap-2 text-sm bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shrink-0">
                          <input
                            type="checkbox"
                            checked={dashboard.isActive}
                            onChange={(e) => updateDashboard(dashboard.id, { isActive: e.target.checked })}
                            className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                          />
                          <span className="font-medium">Active</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => moveDashboard(dashboard.id, "up")} disabled={index === 0} title="Move Up">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveDashboard(dashboard.id, "down")} disabled={index === sortedDashboards.length - 1} title="Move Down">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewIndex(index)}
                          className={previewIndex === index ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : ""}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {editingDashboard === dashboard.id ? (
                          <Button onClick={() => setEditingDashboard(null)} size="sm" className="bg-green-600 hover:bg-green-700" title="Save">
                            <Save className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setEditingDashboard(dashboard.id)} title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDashboard(dashboard.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingDashboard === dashboard.id && (
                    <div className="p-6">
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Title</label>
                            <Input value={dashboard.title} onChange={(e) => updateDashboard(dashboard.id, { title: e.target.value })} placeholder="Dashboard Title" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
                            <textarea
                              value={dashboard.description}
                              onChange={(e) => updateDashboard(dashboard.id, { description: e.target.value })}
                              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              rows={3}
                              placeholder="Describe this dashboard..."
                            />
                          </div>

                          {/* Dashboard Type */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Dashboard Type</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors flex-1">
                                <input
                                  type="radio"
                                  name={`type-${dashboard.id}`}
                                  value="content"
                                  checked={dashboard.type === "content"}
                                  onChange={(e) => updateDashboard(dashboard.id, { type: e.target.value as "content" | "image" })}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium">Content Dashboard</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors flex-1">
                                <input
                                  type="radio"
                                  name={`type-${dashboard.id}`}
                                  value="image"
                                  checked={dashboard.type === "image"}
                                  onChange={(e) => updateDashboard(dashboard.id, { type: e.target.value as "content" | "image" })}
                                  className="text-purple-600 focus:ring-purple-500"
                                />
                                <Image className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium">Image Slider</span>
                              </label>
                            </div>
                          </div>

                          {/* Conditional Fields */}
                          {dashboard.type === "image" ? (
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Dashboard Image</label>
                              <div className="flex items-start gap-4">
                                {dashboard.imageUrl && (
                                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-600 shrink-0">
                                    <img src={`http://localhost:5000${dashboard.imageUrl}`} alt="Dashboard preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 space-y-3">
                                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(dashboard.id, e)} className="hidden" id={`image-upload-${dashboard.id}`} disabled={uploading === dashboard.id} />
                                  <label
                                    htmlFor={`image-upload-${dashboard.id}`}
                                    className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer transition-colors ${uploading === dashboard.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    <Upload className="w-4 h-4" />
                                    {uploading === dashboard.id ? "Uploading..." : "Upload Image"}
                                  </label>
                                  <Input type="url" placeholder="Or enter image URL" value={dashboard.imageUrl || ""} onChange={(e) => updateDashboard(dashboard.id, { imageUrl: e.target.value })} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Stats Management */}
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Statistics</label>
                                  <Button onClick={() => addStat(dashboard.id)} size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-3 h-3" />
                                    Add Stat
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  {dashboard.stats && Array.isArray(dashboard.stats) && dashboard.stats.length > 0 ? (
                                    dashboard.stats.map((stat, statIndex) => (
                                      <div key={statIndex} className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                        <div className="grid grid-cols-3 gap-3 flex-1">
                                          <div>
                                            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Label</label>
                                            <Input size="sm" placeholder="Label" value={stat.label} onChange={(e) => updateStat(dashboard.id, statIndex, { label: e.target.value })} />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Value</label>
                                            <Input size="sm" placeholder="Value" value={stat.value} onChange={(e) => updateStat(dashboard.id, statIndex, { value: e.target.value })} />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Color</label>
                                            <select
                                              value={stat.color}
                                              onChange={(e) => updateStat(dashboard.id, statIndex, { color: e.target.value as "primary" | "accent" })}
                                              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                              <option value="primary">Primary</option>
                                              <option value="accent">Accent</option>
                                            </select>
                                          </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => deleteStat(dashboard.id, statIndex)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 mt-5">
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                                      <LayoutDashboard className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">No statistics yet. Add your first stat.</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Features */}
                              <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Features (comma-separated)</label>
                                <textarea
                                  value={dashboard.features?.join(", ") || ""}
                                  onChange={(e) => updateFeatures(dashboard.id, e.target.value)}
                                  placeholder="Feature 1, Feature 2, Feature 3"
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {sortedDashboards.length === 0 && (
                <Card className="p-16 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                      <LayoutDashboard className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No dashboards yet</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start creating your hero section by adding your first dashboard.</p>
                    <Button onClick={addDashboard} className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4" />
                      Add First Dashboard
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            /* Hero Content Management */
            <Card className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
              <div className="p-6 bg-linear-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Hero Section Content</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingHeroContent ? (
                      <Button onClick={() => setEditingHeroContent(false)} size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Done Editing
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setEditingHeroContent(true)} className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Edit Content
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {editingHeroContent && heroContent ? (
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Trust Badge</label>
                        <Input value={heroContent.trustBadge} onChange={(e) => updateHeroContentField("trustBadge", e.target.value)} placeholder="Trusted by 5,000+ Companies" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Main Heading</label>
                        <Input value={heroContent.mainHeading} onChange={(e) => updateHeroContentField("mainHeading", e.target.value)} placeholder="Transform Your" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Sub Heading</label>
                        <Input value={heroContent.subHeading} onChange={(e) => updateHeroContentField("subHeading", e.target.value)} placeholder="HR Operations" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tagline</label>
                        <Input value={heroContent.tagline} onChange={(e) => updateHeroContentField("tagline", e.target.value)} placeholder="with AI-Powered Solutions" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
                      <textarea
                        value={heroContent.description}
                        onChange={(e) => updateHeroContentField("description", e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        rows={3}
                        placeholder="Streamline payroll, optimize talent management..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Trust Points (comma-separated)</label>
                      <textarea
                        value={heroContent.trustPoints.join(", ")}
                        onChange={(e) => updateTrustPoints(e.target.value)}
                        placeholder="No Setup Fees, 24/7 Support, GDPR Compliant"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Primary CTA Text</label>
                        <Input value={heroContent.primaryCtaText} onChange={(e) => updateHeroContentField("primaryCtaText", e.target.value)} placeholder="Start Free Trial" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Primary CTA Link</label>
                        <Input value={heroContent.primaryCtaLink || ""} onChange={(e) => updateHeroContentField("primaryCtaLink", e.target.value)} placeholder="https://example.com/signup" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Secondary CTA Text</label>
                        <Input value={heroContent.secondaryCtaText} onChange={(e) => updateHeroContentField("secondaryCtaText", e.target.value)} placeholder="Schedule Demo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Secondary CTA Link</label>
                        <Input value={heroContent.secondaryCtaLink || ""} onChange={(e) => updateHeroContentField("secondaryCtaLink", e.target.value)} placeholder="https://example.com/demo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Phone Number</label>
                        <Input value={heroContent.phoneNumber} onChange={(e) => updateHeroContentField("phoneNumber", e.target.value)} placeholder="0733769149" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Chat Widget URL</label>
                        <Input value={heroContent.chatWidgetUrl} onChange={(e) => updateHeroContentField("chatWidgetUrl", e.target.value)} placeholder="https://rag-chat-widget.vercel.app/" />
                      </div>
                    </div>
                  </div>
                ) : (
                  heroContent && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Trust Badge</span>
                          <p className="mt-1 text-neutral-900 dark:text-white font-medium">{heroContent.trustBadge}</p>
                        </div>
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Main Heading</span>
                          <p className="mt-1 text-neutral-900 dark:text-white font-medium">
                            {heroContent.mainHeading} <span className="text-purple-600">{heroContent.subHeading}</span>
                          </p>
                        </div>
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg md:col-span-2">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Description</span>
                          <p className="mt-1 text-neutral-900 dark:text-white">{heroContent.description}</p>
                        </div>
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg md:col-span-2">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">Trust Points</span>
                          <div className="flex flex-wrap gap-2">
                            {heroContent.trustPoints.map((point, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm">
                                ✓ {point}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Live Preview - 1/3 width */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <Card className="p-6 border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Live Preview
                </h2>
                {activeTab === "dashboards" && (
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`p-2 transition-colors ${previewMode === "desktop" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`p-2 transition-colors ${previewMode === "mobile" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {activeTab === "dashboards" ? (
                <>
                  {/* Slide Indicators */}
                  {sortedDashboards.length > 0 && (
                    <div className="flex justify-center gap-2 mb-6">
                      {sortedDashboards.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setPreviewIndex(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${index === previewIndex ? "w-8 bg-blue-600" : "w-2 bg-neutral-300 dark:bg-neutral-600"}`}
                          title={`Slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {previewDashboard ? (
                    <div className={`transition-all duration-300 ${previewMode === "mobile" ? "max-w-xs mx-auto" : "w-full"}`}>
                      <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-xl p-6 space-y-4 shadow-inner">
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-neutral-800 dark:text-neutral-200 ${previewMode === "mobile" ? "text-sm" : "text-base"}`}>{previewDashboard.title}</h3>
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                        </div>

                        {/* Image Dashboard */}
                        {previewDashboard.type === "image" && previewDashboard.imageUrl && (
                          <div className="relative rounded-lg overflow-hidden shadow-lg">
                            <img src={`http://localhost:5000${previewDashboard.imageUrl}`} alt={previewDashboard.title} className={`w-full object-cover ${previewMode === "mobile" ? "h-40" : "h-48"}`} />
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/40 to-transparent p-4">
                              <p className={`text-white font-medium ${previewMode === "mobile" ? "text-xs" : "text-sm"}`}>{previewDashboard.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Content Dashboard */}
                        {previewDashboard.type === "content" && (
                          <>
                            <p className={`text-neutral-600 dark:text-neutral-400 ${previewMode === "mobile" ? "text-xs" : "text-sm"}`}>{previewDashboard.description}</p>

                            {/* Stats */}
                            {previewDashboard.stats && Array.isArray(previewDashboard.stats) && previewDashboard.stats.length > 0 && (
                              <div className="grid grid-cols-2 gap-3">
                                {previewDashboard.stats.map((stat, index) => (
                                  <div
                                    key={index}
                                    className={`rounded-lg p-4 shadow-sm ${stat.color === "primary" ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" : "bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800"}`}
                                  >
                                    <div className={`font-bold mb-1 ${previewMode === "mobile" ? "text-xl" : "text-2xl"} ${stat.color === "primary" ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>{stat.value}</div>
                                    <div className={`text-neutral-600 dark:text-neutral-400 ${previewMode === "mobile" ? "text-xs" : "text-sm"}`}>{stat.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Features */}
                            {previewDashboard.features && Array.isArray(previewDashboard.features) && previewDashboard.features.length > 0 && (
                              <div className="space-y-2">
                                {previewDashboard.features.slice(0, 4).map((feature, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md">
                                    <span className={`text-neutral-700 dark:text-neutral-300 font-medium ${previewMode === "mobile" ? "text-xs" : "text-sm"}`}>{feature}</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <LayoutDashboard className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">No dashboards to preview</p>
                    </div>
                  )}

                  <div className="text-center mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">{sortedDashboards.length > 0 ? "🔄 Auto-rotates every 5 seconds" : "Add a dashboard to see preview"}</p>
                  </div>
                </>
              ) : (
                /* Hero Content Preview */
                <div className="bg-linear-to-br from-purple-50 via-white to-pink-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-xl p-6 space-y-5 shadow-inner">
                  {heroContent ? (
                    <>
                      <div className="text-center space-y-3">
                        <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">{heroContent.trustBadge}</div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
                          {heroContent.mainHeading} <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">{heroContent.subHeading}</span>
                        </h1>
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">{heroContent.tagline}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{heroContent.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {heroContent.trustPoints.map((point, index) => (
                          <span key={index} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                            <span className="text-green-600">✓</span> {point}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3 justify-center pt-2">
                        <button className="px-4 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">{heroContent.primaryCtaText}</button>
                        <button className="px-4 py-2.5 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-sm rounded-lg font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all">{heroContent.secondaryCtaText}</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">No content to preview</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
