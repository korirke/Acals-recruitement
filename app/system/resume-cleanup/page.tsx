"use client";

import { useState, useCallback } from "react";
import {
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Files,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Square,
  CheckSquare,
  MinusSquare,
} from "lucide-react";
import {
  resumeCleanupService,
  ResumePreviewResult,
  FilePreviewResult,
  ResumeCleanupResult,
  FileCleanupResult,
} from "@/services/recruitment-services";

// ── helpers

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
  return bytes + " B";
}

// ── types

type Phase =
  | "idle"
  | "previewing"
  | "preview_ready"
  | "deleting"
  | "done"
  | "error";

// ── sub-components

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-amber-900/30 rounded-lg px-4 py-3 text-center">
      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
        {value}
      </p>
      <p className="text-xs mt-0.5 text-amber-700 dark:text-amber-300 opacity-80">
        {label}
      </p>
    </div>
  );
}

// ── Checkbox UI

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
}

function Checkbox({ checked, indeterminate, onChange, label }: CheckboxProps) {
  const Icon = indeterminate ? MinusSquare : checked ? CheckSquare : Square;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="flex items-center gap-2 text-sm shrink-0"
      type="button"
    >
      <Icon
        className={`w-4 h-4 transition-colors ${
          checked || indeterminate
            ? "text-red-500 dark:text-red-400"
            : "text-neutral-400 dark:text-neutral-600"
        }`}
      />
      {label && (
        <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      )}
    </button>
  );
}

// ── Resume Preview Table with checkboxes

interface ResumePreviewTableProps {
  preview: ResumePreviewResult;
  selectedIds: Set<string>;
  onToggleFile: (id: string) => void;
  onToggleCandidate: (candidateId: string, ids: string[]) => void;
  onToggleAll: (allIds: string[]) => void;
}

