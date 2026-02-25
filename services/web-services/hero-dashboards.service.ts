/**
 * Hero Dashboards Service
 * API service for hero section management
 */

import { api } from "@/lib/apiClient";
import { getToken } from "@/lib/auth";
import { config } from "@/lib/config";
import type {
  HeroDashboard,
  HeroContent,
  HeroDataResponse,
  StatItem,
} from "@/types/admin";

const ENDPOINTS = {
  HERO_DATA: "/hero",
  UPDATE_DASHBOARDS: "/admin/hero-dashboards",
  UPDATE_CONTENT: "/admin/hero-content",
  UPLOAD: "/admin/upload/multiple",
} as const;

export const heroDashboardsService = {
  /**
   * Fetch hero data (dashboards + content)
   */
  async getHeroData(): Promise<HeroDataResponse> {
    const response = await api.get<any>(ENDPOINTS.HERO_DATA);

    return {
      heroDashboards: response.data?.heroDashboards || [],
      heroContent: response.data?.heroContent || null,
    };
  },

  /**
   * Update hero dashboards
   */
  async updateDashboards(dashboards: HeroDashboard[]): Promise<void> {
    const cleanDashboards = dashboards.map((dashboard) => {
      const { id, createdAt, updatedAt, ...dashboardData } = dashboard;

      return {
        ...(id.startsWith("temp-") ? {} : { id }),
        ...dashboardData,
        stats:
          dashboard.type === "content" && Array.isArray(dashboard.stats)
            ? dashboard.stats
            : undefined,
        features:
          dashboard.type === "content" && Array.isArray(dashboard.features)
            ? dashboard.features
            : undefined,
        imageUrl: dashboard.type === "image" ? dashboard.imageUrl : undefined,
      };
    });

    await api.put(ENDPOINTS.UPDATE_DASHBOARDS, { dashboards: cleanDashboards });
  },

  /**
   * Update hero content
   */
  async updateContent(content: HeroContent): Promise<void> {
    await api.put(ENDPOINTS.UPDATE_CONTENT, content);
  },

  /**
   * Upload dashboard image
   */
  async uploadImage(file: File): Promise<string> {
    const token = getToken();
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${config.apiBaseUrl}${ENDPOINTS.UPLOAD}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    const uploadedFile = result.data?.[0] || result[0];

    if (uploadedFile && uploadedFile.url) {
      return uploadedFile.url;
    }

    throw new Error("No URL returned from upload");
  },

  /**
   * Create a new dashboard object (local only)
   */
  createNew(position: number): HeroDashboard {
    return {
      id: `temp-${Date.now()}`,
      title: "New Dashboard",
      description: "Dashboard description",
      type: "content",
      stats: [
        { label: "Metric 1", value: "100", color: "primary" },
        { label: "Metric 2", value: "95%", color: "accent" },
      ],
      features: ["Feature 1", "Feature 2", "Feature 3"],
      imageUrl: "",
      position,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Sort dashboards by position
   */
  sortByPosition(dashboards: HeroDashboard[]): HeroDashboard[] {
    return [...dashboards].sort((a, b) => a.position - b.position);
  },

  /**
   * Move dashboard in list
   */
  moveDashboard(
    dashboards: HeroDashboard[],
    id: string,
    direction: "up" | "down",
  ): HeroDashboard[] {
    const sortedDashboards = this.sortByPosition(dashboards);
    const currentIndex = sortedDashboards.findIndex((d) => d.id === id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedDashboards.length - 1)
    ) {
      return dashboards;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedDashboards = [...sortedDashboards];

    [updatedDashboards[currentIndex], updatedDashboards[newIndex]] = [
      updatedDashboards[newIndex],
      updatedDashboards[currentIndex],
    ];

    updatedDashboards.forEach((dashboard, index) => {
      dashboard.position = index + 1;
    });

    return updatedDashboards;
  },

  /**
   * Update a stat in a dashboard
   */
  updateStat(
    dashboards: HeroDashboard[],
    dashboardId: string,
    statIndex: number,
    updates: Partial<StatItem>,
  ): HeroDashboard[] {
    return dashboards.map((dashboard) => {
      if (dashboard.id === dashboardId && dashboard.stats) {
        return {
          ...dashboard,
          stats: dashboard.stats.map((stat, index) =>
            index === statIndex ? { ...stat, ...updates } : stat,
          ),
        };
      }
      return dashboard;
    });
  },

  /**
   * Add a stat to a dashboard
   */
  addStat(dashboards: HeroDashboard[], dashboardId: string): HeroDashboard[] {
    return dashboards.map((dashboard) => {
      if (dashboard.id === dashboardId) {
        const currentStats = Array.isArray(dashboard.stats)
          ? dashboard.stats
          : [];
        return {
          ...dashboard,
          stats: [
            ...currentStats,
            { label: "New Metric", value: "0", color: "primary" as const },
          ],
        };
      }
      return dashboard;
    });
  },

  /**
   * Delete a stat from a dashboard
   */
  deleteStat(
    dashboards: HeroDashboard[],
    dashboardId: string,
    statIndex: number,
  ): HeroDashboard[] {
    return dashboards.map((dashboard) => {
      if (dashboard.id === dashboardId && dashboard.stats) {
        return {
          ...dashboard,
          stats: dashboard.stats.filter((_, index) => index !== statIndex),
        };
      }
      return dashboard;
    });
  },
};
