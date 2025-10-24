import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import * as hubsoftService from '../services/hubsoftService';
import type { AppContextType, Client, PaginatorInfo, ServiceOrder, SyncLog, ApiResponse } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { Table, Pagination } from '../components/common/Table';
import Toast from '../components/common/Toast';
import { Input } from '../components/common/Input';

type DataSet = 'hubsoft_clients' | 'hubsoft_service_orders' | 'snmp_devices';

const JsonViewer: React.FC<{ data: object | null }> = ({ data }) => {
    if (!data) return null;
    return (
        <Card title="Resposta JSON Bruta" className="mt-4">
            <pre className="bg-slate-800 text-slate-200 p-4 rounded-md text-sm whitespace-pre-wrap break-all h-64 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </Card>
    );
};

const ApiReturnsPage: React.FC = () => {
  const { hubsoftConfig } = useContext(AppContext) as AppContextType;
  const [activeDataSet, setActiveDataSet] = useState<DataSet>('hubsoft_clients');
  const [tableData, setTableData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<object | null>(null);
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [syncLog, setSyncLog] = useState<SyncLog | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    if (!hubsoftConfig.graphqlUrl) {
      setToast({ message: "Por favor, configure a API da HubSoft na página de Configurações.", type: 'error' });
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    try {
      let response: ApiResponse<any>;
      if (activeDataSet === 'hubsoft_clients') {
        response = await hubsoftService.fetchClients(hubsoftConfig, page);
      } else if (activeDataSet === 'hubsoft_service_orders') {
        response = await hubsoftService.fetchServiceOrders(hubsoftConfig, page);
      } else {
        // Mock for other data sources
        response = { data: [], paginatorInfo: { currentPage: 1, lastPage: 1, total: 0 } };
        setToast({ message: "Fonte de dados SNMP ainda não implementada.", type: 'error' });
      }

      setTableData(response.data);
      setRawData(response); // Store the whole response as raw data
      setPaginatorInfo(response.paginatorInfo);
      setSyncLog({ timestamp: new Date(), responseTime: Date.now() - startTime, status: 'OK', httpStatus: 200 });

    } catch (error: any) {
      setToast({ message: `Erro ao buscar dados: ${error.message}`, type: 'error' });
      setSyncLog({ timestamp: new Date(), responseTime: Date.now() - startTime, status: 'Error', httpStatus: 500, error: error.message });
      setTableData([]);
      setRawData({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [activeDataSet, hubsoftConfig]);

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDataSet, hubsoftConfig.graphqlUrl]); // re-fetch if config changes

  const onPageChange = (page: number) => {
    fetchData(page);
  };
  
  const clientColumns = [
    { key: 'codigo_cliente', header: 'Código' },
    { key: 'nome_razaosocial', header: 'Nome / Razão Social' },
    { key: 'cpf_cnpj', header: 'CPF/CNPJ' },
    { key: 'status', header: 'Status', render: (item: Client) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
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

  const getColumns = () => {
      switch(activeDataSet) {
          case 'hubsoft_clients': return clientColumns;
          case 'hubsoft_service_orders': return serviceOrderColumns;
          default: return [];
      }
  }

  const renderSyncLog = () => {
    if (!syncLog) return null;
    const isOk = syncLog.status === 'OK';
    const colorClasses = isOk 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    
    return (
      <span className={`p-2 rounded-md text-xs sm:text-sm ${colorClasses}`}>
        Última Sincronização: {syncLog.timestamp.toLocaleTimeString()} ({syncLog.status} {syncLog.httpStatus}) - {syncLog.responseTime}ms
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">APIs e Retornos</h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
           {renderSyncLog()}
            <Button variant="secondary" onClick={() => fetchData(1)} isLoading={isLoading}>Atualizar Agora</Button>
        </div>
      </div>

      <Card>
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
          <button onClick={() => setActiveDataSet('hubsoft_clients')} className={`px-4 py-2 font-medium text-sm ${activeDataSet === 'hubsoft_clients' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-slate-500'}`}>Hubsoft: Clientes</button>
          <button onClick={() => setActiveDataSet('hubsoft_service_orders')} className={`px-4 py-2 font-medium text-sm ${activeDataSet === 'hubsoft_service_orders' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-slate-500'}`}>Hubsoft: Ordens de Serviço</button>
          <button onClick={() => setActiveDataSet('snmp_devices')} className={`px-4 py-2 font-medium text-sm ${activeDataSet === 'snmp_devices' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-slate-500'}`}>SNMP: Dispositivos</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input label="Filtrar por data" id="date-filter" type="date" />
            <Input label="Filtrar por cliente" id="client-filter" />
            <Input label="Filtrar por OLT" id="olt-filter" />
            <Input label="Filtrar por status" id="status-filter" />
        </div>
        
        {isLoading ? <Spinner /> : (
          <>
            <h3 className="text-lg font-semibold mb-2">Dados Processados</h3>
            <Table 
              columns={getColumns()}
              data={tableData}
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

      {!isLoading && <JsonViewer data={rawData} />}
    </div>
  );
};

export default ApiReturnsPage;