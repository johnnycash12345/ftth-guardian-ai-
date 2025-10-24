
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AppContext } from '../App';
import * as hubsoftService from '../services/hubsoftService';
import type { AppContextType, Client, PaginatorInfo, ServiceOrder, SyncLog } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { Table, Pagination } from '../components/common/Table';
import { UserGroupIcon, WrenchScrewdriverIcon } from '../constants';
import Toast from '../components/common/Toast';

type DataSet = 'clients' | 'service_orders';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </Card>
);

const VisualizationPage: React.FC = () => {
  const { hubsoftConfig } = useContext(AppContext) as AppContextType;
  const [activeDataSet, setActiveDataSet] = useState<DataSet>('clients');
  const [data, setData] = useState<Client[] | ServiceOrder[]>([]);
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [syncLog, setSyncLog] = useState<SyncLog | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    if (!hubsoftConfig.host) {
      setToast({ message: "Por favor, configure a API da HubSoft na página de Configurações.", type: 'error' });
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    try {
      if (activeDataSet === 'clients') {
        const response = await hubsoftService.fetchClients(hubsoftConfig, page);
        setData(response.data);
        setPaginatorInfo(response.paginatorInfo);
      } else if (activeDataSet === 'service_orders') {
        const response = await hubsoftService.fetchServiceOrders(hubsoftConfig, page);
        setData(response.data);
        setPaginatorInfo(response.paginatorInfo);
      }
      setSyncLog({ timestamp: new Date(), responseTime: Date.now() - startTime, status: 'OK' });
    } catch (error: any) {
      setToast({ message: `Erro ao buscar dados: ${error.message}`, type: 'error' });
      setSyncLog({ timestamp: new Date(), responseTime: Date.now() - startTime, status: 'Error', error: error.message });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeDataSet, hubsoftConfig]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDataSet, hubsoftConfig]);

  const onPageChange = (page: number) => {
    fetchData(page);
  };
  
  const clientColumns = [
    { key: 'codigo_cliente', header: 'Código' },
    { key: 'nome_razaosocial', header: 'Nome / Razão Social' },
    { key: 'cpf_cnpj', header: 'CPF/CNPJ' },
    { key: 'status', header: 'Status', render: (item: Client) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {item.status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    )},
  ];

  const serviceOrderColumns = [
      { key: 'protocol', header: 'Protocolo' },
      { key: 'client_name', header: 'Cliente' },
      { key: 'service', header: 'Serviço' },
      { key: 'creation_date', header: 'Data Criação' },
      { key: 'status', header: 'Status' },
  ];

  const chartData = [
    { name: 'Jan', Clientes: 40, 'O.S.': 24 },
    { name: 'Fev', Clientes: 30, 'O.S.': 13 },
    { name: 'Mar', Clientes: 20, 'O.S.': 98 },
    { name: 'Abr', Clientes: 27, 'O.S.': 39 },
    { name: 'Mai', Clientes: 18, 'O.S.': 48 },
    { name: 'Jun', Clientes: 23, 'O.S.': 38 },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Visualização de Dados</h1>
        <div className="flex items-center space-x-2">
           <div className="text-sm">
             {syncLog && (
              <span className={`p-2 rounded-md ${syncLog.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Última Sincronização: {syncLog.timestamp.toLocaleTimeString()} ({syncLog.status}) - {syncLog.responseTime}ms
              </span>
             )}
            </div>
            <Button variant="secondary" onClick={() => fetchData(1)} isLoading={isLoading}>Atualizar Agora</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clientes Ativos" value="1,234" icon={<UserGroupIcon className="w-8 h-8 text-blue-800"/>} color="bg-blue-200" />
        <StatCard title="O.S. Abertas" value="56" icon={<WrenchScrewdriverIcon className="w-8 h-8 text-orange-800"/>} color="bg-orange-200" />
        <StatCard title="Falhas Registradas" value="8" icon={<UserGroupIcon className="w-8 h-8 text-red-800"/>} color="bg-red-200" />
        <StatCard title="Ticket Médio" value="R$ 120,50" icon={<UserGroupIcon className="w-8 h-8 text-green-800"/>} color="bg-green-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Crescimento Mensal" className="lg:col-span-2">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700"/>
                        <XAxis dataKey="name" className="text-xs"/>
                        <YAxis className="text-xs"/>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="Clientes" fill="#3b82f6" />
                        <Bar dataKey="O.S." fill="#fb923c" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card title="Log de Sincronização">
            {syncLog ? (
                <ul className="space-y-2 text-sm">
                    <li><strong>Status:</strong> <span className={syncLog.status === 'OK' ? 'text-green-500' : 'text-red-500'}>{syncLog.status}</span></li>
                    <li><strong>Horário:</strong> {syncLog.timestamp.toLocaleString()}</li>
                    <li><strong>Tempo de Resposta:</strong> {syncLog.responseTime} ms</li>
                    {syncLog.error && <li className="text-red-400"><strong>Erro:</strong> {syncLog.error}</li>}
                </ul>
            ) : <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Nenhuma sincronização realizada ainda.</p>}
        </Card>
      </div>
      
      <Card>
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
          <button onClick={() => setActiveDataSet('clients')} className={`px-4 py-2 font-medium text-sm ${activeDataSet === 'clients' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-slate-500'}`}>Clientes</button>
          <button onClick={() => setActiveDataSet('service_orders')} className={`px-4 py-2 font-medium text-sm ${activeDataSet === 'service_orders' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-slate-500'}`}>Ordens de Serviço</button>
        </div>
        
        {isLoading ? <Spinner /> : (
          <>
            <Table 
              columns={activeDataSet === 'clients' ? clientColumns : serviceOrderColumns}
              data={data as any} 
            />
            <Pagination 
              currentPage={paginatorInfo.currentPage}
              lastPage={paginatorInfo.lastPage}
              total={paginatorInfo.total}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default VisualizationPage;
