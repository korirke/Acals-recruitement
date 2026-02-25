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
  Save,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Link as LinkIcon,
  Folder,
} from "lucide-react";
import { api } from "@/lib/apiClient";
import { FooterSection, FooterLink, ApiResponse } from "@/types";

interface FooterData {
  sections: FooterSection[];
}

export default function AdminFooterManager() {
  const [footerData, setFooterData] = useState<FooterData>({ sections: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await api.get<ApiResponse<FooterData>>("/footer");
      const data = response.data || response;
      setFooterData(data as unknown as FooterData);
    } catch (error) {
      console.error("Failed to fetch footer data:", error);
      showToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load footer data",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      const cleanedSections = footerData.sections.map((section) => {
        const { id, createdAt, updatedAt, ...sectionData } = section;
        
        return {
          ...(id.startsWith("temp-") ? {} : { id }),
          ...sectionData,
          // Clean links
          links: section.links.map((link) => {
            const { id: linkId, footerSectionId, createdAt, updatedAt, ...linkData } = link;
            
            return {
              ...(linkId.startsWith("temp-") ? {} : { id: linkId }),
              ...linkData,
            };
          }),
        };
      });

      await api.put(
        "/admin/footer",
        { sections: cleanedSections }
      );

      showToast({
        type: "success",
        title: "Success",
        message: "Footer updated successfully",
      });

      setEditingSection(null);
      setEditingLink(null);
      await fetchFooterData();
    } catch (error: any) {
      console.error("Failed to save footer:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: error?.message || "Failed to save footer changes",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: FooterSection = {
      id: `temp-${Date.now()}`,
      title: "New Section",
      position: footerData.sections.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      links: [],
    };
    setFooterData({
      sections: [...footerData.sections, newSection],
    });
    setEditingSection(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setFooterData({
        sections: footerData.sections.filter((s) => s.id !== sectionId),
      });
    }
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<FooterSection>
  ) => {
    setFooterData({
      sections: footerData.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const addLink = (sectionId: string) => {
    const section = footerData.sections.find((s) => s.id === sectionId);
    const linksLength = section?.links.length ?? 0;

    const newLink: FooterLink = {
      id: `temp-${Date.now()}`,
      footerSectionId: sectionId,
      name: "New Link",
      href: "/new-link",
      position: linksLength + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFooterData({
      sections: footerData.sections.map((section) =>
        section.id === sectionId
          ? { ...section, links: [...section.links, newLink] }
          : section
      ),
    });
    setEditingLink(newLink.id);
  };

  const deleteLink = (sectionId: string, linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      setFooterData({
        sections: footerData.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                links: section.links.filter((l) => l.id !== linkId),
              }
            : section
        ),
      });
    }
  };

  const updateLink = (
    sectionId: string,
    linkId: string,
    updates: Partial<FooterLink>
  ) => {
    setFooterData({
      sections: footerData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map((link) =>
                link.id === linkId ? { ...link, ...updates } : link
              ),
            }
          : section
      ),
    });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const currentIndex = footerData.sections.findIndex(
      (s) => s.id === sectionId
    );
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === footerData.sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedSections = [...footerData.sections];
    [updatedSections[currentIndex], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[currentIndex],
    ];

    updatedSections.forEach((section, index) => {
      section.position = index + 1;
    });

    setFooterData({ sections: updatedSections });
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

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Footer Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Folder className="w-4 h-4 mr-2 text-blue-500" />
            Manage footer sections and navigation • {footerData.sections.length} sections
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addSection}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
          <Button
            onClick={saveFooter}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {footerData.sections.map((section, sectionIndex) => (
          <Card
            key={section.id}
            className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl"
          >
            <div className="p-6 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-neutral-200/60 dark:border-neutral-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <GripVertical className="w-5 h-5 text-neutral-400" />
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono bg-white dark:bg-neutral-800 px-3 py-1 rounded-full">
                    #{section.position}
                  </div>

                  {editingSection === section.id ? (
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, { title: e.target.value })
                      }
                      placeholder="Section Title"
                      className="font-semibold text-lg max-w-md"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {section.title}
                    </h3>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                      <input
                        type="checkbox"
                        checked={section.isActive}
                        onChange={(e) =>
                          updateSection(section.id, {
                            isActive: e.target.checked,
                          })
                        }
                        className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                      />
                      <span className="font-medium">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section.id, "up")}
                    disabled={sectionIndex === 0}
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section.id, "down")}
                    disabled={sectionIndex === footerData.sections.length - 1}
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Links ({section.links.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLink(section.id)}
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-3">
                {section.links.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                    <LinkIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      No links yet. Add your first link to this section.
                    </p>
                  </div>
                ) : (
                  section.links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        #{link.position}
                      </div>

                      {editingLink === link.id ? (
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input
                            value={link.name}
                            onChange={(e) =>
                              updateLink(section.id, link.id, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Link Name"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) =>
                              updateLink(section.id, link.id, {
                                href: e.target.value,
                              })
                            }
                            placeholder="Link URL (e.g., /about)"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {link.name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                            {link.href}
                          </div>
                        </div>
                      )}

                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={link.isActive}
                          onChange={(e) =>
                            updateLink(section.id, link.id, {
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-medium">Active</span>
                      </label>

                      <div className="flex items-center gap-1">
                        {editingLink === link.id ? (
                          <Button
                            onClick={() => setEditingLink(null)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            title="Save"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingLink(link.id)}
                            title="Edit"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLink(section.id, link.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        ))}

        {footerData.sections.length === 0 && (
          <Card className="p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                <Folder className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                No footer sections yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Start building your footer navigation by adding your first section.
              </p>
              <Button
                onClick={addSection}
                className="flex items-center gap-2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add First Section
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}