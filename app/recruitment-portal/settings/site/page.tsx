"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { recruitmentAdminService } from "@/services/recruitment-services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import { Switch } from "@/components/careers/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { useToast } from "@/components/careers/ui/use-toast";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import Link from "next/link";

export default function SiteSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    logoUrl: "",
    faviconUrl: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    defaultCurrency: "USD",
    timezone: "UTC",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    jobApprovalRequired: true,
  });

  useEffect(() => {
    if (!user || user.role !== "SUPER_ADMIN") {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await recruitmentAdminService.getSettings();
      if (response.success && response.data) {
        setFormData({
          siteName: response.data.siteName || "",
          logoUrl: response.data.logoUrl || "",
          faviconUrl: response.data.faviconUrl || "",
          description: response.data.description || "",
          contactEmail: response.data.contactEmail || "",
          contactPhone: response.data.contactPhone || "",
          address: response.data.address || "",
          defaultCurrency: response.data.defaultCurrency || "USD",
          timezone: response.data.timezone || "UTC",
          maintenanceMode: response.data.maintenanceMode || false,
          allowRegistration: response.data.allowRegistration !== false,
          requireEmailVerification:
            response.data.requireEmailVerification !== false,
          jobApprovalRequired: response.data.jobApprovalRequired !== false,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await recruitmentAdminService.updateSettings(formData);
      toast({
        title: "Settings Saved",
        description: "Site configuration has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/recruitment-portal/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Site Configuration
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your site's basic information and settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your site's core details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name *</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  placeholder="CareerHub"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="A brief description of your job portal..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How users can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="contact@careerhub.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Business St, City, State ZIP"
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure currency and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={formData.defaultCurrency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, defaultCurrency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">London Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">
                    Allow User Registration
                  </Label>
                  <p className="text-sm text-neutral-500">
                    Enable new users to create accounts
                  </p>
                </div>
                <Switch
                  checked={formData.allowRegistration}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, allowRegistration: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">
                    Require Email Verification
                  </Label>
                  <p className="text-sm text-neutral-500">
                    Users must verify email before applying
                  </p>
                </div>
                <Switch
                  checked={formData.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      requireEmailVerification: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">
                    Job Approval Required
                  </Label>
                  <p className="text-sm text-neutral-500">
                    Jobs must be approved before going live
                  </p>
                </div>
                <Switch
                  checked={formData.jobApprovalRequired}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, jobApprovalRequired: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <Label className="text-base font-semibold text-red-900 dark:text-red-200">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Disable public access to the site
                  </p>
                </div>
                <Switch
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, maintenanceMode: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-24">
            <CardHeader>
              <CardTitle>Site Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Logo URL</Label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <Input
                  value={formData.faviconUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, faviconUrl: e.target.value })
                  }
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
