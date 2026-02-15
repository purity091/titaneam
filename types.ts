
export enum AssetStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  DOWN = 'DOWN',
  STANDBY = 'STANDBY'
}

export enum AssetType {
  HEAVY_MACHINERY = 'HEAVY_MACHINERY',
  LIGHTING = 'LIGHTING',
  BUILDING = 'BUILDING',
  FIXED_EQUIPMENT = 'FIXED_EQUIPMENT'
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  PREDICTIVE = 'PREDICTIVE'
}

export enum PartCondition {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED'
}

export interface SparePart {
  id: string;
  name: string;
  serialNumber: string;
  condition: PartCondition;
  installedOnAssetId?: string;
  removedDate?: string;
  installedDate?: string;
}

export interface AuditEntry {
  id: string;
  assetId: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
  partsInvolved?: SparePart[];
  location: string;
}

export interface CorruptionAlert {
  id: string;
  type: 'PART_SWAP' | 'FREQUENT_REPLACEMENT' | 'UNAUTHORIZED_ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  auditEntryId: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED';
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: MaintenanceType;
  date: string;
  cost: number;
  technician: string;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  location: string;
  usageHours: number;
  maxHoursBeforeService: number;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  lastMaintenanceDate: string;
}

export interface MaintenanceForecast {
  assetId: string;
  predictedServiceDate: string;
  riskScore: number; // 0-100
  reasoning: string;
  longTermProjection?: string; // e.g. "Monthly forecast for the next year"
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'VIEWER';
}
