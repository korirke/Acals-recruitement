"use client";

import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Mail,
} from "lucide-react";
import { api } from "@/lib/apiClient";
import { ContactInfo, ApiResponse } from "@/types";
import { getIconComponent } from "@/components/icons/IconRegistry";

type ContactType = "address" | "email" | "phone";

const typeOptions: Array<{ value: ContactType; label: string; icon: string }> =
  [
    { value: "address", label: "Address", icon: "map-pin" },
    { value: "email", label: "Email", icon: "mail" },
    { value: "phone", label: "Phone", icon: "phone" },
  ];

export default function AdminContactInfoManager() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const iconOptions = [
    "Mail",
    "Phone",
    "MapPin",
    "Globe",
    "Printer",
    "MessageCircle",
    "Clock",
    "Building",
  ];

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response =
        await api.get<ApiResponse<ContactInfo[]>>("/contact-info");
      const data = response.data || [];
      setContactInfo(
        Array.isArray(data)
          ? data.sort(
              (a: ContactInfo, b: ContactInfo) => a.position - b.position,
            )
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactInfo = async () => {
    setSaving(true);
    try {
      const cleanedContactInfo = contactInfo.map(({ id, ...contact }) => ({
        ...contact,
        ...(id.startsWith("temp-") ? {} : { id }),
      }));

      await api.put("/admin/contact-info", { contactInfo: cleanedContactInfo });
      setEditingId(null);
      await fetchContactInfo();
      alert("Contact info updated successfully!");
    } catch (error) {
      console.error("Failed to save contact info:", error);
      alert("Failed to save contact info");
    } finally {
      setSaving(false);
    }
  };

  const addContactInfo = () => {
    const newContact: ContactInfo = {
      id: `temp-${Date.now()}`,
      type: "email",
      label: "Email",
      value: "contact@company.com",
      icon: "Mail",
      isActive: true,
      position: contactInfo.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContactInfo([...contactInfo, newContact]);
    setEditingId(newContact.id);
  };

  const deleteContactInfo = (id: string) => {
    if (confirm("Are you sure you want to delete this contact info?")) {
      setContactInfo((contactInfo) => contactInfo.filter((c) => c.id !== id));
    }
  };

  const updateContactInfo = (id: string, updates: Partial<ContactInfo>) => {
    setContactInfo((contactInfo) =>
      contactInfo.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact,
      ),
    );
  };

  const moveContactInfo = (id: string, direction: "up" | "down") => {
    const currentIndex = contactInfo.findIndex((c) => c.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === contactInfo.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedContactInfo = [...contactInfo];
    [updatedContactInfo[currentIndex], updatedContactInfo[newIndex]] = [
      updatedContactInfo[newIndex],
      updatedContactInfo[currentIndex],
    ];

    updatedContactInfo.forEach((contact, index) => {
      contact.position = index + 1;
    });

    setContactInfo(updatedContactInfo);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-24 bg-gray-200 dark:bg-neutral-700"
              children={undefined}
            ></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Contact Information Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage company contact information ({contactInfo.length} items)
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={addContactInfo} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Contact Info
          </Button>
          <Button
            onClick={saveContactInfo}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {contactInfo.map((contact, index) => {
          const IconComponent = contact.icon
            ? getIconComponent(contact.icon)
            : null;
          const isClickable =
            contact.type === "email" || contact.type === "phone";

          return (
            <Card key={contact.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                      #{contact.position.toString().padStart(2, "0")}
                    </div>

                    <div className="w-10 h-10 bg-linear-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      {editingId === contact.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Type
                            </label>
                            <select
                              value={contact.type}
                              onChange={(e) => {
                                const selectedType = typeOptions.find(
                                  (t) => t.value === e.target.value,
                                );
                                const selectedValue = e.target
                                  .value as ContactInfo["type"];
                                updateContactInfo(contact.id, {
                                  type: selectedValue,
                                  label: selectedType?.label || contact.label,
                                  icon: selectedType?.icon || contact.icon,
                                });
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-sm"
                            >
                              {typeOptions.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Label
                            </label>
                            <Input
                              value={contact.label}
                              onChange={(e) =>
                                updateContactInfo(contact.id, {
                                  label: e.target.value,
                                })
                              }
                              placeholder="Label"
                              size="sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              Value
                            </label>
                            <Input
                              value={contact.value}
                              onChange={(e) =>
                                updateContactInfo(contact.id, {
                                  value: e.target.value,
                                })
                              }
                              placeholder="Contact value"
                              size="sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                            {contact.label}
                          </div>
                          <div
                            className={`text-sm ${isClickable ? "text-primary-600 dark:text-primary-400" : "text-neutral-600 dark:text-neutral-400"}`}
                          >
                            {contact.value}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 capitalize">
                            {contact.type}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          contact.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {contact.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveContactInfo(contact.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveContactInfo(contact.id, "down")}
                      disabled={index === contactInfo.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {editingId === contact.id ? (
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
                        onClick={() => setEditingId(contact.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteContactInfo(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingId === contact.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Icon
                        </label>
                        <select
                          value={contact.icon || ""}
                          onChange={(e) =>
                            updateContactInfo(contact.id, {
                              icon: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700"
                        >
                          <option value="">No Icon</option>
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={contact.isActive}
                            onChange={(e) =>
                              updateContactInfo(contact.id, {
                                isActive: e.target.checked,
                              })
                            }
                            className="rounded border-neutral-300 dark:border-neutral-600"
                          />
                          <span className="text-sm font-medium">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {contactInfo.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-neutral-400 dark:text-neutral-500">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No contact info yet
              </h3>
              <p className="mb-4">
                Add your company&apos;s contact information to display in the
                footer.
              </p>
              <Button
                onClick={addContactInfo}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Contact Info
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
