import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { CpuChipIcon, ChartBarIcon, DocumentTextIcon, GlobeAltIcon } from '../../constants';
import { AppContext } from '../../App';
import * as hubsoftService from '../../services/hubsoftService';
import type { AppContextType, TelemetryDataPoint, Alert, FeedbackLoopStatus } from '../../types';
import { RealTimeChart } from './components/RealTimeChart';
import { AlertsList } from './components/AlertsList';
import { handleError } from '../../utils/errorHandler';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import Toast from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import { HealthStatusIndicator } from './components/HealthStatusIndicator';

const MonitoringDashboard: React.FC = () => {
    const { systemPreferences, feedbackLoopStatus } = useContext(AppContext) as AppContextType;
    const [telemetry, setTelemetry] = useState<TelemetryDataPoint[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [healthScore, setHealthScore] = useState<{ score: number; trend: 'up' | 'down' | 'stable' } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [alertsData, scoreData] = await Promise.all([
                hubsoftService.fetchAlerts(),
                hubsoftService.fetchNetworkHealthScore(),
            ]);
            setAlerts(alertsData);
            setHealthScore(scoreData);
        } catch (err) {
            const userMessage = handleError(err);
            setError(userMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
        
        const telemetryInterval = setInterval(async () => {
            const newDataPoint = await hubsoftService.fetchRealTimeTelemetry();
            setTelemetry(prevData => [...prevData.slice(-59), newDataPoint]);
        }, systemPreferences.refreshInterval * 1000);

        return () => clearInterval(telemetryInterval);
    }, [systemPreferences.refreshInterval, loadInitialData]);
    
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadInitialData} />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Visão Geral</h1>
             <p className="text-text-light-secondary dark:text-dark-secondary -mt-6">
                Um resumo executivo da saúde da rede e do desempenho do sistema em tempo real.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-text-light-secondary dark:text-dark-secondary">Pontuação de Saúde da Rede</h3>
                    <p className="text-7xl font-bold text-primary-600 dark:text-primary-400 my-2">{healthScore?.score.toFixed(1)}</p>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${healthScore?.score ?? 0 > 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {healthScore?.score ?? 0 > 95 ? 'Excelente' : 'Bom'}
                    </div>
                </Card>
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard title="Disponibilidade" value="99.98%" icon={<GlobeAltIcon />} trend={{ direction: 'up', text: '+0.01% vs 24h' }} />
                    <StatCard title="Redução de OS" value="12%" icon={<DocumentTextIcon />} trend={{ direction: 'up', text: '+1.2% vs mês anterior' }} />
                    <StatCard title="Latência Média" value={`${telemetry.slice(-1)[0]?.latency.toFixed(1) ?? '...'}ms`} icon={<ChartBarIcon />} trend={{ direction: 'down', text: '-2ms vs 1h' }}/>
                    <StatCard title="Previsões Ativas" value="4" icon={<CpuChipIcon />} description="Críticas: 1" />
                </div>
            </div>
            
            <Card title="Telemetria da Rede" subtitle="Dados de latência e potência óptica no último minuto.">
                <RealTimeChart data={telemetry} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Alertas Inteligentes Recentes" subtitle="Eventos críticos e avisos gerados pelo sistema.">
                        {isLoading && <Spinner />}
                        {error && <ErrorMessage message={error} onRetry={loadInitialData} />}
                        {!isLoading && !error && <AlertsList alerts={alerts} />}
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card title="Status do Sistema" subtitle="Saúde dos serviços internos do Guardian.">
                       <div className="space-y-3">
                            <HealthStatusIndicator service="Coleta de Dados (Hubsoft)" status="operational" />
                            <HealthStatusIndicator service="Serviço de Inferência ML" status="operational" />
                            <HealthStatusIndicator service="Feedback Loop (Simulator)" status={feedbackLoopStatus} />
                            <HealthStatusIndicator service="Pipeline de Treinamento" status="standby" />
                            <HealthStatusIndicator service="Gateway de Notificações" status="operational" />
                       </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MonitoringDashboard;