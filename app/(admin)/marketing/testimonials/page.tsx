"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import AvatarImage from "@/components/ui/AvatarImage";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Star,
  Upload,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useTestimonialManager } from "@/hooks/useTestimonialManager";
import type { Testimonial } from "@/types";

const serviceOptions = [
  { value: "", label: "All Services" },
  { value: "payroll", label: "Payroll Management" },
  { value: "recruitment", label: "Recruitment" },
  { value: "attendance", label: "Time & Attendance" },
  { value: "consulting", label: "HR Consulting" },
  { value: "outsourcing", label: "Staff Outsourcing" },
  { value: "hr-system", label: "HR System" },
  { value: "software", label: "Software Development" },
  { value: "cctv", label: "CCTV Solutions" },
];

type UiTestimonial = Testimonial & {
  _dirty?: boolean;
  _resultsText?: string;
  _errors?: {
    name?: boolean;
    role?: boolean;
    company?: boolean;
    content?: boolean;
  };
};

const resultsToText = (r: any) => (Array.isArray(r) ? r.join("\n") : "");
const textToResults = (t: string) =>
  t
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

function validate(t: UiTestimonial) {
  const name = (t.name || "").trim();
  const role = (t.role || "").trim();
  const company = (t.company || "").trim();
  const content = (t.content || "").trim();

  const errors = {
    name: !name,
    role: !role,
    company: !company,
    content: !content,
  };

  const ok = !errors.name && !errors.role && !errors.company && !errors.content;
  return { ok, errors };
}

