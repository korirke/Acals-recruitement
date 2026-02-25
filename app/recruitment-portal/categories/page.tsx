"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { recruitmentAdminService, jobsService } from "@/services/recruitment-services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Badge } from "@/components/careers/ui/badge";
import { IconPicker } from "@/components/ui/IconPicker";
import { useToast } from "@/components/careers/ui/use-toast";
import { Plus, Edit2, Trash2, X, Save, Loader2, Tag, Briefcase } from "lucide-react";
import { getIconComponent } from "@/components/icons/IconRegistry";
import type { JobCategory } from "@/types";

export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    sortOrder: 0,
  });

  useEffect(() => {
    if (!user || !["HR_MANAGER", "SUPER_ADMIN"].includes(user.role)) {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      sortOrder: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (category: JobCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      sortOrder: 0,
    });
    setIsAdding(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading("submit");
      if (editingId) {
        await recruitmentAdminService.updateCategory(editingId, formData);
        toast({
          title: "Category Updated",
          description: "The category has been updated successfully",
        });
      } else {
        await recruitmentAdminService.createCategory(formData);
        toast({
          title: "Category Created",
          description: "New category has been added successfully",
        });
      }
      resetForm();
      setIsAdding(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setActionLoading(categoryId);
      await recruitmentAdminService.deleteCategory(categoryId);
      toast({
        title: "Category Deleted",
        description: "The category has been removed successfully",
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Organize jobs into categories for better discovery
          </p>
        </div>
        <Button
          onClick={() => {
            if (isAdding) {
              resetForm();
            }
            setIsAdding(!isAdding);
          }}
          size="sm"
          className={`w-full sm:w-auto ${
            isAdding
              ? "bg-neutral-200 hover:bg-neutral-300"
              : "bg-primary-500 hover:bg-primary-600"
          }`}
        >
          {isAdding ? (
            <>
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Add Category
            </>
          )}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="shadow-card bg-neutral-50 dark:bg-neutral-900 border-2 border-dashed animate-fade-in">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
              {editingId ? "Edit Category" : "Add New Category"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {editingId ? "Update category information" : "Create a new job category"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-xs sm:text-sm">
                Category Name *
              </Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering, Marketing"
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the category"
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm">Icon (Optional)</Label>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700">
                <IconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                />
              </div>
              {formData.icon && (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Preview:
                  </span>
                  <div className="p-1.5 sm:p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon);
                      return (
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                      );
                    })()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {formData.icon}
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={actionLoading === "submit"}
              size="sm"
              className="w-full bg-primary-500 hover:bg-primary-600"
            >
              {actionLoading === "submit" ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  {editingId ? "Update Category" : "Add Category"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const IconComponent = category.icon ? getIconComponent(category.icon) : null;

          return (
            <Card
              key={category.id}
              className="animate-fade-in shadow-card hover:shadow-card-hover transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {IconComponent ? (
                      <div className="p-1.5 sm:p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg shrink-0">
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    ) : (
                      <div className="p-1.5 sm:p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg shrink-0">
                        <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-neutral-900 dark:text-neutral-100 truncate">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs">
                        <Briefcase className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                        {category.jobCount || 0} jobs
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 shrink-0">
                    <Button
                      onClick={() => handleEdit(category)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      disabled={actionLoading === category.id}
                    >
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={actionLoading === category.id}
                    >
                      {actionLoading === category.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 sm:py-16 text-center">
            <Tag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              No Categories Yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Get started by creating your first job category
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}