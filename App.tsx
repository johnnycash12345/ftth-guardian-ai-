
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import SettingsPage from './pages/SettingsPage';
import VisualizationPage from './pages/VisualizationPage';
import { Page, AppContextType } from './types';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HubsoftConfig, OtherIntegration, SystemPreferences } from './types';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('visualization');
  const [theme, setTheme] = useTheme();
  
  const [hubsoftConfig, setHubsoftConfig] = useLocalStorage<HubsoftConfig>('hubsoftConfig', {
    host: '',
    clientId: '',
    clientSecret: '',
    username: '',
    password: '',
  });

  const [otherIntegrations, setOtherIntegrations] = useLocalStorage<OtherIntegration[]>('otherIntegrations', []);
  const [systemPreferences, setSystemPreferences] = useLocalStorage<SystemPreferences>('systemPreferences', {
    language: 'pt',
    refreshInterval: 300,
    timeFormat: '24h',
  });

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    hubsoftConfig,
    setHubsoftConfig,
    otherIntegrations,
    setOtherIntegrations,
    systemPreferences,
    setSystemPreferences,
  }), [theme, setTheme, hubsoftConfig, setHubsoftConfig, otherIntegrations, setOtherIntegrations, systemPreferences, setSystemPreferences]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`${theme} font-sans`}>
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'visualization' && <VisualizationPage />}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
