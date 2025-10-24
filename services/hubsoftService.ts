import type { HubsoftConfig, ApiResponse, Client, ServiceOrder, ModelMetrics, Prediction, FeatureImportance, PredictionHistory, User, Role, TelemetryDataPoint, Alert, ShapValues, DriftDataPoint, ReportHistory } from '../types';

// --- MOCK DATA ---
export const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@ftth-guardian.ai', role: 'Admin', lastLogin: new Date().toISOString() },
    { id: '2', name: 'Operator One', email: 'op1@ftth-guardian.ai', role: 'Operator', lastLogin: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: '3', name: 'Executive Viewer', email: 'exec@ftth-guardian.ai', role: 'Executive', lastLogin: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
];

const MOCK_CLIENTS: Client[] = Array.from({ length: 50 }, (_, i) => ({
  id_cliente: 1000 + i,
  codigo_cliente: `C${1000 + i}`,
  nome_razaosocial: `Cliente Fictício ${i + 1}`,
  cpf_cnpj: `000.000.000-${String(i).padStart(2, '0')}`,
  status: i % 10 === 0 ? 'inactive' : 'active',
}));

const MOCK_SERVICE_ORDERS: ServiceOrder[] = Array.from({ length: 30 }, (_, i) => ({
    id: 5000 + i,
    protocol: `OS2023${5000 + i}`,
    client_name: `Cliente Fictício ${i + 3}`,
    service: i % 2 === 0 ? 'Instalação Fibra' : 'Manutenção de Rede',
    status: ['open', 'in_progress', 'closed', 'canceled'][i % 4] as 'open' | 'in_progress' | 'closed' | 'canceled',
    creation_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
}));

const MOCK_MODEL_METRICS: ModelMetrics = {
    version: 'v2.0.1-prod',
    algorithm: 'XGBoost',
    accuracy: 0.94,
    f1Score: 0.89,
    rocAuc: 0.97,
    trainingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
}

const generateShapValues = (risk: number): ShapValues => {
    const base = 25; // Base risk percentage
    const diff = risk - base;
    const c1 = Math.random() * diff * 0.8;
    const c2 = Math.random() * diff * 0.4;
    const c3 = diff - c1 - c2;
    return {
        baseValue: base,
        finalPrediction: risk,
        contributions: [
            { feature: 'potencia_media_sinal', value: -25.5, contribution: c1 },
            { feature: 'variacao_latencia_24h', value: '15ms', contribution: c2 },
            { feature: 'n_desconexoes_semana', value: 3, contribution: c3 },
            { feature: 'idade_contrato_meses', value: 24, contribution: Math.random() * -5 },
        ]
    }
}

const MOCK_PREDICTIONS: Prediction[] = [
    { id: 'ONU-1', entity: 'ONU ABC-123 (Zona Sul)', riskPercentage: 82, timeframe: '48h', details: 'Degradação de potência óptica.', shapValues: generateShapValues(82) },
    { id: 'ONU-2', entity: 'Cliente 1024 (Centro)', riskPercentage: 65, timeframe: '72h', details: 'Aumento de latência.', shapValues: generateShapValues(65) },
    { id: 'ONU-3', entity: 'ONU DEF-456 (Zona Norte)', riskPercentage: 40, timeframe: '24h', details: 'Flapping de porta.', shapValues: generateShapValues(40) },
    { id: 'ONU-4', entity: 'Cliente 1055 (Zona Leste)', riskPercentage: 15, timeframe: '48h', details: 'Histórico de falhas recorrente.', shapValues: generateShapValues(15) },
];

const MOCK_FEATURE_IMPORTANCE: FeatureImportance[] = [
    { feature: 'potencia_media_sinal', importance: 0.45 },
    { feature: 'variacao_latencia_24h', importance: 0.25 },
    { feature: 'n_desconexoes_semana', importance: 0.15 },
    { feature: 'idade_contrato_meses', importance: 0.10 },
    { feature: 'n_ordens_servico_90d', importance: 0.05 },
];

const MOCK_PREDICTION_HISTORY: PredictionHistory[] = Array.from({length: 30}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    const predicted = 5 + Math.round(Math.random() * 5);
    const actual = predicted - Math.round(Math.random() * 3 - 1);
    return {
        date: date.toISOString().split('T')[0],
        predicted,
        actual: Math.max(0, actual),
    }
});

