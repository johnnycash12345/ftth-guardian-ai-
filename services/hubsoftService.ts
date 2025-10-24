import type { HubsoftConfig, ApiResponse, Client, ServiceOrder, ModelMetrics, Prediction, FeatureImportance, PredictionHistory } from '../types';

// --- MOCK DATA ---
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
    version: 'v1.2.3',
    algorithm: 'XGBoost',
    accuracy: 0.93,
    f1Score: 0.88,
    rocAuc: 0.96,
    trainingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
}

const MOCK_PREDICTIONS: Prediction[] = [
    { id: 'ONU-1', entity: 'ONU ABC-123 (Zona Sul)', riskPercentage: 82, timeframe: '48h', details: 'Degradação de potência óptica.' },
    { id: 'ONU-2', entity: 'Cliente 1024 (Centro)', riskPercentage: 65, timeframe: '72h', details: 'Aumento de latência.' },
    { id: 'ONU-3', entity: 'ONU DEF-456 (Zona Norte)', riskPercentage: 40, timeframe: '24h', details: 'Flapping de porta.' },
    { id: 'ONU-4', entity: 'Cliente 1055 (Zona Leste)', riskPercentage: 15, timeframe: '48h', details: 'Histórico de falhas recorrente.' },
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