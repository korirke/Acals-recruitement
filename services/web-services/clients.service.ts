/**
 * Clients Service
 * API service for client management
 */

import { api } from "@/lib/apiClient";
import type { Client, ClientFormData, ClientStats } from "@/types/admin";
import type { UploadResponse } from "@/types/admin";

const ENDPOINTS = {
  LIST: "/admin/clients",
  UPDATE: "/admin/clients",
  UPLOAD: "/admin/upload",
} as const;

export const clientsService = {
  /**
   * Fetch all clients
   */
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>(ENDPOINTS.LIST);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Update all clients (bulk update)
   */
  async updateAll(clients: ClientFormData[]): Promise<void> {
    const cleanClients = clients.map((client, index) => ({
      id: (client as any).id,
      name: client.name,
      logo: client.logo,
      industry: client.industry || "",
      website: client.website || "",
      position: index + 1,
      isActive: client.isActive !== false,
    }));

    await api.put(ENDPOINTS.UPDATE, { clients: cleanClients });
  },

  /**
   * Upload client logo
   */
  async uploadLogo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>(
      ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.success && response.data?.url) {
      return response.data;
    }

    throw new Error("Invalid upload response");
  },

  /**
   * Calculate client statistics
   */
  calculateStats(clients: Client[]): ClientStats {
    return {
      total: clients.length,
      active: clients.filter((c) => c.isActive).length,
      withIndustry: clients.filter((c) => c.industry).length,
      withWebsite: clients.filter((c) => c.website).length,
    };
  },

  /**
   * Create a new client object (local only)
   */
  createNew(position: number): Client {
    return {
      id: `temp-${Date.now()}`,
      name: "New Client",
      logo: "https://via.placeholder.com/150x60/6B7280/FFFFFF?text=Logo",
      industry: "",
      website: "",
      position,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Sort clients by position
   */
  sortByPosition(clients: Client[]): Client[] {
    return [...clients].sort((a, b) => a.position - b.position);
  },

  /**
   * Move client in list
   */
  moveClient(
    clients: Client[],
    id: string,
    direction: "up" | "down",
  ): Client[] {
    const sortedClients = this.sortByPosition(clients);
    const currentIndex = sortedClients.findIndex((c) => c.id === id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedClients.length - 1)
    ) {
      return clients;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedClients = [...sortedClients];

    [updatedClients[currentIndex], updatedClients[newIndex]] = [
      updatedClients[newIndex],
      updatedClients[currentIndex],
    ];

    updatedClients.forEach((client, index) => {
      client.position = index + 1;
    });

    return updatedClients;
  },
};
