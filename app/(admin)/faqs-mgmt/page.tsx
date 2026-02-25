"use client";

import React, { useState, useMemo } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Eye,
  ThumbsUp,
  Folder,
  FileQuestion,
  TrendingUp,
  X,
  Save,
  GripVertical,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  Shield,
  CreditCard,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  useAdminFaqs,
  useAdminFaqCategories,
  useAdminFaqStats,
} from "@/hooks/useAdminFaqData";
import { useAdminFaq } from "@/hooks/useAdminFaq";
import type { Faq, FaqCategory } from "@/types";

type ViewMode = "faqs" | "categories";
type DialogType = "faq" | "category" | null;

const iconMap = {
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
};

const iconOptions = [
  "HelpCircle",
  "User",
  "Briefcase",
  "Shield",
  "CreditCard",
  "MessageSquare",
];

export default function AdminFAQPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("faqs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDialog, setShowDialog] = useState<DialogType>(null);
  const [editingItem, setEditingItem] = useState<Faq | FaqCategory | null>(
    null,
  );
  const [formData, setFormData] = useState<any>({});
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const { faqs, loading: faqsLoading, refetch: refetchFaqs } = useAdminFaqs();
  const {
    categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useAdminFaqCategories();
  const { stats } = useAdminFaqStats(faqs, categories);

  const {
    loading: adminLoading,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaqActive,
    reorderFaqs,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    reorderCategories,
  } = useAdminFaq();

  const loading = faqsLoading || categoriesLoading;

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category.key === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchTerm]);

  const allCategories = useMemo(() => {
    return [
      {
        id: "all",
        name: "All Topics",
        key: "all",
        icon: "HelpCircle",
        faqCount: faqs.length,
        isActive: true,
        position: -1,
      },
      ...categories,
    ];
  }, [categories, faqs]);

  const openCreateDialog = (type: DialogType) => {
    setShowDialog(type);
    setEditingItem(null);

    if (type === "faq") {
      setFormData({
        question: "",
        answer: "",
        category: categories.find((c) => c.isActive)?.key || "",
        isPopular: false,
        tags: [],
      });
    } else if (type === "category") {
      setFormData({
        name: "",
        key: "",
        icon: "HelpCircle",
        description: "",
      });
    }
  };

  const openEditDialog = (item: Faq | FaqCategory, type: DialogType) => {
    setShowDialog(type);
    setEditingItem(item);

    if (type === "faq") {
      const faq = item as Faq;
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category.key,
        isPopular: faq.isPopular,
        tags: faq.tags || [],
        isActive: faq.isActive,
      });
    } else if (type === "category") {
      const category = item as FaqCategory;
      setFormData({
        name: category.name,
        key: category.key,
        icon: category.icon,
        description: category.description || "",
        isActive: category.isActive,
      });
    }
  };

  const handleSubmit = async () => {
    if (showDialog === "faq") {
      const success = editingItem
        ? await updateFaq(editingItem.id, formData)
        : await createFaq(formData);

      if (success) {
        setShowDialog(null);
        setEditingItem(null);
        setFormData({});
        await refetchFaqs();
        await refetchCategories();
      }
    } else if (showDialog === "category") {
      const success = editingItem
        ? await updateCategory(editingItem.id, formData)
        : await createCategory(formData);

      if (success) {
        setShowDialog(null);
        setEditingItem(null);
        setFormData({});
        await refetchFaqs();
        await refetchCategories();
      }
    }
  };

  const handleDelete = async (id: string, type: "faq" | "category") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    const success =
      type === "faq" ? await deleteFaq(id) : await deleteCategory(id);

    if (success) {
      await refetchFaqs();
      await refetchCategories();
    }
  };

  const handleToggleActive = async (
    id: string,
    isActive: boolean,
    type: "faq" | "category",
  ) => {
    const success =
      type === "faq"
        ? await toggleFaqActive(id, isActive)
        : await toggleCategoryActive(id, isActive);

    if (success) {
      await refetchFaqs();
      await refetchCategories();
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    if (viewMode === "faqs") {
      const items = [...faqs];
      const draggedIndex = items.findIndex((item) => item.id === draggedItem);
      const targetIndex = items.findIndex((item) => item.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const [removed] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, removed);

      const reordered = items.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      const success = await reorderFaqs(reordered);
      if (success) {
        await refetchFaqs();
      }
    } else {
      const items = [...categories];
      const draggedIndex = items.findIndex((item) => item.id === draggedItem);
      const targetIndex = items.findIndex((item) => item.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const [removed] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, removed);

      const reordered = items.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      const success = await reorderCategories(reordered);
      if (success) {
        await refetchCategories();
      }
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FAQ Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage frequently asked questions and categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode("faqs")}
              className={`px-4 py-2 rounded-l-lg text-sm font-medium transition-colors ${
                viewMode === "faqs"
                  ? "bg-primary-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <FileQuestion className="w-4 h-4 inline mr-2" />
              FAQs
            </button>
            <button
              onClick={() => setViewMode("categories")}
              className={`px-4 py-2 rounded-r-lg text-sm font-medium transition-colors ${
                viewMode === "categories"
                  ? "bg-primary-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <Folder className="w-4 h-4 inline mr-2" />
              Categories
            </button>
          </div>
          <Button
            onClick={() =>
              openCreateDialog(viewMode === "faqs" ? "faq" : "category")
            }
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {viewMode === "faqs" ? "FAQ" : "Category"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total FAQs"
            value={stats.totalFaqs}
            icon={<FileQuestion className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Categories"
            value={stats.categories}
            icon={<Folder className="w-6 h-6" />}
            color="purple"
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews}
            icon={<Eye className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Popular FAQs"
            value={stats.popularFaqs}
            icon={<Star className="w-6 h-6" />}
            color="orange"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search ${viewMode === "faqs" ? "FAQs" : "categories"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {viewMode === "faqs" && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.key}>
                    {cat.name} ({cat.faqCount})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {viewMode === "faqs" ? (
            // FAQs List
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    No FAQs found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by creating your first FAQ"}
                  </p>
                  {!searchTerm && selectedCategory === "all" && (
                    <Button onClick={() => openCreateDialog("faq")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create FAQ
                    </Button>
                  )}
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    draggable
                    onDragStart={() => handleDragStart(faq.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(faq.id)}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg transition-all duration-300 cursor-move"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 pt-1">
                          <GripVertical className="w-5 h-5 text-neutral-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 rounded">
                                  {faq.category.name}
                                </span>
                                {faq.isPopular && (
                                  <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded">
                                    <Star className="w-3 h-3 fill-current" />
                                    Popular
                                  </span>
                                )}
                                {!faq.isActive && (
                                  <span className="text-xs text-red-600 dark:text-red-400 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                                {faq.question}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {faq.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  {faq.helpfulCount}
                                </span>
                                <span>
                                  {faq.updatedAt
                                    ? new Date(
                                        faq.updatedAt,
                                      ).toLocaleDateString()
                                    : faq.createdAt
                                      ? new Date(
                                          faq.createdAt,
                                        ).toLocaleDateString()
                                      : ""}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setExpandedFaq(
                                    expandedFaq === faq.id ? null : faq.id,
                                  )
                                }
                                className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                title="View answer"
                              >
                                {expandedFaq === faq.id ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => openEditDialog(faq, "faq")}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleActive(
                                    faq.id,
                                    !faq.isActive,
                                    "faq",
                                  )
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  faq.isActive
                                    ? "text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                                    : "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                }`}
                                title={faq.isActive ? "Deactivate" : "Activate"}
                              >
                                {faq.isActive ? (
                                  <X className="w-5 h-5" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(faq.id, "faq")}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {expandedFaq === faq.id && (
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {faq.answer}
                              </p>
                              {faq.tags && faq.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {faq.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Categories List
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Folder className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    No categories found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Create your first category to organize FAQs
                  </p>
                  <Button onClick={() => openCreateDialog("category")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
                  </Button>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    draggable
                    onDragStart={() => handleDragStart(category.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(category.id)}
                    className="group bg-linear-to-br from-white to-blue-50 dark:from-neutral-900 dark:to-blue-900/10 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-move"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                          {iconMap[category.icon as keyof typeof iconMap] || (
                            <Folder className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {category.faqCount} FAQs
                          </p>
                        </div>
                      </div>
                      {!category.isActive && (
                        <span className="text-xs text-red-600 dark:text-red-400 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    {category.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={() => openEditDialog(category, "category")}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleToggleActive(
                            category.id,
                            !category.isActive,
                            "category",
                          )
                        }
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          category.isActive
                            ? "text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            : "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                        }`}
                      >
                        {category.isActive ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {category.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, "category")}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top FAQs */}
      {stats && stats.topFaqs.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Top Performing FAQs
          </h2>
          <div className="space-y-3">
            {stats.topFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
              >
                <div className="shrink-0 w-8 h-8 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {faq.question}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {faq.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {faq.helpfulCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingItem ? "Edit" : "Create"}{" "}
                {showDialog === "faq" ? "FAQ" : "Category"}
              </h3>
              <button
                onClick={() => setShowDialog(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {showDialog === "faq" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Question *
                    </label>
                    <input
                      type="text"
                      value={formData.question || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the question"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Answer *
                    </label>
                    <textarea
                      value={formData.answer || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter the answer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories
                          .filter((c) => c.isActive)
                          .map((cat) => (
                            <option key={cat.id} value={cat.key}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(formData.tags)
                            ? formData.tags.join(", ")
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., account, billing"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPopular || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPopular: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Mark as Popular
                      </span>
                    </label>

                    {/* ✅ Only show isActive checkbox for EDIT, not CREATE */}
                    {editingItem && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          Active
                        </span>
                      </label>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Account & Profile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Key (URL-safe) *
                      </label>
                      <input
                        type="text"
                        value={formData.key || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            key: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "-"),
                          })
                        }
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., account-profile"
                        disabled={!!editingItem}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon || "HelpCircle"}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Brief description of this category"
                    />
                  </div>

                  {/* ✅ Only show isActive checkbox for EDIT, not CREATE */}
                  {editingItem && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive !== false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Active
                      </span>
                    </label>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  adminLoading ||
                  (showDialog === "faq" &&
                    (!formData.question ||
                      !formData.answer ||
                      !formData.category)) ||
                  (showDialog === "category" &&
                    (!formData.name || !formData.key))
                }
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {adminLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
