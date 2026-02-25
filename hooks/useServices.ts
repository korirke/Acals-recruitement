import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { Service, ApiResponse } from "@/types";

export interface ServiceFilters {
  category?: string;
  featured?: boolean;
  popular?: boolean;
  onQuote?: boolean;
}

/**
 * Fetches all services with optional filters
 */
export const useServices = (filters?: ServiceFilters) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (filters?.category) queryParams.set("category", filters.category);
        if (filters?.featured !== undefined)
          queryParams.set("featured", String(filters.featured));
        if (filters?.popular !== undefined)
          queryParams.set("popular", String(filters.popular));
        if (filters?.onQuote !== undefined)
          queryParams.set("onQuote", String(filters.onQuote));

        const endpoint = `/services${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await api.get<ApiResponse<Service[]>>(endpoint);

        // ✅ Safely unpack .data
        const servicesData = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
            ? response.data
            : [];

        setServices(
          servicesData.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        );
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Failed to load services");

        try {
          const fallback = (await import("@/lib/dummyData")).fallbackData;
          setServices(fallback.services || []);
        } catch {
          setServices([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [
    filters?.category,
    filters?.featured,
    filters?.popular,
    filters?.onQuote,
  ]);

  return { services, loading, error };
};

/**
 * Fetch a single service by slug
 */
export const useService = (slug: string) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse<Service>>(
          `/services/${slug}`,
        );

        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            // Extract Service from ApiResponse wrapper
            const serviceData = response.data as unknown as Service;
            setService(serviceData);
          } else if ("title" in response) {
            setService(response as unknown as Service);
          }
        }
      } catch (err) {
        console.error("Service not found:", err);
        setError("Service not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchService();
  }, [slug]);

  return { service, loading, error };
};

/**
 * Fetch services that can appear in the "Get Quote" dropdown
 */
export const useQuoteServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteServices = async () => {
      try {
        const response = await api.get<ApiResponse<Service[]>>(
          "/services/quote-options",
        );

        const servicesData = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
            ? response.data
            : [];

        setServices(
          servicesData.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        );
      } catch (error) {
        console.error("Failed to load quote services:", error);

        // Fallback options for dropdown
        setServices([
          { id: "1", title: "Payroll Management" } as Service,
          { id: "2", title: "Recruitment Services" } as Service,
          { id: "3", title: "Time & Attendance" } as Service,
          { id: "4", title: "HR Management System" } as Service,
          { id: "5", title: "Staff Outsourcing" } as Service,
          { id: "6", title: "CCTV Solutions" } as Service,
          { id: "7", title: "Web Development" } as Service,
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteServices();
  }, []);

  return { services, loading };
};
