"use client";

import { useEffect, useRef, useState } from "react";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

export function useJobAutosave(opts: {
  enabled: boolean;
  intervalMs?: number;
  isDirty: boolean;
  onAutosave: () => Promise<void>;
}) {
  const { enabled, intervalMs = 8000, isDirty, onAutosave } = opts;

  const [state, setState] = useState<AutosaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lock = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(async () => {
      if (!isDirty) return;
      if (lock.current) return;

      lock.current = true;
      setState("saving");
      try {
        await onAutosave();
        setLastSavedAt(new Date());
        setState("saved");
        window.setTimeout(() => setState("idle"), 2500);
      } catch {
        setState("error");
        window.setTimeout(() => setState("idle"), 4000);
      } finally {
        lock.current = false;
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, intervalMs, isDirty, onAutosave]);

  return { state, lastSavedAt };
}
