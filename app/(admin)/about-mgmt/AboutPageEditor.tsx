"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAboutAdmin } from "@/hooks/useAbout";
import { RichTextEditor } from "@/components/admin/about/RichTextEditor";
import { ImageUpload } from "@/components/admin/about/ImageUpload";
import { AboutPagePreview } from "./AboutPagePreview";
import {
  Save,
  AlertCircle,
  Loader2,
  Upload,
  Eye,
  Settings,
  Users,
  Target,
  Globe,
  History,
  Heart,
  Plus,
  Trash2,
  GripVertical,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { AboutContent } from "@/types";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export function AboutPageEditor() {
  const {
    content,
    setContent,
    loading,
    saving,
    hasChanges,
    saveContent,
    refetch,
  } = useAboutAdmin();
  const [activeTab, setActiveTab] = useState("hero");
  const [showPreview, setShowPreview] = useState(false);

  const tabs = [
    { id: "hero", label: "Hero Section", icon: Upload, color: "primary" },
    { id: "mission", label: "Mission & Vision", icon: Target, color: "purple" },
    { id: "history", label: "Company History", icon: History, color: "green" },
    { id: "team", label: "Leadership Team", icon: Users, color: "orange" },
    { id: "values", label: "Core Values", icon: Heart, color: "pink" },
    { id: "seo", label: "SEO Settings", icon: Settings, color: "indigo" },
  ];

  const handleSave = async () => {
    if (content) {
      await saveContent(content);
    }
  };

  const updateContent = (
    section: keyof AboutContent,
    field: string,
    value: any,
  ) => {
    if (!content) return;

    setContent({
      ...content,
      [section]: {
        ...(content[section] as any),
        [field]: value,
      },
    });
  };

  const addTimelineItem = () => {
    if (!content) return;

    setContent({
      ...content,
      history: {
        ...content.history,
        timeline: [
          ...content.history.timeline,
          { year: "", title: "", description: "" },
        ],
      },
    });
  };

  const removeTimelineItem = (index: number) => {
    if (!content) return;

    setContent({
      ...content,
      history: {
        ...content.history,
        timeline: content.history.timeline.filter((_, i) => i !== index),
      },
    });
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    if (!content) return;

    setContent({
      ...content,
      history: {
        ...content.history,
        timeline: content.history.timeline.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    });
  };

  const addTeamMember = () => {
    if (!content) return;

    setContent({
      ...content,
      team: {
        ...content.team,
        members: [
          ...content.team.members,
          {
            name: "",
            role: "",
            bio: "",
            image: "",
            linkedin: "",
            specialties: [],
          },
        ],
      },
    });
  };

  const removeTeamMember = (index: number) => {
    if (!content) return;

    setContent({
      ...content,
      team: {
        ...content.team,
        members: content.team.members.filter((_, i) => i !== index),
      },
    });
  };

  const updateTeamMember = (index: number, field: string, value: any) => {
    if (!content) return;

    setContent({
      ...content,
      team: {
        ...content.team,
        members: content.team.members.map((member, i) =>
          i === index ? { ...member, [field]: value } : member,
        ),
      },
    });
  };

  const addValue = () => {
    if (!content) return;

    setContent({
      ...content,
      values: [
        ...content.values,
        {
          title: "",
          description: "",
          icon: "Heart",
          color:
            "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
        },
      ],
    });
  };

  const removeValue = (index: number) => {
    if (!content) return;

    setContent({
      ...content,
      values: content.values.filter((_, i) => i !== index),
    });
  };

  const updateValue = (index: number, field: string, value: string) => {
    if (!content) return;

    setContent({
      ...content,
      values: content.values.map((val, i) =>
        i === index ? { ...val, [field]: value } : val,
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Loading about page content...
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Failed to load content
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <AdminBreadcrumb />
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            About Page Editor
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            Manage different sections of your About page
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            size="sm"
            className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden sticky top-6">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Content Sections
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Select a section to edit
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-4 border-primary-500 shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-4 md:p-6">
              {/* Hero Section */}
              {activeTab === "hero" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg shrink-0">
                      <Upload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        Hero Section
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Configure the main hero banner
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Hero Title
                      </label>
                      <Input
                        value={content.hero.title}
                        onChange={(e) =>
                          updateContent("hero", "title", e.target.value)
                        }
                        placeholder="Enter hero title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Hero Subtitle
                      </label>
                      <Input
                        value={content.hero.subtitle}
                        onChange={(e) =>
                          updateContent("hero", "subtitle", e.target.value)
                        }
                        placeholder="Enter hero subtitle..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Hero Description
                      </label>
                      <RichTextEditor
                        value={content.hero.description}
                        onChange={(value) =>
                          updateContent("hero", "description", value)
                        }
                        placeholder="Enter hero description..."
                        height={200}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Hero Background Image
                      </label>
                      <ImageUpload
                        value={content.hero.heroImage || ""}
                        onChange={(url) =>
                          updateContent("hero", "heroImage", url)
                        }
                        alt={content.hero.heroImageAlt || ""}
                        onAltChange={(alt) =>
                          updateContent("hero", "heroImageAlt", alt)
                        }
                        showAltField={true}
                        aspectRatio="hero"
                        placeholder="Upload hero image..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mission & Vision */}
              {activeTab === "mission" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg shrink-0">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        Mission & Vision
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Define your company's mission and vision
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-linear-to-br from-primary-50 to-cyan-50 dark:from-primary-900/10 dark:to-cyan-900/10 rounded-lg border border-primary-200 dark:border-primary-800">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      Mission Statement
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Mission Title
                      </label>
                      <Input
                        value={content.mission.title}
                        onChange={(e) =>
                          updateContent("mission", "title", e.target.value)
                        }
                        placeholder="Enter mission title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Mission Content
                      </label>
                      <RichTextEditor
                        value={content.mission.content}
                        onChange={(value) =>
                          updateContent("mission", "content", value)
                        }
                        placeholder="Enter mission content..."
                        height={150}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      Vision Statement
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Vision Title
                      </label>
                      <Input
                        value={content.vision.title}
                        onChange={(e) =>
                          updateContent("vision", "title", e.target.value)
                        }
                        placeholder="Enter vision title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Vision Content
                      </label>
                      <RichTextEditor
                        value={content.vision.content}
                        onChange={(value) =>
                          updateContent("vision", "content", value)
                        }
                        placeholder="Enter vision content..."
                        height={150}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Company History */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg shrink-0">
                      <History className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        Company History
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Share your company's journey
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Section Title
                      </label>
                      <Input
                        value={content.history.title}
                        onChange={(e) =>
                          updateContent("history", "title", e.target.value)
                        }
                        placeholder="Enter section title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Section Description
                      </label>
                      <Input
                        value={content.history.description}
                        onChange={(e) =>
                          updateContent(
                            "history",
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Enter section description..."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                          Timeline Items
                        </label>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {content.history.timeline.length} items
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={addTimelineItem}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {content.history.timeline.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
                        <History className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                        <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          No timeline items yet
                        </h4>
                        <Button
                          onClick={addTimelineItem}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {content.history.timeline.map((item, index) => (
                          <div
                            key={index}
                            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-neutral-400" />
                                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                                  Item {index + 1}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeTimelineItem(index)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Year
                                </label>
                                <Input
                                  value={item.year}
                                  onChange={(e) =>
                                    updateTimelineItem(
                                      index,
                                      "year",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="2024"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Title
                                </label>
                                <Input
                                  value={item.title}
                                  onChange={(e) =>
                                    updateTimelineItem(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Milestone title"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={item.description}
                                  onChange={(e) =>
                                    updateTimelineItem(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Description..."
                                  rows={2}
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leadership Team */}
              {activeTab === "team" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg shrink-0">
                      <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        Leadership Team
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Showcase your team members
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Section Title
                      </label>
                      <Input
                        value={content.team.title}
                        onChange={(e) =>
                          updateContent("team", "title", e.target.value)
                        }
                        placeholder="Enter section title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Section Description
                      </label>
                      <Input
                        value={content.team.description}
                        onChange={(e) =>
                          updateContent("team", "description", e.target.value)
                        }
                        placeholder="Enter section description..."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div>
                        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                          Team Members
                        </label>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {content.team.members.length} members
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={addTeamMember}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {content.team.members.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
                        <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                        <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          No team members yet
                        </h4>
                        <Button
                          onClick={addTeamMember}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Member
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {content.team.members.map((member, index) => (
                          <div
                            key={index}
                            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                                  Member {index + 1}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeTeamMember(index)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Name
                                  </label>
                                  <Input
                                    value={member.name}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter name..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Role
                                  </label>
                                  <Input
                                    value={member.role}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "role",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter role..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Bio
                                  </label>
                                  <RichTextEditor
                                    value={member.bio}
                                    onChange={(value) =>
                                      updateTeamMember(index, "bio", value)
                                    }
                                    placeholder="Enter bio..."
                                    height={100}
                                  />
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Profile Image
                                  </label>
                                  <ImageUpload
                                    value={member.image || ""}
                                    onChange={(url) =>
                                      updateTeamMember(index, "image", url)
                                    }
                                    alt={`${member.name} profile`}
                                    aspectRatio="square"
                                    placeholder="Upload image..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    LinkedIn URL
                                  </label>
                                  <Input
                                    value={member.linkedin || ""}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "linkedin",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="https://linkedin.com/in/..."
                                    type="url"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Specialties (comma-separated)
                                  </label>
                                  <Input
                                    value={member.specialties.join(", ")}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "specialties",
                                        e.target.value
                                          .split(",")
                                          .map((s) => s.trim())
                                          .filter((s) => s),
                                      )
                                    }
                                    placeholder="Leadership, Strategy..."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Core Values */}
              {activeTab === "values" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-lg shrink-0">
                      <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        Core Values
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Define your company's values
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div>
                      <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        Core Values
                      </label>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {content.values.length} values
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={addValue}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {content.values.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
                      <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No core values yet
                      </h4>
                      <Button onClick={addValue} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Value
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {content.values.map((value, index) => (
                        <div
                          key={index}
                          className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-600" />
                              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                                Value {index + 1}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeValue(index)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Title
                                </label>
                                <Input
                                  value={value.title}
                                  onChange={(e) =>
                                    updateValue(index, "title", e.target.value)
                                  }
                                  placeholder="Enter title..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={value.description}
                                  onChange={(e) =>
                                    updateValue(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter description..."
                                  rows={3}
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Icon Name
                                </label>
                                <Input
                                  value={value.icon}
                                  onChange={(e) =>
                                    updateValue(index, "icon", e.target.value)
                                  }
                                  placeholder="Shield, Users..."
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                  Lucide icons: Shield, Users, Zap, Award
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                  Color Theme
                                </label>
                                <select
                                  value={value.color}
                                  onChange={(e) =>
                                    updateValue(index, "color", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                  <option value="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                                    Primary
                                  </option>
                                  <option value="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                    Green
                                  </option>
                                  <option value="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    Purple
                                  </option>
                                  <option value="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                                    Orange
                                  </option>
                                  <option value="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    Red
                                  </option>
                                  <option value="bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400">
                                    Pink
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="p-2 bg-linear-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg shrink-0">
                      <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                        SEO Settings
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Optimize for search engines
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                          Meta Title
                        </label>
                        <Input
                          value={content.seo.metaTitle}
                          onChange={(e) =>
                            updateContent("seo", "metaTitle", e.target.value)
                          }
                          placeholder="Enter meta title..."
                          maxLength={60}
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-neutral-500">
                            Recommended: 50-60 characters
                          </p>
                          <span
                            className={`text-xs font-bold ${
                              content.seo.metaTitle.length > 60
                                ? "text-red-600"
                                : content.seo.metaTitle.length > 50
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {content.seo.metaTitle.length}/60
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={content.seo.metaDescription}
                          onChange={(e) =>
                            updateContent(
                              "seo",
                              "metaDescription",
                              e.target.value,
                            )
                          }
                          rows={3}
                          maxLength={160}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter meta description..."
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-neutral-500">
                            Recommended: 150-160 characters
                          </p>
                          <span
                            className={`text-xs font-bold ${
                              content.seo.metaDescription.length > 160
                                ? "text-red-600"
                                : content.seo.metaDescription.length > 150
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {content.seo.metaDescription.length}/160
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                          Keywords (comma-separated)
                        </label>
                        <Input
                          value={content.seo.keywords.join(", ")}
                          onChange={(e) =>
                            updateContent(
                              "seo",
                              "keywords",
                              e.target.value
                                .split(",")
                                .map((k) => k.trim())
                                .filter((k) => k),
                            )
                          }
                          placeholder="keyword1, keyword2, keyword3..."
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          {content.seo.keywords.length} keywords added
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <AboutPagePreview
          content={content}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
