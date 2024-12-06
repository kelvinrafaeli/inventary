export interface BarcodeEntry {
  id: string;
  code: string;
  quantity: number;
}

export type Delimiter = ',' | ';' | '.' | string;

export interface ExportOptions {
  delimiter: Delimiter;
  format: 'txt' | 'csv';
  quantityPadding: number;
}

export interface BarcodeSummary {
  originalCode: string;
  totalQuantity: number;
  occurrences: number;
}

export interface SystemLicense {
  id: string;
  key: string;
  clientName: string;
  expirationDate: Date;
  isValid: boolean;
  createdAt: Date;
}

export interface ProductReference {
  code: string;
  name: string;
  quantity?: number;
}

export type TabType = 'scan' | 'check' | 'summary' | 'export' | 'license';
export type AdminTabType = 'licenses' | 'generate';