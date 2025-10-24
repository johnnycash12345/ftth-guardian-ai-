import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { Table } from '../components/common/Table';
import { StatCard } from '../components/common/StatCard';
import * as hubsoftService from '../services/hubsoftService';
import type { ModelMetrics, Prediction, FeatureImportance, PredictionHistory } from '../types';
import { CpuChipIcon } from '../constants';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, CartesianGrid, ResponsiveContainer } from 'recharts';


const PredictiveIntelligencePage: React.FC = () => {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [importance, setImportance] = useState<FeatureImportance[]>([]);
    const [history, setHistory] = useState<PredictionHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [metricsData, predictionsData, importanceData, historyData] = await Promise.all([
                    hubsoftService.fetchModelMetrics(),
                    hubsoftService.fetchPredictions(),
                    hubsoftService.fetchFeatureImportance(),
                    hubsoftService.fetchPredictionHistory(),
                ]);
                setMetrics(metricsData);
                setPredictions(predictionsData);
                setImportance(importanceData);
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to load ML data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    
    // FIX: Explicitly define the type for `predictionColumns` to ensure type safety with the generic Table component.
    const predictionColumns: { key: keyof Prediction; header: string; render?: (item: Prediction) => React.ReactNode }[] = [
        { key: 'entity', header: 'Entidade (ONU / Cliente)' },
        { key: 'riskPercentage', header: 'Risco de Falha', render: (item: Prediction) => (
            <div className="flex items-center">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${item.riskPercentage}%` }}></div>
                </div>
                <span className="ml-3 font-semibold">{item.riskPercentage}%</span>
            </div>
        ) },
        { key: 'timeframe', header: 'Janela (Previsão)'},
        { key: 'details', header: 'Causa Provável'},
    ];

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Inteligência Preditiva</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Acurácia do Modelo" value={`${((metrics?.accuracy || 0) * 100).toFixed(0)}%`} icon={<CpuChipIcon className="w-6 h-6" />} description={`Versão ${metrics?.version}`} />
                <StatCard title="F1-Score" value={metrics?.f1Score || 0} icon={<CpuChipIcon className="w-6 h-6" />} description="Balanço precisão/recall" />
                <StatCard title="ROC AUC" value={metrics?.rocAuc || 0} icon={<CpuChipIcon className="w-6 h-6" />} description="Performance geral" />
                <StatCard title="Previsões Críticas (>80%)" value={predictions.filter(p => p.riskPercentage > 80).length} icon={<CpuChipIcon className="w-6 h-6" />} description="Próximas 48h" />
            </div>

            <Card title="Previsões de Falha Ativas">
                <Table columns={predictionColumns} data={predictions} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Histórico de Previsões vs. Ocorrências Reais">
                    <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" stroke="currentColor" />
                            <YAxis stroke="currentColor" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-card-dark)', border: '1px solid var(--color-border)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="predicted" name="Previsões" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="actual" name="Falhas Reais" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Importância das Features no Modelo">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={importance} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis type="number" stroke="currentColor" />
                            <YAxis type="category" dataKey="feature" stroke="currentColor" width={150} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-card-dark)', border: '1px solid var(--color-border)' }} />
                            <Legend />
                            <Bar dataKey="importance" name="Importância" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default PredictiveIntelligencePage;