/**
 * 📊 Dashboard API Types
 */

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    growth: number;
  };
  traffic: {
    total: number;
    unique: number;
    growth: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'order' | 'content' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}
