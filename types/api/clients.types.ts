/**
 * Clients API Types
 */

export interface Client {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website?: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsResponse {
  clients: Client[];
}