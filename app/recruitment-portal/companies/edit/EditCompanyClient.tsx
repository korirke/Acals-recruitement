"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCompanies } from "@/hooks/useCompanies";
import { useUpload } from "@/hooks/useUpload";
import { useToast } from "@/components/admin/ui/Toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/careers/ui/select";
import { ArrowLeft, Save, Loader2, Building2, X, Upload, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/imageUtils";
import type { UpdateCompanyDto, Company } from "@/types";
import { companyService } from "@/services/recruitment-services";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Manufacturing", 
  "Retail", "Consulting", "Marketing", "Real Estate", "Other",
];

const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "501-1000 employees", "1000+ employees",
];

interface ValidationErrors {
  [key: string]: string;
}

interface EditCompanyClientProps {
  companyId: string;
}

export default function EditCompanyClient({ companyId }: EditCompanyClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { forceUpdateCompany } = useCompanies();
  const { uploadSingleFile } = useUpload();
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<UpdateCompanyDto>({
    name: "",
    industry: "",
    companySize: "",
    location: "",
    website: null,
    description: null,
    logo: null,
    coverImage: null,
    socialLinks: { linkedin: null, twitter: null, facebook: null },
  });

  useEffect(() => {
    if (!user || !["SUPER_ADMIN", "HR_MANAGER", "MODERATOR"].includes(user.role)) {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchCompany();
  }, [user, router, companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await companyService.getCompanyById(companyId);
      if (response.success && response.data) {
        const comp = response.data;
        setCompany(comp);
        setFormData({
          name: comp.name || "",
          industry: comp.industry || "",
          companySize: comp.companySize || "",
          location: comp.location || "",
          website: comp.website || null,
          description: comp.description || null,
          logo: comp.logo || null,
          coverImage: comp.coverImage || null,
          socialLinks: {
            linkedin: comp.socialLinks?.linkedin || null,
            twitter: comp.socialLinks?.twitter || null,
            facebook: comp.socialLinks?.facebook || null,
          },
        });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load company data' });
      router.push("/recruitment-portal/companies");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateCompanyDto, value: any) => {
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
      socialLinks: { ...prev.socialLinks, [platform]: value || null },
    }));
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'coverImage') => {
    const setLoading = type === 'logo' ? setUploadingLogo : setUploadingCover;
    
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
        showToast({ type: 'success', title: 'Upload Successful', message: `${type === 'logo' ? 'Logo' : 'Cover image'} uploaded successfully` });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      showToast({ type: 'error', title: 'Upload Failed', message: 'Failed to upload image. Please try again.' });
      setErrors((prev) => ({ ...prev, [type]: 'Failed to upload image. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, [type]: 'Please select a valid image file' }));
        showToast({ type: 'error', title: 'Invalid File', message: 'Please select a valid image file' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [type]: 'Image size must be less than 5MB' }));
        showToast({ type: 'error', title: 'File Too Large', message: 'Image size must be less than 5MB' });
        return;
      }

      handleImageUpload(file, type);
    }
    e.target.value = '';
  };

  const removeImage = (type: 'logo' | 'coverImage') => {
    setFormData((prev) => ({ ...prev, [type]: null }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
    showToast({ type: 'info', title: 'Image Removed', message: `${type === 'logo' ? 'Logo' : 'Cover image'} will be removed when you save changes` });
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.companySize) newErrors.companySize = "Company size is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (formData.website && !isValidUrl(formData.website)) newErrors.website = "Please enter a valid website URL";
    if (formData.socialLinks?.linkedin && !isValidUrl(formData.socialLinks.linkedin)) newErrors.linkedin = "Please enter a valid LinkedIn URL";
    if (formData.socialLinks?.twitter && !isValidUrl(formData.socialLinks.twitter)) newErrors.twitter = "Please enter a valid Twitter URL";
    if (formData.socialLinks?.facebook && !isValidUrl(formData.socialLinks.facebook)) newErrors.facebook = "Please enter a valid Facebook URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !validateForm()) return;

    setSaving(true);

    const submitData: UpdateCompanyDto = {
      name: formData.name?.trim(),
      industry: formData.industry,
      companySize: formData.companySize,
      location: formData.location?.trim(),
      website: formData.website?.trim() || null,
      description: formData.description?.trim() || null,
      logo: formData.logo?.trim() || null,
      coverImage: formData.coverImage?.trim() || null,
      socialLinks: formData.socialLinks?.linkedin || formData.socialLinks?.twitter || formData.socialLinks?.facebook ? {
        linkedin: formData.socialLinks.linkedin?.trim() || null,
        twitter: formData.socialLinks.twitter?.trim() || null,
        facebook: formData.socialLinks.facebook?.trim() || null,
      } : null,
    };

    const success = await forceUpdateCompany(company.id, submitData);
    setSaving(false);

    if (success) {
      showToast({ type: 'success', title: 'Company Updated', message: 'Company profile has been updated successfully' });
      await fetchCompany();
    } else {
      showToast({ type: 'error', title: 'Update Failed', message: 'Failed to update company profile. Please try again.' });
    }
  };

  const RequiredLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1 text-xs sm:text-sm">
      {children}
      <span className="text-red-500 text-xs sm:text-sm">*</span>
    </Label>
  );

  const OptionalLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1 text-xs sm:text-sm">
      {children}
      <span className="text-neutral-400 text-[10px] sm:text-xs">(optional)</span>
    </Label>
  );

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">
        <X className="h-3 w-3 shrink-0" />
        {error}
      </p>
    );
  };

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
    value: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    onUrlChange: (url: string) => void;
    uploading: boolean;
    error?: string;
    type: 'logo' | 'coverImage';
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
              className={`w-full object-cover rounded-lg border-2 border-neutral-200 dark:border-neutral-700 ${type === 'logo' ? 'h-24 sm:h-32' : 'h-32 sm:h-48'}`}
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <label htmlFor={`${type}-replace`} className="cursor-pointer">
                <Button type="button" variant="secondary" size="sm" asChild>
                  <span>
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Replace
                  </span>
                </Button>
              </label>
              <input type="file" id={`${type}-replace`} accept="image/*" onChange={onChange} disabled={uploading} className="hidden" />
              <Button type="button" variant="destructive" size="sm" onClick={onRemove} disabled={uploading}>
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {showUrlInput ? (
              <div className="flex gap-2">
                <Input placeholder="Paste image URL here..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()} className="text-xs sm:text-sm" />
                <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()} size="sm">Add</Button>
                <Button type="button" variant="outline" onClick={() => { setShowUrlInput(false); setUrlInput(""); }} size="sm">Cancel</Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input type="file" id={type} accept="image/*" onChange={onChange} disabled={uploading} className="hidden" />
                  <label
                    htmlFor={type}
                    className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${type === 'logo' ? 'h-24 sm:h-32' : 'h-32 sm:h-48'} ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'} ${error ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`}
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400 mb-2" />
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">Click to upload image</p>
                        <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300 dark:border-neutral-600" />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">Or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setShowUrlInput(true)}>
                  <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Paste Image URL
                </Button>
              </>
            )}
          </div>
        )}
        
        <ErrorMessage error={error} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="py-12 sm:py-16 text-center">
          <Building2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Company Not Found</h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4">This company does not exist</p>
          <Button asChild size="sm">
            <Link href="/recruitment-portal/companies">Back to Companies</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/recruitment-portal/companies">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">Edit Company Profile (Admin)</h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Force update company information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Company details visible to candidates</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="name">Company Name</RequiredLabel>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={`text-xs sm:text-sm ${errors.name ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.name} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="industry">Industry</RequiredLabel>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger className={`text-xs sm:text-sm ${errors.industry ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage error={errors.industry} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="companySize">Company Size</RequiredLabel>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                  <SelectTrigger className={`text-xs sm:text-sm ${errors.companySize ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage error={errors.companySize} />
              </div>
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="location">Location</RequiredLabel>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} className={`text-xs sm:text-sm ${errors.location ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.location} />
            </div>

            <div className="space-y-2">
              <OptionalLabel htmlFor="website">Website</OptionalLabel>
              <Input id="website" value={formData.website || ""} onChange={(e) => handleInputChange("website", e.target.value || null)} placeholder="https://www.example.com" className={`text-xs sm:text-sm ${errors.website ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.website} />
            </div>

            <div className="space-y-2">
              <OptionalLabel htmlFor="description">Company Description</OptionalLabel>
              <Textarea id="description" value={formData.description || ""} onChange={(e) => handleInputChange("description", e.target.value || null)} placeholder="Tell candidates about your company..." className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Branding</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Company logo and cover image</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <ImageUploader label="Company Logo" value={formData.logo ?? null} onChange={(e) => handleFileSelect(e, 'logo')} onRemove={() => removeImage('logo')} onUrlChange={(url) => handleInputChange('logo', url)} uploading={uploadingLogo} error={errors.logo} type="logo" />
            <ImageUploader label="Cover Image" value={formData.coverImage ?? null} onChange={(e) => handleFileSelect(e, 'coverImage')} onRemove={() => removeImage('coverImage')} onUrlChange={(url) => handleInputChange('coverImage', url)} uploading={uploadingCover} error={errors.coverImage} type="coverImage" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Social Media</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Link your company social profiles</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <OptionalLabel htmlFor="linkedin">LinkedIn</OptionalLabel>
              <Input id="linkedin" value={formData.socialLinks?.linkedin || ""} onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)} placeholder="https://linkedin.com/company/your-company" className={`text-xs sm:text-sm ${errors.linkedin ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.linkedin} />
            </div>

            <div className="space-y-2">
              <OptionalLabel htmlFor="twitter">Twitter</OptionalLabel>
              <Input id="twitter" value={formData.socialLinks?.twitter || ""} onChange={(e) => handleSocialLinkChange("twitter", e.target.value)} placeholder="https://twitter.com/yourcompany" className={`text-xs sm:text-sm ${errors.twitter ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.twitter} />
            </div>

            <div className="space-y-2">
              <OptionalLabel htmlFor="facebook">Facebook</OptionalLabel>
              <Input id="facebook" value={formData.socialLinks?.facebook || ""} onChange={(e) => handleSocialLinkChange("facebook", e.target.value)} placeholder="https://facebook.com/yourcompany" className={`text-xs sm:text-sm ${errors.facebook ? "border-red-500" : ""}`} />
              <ErrorMessage error={errors.facebook} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => router.push("/recruitment-portal/companies")} disabled={saving || uploadingLogo || uploadingCover} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving || uploadingLogo || uploadingCover} className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}