"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Badge } from "@/components/careers/ui/badge";
import { Switch } from "@/components/careers/ui/switch";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Loader2,
  Save,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";
import { educationQualificationLevelService } from "@/services/recruitment-services/educationQualificationLevel.service";
import type { QualificationLevelDTO } from "@/types/recruitment/profileRequirements.types";

// ─── Types ──────────

interface FormState {
  key: string;
  label: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = { key: "", label: "", isActive: true };

// ─── Inline Toast ───

interface ToastState {
  type: "success" | "error";
  msg: string;
}

// ─── Component ──────

export default function EducationQualificationLevelsManager() {
  const [levels, setLevels] = useState<QualificationLevelDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  // ── Add form ──────
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [addError, setAddError] = useState<string | null>(null);

  // ── Edit state ────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FormState>>({});
  const [editError, setEditError] = useState<string | null>(null);

  // ── Delete confirm 
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Drag-and-drop
  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ type, msg });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  // ── Load
  const loadLevels = useCallback(async () => {
    try {
      setLoading(true);
      const res = await educationQualificationLevelService.adminGetAll();
      if (res.success && Array.isArray(res.data)) {
        setLevels(res.data);
      } else {
        showToast("Failed to load qualification levels", "error");
      }
    } catch {
      showToast("Failed to load qualification levels", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadLevels();
  }, [loadLevels]);

  // ── Add 
  const handleAdd = async () => {
    setAddError(null);

    const key = addForm.key
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_]/g, "_");
    const label = addForm.label.trim();

    if (!key) {
      setAddError("Key is required");
      return;
    }
    if (!label) {
      setAddError("Label is required");
      return;
    }
    if (levels.some((l) => l.key === key)) {
      setAddError(`A level with key "${key}" already exists.`);
      return;
    }

    setSaving(true);
    try {
      const res = await educationQualificationLevelService.create({
        key,
        label,
        isActive: addForm.isActive,
      });

      if (res.success && res.data) {
        setLevels((prev) => [...prev, res.data!]);
        setAddForm(EMPTY_FORM);
        setShowAddForm(false);
        showToast("Qualification level added successfully");
      } else {
        setAddError((res as any).message || "Failed to create level");
      }
    } catch (err: any) {
      setAddError(err.message || "Failed to create level");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ───────────
  const startEdit = (level: QualificationLevelDTO) => {
    setEditingId(level.id);
    setEditForm({
      key: level.key,
      label: level.label,
      isActive: level.isActive,
    });
    setEditError(null);
    // Close add form if open
    setShowAddForm(false);
    setAddError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditError(null);
  };

  const handleSaveEdit = async (level: QualificationLevelDTO) => {
    setEditError(null);

    const label = (editForm.label ?? "").trim();
    if (!label) {
      setEditError("Label is required");
      return;
    }

    // Key validation for non-system levels
    let newKey: string | undefined;
    if (!level.isSystem && editForm.key !== undefined) {
      newKey = editForm.key
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, "_");
      if (!newKey) {
        setEditError("Key is required");
        return;
      }
      if (levels.some((l) => l.key === newKey && l.id !== level.id)) {
        setEditError(`Key "${newKey}" is already in use.`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await educationQualificationLevelService.update(level.id, {
        ...(newKey !== undefined ? { key: newKey } : {}),
        label,
        isActive: editForm.isActive ?? level.isActive,
      });

      if (res.success && res.data) {
        setLevels((prev) =>
          prev.map((l) => (l.id === level.id ? res.data! : l)),
        );
        cancelEdit();
        showToast("Qualification level updated");
      } else {
        setEditError((res as any).message || "Failed to update level");
      }
    } catch (err: any) {
      setEditError(err.message || "Failed to update level");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Active ──
  const handleToggleActive = async (level: QualificationLevelDTO) => {
    setToggling(level.id);
    try {
      const res = await educationQualificationLevelService.update(level.id, {
        isActive: !level.isActive,
      });
      if (res.success && res.data) {
        setLevels((prev) =>
          prev.map((l) => (l.id === level.id ? res.data! : l)),
        );
        showToast(
          `"${level.label}" ${res.data.isActive ? "activated" : "deactivated"}`,
        );
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setToggling(null);
    }
  };

  // ── Delete ─────────
  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    setDeleting(id);
    try {
      const res = await educationQualificationLevelService.delete(id);
      if (res.success !== false) {
        setLevels((prev) => prev.filter((l) => l.id !== id));
        showToast("Qualification level deleted");
      } else {
        showToast((res as any).message || "Failed to delete level", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to delete level", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ── Move (up/down buttons) ───────────────────────────────────────────────────
  const moveLevel = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= levels.length) return;

    const next = [...levels];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setLevels(next);
    await persistReorder(next);
  };

  // ── Drag-and-drop ──
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index;
      setIsDragging(true);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
        setDragOver(index);
      }
    },
    [],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(null);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      dragIndexRef.current = null;
      setDragOver(null);
      setIsDragging(false);

      if (fromIndex === null || fromIndex === dropIndex) return;

      const next = [...levels];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(dropIndex, 0, moved);
      setLevels(next);
      await persistReorder(next);
    },
    [levels],
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    setDragOver(null);
    setIsDragging(false);
  }, []);

  // ── Persist reorder to API ───────────────────────────────────────────────────
  const persistReorder = async (ordered: QualificationLevelDTO[]) => {
    setReordering(true);
    try {
      await educationQualificationLevelService.reorder(
        ordered.map((l) => l.id),
      );
    } catch {
      showToast("Failed to save new order", "error");
    } finally {
      setReordering(false);
    }
  };

  // ───────────────────
  // RENDER
  // ───────────────────
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      {/* ── Header ── */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-neutral-900 dark:text-white">
                Education Qualification Levels
              </CardTitle>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage the qualification levels available to candidates and used
                in shortlisting criteria.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reordering && (
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving order…
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadLevels}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowAddForm(true);
                cancelEdit();
              }}
              disabled={showAddForm}
              className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Level
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Inline Toast ── */}
        {toast && (
          <div
            className={[
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800",
            ].join(" ")}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {toast.msg}
          </div>
        )}

        {/* ── Info banner ── */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
            <strong>System levels</strong> (🔒) are built-in and cannot be
            deleted or have their key changed. You can deactivate them if not
            needed. <strong>Custom levels</strong> you add here will appear in
            the candidate education dropdown and in the job configuration
            education requirement selector.
          </p>
        </div>

        {/* ── Add Form ── */}
        {showAddForm && (
          <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-5 bg-primary-50/50 dark:bg-primary-900/10 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary-600" />
                Add New Qualification Level
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setAddForm(EMPTY_FORM);
                  setAddError(null);
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addError && (
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {addError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Key field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Key <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Uppercase letters, numbers, underscores only. Immutable after
                  creation (system-level).
                </p>
                <Input
                  value={addForm.key}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      key: e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9_]/g, "_"),
                    })
                  }
                  placeholder="e.g. HIGHER_NATIONAL_DIPLOMA"
                  className="h-10 font-mono text-sm"
                  maxLength={100}
                />
              </div>

              {/* Label field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Display Label <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Human-readable name shown in dropdowns and forms.
                </p>
                <Input
                  value={addForm.label}
                  onChange={(e) =>
                    setAddForm({ ...addForm, label: e.target.value })
                  }
                  placeholder="e.g. Higher National Diploma"
                  className="h-10 text-sm"
                  maxLength={255}
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Switch
                id="add-isActive"
                checked={addForm.isActive}
                onCheckedChange={(v) => setAddForm({ ...addForm, isActive: v })}
              />
              <Label
                htmlFor="add-isActive"
                className="text-sm cursor-pointer text-neutral-700 dark:text-neutral-300"
              >
                Active{" "}
                <span className="text-neutral-500 font-normal">
                  (inactive levels are hidden from dropdowns)
                </span>
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Qualification Level
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setAddForm(EMPTY_FORM);
                  setAddError(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* ── Level List ── */}
        {loading ? (
          <div className="flex items-center gap-3 py-8 justify-center text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading qualification levels…</span>
          </div>
        ) : levels.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-500">
            No qualification levels found. Click &quot;Add Level&quot; to get
            started.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {levels.length} level{levels.length !== 1 ? "s" : ""} total •{" "}
                {levels.filter((l) => l.isActive).length} active
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Drag ⠿ or use ↑↓ to reorder
              </p>
            </div>

            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[40px_40px_30px_1fr_1fr_100px_130px] gap-2 px-3 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-800">
              <span></span>
              <span>#</span>
              <span></span>
              <span>Key</span>
              <span>Label</span>
              <span className="text-center">Status</span>
              <span className="text-right">Actions</span>
            </div>

            {levels.map((level, index) => {
              const isEditing = editingId === level.id;
              const isBeingDraggedOver =
                dragOver === index && dragIndexRef.current !== index;
              const isCurrentlyDragged =
                isDragging && dragIndexRef.current === index;
              const isConfirmingDelete = confirmDeleteId === level.id;

              return (
                <div
                  key={level.id}
                  draggable={!isEditing}
                  onDragStart={(e) => !isEditing && handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "rounded-xl border overflow-hidden transition-all duration-150",
                    isCurrentlyDragged
                      ? "opacity-40 scale-[0.98] border-primary-400 dark:border-primary-600"
                      : isBeingDraggedOver
                        ? "ring-2 ring-primary-400 dark:ring-primary-500 border-primary-400 dark:border-primary-500 shadow-md translate-y-0.5"
                        : level.isActive
                          ? "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                          : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 opacity-70",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* ── Normal row (non-editing) ── */}
                  {!isEditing && (
                    <div className="flex items-center gap-2 px-3 py-3 flex-wrap sm:flex-nowrap">
                      {/* Drag handle */}
                      <div
                        className={[
                          "cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-400 shrink-0",
                          isEditing ? "pointer-events-none opacity-20" : "",
                        ].join(" ")}
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      {/* Up/down buttons */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveLevel(index, "up")}
                          disabled={index === 0 || reordering}
                          className="p-0.5 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLevel(index, "down")}
                          disabled={index === levels.length - 1 || reordering}
                          className="p-0.5 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed"
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Order number */}
                      <span className="text-xs font-bold text-neutral-400 w-5 text-center shrink-0 select-none">
                        {index + 1}
                      </span>

                      {/* System badge */}
                      {level.isSystem ? (
                        <Lock
                          className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0"
                          aria-label="System level — key cannot be changed and this level cannot be deleted"
                        />
                      ) : (
                        <div className="w-3.5 shrink-0" />
                      )}

                      {/* Key */}
                      <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded truncate min-w-0 flex-1 sm:flex-none sm:w-52">
                        {level.key}
                      </span>

                      {/* Label */}
                      <span className="text-sm text-neutral-900 dark:text-white font-medium flex-1 min-w-0 truncate">
                        {level.label}
                      </span>

                      {/* Active toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        {toggling === level.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                        ) : (
                          <Switch
                            id={`active-${level.id}`}
                            checked={level.isActive}
                            onCheckedChange={() => handleToggleActive(level)}
                            aria-label={
                              level.isActive ? "Deactivate" : "Activate"
                            }
                          />
                        )}
                        <span
                          className={`text-xs hidden sm:inline ${
                            level.isActive
                              ? "text-green-600 dark:text-green-400"
                              : "text-neutral-400"
                          }`}
                        >
                          {level.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(level)}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {level.isSystem ? (
                          <div
                            className="p-2 text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                            title="System levels cannot be deleted"
                          >
                            <Trash2 className="h-4 w-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(level.id)}
                            disabled={deleting === level.id}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === level.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Delete Confirm Inline ── */}
                  {!isEditing && isConfirmingDelete && (
                    <div className="border-t border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>
                          Delete <strong>&quot;{level.label}&quot;</strong>?
                          This cannot be undone.
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmDeleteId(null)}
                          className="border-neutral-300 dark:border-neutral-600"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(level.id)}
                          disabled={deleting === level.id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting === level.id ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Edit row ── */}
                  {isEditing && (
                    <div className="px-4 py-4 space-y-4 bg-amber-50/60 dark:bg-amber-900/10 border-l-4 border-amber-400 dark:border-amber-600">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                          <Pencil className="h-3.5 w-3.5" />
                          Editing: {level.label}
                          {level.isSystem && (
                            <Badge className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 ml-1">
                              <Lock className="h-2.5 w-2.5 mr-1" />
                              System
                            </Badge>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {editError && (
                        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          {editError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Key — read-only for system levels */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Key{" "}
                            {level.isSystem && (
                              <span className="font-normal text-neutral-400">
                                (immutable for system levels)
                              </span>
                            )}
                          </Label>
                          <Input
                            value={
                              level.isSystem
                                ? level.key
                                : (editForm.key ?? level.key)
                            }
                            onChange={(e) =>
                              !level.isSystem &&
                              setEditForm({
                                ...editForm,
                                key: e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9_]/g, "_"),
                              })
                            }
                            readOnly={level.isSystem}
                            className={`h-10 font-mono text-sm ${
                              level.isSystem
                                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                                : ""
                            }`}
                            maxLength={100}
                          />
                        </div>

                        {/* Label */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Display Label{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={editForm.label ?? level.label}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                label: e.target.value,
                              })
                            }
                            className="h-10 text-sm"
                            maxLength={255}
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <Switch
                          id={`edit-isActive-${level.id}`}
                          checked={editForm.isActive ?? level.isActive}
                          onCheckedChange={(v) =>
                            setEditForm({ ...editForm, isActive: v })
                          }
                        />
                        <Label
                          htmlFor={`edit-isActive-${level.id}`}
                          className="text-sm cursor-pointer text-neutral-700 dark:text-neutral-300"
                        >
                          Active
                        </Label>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => handleSaveEdit(level)}
                          disabled={saving}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving…
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer note ── */}
        {!loading && levels.length > 0 && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
            Changes take effect immediately. Deactivated levels are hidden from
            new entries but existing records referencing them are preserved.
            Reordering affects the display order in all dropdowns and forms.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
