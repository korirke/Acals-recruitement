import type { AxiosResponse } from "axios";
import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  AnalyticsPeriod,
  AnalyticsOverview,
  GrowthTrends,
  JobAnalytics,
  ApplicationAnalytics,
  CandidateAnalytics,
  TopPerformers,
  AnalyticsExportReport,
  JobSelectorResponse,
  JobDrilldownAnalytics,
} from "@/types/recruitment/analytics.types";

// ─── Shared helpers
function buildParams(
  period?: AnalyticsPeriod,
  startDate?: string,
  endDate?: string,
  extra?: Record<string, string | undefined>,
): string {
  const p = new URLSearchParams();
  if (period) p.append("period", period);
  if (startDate) p.append("startDate", startDate);
  if (endDate) p.append("endDate", endDate);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") p.append(k, v);
    });
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

function inferFilenameFromDisposition(
  disposition?: string | null,
): string | null {
  if (!disposition) return null;

  const match = disposition.match(
    /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i,
  );
  const raw = match?.[1] ?? match?.[2];
  if (!raw) return null;

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────
export const analyticsService = {
  getOverview(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<AnalyticsOverview>> {
    return api.get(
      `/analytics/overview${buildParams(period, startDate, endDate)}`,
    );
  },

  getGrowthTrends(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<GrowthTrends>> {
    return api.get(
      `/analytics/growth-trends${buildParams(period, startDate, endDate)}`,
    );
  },

  getJobAnalytics(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<JobAnalytics>> {
    return api.get(`/analytics/jobs${buildParams(period, startDate, endDate)}`);
  },

  getApplicationAnalytics(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<ApplicationAnalytics>> {
    return api.get(
      `/analytics/applications${buildParams(period, startDate, endDate)}`,
    );
  },

  getCandidateAnalytics(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<CandidateAnalytics>> {
    return api.get(
      `/analytics/candidates${buildParams(period, startDate, endDate)}`,
    );
  },

  getTopPerformers(): Promise<ApiResponse<TopPerformers>> {
    return api.get("/analytics/top-performers");
  },

  exportReport(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<AnalyticsExportReport>> {
    return api.get(
      `/analytics/export${buildParams(period, startDate, endDate)}`,
    );
  },

  // Jobs dropdown list
  getJobSelector(
    limit = 200,
    status?: string,
  ): Promise<ApiResponse<JobSelectorResponse>> {
    return api.get(
      `/analytics/job-selector${buildParams(undefined, undefined, undefined, {
        limit: String(limit),
        status,
      })}`,
    );
  },

  // Per-job drilldown analytics
  getJobDrilldown(
    jobId: string,
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
    groupByOverride?: "hour" | "day",
  ): Promise<ApiResponse<JobDrilldownAnalytics>> {
    return api.get(
      `/analytics/job/${jobId}${buildParams(period, startDate, endDate, {
        groupByOverride,
      })}`,
    );
  },

  // Backend-generated XLSX export
  async exportReportXlsx(
    period?: AnalyticsPeriod,
    startDate?: string,
    endDate?: string,
  ): Promise<{ blob: Blob; fileName: string }> {
    const url = `/analytics/export/xlsx${buildParams(period, startDate, endDate)}`;

    const res = (await api.getBlob(url)) as AxiosResponse<Blob>;

    const cd =
      (res.headers?.["content-disposition"] as string | undefined) ??
      (res.headers?.["Content-Disposition"] as string | undefined);

    const inferred = inferFilenameFromDisposition(cd);
    const fallback = `analytics-${period ?? "last_30_days"}-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    return {
      blob: res.data,
      fileName: inferred ?? fallback,
    };
  },
};
