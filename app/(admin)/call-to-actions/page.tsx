"use client";

import { useState, useEffect, useCallback } from "react";
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
  Target,
  Palette,
  RefreshCw,
} from "lucide-react";

// Services and Types
import { callToActionsService } from "@/services/web-services";
import type {
  CallToAction,
  PageKeyOption,
  CTAStylePreset,
} from "@/types/admin/call-to-actions.types";
import { PAGE_KEYS, PRESET_STYLES } from "@/types/admin/call-to-actions.types";

export default function AdminCallToActionsManager() {
  const [ctas, setCtas] = useState<CallToAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("services");

  const { showToast } = useToast();

  const fetchCTAs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callToActionsService.getByPage(selectedPage);
      setCtas(data);
    } catch (error) {
      console.error("Failed to fetch CTAs:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load call-to-actions",
      });
      setCtas([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPage, showToast]);

  useEffect(() => {
    fetchCTAs();
  }, [fetchCTAs]);

  const saveCTAs = async () => {
    setSaving(true);
    try {
      await callToActionsService.updateAll(ctas);
      setEditingId(null);
      await fetchCTAs();
      showToast({
        type: "success",
        title: "Success",
        message: "Call-to-actions updated successfully!",
      });
    } catch (error) {
      console.error("Failed to save CTAs:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to save call-to-actions",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCTA = () => {
    const newCTA = callToActionsService.createNew(
      selectedPage,
      ctas.length + 1,
    );
    setCtas([...ctas, newCTA]);
    setEditingId(newCTA.id);
  };

  const deleteCTA = (id: string) => {
    if (confirm("Are you sure you want to delete this call-to-action?")) {
      setCtas((ctas) => ctas.filter((c) => c.id !== id));
      showToast({
        type: "success",
        title: "Deleted",
        message: "Call-to-action removed successfully",
      });
    }
  };

  const updateCTA = (id: string, updates: Partial<CallToAction>) => {
    setCtas((ctas) =>
      ctas.map((cta) => (cta.id === id ? { ...cta, ...updates } : cta)),
    );
  };

  const moveCTA = (id: string, direction: "up" | "down") => {
    const updatedCTAs = callToActionsService.moveCTA(ctas, id, direction);
    setCtas(updatedCTAs);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={Target} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-32 bg-gray-200 dark:bg-neutral-700"
              children={undefined}
            ></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={Target} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Call-to-Actions Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage call-to-action sections for different pages
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedPage}
            onChange={(e) => {
              setSelectedPage(e.target.value);
              setEditingId(null);
            }}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            {PAGE_KEYS.map((page: PageKeyOption) => (
              <option key={page.key} value={page.key}>
                {page.name}
              </option>
            ))}
          </select>
          <Button onClick={() => fetchCTAs()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={addCTA} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add CTA
          </Button>
          <Button
            onClick={saveCTAs}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {ctas.map((cta, index) => (
          <Card key={cta.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                    #{cta.position.toString().padStart(2, "0")}
                  </div>

                  <div className="w-12 h-12 bg-linear-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingId === cta.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Title
                            </label>
                            <Input
                              value={cta.title}
                              onChange={(e) =>
                                updateCTA(cta.id, { title: e.target.value })
                              }
                              placeholder="CTA Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Page
                            </label>
                            <select
                              value={cta.pageKey}
                              onChange={(e) =>
                                updateCTA(cta.id, { pageKey: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                            >
                              {PAGE_KEYS.map((page: PageKeyOption) => (
                                <option key={page.key} value={page.key}>
                                  {page.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                          {cta.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          Page:{" "}
                          {PAGE_KEYS.find(
                            (p: PageKeyOption) => p.key === cta.pageKey,
                          )?.name || cta.pageKey}
                        </p>
                        {cta.description && (
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            {cta.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        cta.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {cta.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveCTA(cta.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveCTA(cta.id, "down")}
                    disabled={index === ctas.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  {editingId === cta.id ? (
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(cta.id)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCTA(cta.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editingId === cta.id && (
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={cta.description || ""}
                      onChange={(e) =>
                        updateCTA(cta.id, { description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      rows={2}
                      placeholder="CTA description or subtitle"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Primary Button Text
                      </label>
                      <Input
                        value={cta.primaryText}
                        onChange={(e) =>
                          updateCTA(cta.id, { primaryText: e.target.value })
                        }
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Primary Button Link
                      </label>
                      <Input
                        value={cta.primaryLink}
                        onChange={(e) =>
                          updateCTA(cta.id, { primaryLink: e.target.value })
                        }
                        placeholder="/contact"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Secondary Button Text
                      </label>
                      <Input
                        value={cta.secondaryText || ""}
                        onChange={(e) =>
                          updateCTA(cta.id, { secondaryText: e.target.value })
                        }
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Secondary Button Link
                      </label>
                      <Input
                        value={cta.secondaryLink || ""}
                        onChange={(e) =>
                          updateCTA(cta.id, { secondaryLink: e.target.value })
                        }
                        placeholder="/about"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Styling
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {PRESET_STYLES.map((style: CTAStylePreset) => (
                        <button
                          key={style.name}
                          onClick={() =>
                            updateCTA(cta.id, {
                              bgColor: style.bgColor,
                              textColor: style.textColor,
                            })
                          }
                          className={`p-3 rounded-lg text-xs font-medium border-2 transition-all ${
                            cta.bgColor === style.bgColor
                              ? "border-primary-500 ring-2 ring-primary-200"
                              : "border-neutral-200 dark:border-neutral-700"
                          } ${style.bgColor} ${style.textColor}`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Background Classes
                        </label>
                        <Input
                          value={cta.bgColor || ""}
                          onChange={(e) =>
                            updateCTA(cta.id, { bgColor: e.target.value })
                          }
                          placeholder="bg-gradient-to-r from-blue-600 to-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Text Classes
                        </label>
                        <Input
                          value={cta.textColor || ""}
                          onChange={(e) =>
                            updateCTA(cta.id, { textColor: e.target.value })
                          }
                          placeholder="text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={cta.isActive}
                        onChange={(e) =>
                          updateCTA(cta.id, { isActive: e.target.checked })
                        }
                        className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Active
                      </span>
                    </label>
                  </div>

                  {/* Preview */}
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                      Preview
                    </h4>
                    <div
                      className={`p-8 rounded-lg ${cta.bgColor} ${cta.textColor}`}
                    >
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">{cta.title}</h3>
                        {cta.description && (
                          <p className="text-lg mb-6 opacity-90">
                            {cta.description}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-colors">
                            {cta.primaryText}
                          </button>
                          {cta.secondaryText && (
                            <button className="border-2 border-white border-opacity-50 hover:border-opacity-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                              {cta.secondaryText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}

        {ctas.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-neutral-400 dark:text-neutral-500">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No CTAs for{" "}
                {
                  PAGE_KEYS.find((p: PageKeyOption) => p.key === selectedPage)
                    ?.name
                }
              </h3>
              <p className="mb-4">
                Add call-to-action sections to encourage user engagement.
              </p>
              <Button
                onClick={addCTA}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First CTA
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
