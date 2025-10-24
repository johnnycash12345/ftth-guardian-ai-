import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { Input } from '../../components/common/Input';
import { ReportHistoryTable } from './components/ReportHistoryTable';
import * as hubsoftService from '../../services/hubsoftService';
import * as pdfGenerator from '../../services/pdfGenerator';
import { PdfChartRenderer } from './components/PdfChartRenderer';
import type { FeatureImportance, DriftDataPoint } from '../../types';
import { handleError } from '../../utils/errorHandler';

declare const html2canvas: any;

interface PdfChartData {
    importanceData: FeatureImportance[];
    driftData: DriftDataPoint[];
}

const ReportsPage: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportType, setReportType] = useState<'operational' | 'ml'>('operational');
    const [pdfChartData, setPdfChartData] = useState<PdfChartData | null>(null);

    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setToast({ message: `Gerando relatório...`, type: 'success' });

        try {
            if (reportType === 'operational') {
                const predictions = await hubsoftService.fetchPredictions();
                await pdfGenerator.generateOperationalReport(predictions);
                setToast({ message: `Relatório Operacional gerado com sucesso!`, type: 'success' });
            } else if (reportType === 'ml') {
                const [metrics, importance, driftData] = await Promise.all([
                    hubsoftService.fetchModelMetrics(),
                    hubsoftService.fetchFeatureImportance(),
                    hubsoftService.fetchModelDrift(),
                ]);

                setPdfChartData({ importanceData: importance, driftData });

                setTimeout(async () => {
                    try {
                        const importanceContainer = document.getElementById('importance-chart-pdf-container');
                        const driftContainer = document.getElementById('drift-chart-pdf-container');

                        if (!importanceContainer || !driftContainer) {
                            throw new Error("Elementos do gráfico para PDF não encontrados no DOM.");
                        }

                        const importanceCanvas = await html2canvas(importanceContainer);
                        const driftCanvas = await html2canvas(driftContainer);
                        
                        const importanceChartImage = importanceCanvas.toDataURL('image/png', 1.0);
                        const driftChartImage = driftCanvas.toDataURL('image/png', 1.0);
                        
                        await pdfGenerator.generateMLReport(metrics, importance, driftChartImage, importanceChartImage);
                        
                        setToast({ message: `Relatório de ML gerado com sucesso!`, type: 'success' });
                    } catch (captureError) {
                        const userMessage = handleError(captureError);
                        setToast({ message: userMessage, type: 'error' });
                    } finally {
                        setPdfChartData(null);
                    }
                }, 500);
            }
        } catch (error) {
            const userMessage = handleError(error);
            setToast({ message: userMessage, type: 'error' });
            setPdfChartData(null);
        } finally {
            setTimeout(() => setIsGenerating(false), 1000);
        }
    };
    
    const reportDescriptions = {
        operational: "Um resumo das previsões de falha ativas para a equipe de campo, ideal para planejamento de manutenção proativa.",
        ml: "Uma análise técnica detalhada da performance do modelo de IA, incluindo métricas, drift e importância de features."
    };

    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {pdfChartData && <PdfChartRenderer {...pdfChartData} />}

            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-text-light-secondary dark:text-dark-secondary -mt-6">
                Gere e baixe relatórios operacionais e técnicos em formato PDF.
            </p>

            <Card title="Gerar Novo Relatório" subtitle="Selecione o tipo de relatório e o período desejado.">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-3">
                            <label htmlFor="reportType" className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">Tipo de Relatório</label>
                            <select 
                                id="reportType" 
                                name="reportType" 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value as 'operational' | 'ml')}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                            >
                                <option value="operational">Operacional</option>
                                <option value="ml">Machine Learning</option>
                            </select>
                             <p className="text-xs text-text-light-secondary dark:text-dark-secondary mt-2">
                                {reportDescriptions[reportType]}
                            </p>
                        </div>
                        <Input label="Data de Início" id="startDate" type="date" />
                        <Input label="Data de Fim" id="endDate" type="date" />
                         <Button type="submit" isLoading={isGenerating}>
                            {isGenerating ? 'Gerando...' : 'Gerar e Baixar PDF'}
                        </Button>
                    </div>
                </form>
            </Card>

            <ReportHistoryTable />
        </div>
    );
};

export default ReportsPage;