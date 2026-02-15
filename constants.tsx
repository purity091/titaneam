
import { Asset, AssetStatus, AssetType, MaintenanceRecord, MaintenanceType, AuditEntry, SparePart, PartCondition } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'A001',
    name: 'Caterpillar 950M Wheel Loader',
    type: AssetType.HEAVY_MACHINERY,
    status: AssetStatus.OPERATIONAL,
    location: 'Sector A - Construction Site',
    usageHours: 1250,
    maxHoursBeforeService: 1500,
    model: '950M',
    serialNumber: 'CAT950M-12345',
    purchaseDate: '2022-05-20',
    lastMaintenanceDate: '2023-11-15'
  },
  {
    id: 'A002',
    name: 'Main Warehouse HVAC System',
    type: AssetType.FIXED_EQUIPMENT,
    status: AssetStatus.MAINTENANCE,
    location: 'Logistics Center',
    usageHours: 4500,
    maxHoursBeforeService: 5000,
    model: 'Carrier-TX-500',
    serialNumber: 'CAR-556677',
    purchaseDate: '2021-01-10',
    lastMaintenanceDate: '2024-02-01'
  },
  {
    id: 'A003',
    name: 'Tower Crane TC-45',
    type: AssetType.HEAVY_MACHINERY,
    status: AssetStatus.DOWN,
    location: 'Sector B - High Rise',
    usageHours: 850,
    maxHoursBeforeService: 1000,
    model: 'TC-45X',
    serialNumber: 'TC45-X-998',
    purchaseDate: '2023-03-12',
    lastMaintenanceDate: '2023-12-10'
  }
];

export const MOCK_RECORDS: MaintenanceRecord[] = [
  {
    id: 'M001',
    assetId: 'A001',
    type: MaintenanceType.PREVENTIVE,
    date: '2023-11-15',
    cost: 1200,
    technician: 'John Doe',
    notes: 'Oil change, filter replacement, and hydraulic fluid check.'
  }
];

export const MOCK_PARTS: SparePart[] = [
  { id: 'P001', name: 'Hydraulic Pump', serialNumber: 'SN-HP-9921', condition: PartCondition.NEW },
  { id: 'P002', name: 'Engine Filter', serialNumber: 'SN-EF-1123', condition: PartCondition.NEW },
  { id: 'P003', name: 'Compressor Fan', serialNumber: 'SN-CF-8872', condition: PartCondition.USED }
];

export const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'AUD-001',
    assetId: 'A001',
    timestamp: '2024-03-20 09:15',
    userId: 'TECH-77',
    action: 'Maintenance Started',
    details: 'Preventive maintenance initiated for weekly check.',
    location: 'Site Alpha'
  },
  {
    id: 'AUD-002',
    assetId: 'A001',
    timestamp: '2024-03-20 10:45',
    userId: 'TECH-77',
    action: 'Part Replaced',
    details: 'Replaced Hydraulic Pump. Old part (SN-HP-001) removed.',
    partsInvolved: [{ id: 'P001', name: 'Hydraulic Pump', serialNumber: 'SN-HP-9921', condition: PartCondition.NEW }],
    location: 'Site Alpha'
  }
];