function ResumePreviewTable({
  preview,
  selectedIds,
  onToggleFile,
  onToggleCandidate,
  onToggleAll,
}: ResumePreviewTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const allDeletableIds = preview.details.flatMap((d) =>
    d.toDelete.map((f) => f.id),
  );
  const allSelected =
    allDeletableIds.length > 0 &&
    allDeletableIds.every((id) => selectedIds.has(id));
  const someSelected = allDeletableIds.some((id) => selectedIds.has(id));

  return (
    <div className="space-y-2">
      {/* Select all row */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={() => onToggleAll(allDeletableIds)}
          label={allSelected ? "Deselect all" : "Select all"}
        />
        {someSelected && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {selectedIds.size} of {allDeletableIds.length} selected
          </span>
        )}
      </div>

      {/* Candidate rows */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {preview.details.map((d) => {
          const candidateIds = d.toDelete.map((f) => f.id);
          const allCandSelected = candidateIds.every((id) =>
            selectedIds.has(id),
          );
          const someCandSelected = candidateIds.some((id) =>
            selectedIds.has(id),
          );

          return (
            <div
              key={d.candidateId}
              className="border border-amber-200 dark:border-amber-700 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === d.candidateId ? null : d.candidateId)
                }
              >
                <Checkbox
                  checked={allCandSelected}
                  indeterminate={!allCandSelected && someCandSelected}
                  onChange={() =>
                    onToggleCandidate(d.candidateId, candidateIds)
                  }
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-neutral-900 dark:text-white text-sm">
                    {d.candidateName}
                  </span>
                  {d.email && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                      {d.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {d.toDelete.length} file{d.toDelete.length !== 1 ? "s" : ""}{" "}
                    · {formatBytes(d.bytesToFree)}
                  </span>
                  {expanded === d.candidateId ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </div>

              {expanded === d.candidateId && (
                <div className="px-4 py-3 space-y-3 bg-white dark:bg-neutral-900 text-sm">
                  {/* keeping */}
                  <div>
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
                      Keeping
                    </p>
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
                      <span className="text-neutral-700 dark:text-neutral-300 truncate">
                        {d.keeping.fileName}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-4 shrink-0">
                        {formatBytes(d.keeping.fileSize)}
                      </span>
                    </div>
                  </div>
                  {/* deleting */}
                  <div>
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">
                      Will Delete
                    </p>
                    <div className="space-y-1">
                      {d.toDelete.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => onToggleFile(f.id)}
                          className={`flex items-center gap-3 rounded px-3 py-2 cursor-pointer transition-colors ${
                            selectedIds.has(f.id)
                              ? "bg-red-50 dark:bg-red-900/20"
                              : "bg-neutral-50 dark:bg-neutral-800 opacity-50"
                          }`}
                        >
                          <Checkbox
                            checked={selectedIds.has(f.id)}
                            onChange={() => onToggleFile(f.id)}
                          />
                          <span className="text-neutral-700 dark:text-neutral-300 truncate flex-1">
                            {f.fileName}
                          </span>
                          <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                            {formatBytes(f.fileSize)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── File Preview Table with checkboxes

interface FilePreviewTableProps {
  preview: FilePreviewResult;
  selectedIds: Set<string>;
  onToggleFile: (id: string) => void;
  onToggleCandidate: (candidateId: string, ids: string[]) => void;
  onToggleAll: (allIds: string[]) => void;
}

function FilePreviewTable({
  preview,
  selectedIds,
  onToggleFile,
  onToggleCandidate,
  onToggleAll,
}: FilePreviewTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const allDeletableIds = preview.details.flatMap((d) =>
    d.toDelete.map((f) => f.id),
  );
  const allSelected =
    allDeletableIds.length > 0 &&
    allDeletableIds.every((id) => selectedIds.has(id));
  const someSelected = allDeletableIds.some((id) => selectedIds.has(id));

  return (
    <div className="space-y-2">
      {/* Select all row */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={() => onToggleAll(allDeletableIds)}
          label={allSelected ? "Deselect all" : "Select all"}
        />
        {someSelected && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {selectedIds.size} of {allDeletableIds.length} selected
          </span>
        )}
      </div>

      {/* Candidate rows */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {preview.details.map((d) => {
          const candidateIds = d.toDelete.map((f) => f.id);
          const allCandSelected = candidateIds.every((id) =>
            selectedIds.has(id),
          );
          const someCandSelected = candidateIds.some((id) =>
            selectedIds.has(id),
          );

          return (
            <div
              key={d.candidateId}
              className="border border-amber-200 dark:border-amber-700 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === d.candidateId ? null : d.candidateId)
                }
              >
                <Checkbox
                  checked={allCandSelected}
                  indeterminate={!allCandSelected && someCandSelected}
                  onChange={() =>
                    onToggleCandidate(d.candidateId, candidateIds)
                  }
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-neutral-900 dark:text-white text-sm">
                    {d.candidateName}
                  </span>
                  {d.email && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                      {d.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {d.toDelete.length} file{d.toDelete.length !== 1 ? "s" : ""}{" "}
                    · {formatBytes(d.bytesToFree)}
                  </span>
                  {expanded === d.candidateId ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </div>

              {expanded === d.candidateId && (
                <div className="px-4 py-3 bg-white dark:bg-neutral-900 text-sm">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">
                    Will Delete
                  </p>
                  <div className="space-y-1">
                    {d.toDelete.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => onToggleFile(f.id)}
                        className={`flex items-center gap-3 rounded px-3 py-2 cursor-pointer transition-colors ${
                          selectedIds.has(f.id)
                            ? "bg-red-50 dark:bg-red-900/20"
                            : "bg-neutral-50 dark:bg-neutral-800 opacity-50"
                        }`}
                      >
                        <Checkbox
                          checked={selectedIds.has(f.id)}
                          onChange={() => onToggleFile(f.id)}
                        />
                        <div className="flex-1 min-w-0 truncate">
                          <span className="text-neutral-700 dark:text-neutral-300">
                            {f.fileName}
                          </span>
                          <span className="ml-2 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5">
                            {f.category}
                          </span>
                        </div>
                        <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                          {formatBytes(f.fileSize)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResumeCleanupPage() {
  // ── Resume state ──
  const [resumePhase, setResumePhase] = useState<Phase>("idle");
  const [resumePreview, setResumePreview] =
    useState<ResumePreviewResult | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeCleanupResult | null>(
    null,
  );
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeSelected, setResumeSelected] = useState<Set<string>>(new Set());

  // ── File state ──
  const [filePhase, setFilePhase] = useState<Phase>("idle");
  const [filePreview, setFilePreview] = useState<FilePreviewResult | null>(
    null,
  );
  const [fileResult, setFileResult] = useState<FileCleanupResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<Set<string>>(new Set());

  // ── Resume checkbox handlers ──
  const resumeToggleFile = useCallback((id: string) => {
    setResumeSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const resumeToggleCandidate = useCallback(
    (candidateId: string, ids: string[]) => {
      setResumeSelected((prev) => {
        const next = new Set(prev);
        const allChosen = ids.every((id) => next.has(id));
        ids.forEach((id) => (allChosen ? next.delete(id) : next.add(id)));
        return next;
      });
    },
    [],
  );

  const resumeToggleAll = useCallback((allIds: string[]) => {
    setResumeSelected((prev) => {
      const allChosen = allIds.every((id) => prev.has(id));
      return allChosen ? new Set() : new Set(allIds);
    });
  }, []);

  // ── File checkbox handlers ──
  const fileToggleFile = useCallback((id: string) => {
    setFileSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const fileToggleCandidate = useCallback(
    (candidateId: string, ids: string[]) => {
      setFileSelected((prev) => {
        const next = new Set(prev);
        const allChosen = ids.every((id) => next.has(id));
        ids.forEach((id) => (allChosen ? next.delete(id) : next.add(id)));
        return next;
      });
    },
    [],
  );

  const fileToggleAll = useCallback((allIds: string[]) => {
    setFileSelected((prev) => {
      const allChosen = allIds.every((id) => prev.has(id));
      return allChosen ? new Set() : new Set(allIds);
    });
  }, []);

  // ── Resume handlers ──
  const handleResumePreview = async () => {
    setResumePhase("previewing");
    setResumeError(null);
    setResumePreview(null);
    setResumeResult(null);
    setResumeSelected(new Set());

    const data = await resumeCleanupService.previewResumeCleanup();
    if (!data) {
      setResumeError("Failed to generate preview. Please try again.");
      setResumePhase("error");
      return;
    }
    // Auto-select all by default
    const allIds = data.details.flatMap((d) => d.toDelete.map((f) => f.id));
    setResumeSelected(new Set(allIds));
    setResumePreview(data);
    setResumePhase("preview_ready");
  };

  const handleResumeDelete = async () => {
    if (resumeSelected.size === 0) return;
    setResumePhase("deleting");
    const data = await resumeCleanupService.cleanupOldResumes(
      Array.from(resumeSelected),
    );
    if (!data) {
      setResumeError("Cleanup failed. Please try again.");
      setResumePhase("error");
      return;
    }
    setResumeResult(data);
    setResumePhase("done");
  };

  // ── File handlers ──
  const handleFilePreview = async () => {
    setFilePhase("previewing");
    setFileError(null);
    setFilePreview(null);
    setFileResult(null);
    setFileSelected(new Set());

    const data = await resumeCleanupService.previewDuplicateFiles();
    if (!data) {
      setFileError("Failed to generate preview. Please try again.");
      setFilePhase("error");
      return;
    }
    // Auto-select all by default
    const allIds = data.details.flatMap((d) => d.toDelete.map((f) => f.id));
    setFileSelected(new Set(allIds));
    setFilePreview(data);
    setFilePhase("preview_ready");
  };

  const handleFileDelete = async () => {
    if (fileSelected.size === 0) return;
    setFilePhase("deleting");
    const data = await resumeCleanupService.cleanupDuplicateFiles(
      Array.from(fileSelected),
    );
    if (!data) {
      setFileError("Cleanup failed. Please try again.");
      setFilePhase("error");
      return;
    }
    setFileResult(data);
    setFilePhase("done");
  };

  // ── Compute selected size for display ──
  const resumeSelectedBytes = resumePreview
    ? resumePreview.details
        .flatMap((d) => d.toDelete)
        .filter((f) => resumeSelected.has(f.id))
        .reduce((acc, f) => acc + f.fileSize, 0)
    : 0;

  const fileSelectedBytes = filePreview
    ? filePreview.details
        .flatMap((d) => d.toDelete)
        .filter((f) => fileSelected.has(f.id))
        .reduce((acc, f) => acc + f.fileSize, 0)
    : 0;

  // ── render

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Storage Cleanup
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Preview duplicates, select exactly what to delete, then confirm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RESUME CLEANUP CARD*/}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Cleanup Old Resumes
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Keep latest · delete the rest
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              {[
                "Finds candidates with multiple resume versions",
                "Keeps the latest, deletes the rest from disk & DB",
                "Resets all kept resumes to version 1",
                "Syncs candidate profile resumeUrl with kept file",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>

            {/* idle / error */}
            {(resumePhase === "idle" || resumePhase === "error") && (
              <button
                onClick={handleResumePreview}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview What Will Be Deleted
              </button>
            )}

            {/* previewing */}
            {resumePhase === "previewing" && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-400 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning files…
              </button>
            )}

            {/* preview ready */}
            {resumePhase === "preview_ready" && resumePreview && (
              <div className="space-y-4">
                {resumePreview.candidatesAffected === 0 ? (
                  <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      Everything is clean — no duplicate resumes found.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Select files to delete — uncheck anything you want to
                        keep
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <StatPill
                          label="Candidates"
                          value={resumePreview.candidatesAffected}
                        />
                        <StatPill
                          label="Selected"
                          value={resumeSelected.size}
                        />
                        <StatPill
                          label="Space freed"
                          value={formatBytes(resumeSelectedBytes)}
                        />
                      </div>
                      <ResumePreviewTable
                        preview={resumePreview}
                        selectedIds={resumeSelected}
                        onToggleFile={resumeToggleFile}
                        onToggleCandidate={resumeToggleCandidate}
                        onToggleAll={resumeToggleAll}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setResumePhase("idle");
                          setResumePreview(null);
                          setResumeSelected(new Set());
                        }}
                        className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleResumeDelete}
                        disabled={resumeSelected.size === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete {resumeSelected.size} file
                        {resumeSelected.size !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* deleting */}
            {resumePhase === "deleting" && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-400 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </button>
            )}

            {/* done */}
            {resumePhase === "done" && (
              <button
                onClick={() => {
                  setResumePhase("idle");
                  setResumePreview(null);
                  setResumeResult(null);
                  setResumeSelected(new Set());
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-sm"
              >
                Run Again
              </button>
            )}
          </div>

          {/* Result */}
          {resumePhase === "done" && resumeResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Resume Cleanup Complete
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {resumeResult.candidatesProcessed}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Candidates Processed
                  </p>
                </div>
                <div className="bg-white dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {resumeResult.resumesDeleted}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Resumes Deleted
                  </p>
                </div>
              </div>
            </div>
          )}

          {resumeError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {resumeError}
              </p>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════
            DUPLICATE FILES CLEANUP CARD
        ══════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Files className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Cleanup Duplicate Files
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Same filename + category = duplicate
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              {[
                "Groups files by candidate, category and filename",
                "Only exact same filename in same category = duplicate",
                "Different filenames in same category are kept",
                "Removes physical files and DB records",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>

            {/* idle / error */}
            {(filePhase === "idle" || filePhase === "error") && (
              <button
                onClick={handleFilePreview}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview What Will Be Deleted
              </button>
            )}

            {/* previewing */}
            {filePhase === "previewing" && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-400 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning files…
              </button>
            )}

            {/* preview ready */}
            {filePhase === "preview_ready" && filePreview && (
              <div className="space-y-4">
                {filePreview.candidatesAffected === 0 ? (
                  <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      Everything is clean — no duplicate files found.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Select files to delete — uncheck anything you want to
                        keep
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <StatPill
                          label="Candidates"
                          value={filePreview.candidatesAffected}
                        />
                        <StatPill label="Selected" value={fileSelected.size} />
                        <StatPill
                          label="Space freed"
                          value={formatBytes(fileSelectedBytes)}
                        />
                      </div>
                      <FilePreviewTable
                        preview={filePreview}
                        selectedIds={fileSelected}
                        onToggleFile={fileToggleFile}
                        onToggleCandidate={fileToggleCandidate}
                        onToggleAll={fileToggleAll}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setFilePhase("idle");
                          setFilePreview(null);
                          setFileSelected(new Set());
                        }}
                        className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFileDelete}
                        disabled={fileSelected.size === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete {fileSelected.size} file
                        {fileSelected.size !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* deleting */}
            {filePhase === "deleting" && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-400 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </button>
            )}

            {/* done */}
            {filePhase === "done" && (
              <button
                onClick={() => {
                  setFilePhase("idle");
                  setFilePreview(null);
                  setFileResult(null);
                  setFileSelected(new Set());
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-sm"
              >
                Run Again
              </button>
            )}
          </div>

          {/* Result */}
          {filePhase === "done" && fileResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                  File Cleanup Complete
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {fileResult.candidatesProcessed}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Candidates Processed
                  </p>
                </div>
                <div className="bg-white dark:bg-green-900/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {fileResult.filesDeleted}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Duplicate Files Deleted
                  </p>
                </div>
              </div>
            </div>
          )}

          {fileError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {fileError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
