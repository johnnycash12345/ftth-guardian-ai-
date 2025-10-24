
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import type { AppContextType, HubsoftConfig, OtherIntegration, SystemPreferences } from '../types';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import Toast from '../components/common/Toast';
import { Table } from '../components/common/Table';
import { PencilIcon, PlusCircleIcon, TrashIcon } from '../constants';
import * as hubsoftService from '../services/hubsoftService';

const SettingsPage: React.FC = () => {
  const { 
    hubsoftConfig, setHubsoftConfig, 
    otherIntegrations, setOtherIntegrations, 
    systemPreferences, setSystemPreferences 
  } = useContext(AppContext) as AppContextType;

  const [localHubsoftConfig, setLocalHubsoftConfig] = useState<HubsoftConfig>(hubsoftConfig);
  const [localPreferences, setLocalPreferences] = useState<SystemPreferences>(systemPreferences);
  const [isTesting, setIsTesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleHubsoftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHubsoftConfig({ ...localHubsoftConfig, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalPreferences({ ...localPreferences, [e.target.name]: e.target.value });
  };
  
  const handleSaveHubsoft = () => {
    setHubsoftConfig(localHubsoftConfig);
    setToast({ message: 'Configurações da HubSoft salvas!', type: 'success' });
  };

  const handleSavePreferences = () => {
    setSystemPreferences(localPreferences);
    setToast({ message: 'Preferências salvas!', type: 'success' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await hubsoftService.testConnection(localHubsoftConfig);
      setToast({ message: 'Conexão com a HubSoft bem-sucedida!', type: 'success' });
    } catch (error: any) {
      setToast({ message: `Falha na conexão: ${error.message}`, type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const addIntegration = () => {
    const newIntegration: OtherIntegration = {
      id: new Date().toISOString(),
      name: 'Nova Integração',
      url: '',
      type: 'REST',
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
      
      <Card title="Integração HubSoft API">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Host / URL Base" id="host" name="host" value={localHubsoftConfig.host} onChange={handleHubsoftChange} placeholder="https://api.hubsoft.com.br"/>
          <Input label="Client ID" id="clientId" name="clientId" value={localHubsoftConfig.clientId} onChange={handleHubsoftChange}/>
          <Input label="Client Secret" id="clientSecret" name="clientSecret" type="password" value={localHubsoftConfig.clientSecret} onChange={handleHubsoftChange}/>
          <Input label="Username" id="username" name="username" value={localHubsoftConfig.username} onChange={handleHubsoftChange}/>
          <Input label="Password" id="password" name="password" type="password" value={localHubsoftConfig.password || ''} onChange={handleHubsoftChange}/>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleTestConnection} isLoading={isTesting}>Testar Conexão</Button>
          <Button onClick={handleSaveHubsoft}>Salvar</Button>
        </div>
      </Card>
      
      <Card title="Outras Integrações" actions={<Button variant="secondary" onClick={addIntegration}><PlusCircleIcon className="w-5 h-5 mr-2"/>Adicionar</Button>}>
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

      <Card title="Preferências do Sistema">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <option value="60">60</option>
                    <option value="300">300</option>
                    <option value="600">600</option>
                </select>
            </div>
            <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">Formato de Hora</label>
                <select id="timeFormat" name="timeFormat" value={localPreferences.timeFormat} onChange={handlePreferencesChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition">
                    <option value="24h">24 Horas</option>
                    <option value="12h">12 Horas (AM/PM)</option>
                </select>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePreferences}>Salvar Preferências</Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
