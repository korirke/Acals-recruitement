// /**
//  * 📊 Dashboard Service
//  * Handles dashboard-related API calls
//  */

// import { api } from '@/lib/apiClient';
// import { ENDPOINTS } from '@/lib/endpoints';
// import type { DashboardStats, RecentActivity } from '@/types';



// export interface DashboardStats {
//   totalJobs: number;
//   activeJobs: number;
//   totalApplications: number;
//   registeredCandidates: number;
//   activeEmployers: number;
//   pendingModeration: number;
//   avgTimeToHire: number;
//   successRate: number;
//   trends?: {
//     jobs: number;
//     applications: number;
//   };
// }

// export interface TopPerformers {
//   topJobs: Array<{
//     id: string;
//     title: string;
//     applicationCount: number;
//     views: number;
//     company: {
//       name: string;
//       logo?: string;
//     };
//   }>;
//   topEmployers: Array<{
//     id: string;
//     name: string;
//     logo?: string;
//     _count: {
//       jobs: number;
//     };
//   }>;
//   topCategories: Array<{
//     id: string;
//     name: string;
//     jobCount: number;
//   }>;
// }

// export const dashboardService = {
//   /**
//    * Get dashboard statistics
//    */
//   async getStats(): Promise<DashboardStats> {
//     const response = await api.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS);
//     if (response.success && response.data) {
//       return response.data;
//     }
//     throw new Error(response.message || 'Failed to fetch dashboard stats');
//   },

//   /**
//    * Get recent activities
//    */
//   async getRecentActivities(limit = 10): Promise<RecentActivity[]> {
//     const response = await api.get<RecentActivity[]>(
//       `${ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES}?limit=${limit}`
//     );
//     if (response.success && response.data) {
//       return response.data;
//     }
//     throw new Error(response.message || 'Failed to fetch recent activities');
//   },
// };
