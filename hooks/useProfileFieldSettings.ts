"use client";

import { useProfileFieldSettingsContext } from "@/context/ProfileFieldSettingsContext";

export function useProfileFieldSettings() {
  return useProfileFieldSettingsContext();
}
