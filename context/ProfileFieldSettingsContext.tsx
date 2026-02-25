"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProfileFieldSetting } from "@/types";
import { profileFieldSettingsService } from "@/services/recruitment-services";

type Ctx = {
  loading: boolean;
  error: string | null;
  settings: ProfileFieldSetting[];
  map: Record<string, ProfileFieldSetting>;
  isVisible: (fieldName: string) => boolean;
  isRequired: (fieldName: string) => boolean;
  refetch: () => Promise<void>;
};

const ProfileFieldSettingsContext = createContext<Ctx | null>(null);

export function ProfileFieldSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ProfileFieldSetting[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await profileFieldSettingsService.getAll();
      if (!res.success)
        throw new Error(res.message || "Failed to load settings");
      setSettings(res.data?.settings || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load settings");
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const map = useMemo(() => {
    const m: Record<string, ProfileFieldSetting> = {};
    for (const s of settings) m[s.fieldName] = s;
    return m;
  }, [settings]);

  const isVisible = useCallback(
    (fieldName: string) => {
      // default visible if not configured (safe fallback)
      return map[fieldName]?.isVisible ?? true;
    },
    [map],
  );

  const isRequired = useCallback(
    (fieldName: string) => {
      return map[fieldName]?.isRequired ?? false;
    },
    [map],
  );

  const value: Ctx = useMemo(
    () => ({
      loading,
      error,
      settings,
      map,
      isVisible,
      isRequired,
      refetch: fetchAll,
    }),
    [loading, error, settings, map, isVisible, isRequired, fetchAll],
  );

  return (
    <ProfileFieldSettingsContext.Provider value={value}>
      {children}
    </ProfileFieldSettingsContext.Provider>
  );
}

export function useProfileFieldSettingsContext() {
  const ctx = useContext(ProfileFieldSettingsContext);
  if (!ctx)
    throw new Error(
      "useProfileFieldSettingsContext must be used within ProfileFieldSettingsProvider",
    );
  return ctx;
}
