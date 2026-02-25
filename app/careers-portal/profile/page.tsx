"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCandidate } from "@/hooks/useCandidate";
import { checkCandidateProfileCompletion } from "@/lib/profileCompletion";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import { useToast } from "@/components/careers/ui/use-toast";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  MapPin,
  Phone,
  Banknote,
  Calendar,
  Globe,
  Linkedin,
  Github,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import SkillsSection from "@/components/careers/profile/SkillsSection";
import DomainsSection from "@/components/careers/profile/DomainsSection";
import EducationSection from "@/components/careers/profile/EducationSection";
import ExperienceSection from "@/components/careers/profile/ExperienceSection";
import ResumeSection from "@/components/careers/profile/ResumeSection";
import PersonalInfoSection from "@/components/careers/profile/PersonalInfoSection";
import DocumentsSection from "@/components/careers/profile/DocumentsSection";
import PublicationsSection from "@/components/careers/profile/PublicationsSection";
import MembershipsSection from "@/components/careers/profile/MembershipsSection";
import ClearancesSection from "@/components/careers/profile/ClearancesSection";
import CoursesSection from "@/components/careers/profile/CoursesSection";
import RefereesSection from "@/components/careers/profile/RefereesSection";

import { ProfileFieldSettingsProvider } from "@/context/ProfileFieldSettingsContext";
import { useProfileFieldSettings } from "@/hooks/useProfileFieldSettings";

const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

