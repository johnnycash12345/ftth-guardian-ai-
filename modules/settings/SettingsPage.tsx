import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import type { AppContextType, HubsoftConfig, OtherIntegration, SystemPreferences, NotificationPreferences, SimulatorConfig } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { Table } from '../../components/common/Table';
import { PencilIcon, PlusCircleIcon, TrashIcon } from '../../constants';
import * as hubsoftService from '../../services/hubsoftService';
import { UserManagement } from './components/UserManagement';
import { handleError } from '../../utils/errorHandler';

const JsonViewer: React.FC<{ data: object }> = ({ data }) => (
    <pre className="bg-slate-800 text-slate-200 p-4 rounded-md text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
    </pre>
);

const SettingsPage: React.FC = () => {
  const { 
    hubsoftConfig, setHubsoftConfig, 
    otherIntegrations, setOtherIntegrations, 
    systemPreferences, setSystemPreferences,
    notificationPreferences, setNotificationPreferences,
    simulatorConfig, setSimulatorConfig
  } = useContext(AppContext) as AppContextType;

  const [localHubsoftConfig, setLocalHubsoftConfig] = useState<HubsoftConfig>(hubsoftConfig);
  const [localPreferences, setLocalPreferences] = useState<SystemPreferences>(systemPreferences);
  const [localNotifications, setLocalNotifications] = useState<NotificationPreferences>(notificationPreferences);
  const [localSimulatorConfig, setLocalSimulatorConfig] = useState<SimulatorConfig>(simulatorConfig);
  
  const [isTesting, setIsTesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [testResponse, setTestResponse] = useState<object | null>(null);
  const [isTestingSimulator, setIsTestingSimulator] = useState(false);
  const [simulatorTestResponse, setSimulatorTestResponse] = useState<object | null>(null);


  const handleHubsoftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHubsoftConfig({ ...localHubsoftConfig, [e.target.name]: e.target.value });
  };
  
  const handleSimulatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSimulatorConfig({ ...localSimulatorConfig, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.name === 'refreshInterval' ? parseInt(e.target.value, 10) : e.target.value;
    setLocalPreferences({ ...localPreferences, [e.target.name]: value as any });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name in localNotifications.events) {
       setLocalNotifications(prev => ({...prev, events: {...prev.events, [name]: checked }}));
    } else {
       setLocalNotifications(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const handleSaveHubsoft = () => {
    setHubsoftConfig(localHubsoftConfig);
    setToast({ message: 'Configurações da HubSoft salvas!', type: 'success' });
  };

  const handleSaveSimulator = () => {
    setSimulatorConfig(localSimulatorConfig);
    setToast({ message: 'Configurações do Simulador salvas!', type: 'success' });
  };

  const handleSavePreferences = () => {
    setSystemPreferences(localPreferences);
    setNotificationPreferences(localNotifications);
    setToast({ message: 'Preferências salvas!', type: 'success' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const response = await hubsoftService.testConnection(localHubsoftConfig);
      setToast({ message: 'Conexão com a HubSoft bem-sucedida!', type: 'success' });
      setTestResponse(response.data);
    } catch (error) {
      const userMessage = handleError(error);
      setToast({ message: userMessage, type: 'error' });
      setTestResponse({ error: userMessage, details: (error as any).technicalDetails });
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleTestSimulatorConnection = async () => {
    setIsTestingSimulator(true);
    setSimulatorTestResponse(null);
    try {
        const response = await hubsoftService.testSimulatorConnection(localSimulatorConfig);
        setToast({ message: 'Conexão com o Simulador bem-sucedida!', type: 'success' });
        setSimulatorTestResponse(response.data);
    } catch (error) {
        const userMessage = handleError(error);
        setToast({ message: userMessage, type: 'error' });
        setSimulatorTestResponse({ error: userMessage, details: (error as any).technicalDetails });
    } finally {
        setIsTestingSimulator(false);
    }
  };

  const addIntegration = () => {
    const newIntegration: OtherIntegration = {
      id: new Date().toISOString(),
      name: 'Nova Integração',
      url: '',
      type: 'SNMP',
      token: ''
    };
    setOtherIntegrations([...otherIntegrations, newIntegration]);
  };

  const deleteIntegration = (id: string) => {
    setOtherIntegrations(otherIntegrations.filter(i => i.id !== id));
  };
  
  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-bold">Configurações</h1>
      <p className="text-text-light-secondary dark:text-dark-secondary -mt-6">
        Gerencie as integrações, preferências e usuários do sistema.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <Card title="Integrações Principais" subtitle="Configure as fontes de dados primárias.">
                <div className="space-y-8">
                    <div>
                        <h4 className="font-semibold text-lg">HubSoft API</h4>
                        <p className="text-sm text-text-light-secondary dark:text-dark-secondary mb-4">Credenciais para acesso à API da Hubsoft.</p>
                        <div className="space-y-4">
                            <Input label="GraphQL API URL" id="graphqlUrl" name="graphqlUrl" value={localHubsoftConfig.graphqlUrl} onChange={handleHubsoftChange} placeholder="https://api.hubsoft.com.br/graphql/v1"/>
                            <Input label="REST API URL" id="restUrl" name="restUrl" value={localHubsoftConfig.restUrl} onChange={handleHubsoftChange} placeholder="https://api.hubsoft.com.br/api/v1/"/>
                            <Input label="ID da Empresa" id="companyId" name="companyId" value={localHubsoftConfig.companyId} onChange={handleHubsoftChange}/>
                            <Input label="Token de Autenticação" id="authToken" name="authToken" type="password" value={localHubsoftConfig.authToken} onChange={handleHubsoftChange}/>
                        </div>
                        {testResponse && <div className="mt-6"><JsonViewer data={testResponse} /></div>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={handleTestConnection} isLoading={isTesting}>Testar</Button>
                            <Button onClick={handleSaveHubsoft}>Salvar</Button>
                        </div>
                    </div>
                     <hr className="border-slate-200 dark:border-slate-700" />
                    <div>
                        <h4 className="font-semibold text-lg">FTTH Data Simulator</h4>
                        <p className="text-sm text-text-light-secondary dark:text-dark-secondary mb-4">Conecte o Guardian ao simulador para o aprendizado contínuo.</p>
                        <div className="space-y-4">
                            <Input label="URL do FTTH Data Simulator" id="sim-url" name="url" value={localSimulatorConfig.url} onChange={handleSimulatorChange} />
                            <Input label="API Key do Data Simulator" id="sim-apiKey" name="apiKey" type="password" value={localSimulatorConfig.apiKey} onChange={handleSimulatorChange} />
                        </div>
                        {simulatorTestResponse && <div className="mt-6"><JsonViewer data={simulatorTestResponse} /></div>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={handleTestSimulatorConnection} isLoading={isTestingSimulator}>Testar</Button>
                            <Button onClick={handleSaveSimulator}>Salvar</Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Outras Integrações" subtitle="Adicione fontes de dados secundárias (SNMP, OLT, etc)." actions={<Button variant="secondary" onClick={addIntegration}><PlusCircleIcon className="w-5 h-5 mr-2"/>Adicionar</Button>}>
                <Table<OtherIntegration>
                    columns={[
                        { key: 'name', header: 'Nome' },
                        { key: 'type', header: 'Tipo' },
                        { key: 'url', header: 'URL' },
                    ]}
                    data={otherIntegrations}
                    renderActions={(item) => (
                        <div className="flex space-x-2">
                            <button className="text-primary-500 hover:text-primary-700"><PencilIcon /></button>
                            <button onClick={() => deleteIntegration(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                    )}
                />
            </Card>
        </div>

        <div className="space-y-8">
            <Card title="Preferências do Sistema" subtitle="Ajuste o comportamento da interface e notificações.">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-md font-semibold mb-3">Interface</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">Idioma</label>
                                <select id="language" name="language" value={localPreferences.language} onChange={handlePreferencesChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition">
                                    <option value="pt">Português</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="refreshInterval" className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">Intervalo de Atualização (segundos)</label>
                                <select id="refreshInterval" name="refreshInterval" value={localPreferences.refreshInterval} onChange={handlePreferencesChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition">
                                    <option value="5">5 (Real-time)</option>
                                    <option value="60">60</option>
                                    <option value="300">300</option>
                                </select>
                            </div>
                        </div>
                    </div>
                     <hr className="border-slate-200 dark:border-slate-700" />
                    <div>
                        <h4 className="text-md font-semibold mb-3">Notificações</h4>
                        <div className="grid grid-cols-1 gap-6">
                             <div>
                                <span className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-2">Canais de Alerta</span>
                                <div className="flex space-x-4">
                                <label className="flex items-center"><input type="checkbox" name="email" checked={localNotifications.email} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">E-mail</span></label>
                                <label className="flex items-center"><input type="checkbox" name="popup" checked={localNotifications.popup} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Popup na Tela</span></label>
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-2">Eventos para Notificar</span>
                                <div className="flex flex-col space-y-2">
                                <label className="flex items-center"><input type="checkbox" name="failures" checked={localNotifications.events.failures} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Falhas Confirmadas</span></label>
                                <label className="flex items-center"><input type="checkbox" name="criticalPredictions" checked={localNotifications.events.criticalPredictions} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Previsões Críticas (Risco > 80%)</span></label>
                                <label className="flex items-center"><input type="checkbox" name="disconnections" checked={localNotifications.events.disconnections} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Desconexões de Equipamentos</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSavePreferences}>Salvar Preferências</Button>
                </div>
            </Card>

             <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;