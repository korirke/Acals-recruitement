"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/admin/ui/Toast";
import { Save, Edit3, FileText, RefreshCw, X, Sparkles } from "lucide-react";

// Services and Types
import { sectionContentsService } from "@/services/web-services/section-contents.service";
import type { SectionContent, SectionContentData, PredefinedSection } from "@/types/admin/section-contents.types";
import { PREDEFINED_SECTIONS } from "@/types/admin/section-contents.types";

export default function SectionContentsManager() {
  const [sections, setSections] = useState<SectionContentData>({});
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const data = await sectionContentsService.getAll();
      setSections(data);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load section contents",
      });
      setSections({});
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (sectionKey: string, updates: Partial<SectionContent>) => {
    const updatedSections = sectionContentsService.updateLocal(sections, sectionKey, updates);
    setSections(updatedSections);
  };

  const saveSection = async (sectionKey: string) => {
    setSavingSection(sectionKey);
    try {
      const section = sections[sectionKey];
      if (!section) {
        showToast({
          type: "warning",
          title: "No Data",
          message: "No section data to save",
        });
        return;
      }

      await sectionContentsService.update({
        sectionKey,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        imageUrl: section.imageUrl,
        isActive: section.isActive,
      });

      showToast({
        type: "success",
        title: "Success",
        message: "Section content updated successfully!",
      });

      setEditingSection(null);
      await fetchSections();
    } catch (error) {
      console.error("Failed to save section:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update section content",
      });
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={FileText} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl" 
              children={undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  const stats = sectionContentsService.calculateStats(sections);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={FileText} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Section Contents
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            Manage titles, subtitles, and descriptions for website sections
          </p>
        </div>
        <Button onClick={() => fetchSections()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {PREDEFINED_SECTIONS.length}
            </div>
            <div className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              Available Sections
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.configured}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              Configured
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.withTitle}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              With Title
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.withImages}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              With Images
            </div>
          </div>
        </Card>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PREDEFINED_SECTIONS.map(({ key, title, description }) => {
          const section = sections[key];
          const isEditing = editingSection === key;
          const isSaving = savingSection === key;

          return (
            <Card
              key={key}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 dark:hover:border-primary-800"
            >
              <div className="p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors shrink-0">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-neutral-900 dark:text-white truncate">
                        {title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => saveSection(key)}
                          disabled={isSaving}
                          size="sm"
                          className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSection(null)}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSection(key)}
                        className="hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Section Content */}
                {isEditing ? (
                  <div className="space-y-4 bg-linear-to-r from-primary-50/50 to-purple-50/50 dark:from-primary-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-primary-200/50 dark:border-primary-800/50">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                        Section Title
                      </label>
                      <Input
                        value={section?.title || ""}
                        onChange={(e) => updateSection(key, { title: e.target.value })}
                        placeholder="Enter section title (optional)"
                        className="border-2 focus:border-primary-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                        Section Subtitle
                      </label>
                      <Input
                        value={section?.subtitle || ""}
                        onChange={(e) => updateSection(key, { subtitle: e.target.value })}
                        placeholder="Enter section subtitle (optional)"
                        className="border-2 focus:border-primary-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                        Section Description
                      </label>
                      <textarea
                        value={section?.description || ""}
                        onChange={(e) =>
                          updateSection(key, { description: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-200"
                        rows={4}
                        placeholder="Enter section description (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                        Section Image URL
                      </label>
                      <Input
                        value={section?.imageUrl || ""}
                        onChange={(e) => updateSection(key, { imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        className="border-2 focus:border-primary-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section?.title ? (
                      <div>
                        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          Title:
                        </span>
                        <p className="text-neutral-900 dark:text-white font-medium mt-1">
                          {section.title}
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 italic bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-lg">
                        No title set - Click Edit to configure
                      </div>
                    )}

                    {section?.subtitle && (
                      <div>
                        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          Subtitle:
                        </span>
                        <p className="text-neutral-800 dark:text-neutral-200 mt-1">
                          {section.subtitle}
                        </p>
                      </div>
                    )}

                    {section?.description && (
                      <div>
                        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          Description:
                        </span>
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mt-1">
                          {section.description}
                        </p>
                      </div>
                    )}

                    {section?.imageUrl && (
                      <div>
                        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          Image:
                        </span>
                        <div className="mt-2">
                          <img
                            src={section.imageUrl}
                            alt="Section preview"
                            className="w-full h-32 object-cover rounded-xl border-2 border-neutral-200 dark:border-neutral-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!section && (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          No content configured for this section
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                          Click Edit to add content
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Section Key */}
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Section Key:{" "}
                    <code className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded font-mono">
                      {key}
                    </code>
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
