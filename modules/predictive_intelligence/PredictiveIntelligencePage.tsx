import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { StatCard } from '../../components/common/StatCard';
import * as hubsoftService from '../../services/hubsoftService';
import type { ModelMetrics, Prediction, FeatureImportance, PredictionHistory, DriftDataPoint } from '../../types';
import { CpuChipIcon, InformationCircleIcon } from '../../constants';
import { DriftChart } from './components/DriftChart';
import { Button } from '../../components/common/Button';
import { handleError } from '../../utils/errorHandler';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import Toast from '../../components/common/Toast';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { PredictiveAnalysisDetail } from './components/PredictiveAnalysisDetail';

const MLOpsSection: React.FC<{
    metrics: ModelMetrics | null;
    importance: FeatureImportance[];
    modelDrift: DriftDataPoint[];
    dataDrift: DriftDataPoint[];
    onRetrain: () => void;
    isRetraining: boolean;
}> = ({ metrics, modelDrift, dataDrift, onRetrain, isRetraining }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">Saúde do Modelo (MLOps)</h3>
                        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                            {metrics ? `Analisando modelo ${metrics.version}` : 'Carregando...'}
                        </p>
                    </div>
                    <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="mt-6 space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <DriftChart 
                          title="Monitoramento de Model Drift" 
                          data={modelDrift} 
                          dataKey="value" 
                          baselineKey="baseline" 
                          tooltipText="Acompanha a performance (acurácia) do modelo ao longo do tempo. Quedas indicam que o modelo está se tornando menos preciso."
                        />
                        <DriftChart 
                          title="Monitoramento de Data Drift" 
                          data={dataDrift} 
                          dataKey="value" 
                          baselineKey="baseline" 
                          tooltipText="Detecta mudanças na distribuição dos dados de entrada. Mudanças significativas podem degradar a performance do modelo."
                        />
                    </div>
                     <Card title="Automação de Retreinamento" subtitle="Gerencie o ciclo de vida e a atualização do modelo.">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <h4 className="font-semibold">Gatilhos de Retreinamento Ativos</h4>
                                <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Agendado (a cada 30 dias)</span></label>
                                <label className="flex items-center"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Model Drift &gt; 5%</span></label>
                                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> <span className="ml-2">Data Drift &gt; 10%</span></label>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Ações Manuais</h4>
                                <p className="text-sm text-text-light-secondary dark:text-dark-secondary my-2">Inicie um novo ciclo de treinamento do modelo com os dados mais recentes validados.</p>
                                <Button onClick={onRetrain} isLoading={isRetraining}>{isRetraining ? 'Treinando...' : 'Forçar Retreinamento Agora'}</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    )
}


const PredictiveIntelligencePage: React.FC = () => {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [importance, setImportance] = useState<FeatureImportance[]>([]);
    const [history, setHistory] = useState<PredictionHistory[]>([]);
    const [modelDrift, setModelDrift] = useState<DriftDataPoint[]>([]);
    const [dataDrift, setDataDrift] = useState<DriftDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const [isRetraining, setIsRetraining] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const loadData = useCallback(async () => {
        setError(null);
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
            // Auto-select the first prediction on load
            if (predictionsData.length > 0 && !selectedPrediction) {
                setSelectedPrediction(predictionsData[0]);
            }
        } catch (err) {
            const userMessage = handleError(err);
            setError(userMessage);
        } finally {
            setIsLoading(false);
        }
    }, [selectedPrediction]);

    useEffect(() => {
        setIsLoading(true);
        loadData();
    }, []); // Run only once on mount

    const handleRetrain = async () => {
        setIsRetraining(true);
        setToast({ message: "Iniciando pipeline de retreinamento...", type: 'success' });
        try {
             const mockFeedback = {
                simulationId: 'sim-manual-trigger',
                correctPredictions: Array.from({ length: 90 }).map((_, i) => ({ equipmentId: `ONU-${i}`, riskPercentage: 15, prediction: 'No-Failure' })),
                incorrectPredictions: Array.from({ length: 10 }).map((_, i) => ({
                    prediction: { equipmentId: `ONU-FAIL-${i}`, riskPercentage: 80, prediction: 'Failure' },
                    actualOutcome: 'No-Failure',
                })),
            };
            const response = await hubsoftService.sendFeedbackData(mockFeedback);
            setToast({ message: response.message, type: 'success' });
            await new Promise(res => setTimeout(res, 2000));
            setToast({ message: "Atualizando dashboard com o novo modelo...", type: 'success' });
            await loadData();
            setTimeout(() => {
                setToast({ message: "Dashboard atualizado com sucesso!", type: 'success' });
            }, 500);
        } catch (error) {
            const userMessage = handleError(error);
            setToast({ message: userMessage, type: 'error' });
        } finally {
            setIsRetraining(false);
        }
    }
    
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadData} className="m-4" />;

    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h1 className="text-3xl font-bold">Análise Preditiva</h1>
             <p className="text-text-light-secondary dark:text-dark-secondary -mt-6">
                Explore previsões de falha, entenda as causas e monitore a saúde do modelo de IA.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Acurácia do Modelo" value={`${((metrics?.accuracy || 0) * 100).toFixed(1)}%`} icon={<CpuChipIcon className="w-6 h-6" />} description={`Versão ${metrics?.version}`} />
                <StatCard title="Previsões Críticas" value={predictions.filter(p => p.riskPercentage > 80).length} icon={<CpuChipIcon className="w-6 h-6" />} description="Risco > 80%" />
                <StatCard title="F1-Score" value={metrics?.f1Score?.toFixed(2) || 0} icon={<CpuChipIcon className="w-6 h-6" />} description="Balanço precisão/recall" />
                <StatCard title="ROC AUC" value={metrics?.rocAuc?.toFixed(2) || 0} icon={<CpuChipIcon className="w-6 h-6" />} description="Performance geral" />
            </div>

            <Card title="Previsões de Falha Ativas" subtitle="Clique em uma previsão para ver a análise detalhada.">
                <div className="flex flex-col lg:flex-row lg:space-x-8">
                    {/* Master Column */}
                    <div className="lg:w-1/3 h-[400px] overflow-y-auto pr-4">
                        <ul className="space-y-2">
                           {predictions.map(p => (
                                <li key={p.id}>
                                    <button 
                                        onClick={() => setSelectedPrediction(p)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${selectedPrediction?.id === p.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <div className="font-semibold">{p.entity}</div>
                                        <div className="text-sm text-text-light-secondary dark:text-dark-secondary">{p.details}</div>
                                        <div className="flex items-center mt-2">
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${p.riskPercentage}%` }}></div>
                                            </div>
                                            <span className="ml-3 text-sm font-semibold">{p.riskPercentage}%</span>
                                        </div>
                                    </button>
                                </li>
                           ))}
                        </ul>
                    </div>
                    {/* Detail Column */}
                    <div className="lg:w-2/3 mt-8 lg:mt-0 border-t-2 lg:border-t-0 lg:border-l-2 border-slate-200 dark:border-slate-700 lg:pl-8">
                       {selectedPrediction ? (
                           <PredictiveAnalysisDetail prediction={selectedPrediction} />
                       ) : (
                           <div className="flex items-center justify-center h-full text-slate-500">
                               <p>Selecione uma previsão para ver os detalhes.</p>
                           </div>
                       )}
                    </div>
                </div>
            </Card>

            <MLOpsSection 
                metrics={metrics}
                importance={importance}
                modelDrift={modelDrift}
                dataDrift={dataDrift}
                onRetrain={handleRetrain}
                isRetraining={isRetraining}
            />
        </div>
    );
};

export default PredictiveIntelligencePage;