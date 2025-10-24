import React, { useState, useEffect, useContext } from 'react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { CpuChipIcon, ChartBarIcon, DocumentTextIcon, GlobeAltIcon } from '../../constants';
import { AppContext } from '../../App';
import * as hubsoftService from '../../services/hubsoftService';
import type { AppContextType, TelemetryDataPoint, Alert } from '../../types';
import { RealTimeChart } from './components/RealTimeChart';
import { AlertsList } from './components/AlertsList';

const MonitoringDashboard: React.FC = () => {
    const { systemPreferences } = useContext(AppContext) as AppContextType;
    const [telemetry, setTelemetry] = useState<TelemetryDataPoint[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const newDataPoint = await hubsoftService.fetchRealTimeTelemetry();
            setTelemetry(prevData => [...prevData.slice(-59), newDataPoint]);
        }, systemPreferences.refreshInterval * 1000);

        hubsoftService.fetchAlerts().then(setAlerts);

        return () => clearInterval(intervalId);
    }, [systemPreferences.refreshInterval]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Monitoramento em Tempo Real</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Disponibilidade da Rede" value="99.98%" icon={<GlobeAltIcon />} description="Últimas 24h" />
                <StatCard title="Redução de OS (Preditiva)" value="12%" icon={<DocumentTextIcon />} description="Este mês" />
                <StatCard title="Latência Média" value={`${telemetry.slice(-1)[0]?.latency.toFixed(2) ?? '...'}ms`} icon={<ChartBarIcon />} />
                <StatCard title="Previsões Ativas" value="4" icon={<CpuChipIcon />} description="Críticas: 1" />
            </div>

            <Card title="Telemetria da Rede (Último Minuto)">
                <RealTimeChart data={telemetry} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Alertas Inteligentes Recentes">
                        <AlertsList alerts={alerts} />
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card title="Status do Sistema">
                       <div className="space-y-3">
                            <div className="flex justify-between items-center"><span className="font-medium">Coleta de Dados (Hubsoft)</span><span className="text-green-500 font-bold">● Operacional</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium">Serviço de Inferência ML</span><span className="text-green-500 font-bold">● Operacional</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium">Pipeline de Treinamento</span><span className="text-yellow-500 font-bold">● Em Espera</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium">Gateway de Notificações</span><span className="text-green-500 font-bold">● Operacional</span></div>
                       </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MonitoringDashboard;
