"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { ProfileFieldSetting } from "@/types";
import { profileFieldSettingsService } from "@/services/recruitment-services";
import { useToast } from "@/components/careers/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Switch } from "@/components/careers/ui/switch";
import { Label } from "@/components/careers/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import { Badge } from "@/components/careers/ui/badge";
import { Loader2, Save, AlertCircle, Users2, Eye, EyeOff } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  basic: "Basic",
  social: "Social",
  skills: "Skills",
  education: "Education",
  experience: "Experience",
  resume: "Resume",
  compliance: "Compliance",
};

export default function CandidateProfileSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<ProfileFieldSetting[]>([]);
  const [dirty, setDirty] = useState<
    Record<string, Partial<ProfileFieldSetting>>
  >({});

  useEffect(() => {
    if (!user) return;
    if (user.role !== "SUPER_ADMIN") {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    void load();
  }, [user, router]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await profileFieldSettingsService.getAll();
      if (!res.success)
        throw new Error(res.message || "Failed to load settings");
      setSettings(res.data?.settings || []);
      setDirty({});
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const g: Record<string, ProfileFieldSetting[]> = {};
    for (const s of settings) {
      const c = s.category || "other";
      if (!g[c]) g[c] = [];
      g[c].push(s);
    }
    // keep deterministic order by displayOrder
    for (const k of Object.keys(g)) {
      g[k] = g[k]
        .slice()
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    }
    return g;
  }, [settings]);

  const categories = useMemo(() => {
    const keys = Object.keys(grouped);
    const order = [
      "basic",
      "social",
      "skills",
      "education",
      "experience",
      "resume",
      "compliance",
    ];
    return keys.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [grouped]);

  const markDirty = (id: string, patch: Partial<ProfileFieldSetting>) => {
    setDirty((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  };

  const updateLocal = (id: string, patch: Partial<ProfileFieldSetting>) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  };

  const toggleVisible = (s: ProfileFieldSetting, val: boolean) => {
    updateLocal(s.id, {
      isVisible: val,
      isRequired: val ? s.isRequired : false,
    });
    markDirty(s.id, { isVisible: val, isRequired: val ? s.isRequired : false });
  };

  const toggleRequired = (s: ProfileFieldSetting, val: boolean) => {
    // cannot set required if hidden
    if (!s.isVisible) return;
    updateLocal(s.id, { isRequired: val });
    markDirty(s.id, { isRequired: val });
  };

  const save = async () => {
    const updates = Object.entries(dirty).map(([id, patch]) => ({
      id,
      ...patch,
    }));
    if (updates.length === 0) {
      toast({ title: "No changes", description: "Nothing to save" });
      return;
    }

    try {
      setSaving(true);
      const res = await profileFieldSettingsService.bulkUpdate(updates);
      if (!res.success) throw new Error(res.message || "Failed to save");
      toast({
        title: "Saved",
        description: `Updated ${res.data?.updatedCount || updates.length} setting(s)`,
      });
      await load();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== "SUPER_ADMIN") return null;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <Users2 className="h-7 w-7 text-primary-500" />
            Candidate Profile Configuration
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Super Admin controls: hide/show sections & fields; mark visible
            fields as required.
          </p>
        </div>

        <Button
          onClick={save}
          disabled={saving || Object.keys(dirty).length === 0}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save ({Object.keys(dirty).length})
            </>
          )}
        </Button>
      </div>

      {Object.keys(dirty).length > 0 && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <p className="text-sm text-orange-900 dark:text-orange-200">
            You have unsaved changes. Click Save to apply them.
          </p>
        </div>
      )}

      <Tabs defaultValue={categories[0] || "basic"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          {categories.map((c) => (
            <TabsTrigger
              key={c}
              value={c}
              className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
            >
              {CATEGORY_LABELS[c] || c}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((c) => (
          <TabsContent key={c} value={c} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{CATEGORY_LABELS[c] || c}</CardTitle>
                <CardDescription>
                  Configure visibility & required flags
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {(grouped[c] || []).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {s.label}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {s.fieldName}
                        </Badge>
                        {dirty[s.id] && (
                          <Badge className="text-xs bg-orange-500 text-white border-0">
                            Modified
                          </Badge>
                        )}
                      </div>
                      {s.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Visible */}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!s.isVisible}
                          onCheckedChange={(v) => toggleVisible(s, !!v)}
                        />
                        <Label className="text-sm flex items-center gap-1">
                          {s.isVisible ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-neutral-400" />
                              Hidden
                            </>
                          )}
                        </Label>
                      </div>

                      {/* Required */}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!s.isRequired}
                          onCheckedChange={(v) => toggleRequired(s, !!v)}
                          disabled={!s.isVisible}
                        />
                        <Label
                          className={`text-sm ${!s.isVisible ? "opacity-50" : ""}`}
                        >
                          Required
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
