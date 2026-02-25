/**
 * Client Types
 * Type definitions for client management
 */

import { PositionedEntity } from './common.types';

export interface Client extends PositionedEntity {
  name: string;
  logo: string;
  industry?: string;
  website?: string;
}

export interface ClientFormData {
  name: string;
  logo: string;
  industry?: string;
  website?: string;
  position?: number;
  isActive?: boolean;
}

export interface ClientsResponse {
  clients: Client[];
}

export interface ClientStats {
  total: number;
  active: number;
  withIndustry: number;
  withWebsite: number;
}
