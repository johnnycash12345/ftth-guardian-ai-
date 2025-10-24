
import type { HubsoftConfig, ClientsApiResponse, Client, ServiceOrdersApiResponse, ServiceOrder } from '../types';

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


// --- MOCK SERVICE FUNCTIONS ---

const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

export const testConnection = async (config: HubsoftConfig): Promise<{ success: boolean }> => {
  await simulateNetworkDelay(1000);
  if (config.host && config.clientId && config.clientSecret && config.username) {
    if (config.clientSecret === 'fail') {
        throw new Error("Credenciais inválidas.");
    }
    return { success: true };
  } else {
    throw new Error("Parâmetros de conexão ausentes.");
  }
};

const paginate = <T,>(items: T[], page: number, perPage: number): { data: T[], paginatorInfo: { currentPage: number, lastPage: number, total: number }} => {
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

export const fetchClients = async (config: HubsoftConfig, page = 1): Promise<ClientsApiResponse> => {
    await simulateNetworkDelay();
    if (!config.host) {
        throw new Error("Host da API não configurado.");
    }
    const paginated = paginate(MOCK_CLIENTS, page, 10);
    
    return {
        data: paginated.data,
        paginatorInfo: paginated.paginatorInfo,
    };
};

export const fetchServiceOrders = async (config: HubsoftConfig, page = 1): Promise<ServiceOrdersApiResponse> => {
    await simulateNetworkDelay();
    if (!config.host) {
        throw new Error("Host da API não configurado.");
    }
    const paginated = paginate(MOCK_SERVICE_ORDERS, page, 10);

    return {
        data: paginated.data,
        paginatorInfo: paginated.paginatorInfo,
    };
};
