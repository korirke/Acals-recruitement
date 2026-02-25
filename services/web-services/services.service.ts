// services/web-services/services.service.ts
/**
 * Services Service
 * API service for service management
 */

import { api } from "@/lib/apiClient";
import type {
  Service,
  ServiceFormData,
  ServiceStats,
} from "@/types/api/services.types";
import type { UploadResponse } from "@/types/admin";

const ENDPOINTS = {
  LIST: "/services",
  UPDATE: "/admin/services",
  DELETE: (id: string) => `/admin/services/${id}`,
  UPLOAD: "/admin/upload",
} as const;

export const servicesService = {
  /**
   * Fetch all services
   */
  async getAll(): Promise<Service[]> {
    const response = await api.get<Service[]>(ENDPOINTS.LIST);
    return Array.isArray(response.data)
      ? response.data.sort((a, b) => a.position - b.position)
      : [];
  },

  /**
   * Update all services (bulk update)
   */
  async updateAll(services: ServiceFormData[]): Promise<void> {
    const cleanServices = services.map((service, index) => ({
      ...(service as any).id && !(service as any).id.startsWith('temp-') 
        ? { id: (service as any).id } 
        : {},
      title: service.title,
      slug: service.slug,
      description: service.description,
      shortDesc: service.shortDesc || '',
      icon: service.icon || 'Star',
      color: service.color || 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
      category: service.category || '',
      features: service.features || [],
      benefits: service.benefits || [],
      processSteps: service.processSteps || [],
      complianceItems: service.complianceItems || [],
      imageUrl: service.imageUrl || '',
      heroImageUrl: service.heroImageUrl || '',
      processImageUrl: service.processImageUrl || '',
      complianceImageUrl: service.complianceImageUrl || '',
      onQuote: service.onQuote !== false,
      hasProcess: service.hasProcess || false,
      hasCompliance: service.hasCompliance || false,
      isActive: service.isActive !== false,
      isFeatured: service.isFeatured || false,
      isPopular: service.isPopular || false,
      position: index + 1,
      price: service.price || '',
      buttonText: service.buttonText || 'Learn More',
      buttonLink: service.buttonLink || '',
      metadata: service.metadata || null,
    }));

    await api.put(ENDPOINTS.UPDATE, { services: cleanServices });
  },

  /**
   * Delete a service
   */
  async delete(id: string): Promise<void> {
    await api.delete(ENDPOINTS.DELETE(id));
  },

  /**
   * Upload service image
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>(
      ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.success && response.data?.url) {
      return response.data;
    }

    throw new Error("Invalid upload response");
  },

  /**
   * Calculate service statistics
   */
  calculateStats(services: Service[]): ServiceStats {
    return {
      total: services.length,
      active: services.filter((s) => s.isActive).length,
      featured: services.filter((s) => s.isFeatured).length,
      popular: services.filter((s) => s.isPopular).length,
    };
  },

  /**
   * Create a new service object (local only)
   */
  createNew(position: number = 1): Service {
    return {
      id: `temp-${Date.now()}`,
      title: "New Service",
      slug: `new-service-${Date.now()}`,
      description: "Enter service description here...",
      shortDesc: "Brief description of the service",
      icon: "Star",
      color: "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
      category: "HR Solutions",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      benefits: [],
      processSteps: [],
      complianceItems: [],
      imageUrl: "",
      heroImageUrl: "",
      processImageUrl: "",
      complianceImageUrl: "",
      onQuote: true,
      hasProcess: false,
      hasCompliance: false,
      isActive: true,
      isFeatured: false,
      isPopular: false,
      position,
      price: "",
      buttonText: "Learn More",
      buttonLink: "",
      metadata: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Sort services by position
   */
  sortByPosition(services: Service[]): Service[] {
    return [...services].sort((a, b) => a.position - b.position);
  },

  /**
   * Move service in list
   */
  moveService(
    services: Service[],
    id: string,
    direction: "up" | "down"
  ): Service[] {
    const sortedServices = this.sortByPosition(services);
    const currentIndex = sortedServices.findIndex((s) => s.id === id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedServices.length - 1)
    ) {
      return services;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedServices = [...sortedServices];

    [updatedServices[currentIndex], updatedServices[newIndex]] = [
      updatedServices[newIndex],
      updatedServices[currentIndex],
    ];

    updatedServices.forEach((service, index) => {
      service.position = index + 1;
    });

    return updatedServices;
  },
};
