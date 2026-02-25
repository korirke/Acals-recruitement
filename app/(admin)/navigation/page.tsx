"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Menu,
  Link as LinkIcon,
  ChevronDown,
  Navigation,
  Sparkles,
  RefreshCw,
  X,
  Tag,
} from "lucide-react";
import { api } from "@/lib/apiClient";

// Local type definitions
interface NavItem {
  id: string;
  name: string;
  key: string;
  href?: string;
  position: number;
  hasDropdown: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DropdownItem {
  id: string;
  name: string;
  href: string;
  description: string;
  features: string[];
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DropdownData {
  [key: string]: {
    title: string;
    items: DropdownItem[];
  };
}

interface NavigationApiResponse {
  navItems: NavItem[];
  dropdownData: DropdownData;
}

const FeatureTagManager = ({
  features,
  onChange,
}: {
  features: string[];
  onChange: (features: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const addFeature = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !features.includes(trimmed)) {
      onChange([...features, trimmed]);
      setInputValue("");
    }
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          size="sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type feature and press Enter"
          className="border-2 focus:border-primary-400 flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={addFeature}
          className="bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {features.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700">
          {features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium group hover:from-primary-200 hover:to-purple-200 dark:hover:from-primary-800/50 dark:hover:to-purple-800/50 transition-all duration-200 shadow-sm"
            >
              <Tag className="w-3 h-3" />
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 text-red-600 dark:text-red-400" />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        {features.length} feature{features.length !== 1 ? "s" : ""} added
      </p>
    </div>
  );
};

export default function NavigationManager() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [dropdownData, setDropdownData] = useState<DropdownData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await api.get<NavigationApiResponse>("/navigation");
      setNavItems(response.data?.navItems || []);
      setDropdownData(response.data?.dropdownData || {});
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load navigation data",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNavigation = async () => {
    setSaving(true);
    try {
      const payload = { navItems, dropdownData };
      await api.put("/admin/navigation", payload);

      showToast({
        type: "success",
        title: "Success",
        message: "Navigation updated successfully!",
      });

      setEditingItem(null);
      await fetchNavigation();
    } catch (error) {
      console.error("Failed to save navigation:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update navigation",
      });
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    const newItem: NavItem = {
      id: `temp-${Date.now()}`,
      name: "New Item",
      key: `new-item-${Date.now()}`,
      href: "",
      position: navItems.length + 1,
      hasDropdown: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNavItems([...navItems, newItem]);
    setEditingItem(newItem.key);
  };

  const updateNavItem = (key: string, updates: Partial<NavItem>) => {
    setNavItems((items) =>
      items.map((item) => (item.key === key ? { ...item, ...updates } : item)),
    );
  };

  const deleteNavItem = async (key: string) => {
    const item = navItems.find((item) => item.key === key);
    if (!item) return;

    try {
      if (item.id.startsWith("temp-")) {
        setNavItems((items) => items.filter((item) => item.key !== key));
        const newDropdownData = { ...dropdownData };
        delete newDropdownData[key];
        setDropdownData(newDropdownData);

        showToast({
          type: "success",
          title: "Item Deleted",
          message: "Navigation item removed successfully",
        });
        return;
      }

      await api.delete(`/admin/navigation/${item.id}`);
      setNavItems((items) => items.filter((item) => item.key !== key));
      const newDropdownData = { ...dropdownData };
      delete newDropdownData[key];
      setDropdownData(newDropdownData);

      showToast({
        type: "success",
        title: "Item Deleted",
        message: "Navigation item deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete navigation item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to delete navigation item",
      });
    }
  };

  const addDropdownItem = (navKey: string) => {
    const newDropdownItem: DropdownItem = {
      id: `temp-${Date.now()}`,
      name: "New Dropdown Item",
      href: "/new-page",
      description: "Description for new item",
      features: [],
      position: (dropdownData[navKey]?.items?.length || 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDropdownData((prev: DropdownData) => ({
      ...prev,
      [navKey]: {
        title: prev[navKey]?.title || "Dropdown Title",
        items: [...(prev[navKey]?.items || []), newDropdownItem],
      },
    }));
  };

  const updateDropdownItem = (
    navKey: string,
    itemIndex: number,
    updates: Partial<DropdownItem>,
  ) => {
    setDropdownData((prev: DropdownData) => {
      const dropdown = prev[navKey];
      if (!dropdown) return prev;

      return {
        ...prev,
        [navKey]: {
          ...dropdown,
          items: dropdown.items.map((item, index) =>
            index === itemIndex ? { ...item, ...updates } : item,
          ),
        },
      };
    });
  };

  const deleteDropdownItem = (navKey: string, itemIndex: number) => {
    setDropdownData((prev: DropdownData) => {
      const dropdown = prev[navKey];
      if (!dropdown) return prev;

      return {
        ...prev,
        [navKey]: {
          ...dropdown,
          items: dropdown.items.filter((_, index) => index !== itemIndex),
        },
      };
    });

    showToast({
      type: "success",
      title: "Dropdown Item Deleted",
      message: "Dropdown item removed successfully",
    });
  };

  const moveNavItem = (key: string, direction: "up" | "down") => {
    const sortedItems = [...navItems].sort((a, b) => a.position - b.position);
    const currentIndex = sortedItems.findIndex((item) => item.key === key);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedItems = [...sortedItems];

    [updatedItems[currentIndex], updatedItems[newIndex]] = [
      updatedItems[newIndex],
      updatedItems[currentIndex],
    ];

    updatedItems.forEach((item, index) => {
      item.position = index + 1;
    });

    setNavItems(updatedItems);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
              ></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="h-40 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600"
                children={undefined}
              ></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalDropdownItems = Object.values(dropdownData).reduce(
    (acc, dropdown) => acc + (dropdown?.items?.length || 0),
    0,
  );
  const activeNavItems = navItems.filter((item) => item.isActive);
  const navItemsWithDropdowns = navItems.filter((item) => item.hasDropdown);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Navigation Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            Manage your website navigation and dropdown menus
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => fetchNavigation()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Nav Items"
          value={navItems.length}
          icon={<Menu className="w-6 h-6" />}
          color="blue"
          change={{ value: 2, type: "increase" }}
        />
        <StatsCard
          title="Active Items"
          value={activeNavItems.length}
          icon={<Navigation className="w-6 h-6" />}
          color="green"
          change={{ value: 1, type: "increase" }}
        />
        <StatsCard
          title="With Dropdowns"
          value={navItemsWithDropdowns.length}
          icon={<ChevronDown className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Dropdown Items"
          value={totalDropdownItems}
          icon={<LinkIcon className="w-6 h-6" />}
          color="orange"
          change={{ value: 5, type: "increase" }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={addNavItem}
          className="flex items-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Nav Item
        </Button>
        <Button
          onClick={saveNavigation}
          disabled={saving}
          className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="space-y-6">
        {navItems
          .sort((a, b) => a.position - b.position)
          .map((item, index) => (
            <Card
              key={item.key}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 dark:hover:border-primary-800"
            >
              <div className="p-6">
                {/* Item Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-medium">
                        Position #{item.position}
                      </span>
                    </div>
                    {editingItem === item.key ? (
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateNavItem(item.key, { name: e.target.value })
                        }
                        className="font-bold text-xl border-2 focus:border-primary-400"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {item.name}
                      </h3>
                    )}
                    <div className="flex gap-2">
                      {item.isActive ? (
                        <span className="px-3 py-1 text-xs font-bold bg-linear-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 rounded-full shadow-md">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold bg-linear-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 rounded-full">
                          Inactive
                        </span>
                      )}
                      {item.hasDropdown && (
                        <span className="px-3 py-1 text-xs font-bold bg-linear-to-r from-primary-100 to-purple-100 text-primary-700 dark:from-primary-900/30 dark:to-purple-900/30 dark:text-primary-400 rounded-full shadow-md">
                          Dropdown
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveNavItem(item.key, "up")}
                      disabled={index === 0}
                      className="hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveNavItem(item.key, "down")}
                      disabled={index === navItems.length - 1}
                      className="hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {editingItem === item.key ? (
                      <Button
                        onClick={() => setEditingItem(null)}
                        size="sm"
                        className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item.key)}
                        className="hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNavItem(item.key)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Edit Form */}
                {editingItem === item.key && (
                  <div className="bg-linear-to-r from-primary-50/50 to-purple-50/50 dark:from-primary-900/10 dark:to-purple-900/10 rounded-2xl p-6 mb-6 border border-primary-200/50 dark:border-primary-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                          Display Name
                        </label>
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateNavItem(item.key, { name: e.target.value })
                          }
                          className="border-2 focus:border-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                          Key
                        </label>
                        <Input
                          value={item.key}
                          onChange={(e) =>
                            updateNavItem(item.key, { key: e.target.value })
                          }
                          className="border-2 focus:border-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                          Link (if no dropdown)
                        </label>
                        <Input
                          value={item.href || ""}
                          onChange={(e) =>
                            updateNavItem(item.key, { href: e.target.value })
                          }
                          disabled={item.hasDropdown}
                          className="border-2 focus:border-primary-400 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-8 mt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.hasDropdown}
                          onChange={(e) =>
                            updateNavItem(item.key, {
                              hasDropdown: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-bold flex items-center gap-2">
                          <ChevronDown className="w-4 h-4" />
                          Has Dropdown
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            updateNavItem(item.key, {
                              isActive: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-bold flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          Active
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Dropdown Management */}
                {item.hasDropdown && (
                  <div className="border-t-2 border-neutral-200 dark:border-neutral-700 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                        <ChevronDown className="w-5 h-5 text-primary-600" />
                        Dropdown Items
                      </h4>
                      <Button
                        onClick={() => addDropdownItem(item.key)}
                        size="sm"
                        className="flex items-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Dropdown Item
                      </Button>
                    </div>

                    {dropdownData[item.key] && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                            Dropdown Title
                          </label>
                          <Input
                            value={dropdownData[item.key]?.title || ""}
                            onChange={(e) =>
                              setDropdownData((prev: DropdownData) => ({
                                ...prev,
                                [item.key]: {
                                  ...prev[item.key],
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="border-2 focus:border-primary-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {dropdownData[item.key]?.items?.map(
                            (dropItem: DropdownItem, index: number) => (
                              <Card
                                key={index}
                                className="p-6 bg-white dark:bg-neutral-700 border-2 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <h5 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-primary-600" />
                                    {dropItem.name}
                                  </h5>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      deleteDropdownItem(item.key, index)
                                    }
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                      Name
                                    </label>
                                    <Input
                                      size="sm"
                                      value={dropItem.name}
                                      onChange={(e) =>
                                        updateDropdownItem(item.key, index, {
                                          name: e.target.value,
                                        })
                                      }
                                      className="border-2 focus:border-primary-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                      Link
                                    </label>
                                    <Input
                                      size="sm"
                                      value={dropItem.href}
                                      onChange={(e) =>
                                        updateDropdownItem(item.key, index, {
                                          href: e.target.value,
                                        })
                                      }
                                      className="border-2 focus:border-primary-400"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    className="w-full px-3 py-2 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-sm bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-200"
                                    rows={3}
                                    value={dropItem.description}
                                    onChange={(e) =>
                                      updateDropdownItem(item.key, index, {
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="mt-4">
                                  <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Features
                                  </label>
                                  <FeatureTagManager
                                    features={dropItem.features || []}
                                    onChange={(features) =>
                                      updateDropdownItem(item.key, index, {
                                        features,
                                      })
                                    }
                                  />
                                </div>
                              </Card>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-2xl"></div>
            </Card>
          ))}
      </div>
    </div>
  );
}