export default function AdminTestimonialsManager() {
  const {
    testimonials: fetchedTestimonials,
    loading,
    refetch,
  } = useTestimonials();
  const {
    saving,
    uploadingAvatar,
    saveTestimonials,
    deleteTestimonial,
    uploadAvatar,
  } = useTestimonialManager();

  const [testimonials, setTestimonials] = useState<UiTestimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setTestimonials(
      (fetchedTestimonials || []).map((t) => ({
        ...t,
        _dirty: false,
        _resultsText: resultsToText(t.results),
        _errors: {},
      })),
    );
  }, [fetchedTestimonials]);

  const dirtyCount = useMemo(
    () => testimonials.filter((t) => t._dirty).length,
    [testimonials],
  );

  const scrollToId = (id: string) => {
    requestAnimationFrame(() =>
      itemRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  };

  const updateTestimonial = (id: string, updates: Partial<UiTestimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = {
          ...t,
          ...updates,
          _dirty: true,
          updatedAt: new Date().toISOString(),
        };
        const v = validate(next);
        next._errors = v.errors;
        return next;
      }),
    );
  };

  const addTestimonial = () => {
    const id = `temp-${Date.now()}`;
    const newT: UiTestimonial = {
      id,
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatar: "",
      results: [],
      service: "",
      isActive: true,
      isFeatured: false,
      position: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _dirty: true,
      _resultsText: "",
      _errors: { name: true, role: true, company: true, content: true },
    };

    const next = [newT, ...testimonials].map((t, idx) => ({
      ...t,
      position: idx + 1,
      _dirty: true,
    }));
    setTestimonials(next);
    setEditingId(id);
    scrollToId(id);
  };

  const duplicateTestimonial = (t: UiTestimonial) => {
    const id = `temp-${Date.now()}`;
    const copy: UiTestimonial = {
      ...t,
      id,
      name: t.name ? `${t.name} (Copy)` : "Copy",
      position: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _dirty: true,
      _resultsText: resultsToText(t.results),
      _errors: validate(t).errors,
    };

    const next = [copy, ...testimonials].map((x, idx) => ({
      ...x,
      position: idx + 1,
      _dirty: true,
    }));
    setTestimonials(next);
    setEditingId(id);
    scrollToId(id);
  };

  const moveTestimonial = (id: string, dir: "up" | "down") => {
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx < 0) return;
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === testimonials.length - 1) return;

    const next = [...testimonials];
    const j = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[j]] = [next[j], next[idx]];

    const withPos = next.map((t, k) => ({
      ...t,
      position: k + 1,
      _dirty: true,
    }));
    setTestimonials(withPos);
    scrollToId(id);
  };

  const handleAvatarUpload = async (id: string, file: File) => {
    const url = await uploadAvatar(file);
    if (url) updateTestimonial(id, { avatar: url });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    if (id.startsWith("temp-")) {
      setTestimonials((prev) =>
        prev
          .filter((t) => t.id !== id)
          .map((t, idx) => ({ ...t, position: idx + 1 })),
      );
      return;
    }

    const ok = await deleteTestimonial(id);
    if (ok) {
      setTestimonials((prev) =>
        prev
          .filter((t) => t.id !== id)
          .map((t, idx) => ({ ...t, position: idx + 1 })),
      );
    }
  };

  const saveOne = async (id: string) => {
    const t = testimonials.find((x) => x.id === id);
    if (!t) return;

    const v = validate(t);
    if (!v.ok) {
      updateTestimonial(id, { _errors: v.errors });
      return;
    }

    const payload: Testimonial[] = [
      {
        ...t,
        results: textToResults(t._resultsText || ""),
      },
    ];

    const ok = await saveTestimonials(payload);
    if (ok) {
      setEditingId(null);
      await refetch();
    }
  };

  const saveChanged = async () => {
    const changed = testimonials.filter((t) => t._dirty);
    if (changed.length === 0) return;

    // validate all changed first
    for (const t of changed) {
      const v = validate(t);
      if (!v.ok) {
        setTestimonials((prev) =>
          prev.map((x) => (x.id === t.id ? { ...x, _errors: v.errors } : x)),
        );
        setEditingId(t.id);
        scrollToId(t.id);
        return;
      }
    }

    const payload: Testimonial[] = changed.map((t) => ({
      ...t,
      results: textToResults(t._resultsText || ""),
    }));

    const ok = await saveTestimonials(payload);
    if (ok) {
      setEditingId(null);
      await refetch();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Loading testimonials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Testimonials
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage testimonials ({testimonials.length})
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={addTestimonial} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>

          <Button
            onClick={saveChanged}
            disabled={saving || dirtyCount === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changed ({dirtyCount})
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.map((t, index) => {
          const isEditing = editingId === t.id;
          const e = t._errors || {};

          return (
            <div
              key={t.id}
              ref={(el) => {
                itemRefs.current[t.id] = el;
              }}
            >
              <Card className="overflow-hidden">
                <div className="p-5 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-2">
                          #{String(t.position).padStart(2, "0")}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <AvatarImage
                              src={t.avatar}
                              alt={t.name || "Client"}
                            />
                            <div className="min-w-0">
                              <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                                {t.name || "Unnamed"}
                              </h3>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {t.role} • {t.company}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mt-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= (t.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-neutral-600"}`}
                              />
                            ))}
                          </div>

                          {!isEditing ? (
                            <blockquote className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 italic border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                              “{t.content}”
                            </blockquote>
                          ) : (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Input
                                  label="Name *"
                                  value={t.name || ""}
                                  onChange={(ev) =>
                                    updateTestimonial(t.id, {
                                      name: ev.target.value,
                                    })
                                  }
                                  className={e.name ? "border-red-500" : ""}
                                />
                                <Input
                                  label="Role *"
                                  value={t.role || ""}
                                  onChange={(ev) =>
                                    updateTestimonial(t.id, {
                                      role: ev.target.value,
                                    })
                                  }
                                  className={e.role ? "border-red-500" : ""}
                                />
                              </div>

                              <Input
                                label="Company *"
                                value={t.company || ""}
                                onChange={(ev) =>
                                  updateTestimonial(t.id, {
                                    company: ev.target.value,
                                  })
                                }
                                className={e.company ? "border-red-500" : ""}
                              />

                              <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                  Content *
                                </label>
                                <textarea
                                  value={t.content || ""}
                                  onChange={(ev) =>
                                    updateTestimonial(t.id, {
                                      content: ev.target.value,
                                    })
                                  }
                                  onKeyDown={(ev) => ev.stopPropagation()}
                                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 dark:text-white ${e.content ? "border-red-500" : "border-neutral-300 dark:border-neutral-600"}`}
                                  rows={4}
                                />
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Avatar
                                  </label>
                                  <div className="space-y-2">
                                    <Input
                                      value={t.avatar || ""}
                                      onChange={(ev) =>
                                        updateTestimonial(t.id, {
                                          avatar: ev.target.value,
                                        })
                                      }
                                      placeholder="https://..."
                                    />
                                    <div className="relative">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(ev) => {
                                          const f = ev.target.files?.[0];
                                          if (f) handleAvatarUpload(t.id, f);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={!!uploadingAvatar}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!!uploadingAvatar}
                                        className="w-full"
                                      >
                                        {uploadingAvatar ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-4 h-4 mr-2" />{" "}
                                            Upload
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Rating
                                  </label>
                                  <select
                                    value={t.rating || 5}
                                    onChange={(ev) =>
                                      updateTestimonial(t.id, {
                                        rating: parseInt(ev.target.value),
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                  >
                                    {[1, 2, 3, 4, 5].map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Service
                                  </label>
                                  <select
                                    value={t.service || ""}
                                    onChange={(ev) =>
                                      updateTestimonial(t.id, {
                                        service: ev.target.value || "",
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                  >
                                    {serviceOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                  Results (one per line)
                                </label>
                                <textarea
                                  value={t._resultsText || ""}
                                  onChange={(ev) =>
                                    updateTestimonial(t.id, {
                                      _resultsText: ev.target.value,
                                    })
                                  }
                                  onKeyDown={(ev) => ev.stopPropagation()}
                                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                                  rows={3}
                                  placeholder={
                                    "20hrs saved weekly\n45% satisfaction boost"
                                  }
                                />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={() => saveOne(t.id)}
                                  disabled={saving || !t._dirty}
                                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                  Save This
                                </Button>

                                <Button
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                  className="flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" /> Close
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveTestimonial(t.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveTestimonial(t.id, "down")}
                          disabled={index === testimonials.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateTestimonial(t)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(isEditing ? null : t.id)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
