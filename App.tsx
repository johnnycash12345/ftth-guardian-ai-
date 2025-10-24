import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import SettingsPage from './pages/SettingsPage';
import ApiReturnsPage from './pages/ApiReturnsPage';
import PredictiveIntelligencePage from './pages/PredictiveIntelligencePage';
import ReportsPage from './pages/ReportsPage';
import { Page, AppContextType } from './types';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HubsoftConfig, OtherIntegration, SystemPreferences, NotificationPreferences } from './types';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('predictive_intelligence');
  const [theme, setTheme] = useTheme();
  
  const [hubsoftConfig, setHubsoftConfig] = useLocalStorage<HubsoftConfig>('hubsoftConfig', {
    graphqlUrl: 'https://api.hubsoft.com.br/graphql/v1',
    restUrl: 'https://api.hubsoft.com.br/api/v1/',
    authToken: '',
    companyId: '',
  });

  const [otherIntegrations, setOtherIntegrations] = useLocalStorage<OtherIntegration[]>('otherIntegrations', []);
  
  const [systemPreferences, setSystemPreferences] = useLocalStorage<SystemPreferences>('systemPreferences', {
    language: 'pt',
    refreshInterval: 300,
    timeFormat: '24h',
  });

  const [notificationPreferences, setNotificationPreferences] = useLocalStorage<NotificationPreferences>('notificationPreferences', {
    email: true,
    popup: true,
    events: {
      failures: true,
      criticalPredictions: true,
      disconnections: false,
    },
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
    notificationPreferences,
    setNotificationPreferences,
  }), [
    theme, setTheme, 
    hubsoftConfig, setHubsoftConfig, 
    otherIntegrations, setOtherIntegrations, 
    systemPreferences, setSystemPreferences,
    notificationPreferences, setNotificationPreferences
  ]);

  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage />;
      case 'api_returns':
        return <ApiReturnsPage />;
      case 'predictive_intelligence':
        return <PredictiveIntelligencePage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <PredictiveIntelligencePage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`${theme} font-sans`}>
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;