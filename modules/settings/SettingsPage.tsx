import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import type { AppContextType, HubsoftConfig, OtherIntegration, SystemPreferences, NotificationPreferences } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { Table } from '../../components/common/Table';
import { PencilIcon, PlusCircleIcon, TrashIcon } from '../../constants';
import * as hubsoftService from '../../services/hubsoftService';
import { UserManagement } from './components/UserManagement';

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
  } = useContext(AppContext) as AppContextType;

  const [localHubsoftConfig, setLocalHubsoftConfig] = useState<HubsoftConfig>(hubsoftConfig);
  const [localPreferences, setLocalPreferences] = useState<SystemPreferences>(systemPreferences);
  const [localNotifications, setLocalNotifications] = useState<NotificationPreferences>(notificationPreferences);
  
  const [isTesting, setIsTesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [testResponse, setTestResponse] = useState<object | null>(null);


  const handleHubsoftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHubsoftConfig({ ...localHubsoftConfig, [e.target.name]: e.target.value });
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
    } catch (error: any) {
      setToast({ message: `Falha na conexão: ${error.message}`, type: 'error' });
      setTestResponse({ error: error.message });
    } finally {
      setIsTesting(false);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <Card title="Integração HubSoft API">
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary mb-6">
                Forneça as credenciais da sua conta HubSoft.
                </p>
                <div className="space-y-4">
                    <Input label="GraphQL API URL" id="graphqlUrl" name="graphqlUrl" value={localHubsoftConfig.graphqlUrl} onChange={handleHubsoftChange} placeholder="https://api.hubsoft.com.br/graphql/v1"/>
                    <Input label="REST API URL" id="restUrl" name="restUrl" value={localHubsoftConfig.restUrl} onChange={handleHubsoftChange} placeholder="https://api.hubsoft.com.br/api/v1/"/>
                    <Input label="ID da Empresa" id="companyId" name="companyId" value={localHubsoftConfig.companyId} onChange={handleHubsoftChange}/>
                    <Input label="Token de Autenticação" id="authToken" name="authToken" type="password" value={localHubsoftConfig.authToken} onChange={handleHubsoftChange}/>
                </div>
                {testResponse && <div className="mt-6"><JsonViewer data={testResponse} /></div>}
                <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={handleTestConnection} isLoading={isTesting}>Testar Conexão</Button>
                <Button onClick={handleSaveHubsoft}>Salvar</Button>
                </div>
            </Card>

            <Card title="Outras Integrações (SNMP, OLT, OTDR)" actions={<Button variant="secondary" onClick={addIntegration}><PlusCircleIcon className="w-5 h-5 mr-2"/>Adicionar</Button>}>
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
            <Card title="Preferências e Notificações">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-md font-semibold mb-3">Sistema</h4>
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
                    <div>
                        <h4 className="text-md font-semibold mb-3">Notificações</h4>
                        <div className="grid grid-cols-1 gap-6">
                             <div>
                                <span className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-2">Canais</span>
                                <div className="flex space-x-4">
                                <label className="flex items-center"><input type="checkbox" name="email" checked={localNotifications.email} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">E-mail</span></label>
                                <label className="flex items-center"><input type="checkbox" name="popup" checked={localNotifications.popup} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Popup</span></label>
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-2">Eventos</span>
                                <div className="flex flex-col space-y-2">
                                <label className="flex items-center"><input type="checkbox" name="failures" checked={localNotifications.events.failures} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Falhas</span></label>
                                <label className="flex items-center"><input type="checkbox" name="criticalPredictions" checked={localNotifications.events.criticalPredictions} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Previsões Críticas</span></label>
                                <label className="flex items-center"><input type="checkbox" name="disconnections" checked={localNotifications.events.disconnections} onChange={handleNotificationChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Desconexões</span></label>
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
