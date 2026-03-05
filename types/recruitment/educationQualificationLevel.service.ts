import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type { QualificationLevelDTO } from "@/types/recruitment/profileRequirements.types";

interface LevelsResponse {
  data: QualificationLevelDTO[];
}

interface LevelResponse {
  data: QualificationLevelDTO;
}

// ─── Service ─────────────────────────

export const educationQualificationLevelService = {
  /**
   * Public: fetch active qualification levels (for candidate EducationSection
   * and admin job-config education checkboxes).
   */
  async getActive(): Promise<ApiResponse<QualificationLevelDTO[]>> {
    const res = await api.get<LevelsResponse>("/education-qualification-levels");
    return res as unknown as ApiResponse<QualificationLevelDTO[]>;
  },

  // ── Admin 

  /**
   * Admin: fetch ALL levels including inactive.
   */
  async adminGetAll(): Promise<ApiResponse<QualificationLevelDTO[]>> {
    const res = await api.get<LevelsResponse>("/admin/education-qualification-levels");
    return res as unknown as ApiResponse<QualificationLevelDTO[]>;
  },

  /**
   * Admin: create a new qualification level.
   */
  async create(payload: {
    key: string;
    label: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ApiResponse<QualificationLevelDTO>> {
    const res = await api.post<LevelResponse>("/admin/education-qualification-levels", payload);
    return res as unknown as ApiResponse<QualificationLevelDTO>;
  },

  /**
   * Admin: update an existing level.
   */
  async update(
    id: string,
    payload: Partial<{
      key: string;
      label: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ): Promise<ApiResponse<QualificationLevelDTO>> {
    const res = await api.put<LevelResponse>(`/admin/education-qualification-levels/${id}`, payload);
    return res as unknown as ApiResponse<QualificationLevelDTO>;
  },

  /**
   * Admin: delete a non-system qualification level.
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return api.delete(`/admin/education-qualification-levels/${id}`);
  },

  /**
   * Admin: reorder levels.
   * @param order - Array of level IDs in the desired order.
   */
  async reorder(order: string[]): Promise<ApiResponse<void>> {
    return api.put("/admin/education-qualification-levels/reorder", { order });
  },
};
