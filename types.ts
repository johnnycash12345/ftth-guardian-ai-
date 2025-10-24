
import type React from 'react';

export type Page = 'visualization' | 'settings';
export type Theme = 'light' | 'dark';

export interface HubsoftConfig {
  host: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password?: string;
  token?: string;
}

export interface OtherIntegration {
  id: string;
  name: string;
  url: string;
  type: 'SNMP' | 'OTDR' | 'REST' | 'Other';
  token: string;
}

export interface SystemPreferences {
  language: 'pt' | 'en';
  refreshInterval: number;
  timeFormat: '12h' | '24h';
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

export interface ClientsApiResponse {
  paginatorInfo: PaginatorInfo;
  data: Client[];
}

export interface ServiceOrdersApiResponse {
  paginatorInfo: PaginatorInfo;
  data: ServiceOrder[];
}

export interface SyncLog {
    timestamp: Date;
    responseTime: number;
    status: 'OK' | 'Error';
    error?: string;
}
