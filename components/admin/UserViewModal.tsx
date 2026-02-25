"use client";

import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
  UserCog,
  Loader2,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserActions } from "@/hooks/useUsers";
import type { User } from "@/types";
import { userService } from "@/services/system-services";
import { useToast } from "@/components/admin/ui/Toast";

interface UserViewModalProps {
  user: User;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserViewModal({
  user: initialUser,
  onClose,
  onRefresh,
}: UserViewModalProps) {
  const [user, setUser] = useState<any>(initialUser);
  const [loading, setLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [newRole, setNewRole] = useState(user.role);
  const [roleChangeReason, setRoleChangeReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const { suspendUser, activateUser, changeRole, isSubmitting } =
    useUserActions();
  const { showToast } = useToast();

  // Fetch full user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const fullUser = await userService.getById(user.id);
        if (fullUser) {
          setUser(fullUser);
        }
      } catch (error: any) {
        showToast({
          type: "error",
          title: "Error",
          message: error.message || "Failed to load user details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  const handleSuspend = async () => {
    const success = await suspendUser(
      user.id,
      suspendReason ? { reason: suspendReason } : undefined,
    );
    if (success) {
      setShowSuspendDialog(false);
      setSuspendReason("");
      onRefresh();
      onClose();
    }
  };

  const handleActivate = async () => {
    const success = await activateUser(user.id);
    if (success) {
      onRefresh();
      onClose();
    }
  };

  const handleChangeRole = async () => {
    if (!newRole) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please select a role",
      });
      return;
    }

    const success = await changeRole(user.id, {
      newRole,
      reason: roleChangeReason || undefined,
    });

    if (success) {
      setShowRoleDialog(false);
      setNewRole("");
      setRoleChangeReason("");
      onRefresh();
      onClose();
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: "bg-purple-500",
      HR_MANAGER: "bg-blue-500",
      MODERATOR: "bg-cyan-500",
      EMPLOYER: "bg-orange-500",
      CANDIDATE: "bg-green-500",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors[role] || "bg-gray-500"}`}
      >
        {role.replace("_", " ")}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500",
      INACTIVE: "bg-gray-500",
      SUSPENDED: "bg-red-500",
      PENDING_VERIFICATION: "bg-yellow-500",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors[status] || "bg-gray-500"}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-neutral-600 dark:text-neutral-400 mt-4">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {user.firstName?.charAt(0)?.toUpperCase()}
                  {user.lastName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Email
                      </p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Phone
                        </p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Joined
                      </p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Last Login
                        </p>
                        <p className="font-medium">
                          {new Date(user.lastLoginAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.lastLoginIp && (
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Last IP
                        </p>
                        <p className="font-medium">{user.lastLoginIp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Profile */}
            {user.candidateProfile && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Candidate Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.candidateProfile.title && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Title
                      </p>
                      <p className="font-medium">
                        {user.candidateProfile.title}
                      </p>
                    </div>
                  )}
                  {user.candidateProfile.location && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Location
                      </p>
                      <p className="font-medium">
                        {user.candidateProfile.location}
                      </p>
                    </div>
                  )}
                  {user.candidateProfile.experienceYears && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Experience
                      </p>
                      <p className="font-medium">
                        {user.candidateProfile.experienceYears} years
                      </p>
                    </div>
                  )}
                  {user.candidateProfile.expectedSalary && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Expected Salary
                      </p>
                      <p className="font-medium">
                        {user.candidateProfile.currency}{" "}
                        {user.candidateProfile.expectedSalary}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Open to Work
                    </p>
                    <p className="font-medium">
                      {user.candidateProfile.openToWork ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                {user.candidateProfile.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Bio
                    </p>
                    <p className="font-medium mt-1">
                      {user.candidateProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Employer Profile */}
            {user.employerProfile && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Employer Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.employerProfile.company && (
                    <>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Company
                        </p>
                        <p className="font-medium">
                          {user.employerProfile.company.name}
                        </p>
                      </div>
                      {user.employerProfile.company.industry && (
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Industry
                          </p>
                          <p className="font-medium">
                            {user.employerProfile.company.industry}
                          </p>
                        </div>
                      )}
                      {user.employerProfile.company.companySize && (
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Company Size
                          </p>
                          <p className="font-medium">
                            {user.employerProfile.company.companySize}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {user.employerProfile.title && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Position
                      </p>
                      <p className="font-medium">
                        {user.employerProfile.title}
                      </p>
                    </div>
                  )}
                  {user.employerProfile.department && (
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Department
                      </p>
                      <p className="font-medium">
                        {user.employerProfile.department}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Can Post Jobs
                    </p>
                    <p className="font-medium">
                      {user.employerProfile.canPostJobs ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Can View CVs
                    </p>
                    <p className="font-medium">
                      {user.employerProfile.canViewCVs ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Statistics */}
            {user._count && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Activity Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {user._count.applications || 0}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Applications
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <Briefcase className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {user._count.postedJobs || 0}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Posted Jobs
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {user._count.subscriptions || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Subscriptions
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Mail className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {user._count.notifications || 0}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Notifications
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(true)}
              disabled={isSubmitting}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Change Role
            </Button>
            {user.status === "ACTIVE" ? (
              <Button
                variant="outline"
                onClick={() => setShowSuspendDialog(true)}
                disabled={isSubmitting}
                className="text-red-600 dark:text-red-400"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleActivate}
                disabled={isSubmitting}
                className="text-green-600 dark:text-green-400"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Activate
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Change Role Dialog */}
      {showRoleDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Change User Role
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {user.firstName} {user.lastName} - Current:{" "}
                {getRoleBadge(user.role)}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  New Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="EMPLOYER">Employer</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Why is this role change needed?"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleDialog(false);
                  setNewRole(user.role);
                  setRoleChangeReason("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleChangeRole} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Role"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Dialog */}
      {showSuspendDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Suspend User
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Why are you suspending this user?"
              />
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuspendDialog(false);
                  setSuspendReason("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuspend}
                disabled={isSubmitting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suspending...
                  </>
                ) : (
                  "Suspend User"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
