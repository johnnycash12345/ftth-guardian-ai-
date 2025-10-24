import type React from 'react';

export type Page = 'monitoring' | 'predictive_intelligence' | 'api_returns' | 'reports' | 'settings';
export type Theme = 'light' | 'dark';
export type Role = 'Admin' | 'Operator' | 'Executive' | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin: string;
}

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

// Continuous Learning Types
export interface SimulatorConfig {
  url: string;
  apiKey: string;
}

export type FeedbackLoopStatus = 'active' | 'inactive' | 'alert';

// Simplified schemas for frontend simulation
export interface OpticalMetrics { powerRX: number; powerTX: number; }
export interface ElectricalMetrics { voltage: number; temperature: number; }
export interface NetworkMetrics { latency: number; jitter: number; }
export interface PhysicalMetrics { fiberDistance: number; equipmentAge: number; }
export interface StatusMetrics { uptime: number; activeAlarms: number; }
export interface ContextMetrics { hourOfDay: number; }

export interface GuardianPredictionRequest {
  equipmentId: string;
  metrics: {
    optical: OpticalMetrics;
    electrical: ElectricalMetrics;
    network: NetworkMetrics;
    physical: PhysicalMetrics;
    status: StatusMetrics;
    context: ContextMetrics;
  };
  timestamp: number;
}

export interface FeedbackData {
  simulationId: string;
  correctPredictions: any[]; // Simplified for frontend
  incorrectPredictions: {
    prediction: any;
    actualOutcome: string;
  }[];
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
  users: User[];
  setUsers: (users: User[]) => void;
  currentUserRole: Role;
  simulatorConfig: SimulatorConfig;
  setSimulatorConfig: (config: SimulatorConfig) => void;
  feedbackLoopStatus: FeedbackLoopStatus;
}

// API & Data Types
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

// Monitoring Types
export interface TelemetryDataPoint {
    time: string;
    opticalPower: number;
    latency: number;
    disconnections: number;
}

export interface Alert {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
    entity: string;
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

export interface FeatureContribution {
    feature: string;
    value: string | number;
    contribution: number; // positive or negative
}

export interface ShapValues {
    baseValue: number;
    finalPrediction: number;
    contributions: FeatureContribution[];
}

export interface Prediction {
    id: string;
    entity: string; // e.g., "ONU XYZ-123" or "Cliente 456"
    riskPercentage: number;
    timeframe: '24h' | '48h' | '72h';
    details: string;
    shapValues: ShapValues;
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

export interface DriftDataPoint {
    date: string;
    value: number;
    baseline: number;
}

// Reports
export interface ReportHistory {
    id: string;
    type: 'Operacional' | 'Machine Learning';
    generatedAt: string;
    generatedBy: string;
    filters: string;
}
