import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import { ProfileFieldSettingsPayload } from "@/types";

export const profileFieldSettingsService = {
  async getAll(): Promise<ApiResponse<ProfileFieldSettingsPayload>> {
    return api.get("/profile-field-settings");
  },

  async bulkUpdate(
    updates: Array<{
      id: string;
      isVisible?: boolean;
      isRequired?: boolean;
      displayOrder?: number;
    }>,
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return api.patch("/profile-field-settings/bulk", { updates });
  },
};
