import { api } from "@/lib/apiClient";
import { SearchResponse } from "@/types";

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  sortBy?: string;
}

class SearchServiceClass {
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const response = await api.get<SearchResponse>(
        `/search?${queryParams.toString()}`,
      );

      return (
        response.data || {
          success: false,
          query: params.q,
          results: [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
          searchType: "hybrid",
          responseTime: 0,
        }
      );
    } catch (error) {
      console.error("Search failed:", error);

      // Return empty results on error
      return {
        success: false,
        query: params.q,
        results: [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        searchType: "hybrid",
        responseTime: 0,
      };
    }
  }

  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await api.get<{
        success: boolean;
        suggestions: string[];
      }>(`/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);

      return response.data?.suggestions || [];
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      return [];
    }
  }

  async getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
      const response = await api.get<{ success: boolean; data: string[] }>(
        `/search/popular?limit=${limit}`,
      );

      return response.data?.data || [];
    } catch (error) {
      console.error("Failed to get popular searches:", error);
      return [];
    }
  }
}

export const searchService = new SearchServiceClass();