function ProfileInner() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const {
    profile,
    loading: profileLoading,
    fetchProfile,
    updateProfile,
  } = useCandidate();
  const {
    loading: settingsLoading,
    error: settingsError,
    isVisible,
    isRequired,
    settings,
  } = useProfileFieldSettings();

  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    location: "",
    phone: "",
    currentCompany: "",
    experienceYears: "",
    expectedSalary: undefined as number | undefined,
    currency: "KSH",
    openToWork: true,
    availableFrom: "",
    websiteUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  // Decide what to include in candidate profile fetch
  const includeSections = useMemo(() => {
    const include: string[] = [];

    // Always base profile + user is included

    if (isVisible("skills.section")) include.push("skills");
    if (isVisible("domains.section")) include.push("domains");

    if (isVisible("education.section")) include.push("educations");
    if (isVisible("experience.section")) include.push("experiences");

    // Resume tab: include resume versions only if visible
    if (isVisible("resume.section")) include.push("resumes");

    // Compliance sections:
    const complianceVisible =
      isVisible("personalInfo.section") ||
      isVisible("documents.section") ||
      isVisible("publications.section") ||
      isVisible("memberships.section") ||
      isVisible("clearances.section") ||
      isVisible("courses.section") ||
      isVisible("referees.section");

    if (complianceVisible) {
      if (isVisible("personalInfo.section")) include.push("personalInfo");
      if (isVisible("documents.section")) include.push("files");
      if (isVisible("publications.section")) include.push("publications");
      if (isVisible("memberships.section")) include.push("memberships");
      if (isVisible("clearances.section")) include.push("clearances");
      if (isVisible("courses.section")) include.push("courses");
      if (isVisible("referees.section")) include.push("referees");
    }

    // De-dupe
    return Array.from(new Set(include));
  }, [isVisible]);

  // Profile completion uses settings now
  const profileStatus = useMemo(() => {
    return checkCandidateProfileCompletion(profile, settings);
  }, [profile, settings]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/careers-portal/profile");
      return;
    }

    if (user?.role !== "CANDIDATE") {
      router.push("/careers-portal");
      return;
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Fetch profile AFTER settings are ready
  useEffect(() => {
    if (authLoading || !isAuthenticated || user?.role !== "CANDIDATE") return;
    if (settingsLoading) return;

    if (settingsError) {
      // fallback: still fetch full profile if settings fail
      fetchProfile();
      return;
    }

    fetchProfile({ include: includeSections });
  }, [
    authLoading,
    isAuthenticated,
    user?.role,
    settingsLoading,
    settingsError,
    includeSections,
    fetchProfile,
  ]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.user?.phone || "",
        currentCompany: profile.currentCompany || "",
        experienceYears: profile.experienceYears || "",
        expectedSalary: profile.expectedSalary || undefined,
        currency: profile.currency || "KSH",
        openToWork: profile.openToWork ?? true,
        availableFrom: formatDateForInput(profile.availableFrom),
        websiteUrl: profile.websiteUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
      });
    }
  }, [profile]);

  const requiredBasicFields = useMemo(() => {
    // Only validate required+visible fields
    const candidates = ["title", "bio", "location", "phone"] as const;
    return candidates.filter((f) => isVisible(f) && isRequired(f));
  }, [isVisible, isRequired]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    requiredBasicFields.forEach((field) => {
      const value = (formData as any)[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        errors[field] = "This field is required";
      }
    });

    // phone validation only if visible and has value
    if (
      isVisible("phone") &&
      formData.phone &&
      !formData.phone.match(/^\+?[1-9]\d{1,14}$/)
    ) {
      errors.phone =
        "Please provide a valid phone number with country code (e.g., +254712345678)";
    }

    // bio min len only if visible and required (or if visible and filled)
    if (isVisible("bio") && formData.bio) {
      if (formData.bio.trim().length < 50) {
        errors.bio = "Bio must be at least 50 characters long";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Only send fields that are VISIBLE (prevents candidates editing hidden fields)
      const updateData: any = {};

      const maybeSet = (
        fieldName: keyof typeof formData,
        payloadKey?: string,
      ) => {
        if (!isVisible(fieldName as string)) return;
        updateData[payloadKey || fieldName] = formData[fieldName];
      };

      maybeSet("title");
      maybeSet("bio");
      maybeSet("location");
      maybeSet("phone");
      maybeSet("currentCompany");
      maybeSet("currency");
      maybeSet("openToWork");
      maybeSet("availableFrom");
      maybeSet("websiteUrl");
      maybeSet("linkedinUrl");
      maybeSet("githubUrl");
      maybeSet("portfolioUrl");

      if (
        isVisible("expectedSalary") &&
        formData.expectedSalary &&
        formData.expectedSalary > 0
      ) {
        updateData.expectedSalary = formData.expectedSalary;
      }

      await updateProfile(updateData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });

      setValidationErrors({});
      // refresh using same include config
      if (!settingsError) {
        await fetchProfile({ include: includeSections });
      } else {
        await fetchProfile();
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Update Failed",
        description:
          error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const showSocialSection = useMemo(() => {
    if (!isVisible("social.section")) return false;
    return (
      isVisible("websiteUrl") ||
      isVisible("linkedinUrl") ||
      isVisible("githubUrl") ||
      isVisible("portfolioUrl")
    );
  }, [isVisible]);

  const showSkillsTab = isVisible("skills.section");
  const showDomains = isVisible("domains.section");

  const showEducationTab = isVisible("education.section");
  const showExperienceTab = isVisible("experience.section");
  const showResumeTab = isVisible("resume.section");

  const showComplianceTab = useMemo(() => {
    if (!isVisible("compliance.tab")) return false;
    return (
      isVisible("personalInfo.section") ||
      isVisible("documents.section") ||
      isVisible("publications.section") ||
      isVisible("memberships.section") ||
      isVisible("clearances.section") ||
      isVisible("courses.section") ||
      isVisible("referees.section")
    );
  }, [isVisible]);

  const tabItems = useMemo(() => {
    const tabs: Array<{ key: string; label: string; icon: any }> = [
      { key: "basic", label: "Basic Info", icon: User },
    ];
    if (showSkillsTab)
      tabs.push({ key: "skills", label: "Skills", icon: Award });
    if (showExperienceTab)
      tabs.push({ key: "experience", label: "Experience", icon: Briefcase });
    if (showEducationTab)
      tabs.push({ key: "education", label: "Education", icon: GraduationCap });
    if (showResumeTab)
      tabs.push({ key: "resume", label: "Resume", icon: FileText });
    if (showComplianceTab)
      tabs.push({ key: "compliance", label: "Compliance", icon: FileText });
    return tabs;
  }, [
    showSkillsTab,
    showExperienceTab,
    showEducationTab,
    showResumeTab,
    showComplianceTab,
  ]);

  // Loading screen: wait for auth + settings + initial profile
  if (authLoading || settingsLoading || (profileLoading && !profile)) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "CANDIDATE") return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 bg-neutral-50 dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your professional profile and job preferences
            </p>

            {/* Dynamic Profile Completion Progress - Compact */}
            <Card className="mt-4 bg-linear-to-r from-primary-500 to-orange-500 text-white border-none shadow-lg">
              <CardContent className="py-4 px-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {profileStatus.isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="font-semibold text-sm">
                      {profileStatus.completionPercentage}% Complete
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${profileStatus.completionPercentage}%` }}
                  />
                </div>

                {!profileStatus.isComplete &&
                profileStatus.missingFields.length > 0 ? (
                  <p className="text-xs text-white/90">
                    Missing: {profileStatus.missingFields.join(", ")}
                  </p>
                ) : (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <p className="text-xs text-white/90">
                      Profile complete and ready for employers!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList
              className={`grid w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700`}
              style={{
                gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))`,
              }}
            >
              {tabItems.map((t) => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
                >
                  <t.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* BASIC TAB */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="text-neutral-900 dark:text-white">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-neutral-600 dark:text-neutral-400">
                    Your basic profile information visible to employers
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-700 dark:text-neutral-300">
                        First Name
                      </Label>
                      <Input
                        value={profile?.user?.firstName || ""}
                        disabled
                        className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-700 dark:text-neutral-300">
                        Last Name
                      </Label>
                      <Input
                        value={profile?.user?.lastName || ""}
                        disabled
                        className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {isVisible("title") && (
                    <div className="space-y-2">
                      <Label className="text-neutral-700 dark:text-neutral-300">
                        Professional Title{" "}
                        {isRequired("title") && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="e.g., Senior Frontend Developer"
                        className={`border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 ${
                          validationErrors.title ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.title && (
                        <p className="text-sm text-red-500">
                          {validationErrors.title}
                        </p>
                      )}
                    </div>
                  )}

                  {isVisible("bio") && (
                    <div className="space-y-2">
                      <Label className="text-neutral-700 dark:text-neutral-300">
                        Bio{" "}
                        {isRequired("bio") && (
                          <span className="text-red-500">*</span>
                        )}
                        <span className="text-xs text-neutral-500 ml-2">
                          (minimum 50 characters)
                        </span>
                      </Label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself..."
                        className={`min-h-[120px] border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 ${
                          validationErrors.bio ? "border-red-500" : ""
                        }`}
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          {validationErrors.bio && (
                            <p className="text-sm text-red-500">
                              {validationErrors.bio}
                            </p>
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            formData.bio.length >= 50
                              ? "text-green-600"
                              : "text-neutral-500"
                          }`}
                        >
                          {formData.bio.length} / 50 characters
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {isVisible("location") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <MapPin className="h-4 w-4 inline mr-2" />
                          Location{" "}
                          {isRequired("location") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          placeholder="e.g., Nairobi, Kenya"
                          className={`border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 ${
                            validationErrors.location ? "border-red-500" : ""
                          }`}
                        />
                        {validationErrors.location && (
                          <p className="text-sm text-red-500">
                            {validationErrors.location}
                          </p>
                        )}
                      </div>
                    )}

                    {isVisible("phone") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Phone className="h-4 w-4 inline mr-2" />
                          Phone Number{" "}
                          {isRequired("phone") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+254712345678"
                          className={`border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 ${
                            validationErrors.phone ? "border-red-500" : ""
                          }`}
                        />
                        {validationErrors.phone && (
                          <p className="text-sm text-red-500">
                            {validationErrors.phone}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500">
                          Include country code (e.g., +254 for Kenya)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {isVisible("currentCompany") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Briefcase className="h-4 w-4 inline mr-2" />
                          Current Company
                        </Label>
                        <Input
                          value={formData.currentCompany}
                          onChange={(e) =>
                            handleInputChange("currentCompany", e.target.value)
                          }
                          placeholder="e.g., TechCorp Inc."
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}

                    {isVisible("experienceYearsDisplay") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          Years of Experience (Auto-calculated)
                        </Label>
                        <Input
                          value={profile?.experienceYears || "0 years"}
                          disabled
                          className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-500">
                          Calculated automatically from your experience records
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {isVisible("availableFrom") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Available From
                        </Label>
                        <Input
                          type="date"
                          value={formData.availableFrom}
                          onChange={(e) =>
                            handleInputChange("availableFrom", e.target.value)
                          }
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    )}

                    {isVisible("currency") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          Currency
                        </Label>
                        <Input
                          value={formData.currency}
                          onChange={(e) =>
                            handleInputChange("currency", e.target.value)
                          }
                          placeholder="KSH"
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}
                  </div>

                  {isVisible("expectedSalary") && (
                    <div className="space-y-2">
                      <Label className="text-neutral-700 dark:text-neutral-300">
                        <Banknote className="h-4 w-4 inline mr-2" />
                        Expected Salary (Optional)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.expectedSalary || ""}
                        onChange={(e) => {
                          const v =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          handleInputChange("expectedSalary", v);
                        }}
                        className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                      />
                    </div>
                  )}

                  {isVisible("openToWork") && (
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div>
                        <Label className="text-base font-semibold text-neutral-900 dark:text-white">
                          Open to Work
                        </Label>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Let employers know you're open to opportunities
                        </p>
                      </div>
                      <Switch
                        checked={formData.openToWork}
                        onCheckedChange={(checked) =>
                          handleInputChange("openToWork", checked)
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SOCIAL LINKS */}
              {showSocialSection && (
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="text-neutral-900 dark:text-white">
                      Social Links
                    </CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      Connect your professional profiles
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {isVisible("websiteUrl") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Globe className="h-4 w-4 inline mr-2" />
                          Website{" "}
                          {isRequired("websiteUrl") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          value={formData.websiteUrl}
                          onChange={(e) =>
                            handleInputChange("websiteUrl", e.target.value)
                          }
                          placeholder="https://yourwebsite.com"
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}

                    {isVisible("linkedinUrl") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Linkedin className="h-4 w-4 inline mr-2" />
                          LinkedIn{" "}
                          {isRequired("linkedinUrl") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          value={formData.linkedinUrl}
                          onChange={(e) =>
                            handleInputChange("linkedinUrl", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/username"
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}

                    {isVisible("githubUrl") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          <Github className="h-4 w-4 inline mr-2" />
                          GitHub{" "}
                          {isRequired("githubUrl") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          value={formData.githubUrl}
                          onChange={(e) =>
                            handleInputChange("githubUrl", e.target.value)
                          }
                          placeholder="https://github.com/username"
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}

                    {isVisible("portfolioUrl") && (
                      <div className="space-y-2">
                        <Label className="text-neutral-700 dark:text-neutral-300">
                          Portfolio{" "}
                          {isRequired("portfolioUrl") && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          value={formData.portfolioUrl}
                          onChange={(e) =>
                            handleInputChange("portfolioUrl", e.target.value)
                          }
                          placeholder="https://portfolio.com"
                          className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* SAVE BUTTON */}
              <Card className="border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-neutral-900">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                        Ready to update your profile?
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Your changes will be visible to employers immediately
                      </p>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="lg"
                      className="bg-primary-500 hover:bg-primary-600 text-white min-w-40"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SKILLS TAB */}
            {showSkillsTab && (
              <TabsContent value="skills">
                <div className="space-y-6">
                  <SkillsSection
                    profile={profile}
                    onUpdate={() => fetchProfile({ include: includeSections })}
                    showLevel={isVisible("skills.level")}
                    showYearsOfExp={isVisible("skills.yearsOfExp")}
                  />
                  {showDomains && (
                    <DomainsSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                </div>
              </TabsContent>
            )}

            {/* EXPERIENCE TAB */}
            {showExperienceTab && (
              <TabsContent value="experience">
                <ExperienceSection
                  profile={profile}
                  onUpdate={() => fetchProfile({ include: includeSections })}
                />
              </TabsContent>
            )}

            {/* EDUCATION TAB */}
            {showEducationTab && (
              <TabsContent value="education">
                <EducationSection
                  profile={profile}
                  onUpdate={() => fetchProfile({ include: includeSections })}
                  showGrade={isVisible("education.grade")}
                />
              </TabsContent>
            )}

            {/* RESUME TAB */}
            {showResumeTab && (
              <TabsContent value="resume">
                <ResumeSection
                  profile={profile}
                  onUpdate={() => fetchProfile({ include: includeSections })}
                />
              </TabsContent>
            )}

            {/* COMPLIANCE TAB */}
            {showComplianceTab && (
              <TabsContent value="compliance">
                <div className="space-y-6">
                  {isVisible("personalInfo.section") && (
                    <PersonalInfoSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("documents.section") && (
                    <DocumentsSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("publications.section") && (
                    <PublicationsSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("memberships.section") && (
                    <MembershipsSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("clearances.section") && (
                    <ClearancesSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("courses.section") && (
                    <CoursesSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                  {isVisible("referees.section") && (
                    <RefereesSection
                      profile={profile}
                      onUpdate={() =>
                        fetchProfile({ include: includeSections })
                      }
                    />
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  // Wrap with Provider so the settings call happens once
  return (
    <ProfileFieldSettingsProvider>
      <ProfileInner />
    </ProfileFieldSettingsProvider>
  );
}
