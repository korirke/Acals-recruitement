"use client";

import { Download, FileText, File, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/careers/ui/card";

interface JDDocumentCardProps {
  /** The stored URL of the uploaded JD document (PDF, Word, or image). */
  jdDocumentUrl?: string | null;
  /** Optional card heading — defaults to "Job Description Document". */
  title?: string;
}

/** Derive file type from URL extension. */
function getDocType(url: string): "pdf" | "word" | "image" | "other" {
  const clean = url.toLowerCase().split("?")[0];
  if (clean.endsWith(".pdf")) return "pdf";
  if (clean.endsWith(".doc") || clean.endsWith(".docx")) return "word";
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(clean)) return "image";
  return "other";
}

/** Best-effort filename from URL. */
function getFileName(url: string): string {
  try {
    const parts = url.split("/");
    const raw = parts[parts.length - 1].split("?")[0];
    return decodeURIComponent(raw) || "Job Description";
  } catch {
    return "Job Description";
  }
}

export function JDDocumentCard({
  jdDocumentUrl,
  title = "Downloadable version",
}: JDDocumentCardProps) {
  // Render nothing when there is no document
  if (!jdDocumentUrl) return null;

  const docType  = getDocType(jdDocumentUrl);
  const fileName = getFileName(jdDocumentUrl);

  const handleOpen = () => {
    window.open(jdDocumentUrl, "_blank", "noopener,noreferrer");
  };

  // ── Icon & accent colour by file type ──────────────────────────────────
  const iconMap = {
    pdf:   { icon: FileText,  colour: "text-red-500",     bg: "bg-red-50 dark:bg-red-900/20",   label: "PDF Document"  },
    word:  { icon: FileText,  colour: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20", label: "Word Document" },
    image: { icon: ImageIcon, colour: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", label: "Image"   },
    other: { icon: File,      colour: "text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800", label: "Document"  },
  };

  const { icon: DocIcon, colour, bg, label } = iconMap[docType];

  return (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <FileText className="h-4 w-4 text-primary-500 shrink-0" />
        <h3 className="font-semibold text-base">{title}</h3>
      </div>

      {/* Clickable square preview area */}
      <button
        type="button"
        onClick={handleOpen}
        className="group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`Open ${fileName}`}
      >
        {docType === "image" ? (
          /* ── Image preview ── */
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={jdDocumentUrl}
              alt={fileName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Download overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Download className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          /* ── Icon preview (PDF / Word / other) ── */
          <div
            className={[
              "aspect-square w-full flex flex-col items-center justify-center gap-3 p-6",
              bg,
              "transition-opacity group-hover:opacity-80",
            ].join(" ")}
          >
            <DocIcon className={`h-16 w-16 ${colour}`} />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {label}
            </span>
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <Download className="h-4 w-4 text-primary-500 shrink-0" />
          <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 truncate text-left">
            {fileName}
          </span>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 shrink-0 group-hover:underline whitespace-nowrap">
            Open / Download
          </span>
        </div>
      </button>
    </Card>
  );
}