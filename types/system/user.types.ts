
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
  candidateProfile?: {
    id: string;
    title?: string;
    bio?: string;
    location?: string;
    openToWork: boolean;
    resumeUrl?: string;
    experienceYears?: number;
    expectedSalary?: number;
    currency?: string;
  };
  employerProfile?: {
    id: string;
    title?: string;
    department?: string;
    canPostJobs: boolean;
    canViewCVs: boolean;
    company: {
      id: string;
      name: string;
      logo?: string;
      website?: string;
      industry?: string;
      companySize?: string;
    };
  };
  _count?: {
    applications: number;
    postedJobs: number;
    subscriptions: number;
    notifications: number;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
}

export interface ChangeRoleData {
  newRole: string;
  reason?: string;
}

export interface SuspendUserData {
  reason?: string;
}