const MOCK_ALERTS: Alert[] = [
    { id: 'a1', severity: 'critical', message: 'Previsão de falha crítica (82%) para ONU ABC-123.', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), entity: 'ONU ABC-123' },
    { id: 'a2', severity: 'warning', message: 'Data Drift detectado no feature `potencia_media_sinal`.', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), entity: 'ML Model v2.0.1' },
    { id: 'a3', severity: 'info', message: 'Retreinamento do modelo concluído com sucesso.', timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), entity: 'MLOps Pipeline' },
];

const MOCK_DRIFT_DATA: DriftDataPoint[] = Array.from({length: 30}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
        date: date.toISOString().split('T')[0],
        value: 0.95 - (i > 20 ? (i-20) * 0.015 : 0) - Math.random() * 0.02,
        baseline: 0.94
    }
});

const MOCK_REPORT_HISTORY: ReportHistory[] = [
    { id: 'r1', type: 'Operacional', generatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), generatedBy: 'Admin User', filters: 'Período: Últimas 24h'},
    { id: 'r2', type: 'Machine Learning', generatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), generatedBy: 'MLOps Pipeline', filters: 'Modelo: v2.0.1'},
];

// --- MOCK SERVICE FUNCTIONS ---

const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

export const testConnection = async (config: HubsoftConfig): Promise<{ success: boolean; data: any }> => {
  await simulateNetworkDelay(1000);
  if (config.graphqlUrl && config.authToken && config.companyId) {
    if (config.authToken === 'fail') {
        throw new Error("Token de autenticação inválido.");
    }
    return { success: true, data: { id: config.companyId, nome_empresa: "Minha Empresa FTTH", status: "ATIVA"} };
  } else {
    throw new Error("Parâmetros de conexão ausentes.");
  }
};

const paginate = <T,>(items: T[], page: number, perPage: number): ApiResponse<T> => {
    const total = items.length;
    const lastPage = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const data = items.slice(offset, offset + perPage);
    return {
        data,
        paginatorInfo: {
            currentPage: page,
            lastPage,
            total,
        }
    }
};

export const fetchClients = async (config: HubsoftConfig, page = 1): Promise<ApiResponse<Client>> => {
    await simulateNetworkDelay();
    if (!config.graphqlUrl) {
        throw new Error("URL GraphQL da API não configurada.");
    }
    return paginate(MOCK_CLIENTS, page, 10);
};

export const fetchServiceOrders = async (config: HubsoftConfig, page = 1): Promise<ApiResponse<ServiceOrder>> => {
    await simulateNetworkDelay();
     if (!config.graphqlUrl) {
        throw new Error("URL GraphQL da API não configurada.");
    }
    return paginate(MOCK_SERVICE_ORDERS, page, 10);
};

// --- ML Service Mocks ---

export const fetchModelMetrics = async (): Promise<ModelMetrics> => {
    await simulateNetworkDelay(300);
    return MOCK_MODEL_METRICS;
}

export const fetchPredictions = async (): Promise<Prediction[]> => {
    await simulateNetworkDelay(800);
    return MOCK_PREDICTIONS;
}

export const fetchFeatureImportance = async (): Promise<FeatureImportance[]> => {
    await simulateNetworkDelay(400);
    return MOCK_FEATURE_IMPORTANCE;
}

export const fetchPredictionHistory = async (): Promise<PredictionHistory[]> => {
    await simulateNetworkDelay(600);
    return MOCK_PREDICTION_HISTORY;
}

// --- New Service Mocks ---
export const fetchRealTimeTelemetry = async (): Promise<TelemetryDataPoint> => {
    // No delay, should be fast for real-time simulation
    const now = new Date();
    return {
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
        opticalPower: -20 - Math.random() * 5,
        latency: 10 + Math.random() * 15,
        disconnections: Math.random() > 0.99 ? 1 : 0
    };
};

export const fetchAlerts = async (): Promise<Alert[]> => {
    await simulateNetworkDelay(200);
    return MOCK_ALERTS;
}

export const fetchModelDrift = async (): Promise<DriftDataPoint[]> => {
    await simulateNetworkDelay(500);
    return MOCK_DRIFT_DATA;
}
export const fetchDataDrift = async (): Promise<DriftDataPoint[]> => {
    await simulateNetworkDelay(500);
    return MOCK_DRIFT_DATA.map(d => ({...d, value: d.value - 0.1, baseline: 0.85})).reverse();
}

export const fetchReportHistory = async (): Promise<ReportHistory[]> => {
    await simulateNetworkDelay(300);
    return MOCK_REPORT_HISTORY;
}
