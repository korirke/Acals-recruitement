"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserActions } from "@/hooks/useUsers";
import { User } from "@/types";

interface UserFormDialogProps {
  user?: User | null;
  onClose: (shouldRefetch?: boolean) => void;
  scope?: "website" | "recruitment";
}

export default function UserFormDialog({
  user,
  onClose,
  scope,
}: UserFormDialogProps) {
  const { createUser, updateUser, isSubmitting } = useUserActions();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      const success = await updateUser(user.id, updateData);
      if (success) onClose(true);
    } else {
      const success = await createUser(formData);
      if (success) onClose(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRoleOptions = () => {
    if (scope === "website") {
      return [
        { value: "SUPER_ADMIN", label: "Super Admin" },
        { value: "WEBSITE_ADMIN", label: "Website Admin" },
      ];
    } else if (scope === "recruitment") {
      return [
        { value: "CANDIDATE", label: "Candidate" },
        { value: "EMPLOYER", label: "Employer" },
        { value: "MODERATOR", label: "Moderator" },
        { value: "HR_MANAGER", label: "HR Manager" },
        { value: "SUPER_ADMIN", label: "Super Admin" },
      ];
    }
    return [
      { value: "CANDIDATE", label: "Candidate" },
      { value: "EMPLOYER", label: "Employer" },
      { value: "MODERATOR", label: "Moderator" },
      { value: "HR_MANAGER", label: "HR Manager" },
      { value: "SUPER_ADMIN", label: "Super Admin" },
      { value: "WEBSITE_ADMIN", label: "Website Admin" },
    ];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {user ? "Edit User" : "Create New User"}
          </h2>
          <button
            onClick={() => onClose()}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Password {user ? "(leave blank to keep unchanged)" : "*"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
              minLength={6}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              >
                <option value="">Select role</option>
                {getRoleOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{user ? "Update User" : "Create User"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
