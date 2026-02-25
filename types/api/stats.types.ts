/**
 * Stats API Types
 */

export interface Stat {
  id: string;
  number: string;
  label: string;
  icon?: string | null;
  color?: string | null;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}