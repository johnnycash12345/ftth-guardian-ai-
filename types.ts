import type React from 'react';

export type Page = 'predictive_intelligence' | 'api_returns' | 'reports' | 'settings';
export type Theme = 'light' | 'dark';

export interface HubsoftConfig {
  graphqlUrl: string;
  restUrl: string;
  authToken: string;
  companyId: string;
}

export interface OtherIntegration {
  id: string;
  name: string;
  url: string;
  type: 'SNMP' | 'OLT' | 'OTDR' | 'NetFlow' | 'Other';
  token: string;
}

export interface SystemPreferences {
  language: 'pt' | 'en';
  refreshInterval: number;
  timeFormat: '12h' | '24h';
}

export interface NotificationPreferences {
  email: boolean;
  popup: boolean;
  events: {
    failures: boolean;
    criticalPredictions: boolean;
    disconnections: boolean;
  };
}

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  hubsoftConfig: HubsoftConfig;
  setHubsoftConfig: (config: HubsoftConfig) => void;
  otherIntegrations: OtherIntegration[];
  setOtherIntegrations: (integrations: OtherIntegration[]) => void;
  systemPreferences: SystemPreferences;
  setSystemPreferences: (prefs: SystemPreferences) => void;
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: (prefs: NotificationPreferences) => void;
}

export interface Client {
  id_cliente: number;
  codigo_cliente: string;
  nome_razaosocial: string;
  cpf_cnpj: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface ServiceOrder {
  id: number;
  protocol: string;
  client_name: string;
  service: string;
  status: 'open' | 'in_progress' | 'closed' | 'canceled';
  creation_date: string;
}

export interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface ApiResponse<T> {
  paginatorInfo: PaginatorInfo;
  data: T[];
}

export interface SyncLog {
    timestamp: Date;
    responseTime: number;
    status: 'OK' | 'Error';
    httpStatus: number;
    error?: string;
}

// Machine Learning Types
export interface ModelMetrics {
    version: string;
    algorithm: string;
    accuracy: number;
    f1Score: number;
    rocAuc: number;
    trainingDate: string;
}

export interface Prediction {
    id: string;
    entity: string; // e.g., "ONU XYZ-123" or "Cliente 456"
    riskPercentage: number;
    timeframe: '24h' | '48h' | '72h';
    details: string;
}

export interface FeatureImportance {
    feature: string;
    importance: number;
}

export interface PredictionHistory {
    date: string;
    predicted: number;
    actual: number;
}