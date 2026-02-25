"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCompanies } from "@/hooks/useCompanies";
import { useUpload } from "@/hooks/useUpload";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";
import type { CreateCompanyDto } from "@/types";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
];

interface ValidationErrors {
  [key: string]: string;
}

export default function CompanySetupWizard() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { setupCompany, loading } = useCompanies();
  const { uploadSingleFile } = useUpload();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: "",
    industry: "",
    companySize: "",
    location: "",
    email: user?.email || "",
    website: null,
    description: null,
    logo: null,
    coverImage: null,
    socialLinks: {
      linkedin: null,
      twitter: null,
      facebook: null,
    },
  });

  useEffect(() => {
    if (!user || user.role !== "EMPLOYER") {
      router.push("/login");
      return;
    }

    if (user.employerProfile) {
      router.push("/recruitment-portal/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (field: keyof CreateCompanyDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleImageUpload = async (file: File, type: "logo" | "coverImage") => {
    const setLoading = type === "logo" ? setUploadingLogo : setUploadingCover;

    try {
      setLoading(true);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });

      const result = await uploadSingleFile(file);

      if (result?.url) {
        handleInputChange(type, result.url);
        showToast({
          type: "success",
          title: "Upload Successful",
          message: `${
            type === "logo" ? "Logo" : "Cover image"
          } uploaded successfully`,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      showToast({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload image. Please try again.",
      });
      setErrors((prev) => ({
        ...prev,
        [type]: "Failed to upload image. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Please select a valid image file",
        }));
        showToast({
          type: "error",
          title: "Invalid File",
          message: "Please select a valid image file",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Image size must be less than 5MB",
        }));
        showToast({
          type: "error",
          title: "File Too Large",
          message: "Image size must be less than 5MB",
        });
        return;
      }

      handleImageUpload(file, type);
    }
    e.target.value = "";
  };

  const removeImage = (type: "logo" | "coverImage") => {
    setFormData((prev) => ({ ...prev, [type]: "" }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
  };

  const isValidUrl = (url: string): boolean => {
    if (!url) return true;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Company name is required";
      }
      if (!formData.industry) {
        newErrors.industry = "Industry is required";
      }
      if (!formData.companySize) {
        newErrors.companySize = "Company size is required";
      }
      if (!formData.location?.trim()) {
        newErrors.location = "Location is required";
      }
      if (formData.website && !isValidUrl(formData.website)) {
        newErrors.website = "Please enter a valid website URL";
      }
    }

    if (step === 2) {
      if (
        formData.socialLinks?.linkedin &&
        !isValidUrl(formData.socialLinks.linkedin)
      ) {
        newErrors.linkedin = "Please enter a valid LinkedIn URL";
      }
      if (
        formData.socialLinks?.twitter &&
        !isValidUrl(formData.socialLinks.twitter)
      ) {
        newErrors.twitter = "Please enter a valid Twitter URL";
      }
      if (
        formData.socialLinks?.facebook &&
        !isValidUrl(formData.socialLinks.facebook)
      ) {
        newErrors.facebook = "Please enter a valid Facebook URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const submitData: CreateCompanyDto = {
      name: formData.name.trim(),
      industry: formData.industry,
      companySize: formData.companySize,
      location: formData.location?.trim() || "",
      email: formData.email,
      website: formData.website?.trim() || null,
      description: formData.description?.trim() || null,
      logo: formData.logo?.trim() || null,
      coverImage: formData.coverImage?.trim() || null,
      socialLinks:
        formData.socialLinks?.linkedin ||
        formData.socialLinks?.twitter ||
        formData.socialLinks?.facebook
          ? {
              linkedin: formData.socialLinks.linkedin?.trim() || null,
              twitter: formData.socialLinks.twitter?.trim() || null,
              facebook: formData.socialLinks.facebook?.trim() || null,
            }
          : null,
    };

    const success = await setupCompany(submitData);
    if (success) {
      showToast({
        type: "success",
        title: "Company Created",
        message: "Your company profile has been created successfully",
      });
      await refreshUser();
      router.push("/recruitment-portal/dashboard");
    } else {
      showToast({
        type: "error",
        title: "Setup Failed",
        message: "Failed to create company profile. Please try again.",
      });
    }
  };

  const steps = [
    { number: 1, title: "Company Information" },
    { number: 2, title: "Branding" },
    { number: 3, title: "Review & Confirm" },
  ];

  const RequiredLabel = ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {children}
      <span className="text-red-500 text-sm">*</span>
    </Label>
  );

  const OptionalLabel = ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {children}
      <span className="text-neutral-400 text-xs">(optional)</span>
    </Label>
  );

  const ImageUploader = ({
    label,
    value,
    onChange,
    onRemove,
    onUrlChange,
    uploading,
    error,
    type,
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    onUrlChange: (url: string) => void;
    uploading: boolean;
    error?: string;
    type: "logo" | "coverImage";
  }) => {
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    const handleUrlSubmit = () => {
      if (urlInput.trim()) {
        onUrlChange(urlInput.trim());
        setUrlInput("");
        setShowUrlInput(false);
      }
    };

    return (
      <div className="space-y-2">
        <OptionalLabel htmlFor={type}>{label}</OptionalLabel>

        {value ? (
          <div className="relative group">
            <img
              src={normalizeImageUrl(value)}
              alt={label}
              className={`w-full object-cover rounded-lg border-2 border-neutral-200 dark:border-neutral-700 ${
                type === "logo" ? "h-32" : "h-48"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo.png";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {showUrlInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL here..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    type="file"
                    id={type}
                    accept="image/*"
                    onChange={onChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label
                    htmlFor={type}
                    className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      type === "logo" ? "h-32" : "h-48"
                    } ${
                      uploading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    } ${
                      error
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300 dark:border-neutral-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500">
                      Or
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowUrlInput(true)}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Paste Image URL
                </Button>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <X className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
        <X className="h-3 w-3" />
        {error}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    currentStep >= step.number
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-24 mx-2 transition-colors ${
                      currentStep > step.number
                        ? "bg-primary-500"
                        : "bg-neutral-200 dark:bg-neutral-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <p
                key={step.number}
                className={`text-sm ${
                  currentStep >= step.number
                    ? "text-foreground font-medium"
                    : "text-neutral-500"
                }`}
              >
                {step.title}
              </p>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about your company"}
                  {currentStep === 2 &&
                    "Upload your company branding (optional)"}
                  {currentStep === 3 && "Review and confirm your details"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <RequiredLabel htmlFor="name">Company Name</RequiredLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., TechCorp Inc."
                    className={errors.name ? "border-red-500" : ""}
                  />
                  <ErrorMessage error={errors.name} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="industry">Industry</RequiredLabel>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleInputChange("industry", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.industry ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage error={errors.industry} />
                  </div>

                  <div className="space-y-2">
                    <RequiredLabel htmlFor="companySize">
                      Company Size
                    </RequiredLabel>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) =>
                        handleInputChange("companySize", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.companySize ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage error={errors.companySize} />
                  </div>
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="location">Location</RequiredLabel>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., San Francisco, CA"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  <ErrorMessage error={errors.location} />
                </div>

                <div className="space-y-2">
                  <OptionalLabel htmlFor="website">Website</OptionalLabel>
                  <Input
                    id="website"
                    value={formData.website ?? ""}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://www.example.com"
                    className={errors.website ? "border-red-500" : ""}
                  />
                  <ErrorMessage error={errors.website} />
                </div>

                <div className="space-y-2">
                  <OptionalLabel htmlFor="description">
                    Company Description
                  </OptionalLabel>
                  <Textarea
                    id="description"
                    value={formData.description ?? ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Tell candidates about your company..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-neutral-500">
                    This will be displayed on your company profile and job
                    listings
                  </p>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <ImageUploader
                  label="Company Logo"
                  value={formData.logo || ""}
                  onChange={(e) => handleFileSelect(e, "logo")}
                  onRemove={() => removeImage("logo")}
                  onUrlChange={(url) => handleInputChange("logo", url)}
                  uploading={uploadingLogo}
                  error={errors.logo}
                  type="logo"
                />

                <ImageUploader
                  label="Cover Image"
                  value={formData.coverImage || ""}
                  onChange={(e) => handleFileSelect(e, "coverImage")}
                  onRemove={() => removeImage("coverImage")}
                  onUrlChange={(url) => handleInputChange("coverImage", url)}
                  uploading={uploadingCover}
                  error={errors.coverImage}
                  type="coverImage"
                />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Social Media Links
                  </Label>
                  <p className="text-sm text-neutral-500">
                    Connect your company's social media profiles (all optional)
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <OptionalLabel htmlFor="linkedin">LinkedIn</OptionalLabel>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/company/your-company"
                        value={formData.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        className={errors.linkedin ? "border-red-500" : ""}
                      />
                      <ErrorMessage error={errors.linkedin} />
                    </div>

                    <div className="space-y-2">
                      <OptionalLabel htmlFor="twitter">Twitter</OptionalLabel>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/yourcompany"
                        value={formData.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                        className={errors.twitter ? "border-red-500" : ""}
                      />
                      <ErrorMessage error={errors.twitter} />
                    </div>

                    <div className="space-y-2">
                      <OptionalLabel htmlFor="facebook">Facebook</OptionalLabel>
                      <Input
                        id="facebook"
                        placeholder="https://facebook.com/yourcompany"
                        value={formData.socialLinks?.facebook || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("facebook", e.target.value)
                        }
                        className={errors.facebook ? "border-red-500" : ""}
                      />
                      <ErrorMessage error={errors.facebook} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Company Information</h3>

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500">Industry:</span>
                      <span className="font-medium">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500">Size:</span>
                      <span className="font-medium">
                        {formData.companySize}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-500">Location:</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                    {formData.website && (
                      <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-neutral-500">Website:</span>
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary-500 hover:underline"
                        >
                          {formData.website}
                        </a>
                      </div>
                    )}
                    {formData.description && (
                      <div className="py-2">
                        <span className="text-neutral-500 block mb-2">
                          Description:
                        </span>
                        <p className="font-medium text-sm leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {(formData.logo || formData.coverImage) && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">Branding</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {formData.logo && (
                        <div>
                          <p className="text-sm text-neutral-500 mb-2">Logo</p>
                          <img
                            src={normalizeImageUrl(formData.logo)}
                            alt="Company logo"
                            className="w-full h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logo.png";
                            }}
                          />
                        </div>
                      )}
                      {formData.coverImage && (
                        <div>
                          <p className="text-sm text-neutral-500 mb-2">
                            Cover Image
                          </p>
                          <img
                            src={normalizeImageUrl(formData.coverImage)}
                            alt="Cover"
                            className="w-full h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logo.png";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(formData.socialLinks?.linkedin ||
                  formData.socialLinks?.twitter ||
                  formData.socialLinks?.facebook) && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">Social Media</h3>
                    <div className="space-y-2 text-sm">
                      {formData.socialLinks?.linkedin && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">LinkedIn:</span>
                          <a
                            href={formData.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-500 hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {formData.socialLinks?.twitter && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Twitter:</span>
                          <a
                            href={formData.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-500 hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {formData.socialLinks?.facebook && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Facebook:</span>
                          <a
                            href={formData.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-500 hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>
                      Your company will be created and verified immediately. You
                      can start posting jobs right away!
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={loading || uploadingLogo || uploadingCover}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="ml-auto"
                  disabled={uploadingLogo || uploadingCover}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || uploadingLogo || uploadingCover}
                  className="ml-auto bg-primary-500 hover:bg-primary-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Company...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
