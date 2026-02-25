'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function SystemUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy data
  const [users] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@fortune.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+254 712 345 678',
      createdAt: '2024-01-15',
      lastLogin: '2 hours ago',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@fortune.com',
      role: 'HR_MANAGER',
      status: 'ACTIVE',
      phone: '+254 723 456 789',
      createdAt: '2024-02-20',
      lastLogin: '5 hours ago',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@fortune.com',
      role: 'WEBSITE_ADMIN',
      status: 'ACTIVE',
      phone: '+254 734 567 890',
      createdAt: '2024-03-10',
      lastLogin: '1 day ago',
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@fortune.com',
      role: 'MODERATOR',
      status: 'INACTIVE',
      phone: '+254 745 678 901',
      createdAt: '2024-01-25',
      lastLogin: '7 days ago',
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@fortune.com',
      role: 'EMPLOYER',
      status: 'ACTIVE',
      phone: '+254 756 789 012',
      createdAt: '2024-04-05',
      lastLogin: '3 hours ago',
    },
  ]);

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      HR_MANAGER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      WEBSITE_ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      MODERATOR: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      EMPLOYER: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      CANDIDATE: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      ACTIVE: { color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
      INACTIVE: { color: 'text-gray-600 dark:text-gray-400', icon: XCircle },
      SUSPENDED: { color: 'text-red-600 dark:text-red-400', icon: XCircle },
      PENDING_VERIFICATION: { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock },
    };

    const { color, icon: Icon } = config[status] || config.INACTIVE;

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
      </div>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'text-blue-600 dark:text-blue-400', icon: Users },
    { label: 'Active', value: users.filter(u => u.status === 'ACTIVE').length, color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
    { label: 'Inactive', value: users.filter(u => u.status === 'INACTIVE').length, color: 'text-gray-600 dark:text-gray-400', icon: XCircle },
    { label: 'Admins', value: users.filter(u => u.role.includes('ADMIN')).length, color: 'text-purple-600 dark:text-purple-400', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            User Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage all system users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="WEBSITE_ADMIN">Website Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="EMPLOYER">Employer</option>
            <option value="CANDIDATE">Candidate</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING_VERIFICATION">Pending</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium">
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {user.lastLogin || 'Never'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      Joined {user.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}