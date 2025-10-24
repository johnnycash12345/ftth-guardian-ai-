import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import SettingsPage from './modules/settings/SettingsPage';
import ApiReturnsPage from './modules/api_returns/ApiReturnsPage';
import PredictiveIntelligencePage from './modules/predictive_intelligence/PredictiveIntelligencePage';
import ReportsPage from './modules/reports/ReportsPage';
import MonitoringDashboard from './modules/monitoring/MonitoringDashboard';
import { Page, AppContextType, User, Role, SimulatorConfig, FeedbackLoopStatus } from './types';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HubsoftConfig, OtherIntegration, SystemPreferences, NotificationPreferences } from './types';
import { MOCK_USERS } from './services/hubsoftService';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('monitoring');
  const [theme, setTheme] = useTheme();
  
  const [hubsoftConfig, setHubsoftConfig] = useLocalStorage<HubsoftConfig>('hubsoftConfig', {
    graphqlUrl: 'https://api.hubsoft.com.br/graphql/v1',
    restUrl: 'https://api.hubsoft.com.br/api/v1/',
    authToken: 'demo-token-123',
    companyId: '12345',
  });

  const [otherIntegrations, setOtherIntegrations] = useLocalStorage<OtherIntegration[]>('otherIntegrations', []);
  
  const [systemPreferences, setSystemPreferences] = useLocalStorage<SystemPreferences>('systemPreferences', {
    language: 'pt',
    refreshInterval: 5, // Set to 5s for real-time demo
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

  const [users, setUsers] = useLocalStorage<User[]>('users', MOCK_USERS);
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Admin');

  const [simulatorConfig, setSimulatorConfig] = useLocalStorage<SimulatorConfig>('simulatorConfig', {
    url: 'http://localhost:8001/api/v1',
    apiKey: 'sim-secret-key-123'
  });
  
  const [feedbackLoopStatus, setFeedbackLoopStatus] = useState<FeedbackLoopStatus>('inactive');

  // Simulate feedback status changes for demonstration
  useEffect(() => {
    const statuses: FeedbackLoopStatus[] = ['inactive', 'active', 'active', 'active', 'alert', 'active'];
    let i = 0;
    const interval = setInterval(() => {
        i = (i + 1) % statuses.length;
        setFeedbackLoopStatus(statuses[i]);
    }, 15000); // Change status every 15 seconds
    return () => clearInterval(interval);
  }, []);

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
    users,
    setUsers,
    currentUserRole,
    simulatorConfig,
    setSimulatorConfig,
    feedbackLoopStatus,
  }), [
    theme, setTheme, 
    hubsoftConfig, setHubsoftConfig, 
    otherIntegrations, setOtherIntegrations, 
    systemPreferences, setSystemPreferences,
    notificationPreferences, setNotificationPreferences,
    users, setUsers, currentUserRole,
    simulatorConfig, setSimulatorConfig, feedbackLoopStatus
  ]);

  const renderPage = () => {
    switch (currentPage) {
      case 'monitoring':
        return <MonitoringDashboard />;
      case 'predictive_intelligence':
        return <PredictiveIntelligencePage />;
      case 'api_returns':
        return <ApiReturnsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MonitoringDashboard />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`${theme} font-sans`}>
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="animate-fadeIn">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;