"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import {
  X,
  Mail,
  Phone,
  Building2,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  MapPin,
  MessageSquare,
  Loader2,
  Upload,
  FileText,
  Trash2,
  Paperclip,
  AlertCircle,
} from "lucide-react";
import { servicesService } from "@/services/public-services";
import { usePricingRequest } from "@/hooks/usePricingRequest";
import { Service } from "@/types/api/services.types";

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessSize?: "small" | "medium" | "enterprise" | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  country: string;
  teamSize: string;
  services: string[];
  message: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  country?: string;
  teamSize?: string;
  services?: string;
}

export const useServices = (params?: {
  featured?: boolean;
  category?: string;
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await servicesService.getServices(params);
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [JSON.stringify(params)]);

  return { services, loading };
};
export const PricingDialog = ({
  isOpen,
  onClose,
  businessSize = null,
}: PricingDialogProps) => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { services: quoteServices, loading: servicesLoading } = useServices({
    featured: true,
  });
  const { isSubmitting, isSubmitted, submitPricingRequest, resetSubmission } =
    usePricingRequest();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    country: "",
    teamSize: "",
    services: [],
    message: "",
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return (
      /^[\d\s\+\-\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 9
    );
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (formData.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
    }

    if (!formData.teamSize) {
      newErrors.teamSize = "Please select team size";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceToggle = (serviceTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceTitle)
        ? prev.services.filter((s) => s !== serviceTitle)
        : [...prev.services, serviceTitle],
    }));

    // Clear services error when selecting
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      validFiles.push(file);
    }

    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      country: "",
      teamSize: "",
      services: [],
      message: "",
    });
    setUploadedFiles([]);
    setStep(1);
    setErrors({});
    resetSubmission();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const nextStep = () => {
    let isValid = false;

    if (step === 1) {
      isValid = validateStep1();
    } else if (step === 2) {
      isValid = validateStep2();
    }

    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    const success = await submitPricingRequest({
      ...formData,
      files: uploadedFiles,
    });

    if (success) {
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const getEmployeeRange = () => {
    switch (businessSize) {
      case "small":
        return ["1-10", "11-25", "26-50"];
      case "medium":
        return ["51-100", "101-250", "251-500"];
      case "enterprise":
        return ["500-1000", "1001-5000", "5000+"];
      default:
        return [
          "1-10",
          "11-25",
          "26-50",
          "51-100",
          "101-250",
          "251-500",
          "500-1000",
          "1001-5000",
          "5000+",
        ];
    }
  };

  const getTitle = () => {
    switch (businessSize) {
      case "small":
        return "Small Business Solution";
      case "medium":
        return "Medium Business Platform";
      case "enterprise":
        return "Enterprise Solution";
      default:
        return "Get Custom Pricing";
    }
  };

  const getSubtitle = () => {
    switch (businessSize) {
      case "small":
        return "Designed for growing teams";
      case "medium":
        return "Scaled for mid-market success";
      case "enterprise":
        return "Enterprise-grade solution";
      default:
        return "Perfect for businesses of all sizes";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-4 sm:p-6 lg:p-8 z-10">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1 pr-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                {getTitle()}
              </h3>
              <p className="text-primary-100 text-xs sm:text-sm">
                {getSubtitle()}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mt-4 sm:mt-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold transition-all text-sm sm:text-base ${
                    step >= num
                      ? "bg-white text-primary-600"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {step > num ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                  ) : (
                    num
                  )}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-all ${
                      step > num ? "bg-white" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium">
            <span className={step >= 1 ? "text-white" : "text-white/60"}>
              Contact
            </span>
            <span className={step >= 2 ? "text-white" : "text-white/60"}>
              Company
            </span>
            <span className={step >= 3 ? "text-white" : "text-white/60"}>
              Services
            </span>
          </div>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
            <div className="flex items-center text-green-800 dark:text-green-200 text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
              <span className="font-medium">
                ✅ Thank you! Our sales team will reach out shortly.
              </span>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-280px)] sm:max-h-[calc(90vh-320px)]"
        >
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
                  Contact Information
                </h4>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  Tell us how to reach you
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name
                      ? "border-red-500 dark:border-red-400"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                  placeholder="Full Names"
                />
                {errors.name && (
                  <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Business Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                  placeholder="email@company.com"
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.phone
                      ? "border-red-500 dark:border-red-400"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                  placeholder="+254 712 345 678"
                />
                {errors.phone && (
                  <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Company Information */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
                  Company Details
                </h4>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  Help us understand your business
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.company
                      ? "border-red-500 dark:border-red-400"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                  placeholder="Your Company Ltd"
                />
                {errors.company && (
                  <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.company}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Industry */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.industry
                        ? "border-red-500 dark:border-red-400"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Construction">Construction</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && (
                    <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.industry}
                    </div>
                  )}
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Team Size *
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.teamSize
                        ? "border-red-500 dark:border-red-400"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    <option value="">Select range</option>
                    {getEmployeeRange().map((range) => (
                      <option key={range} value={range}>
                        {range} employees
                      </option>
                    ))}
                  </select>
                  {errors.teamSize && (
                    <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.teamSize}
                    </div>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.country
                      ? "border-red-500 dark:border-red-400"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                  placeholder="Kenya"
                />
                {errors.country && (
                  <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.country}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Services & Files */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
                  Select Services & Add Details
                </h4>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  Choose services and optionally attach files
                </p>
              </div>

              {/* Services Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 sm:mb-4">
                  Services * (Select at least one)
                </label>
                {servicesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary-600" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {quoteServices.map((service) => (
                        <label
                          key={service.id}
                          className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.services.includes(service.title)
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : errors.services
                                ? "border-red-500 dark:border-red-400 hover:border-red-600"
                                : "border-neutral-300 dark:border-neutral-700 hover:border-primary-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.title)}
                            onChange={() => handleServiceToggle(service.title)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 shrink-0"
                          />
                          <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            {service.title}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.services && (
                      <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.services}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Additional Information
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your specific needs or questions..."
                />
              </div>

              {/* File Upload */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Attach Files (Optional, max 5 files, 10MB each)
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedFiles.length >= 5}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                    Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    onChange={handleFileSelect}
                  />
                </div>

                {uploadedFiles.length > 0 ? (
                  <div className="space-y-2 p-2 sm:p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {file.name}
                            </div>
                            <div className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-neutral-400 mb-2" />
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 px-2">
                      No files selected. You can attach RFPs, specifications, or
                      other documents.
                    </p>
                  </div>
                )}

                <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Supported formats: PDF, Word, Excel, Images, Text files
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer with Navigation */}
        <div className="sticky bottom-0 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
              >
                <ArrowLeft className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Back</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
              >
                Cancel
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                size="lg"
                onClick={nextStep}
                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
              >
                <span className="hidden xs:inline">Continue</span>
                <span className="xs:hidden">Next</span>
                <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || servicesLoading}
                className="flex-1 text-sm sm:text-base py-2 sm:py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden xs:inline">Submitting...</span>
                    <span className="xs:hidden">Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Submit Request</span>
                    <span className="sm:hidden">Submit</span>
                    {uploadedFiles.length > 0 && (
                      <span className="hidden sm:inline">
                        {" "}
                        ({uploadedFiles.length} files)
                      </span>
                    )}
                    <CheckCircle2 className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 text-center mt-3 sm:mt-4 px-2">
            By submitting, you agree to our Terms of Service and Privacy Policy.
            We'll contact you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
