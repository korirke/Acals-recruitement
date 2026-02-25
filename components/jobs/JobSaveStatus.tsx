"use client";

import { Badge } from "@/components/careers/ui/badge";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { AutosaveState } from "@/hooks/useJobAutosave";

export function JobSaveStatus(props: {
  isDirty: boolean;
  autosaveState?: AutosaveState;
  lastSavedAt?: Date | null;
}) {
  const time = props.lastSavedAt
    ? props.lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex items-center gap-2">
      {props.isDirty && props.autosaveState !== "saving" && (
        <Badge className="bg-yellow-600 text-white">Unsaved changes</Badge>
      )}

      {props.autosaveState === "saving" && (
        <Badge className="bg-slate-700 text-white flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving…
        </Badge>
      )}

      {props.autosaveState === "saved" && (
        <Badge className="bg-green-600 text-white flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Saved {time ? `· ${time}` : ""}
        </Badge>
      )}

      {props.autosaveState === "error" && (
        <Badge className="bg-red-600 text-white flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5" />
          Autosave failed
        </Badge>
      )}
    </div>
  );
}