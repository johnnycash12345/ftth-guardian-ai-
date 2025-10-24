import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { Table } from '../../components/common/Table';
import { StatCard } from '../../components/common/StatCard';
import * as hubsoftService from '../../services/hubsoftService';
import type { ModelMetrics, Prediction, FeatureImportance, PredictionHistory, DriftDataPoint } from '../../types';
import { CpuChipIcon } from '../../constants';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Modal } from '../../components/common/Modal';
import { ShapExplanation } from './components/ShapExplanation';
import { DriftChart } from './components/DriftChart';
import { Button } from '../../components/common/Button';

const PredictiveIntelligencePage: React.FC = () => {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [importance, setImportance] = useState<FeatureImportance[]>([]);
    const [history, setHistory] = useState<PredictionHistory[]>([]);
    const [modelDrift, setModelDrift] = useState<DriftDataPoint[]>([]);
    const [dataDrift, setDataDrift] = useState<DriftDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const [isRetraining, setIsRetraining] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [metricsData, predictionsData, importanceData, historyData, modelDriftData, dataDriftData] = await Promise.all([
                    hubsoftService.fetchModelMetrics(),
                    hubsoftService.fetchPredictions(),
                    hubsoftService.fetchFeatureImportance(),
                    hubsoftService.fetchPredictionHistory(),
                    hubsoftService.fetchModelDrift(),
                    hubsoftService.fetchDataDrift(),
                ]);
                setMetrics(metricsData);
                setPredictions(predictionsData);
                setImportance(importanceData);
                setHistory(historyData);
                setModelDrift(modelDriftData);
                setDataDrift(dataDriftData);
            } catch (error) {
                console.error("Failed to load ML data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleRetrain = () => {
      setIsRetraining(true);
      setTimeout(() => setIsRetraining(false), 3000); // Simulate retraining
    }
    
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
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            {predictionColumns.map((col) => (
                            <th key={String(col.key)} scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light-secondary dark:text-dark-secondary uppercase tracking-wider">{col.header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-card-light dark:bg-card-dark divide-y divide-slate-200 dark:divide-slate-700">
                        {predictions.map((item) => (
                            <tr key={item.id} onClick={() => setSelectedPrediction(item)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            {predictionColumns.map((col) => (
                                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-text-light-primary dark:text-dark-primary">
                                    {col.render ? col.render(item) : String(item[col.key])}
                                </td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DriftChart title="Monitoramento de Model Drift (Acurácia)" data={modelDrift} dataKey="value" baselineKey="baseline" />
                <DriftChart title="Monitoramento de Data Drift (Potência Média)" data={dataDrift} dataKey="value" baselineKey="baseline" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Importância das Features" className="lg:col-span-1">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={importance} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="feature" interval={0} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{ backgroundColor: 'var(--color-card-dark)', border: '1px solid var(--color-border)' }} />
                            <Bar dataKey="importance" name="Importância" fill="#3b82f6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Automação (Auto-Retraining)" className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <h4 className="font-semibold">Gatilhos de Retreinamento</h4>
                            <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Agendado (a cada 30 dias)</span></label>
                            <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Model Drift &gt; 5%</span></label>
                            <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Data Drift &gt; 10%</span></label>
                        </div>
                        <div className="flex-1">
                             <h4 className="font-semibold">Ações</h4>
                             <p className="text-sm text-text-light-secondary dark:text-dark-secondary my-2">Inicie um novo ciclo de treinamento do modelo com os dados mais recentes.</p>
                             <Button onClick={handleRetrain} isLoading={isRetraining}>{isRetraining ? 'Treinando...' : 'Forçar Retreinamento Agora'}</Button>
                        </div>
                    </div>
                </Card>
            </div>
            
            {selectedPrediction && (
                 <Modal title={`Análise Preditiva (XAI): ${selectedPrediction.entity}`} isOpen={!!selectedPrediction} onClose={() => setSelectedPrediction(null)}>
                    <ShapExplanation shapValues={selectedPrediction.shapValues} />
                </Modal>
            )}
        </div>
    );
};

export default PredictiveIntelligencePage;
