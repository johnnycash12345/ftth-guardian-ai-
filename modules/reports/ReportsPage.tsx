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
                // Step 1: Fetch all data needed for the PDF
                const [metrics, importance, driftData] = await Promise.all([
                    hubsoftService.fetchModelMetrics(),
                    hubsoftService.fetchFeatureImportance(),
                    hubsoftService.fetchModelDrift(),
                ]);

                // Step 2: Set the data in state to render the hidden chart component
                setPdfChartData({ importanceData: importance, driftData });

                // Step 3: Wait for the component to render and then capture it
                setTimeout(async () => {
                    const importanceCanvas = await html2canvas(document.getElementById('importance-chart-pdf-container'));
                    const driftCanvas = await html2canvas(document.getElementById('drift-chart-pdf-container'));
                    
                    const importanceChartImage = importanceCanvas.toDataURL('image/png', 1.0);
                    const driftChartImage = driftCanvas.toDataURL('image/png', 1.0);
                    
                    await pdfGenerator.generateMLReport(metrics, importance, driftChartImage, importanceChartImage);
                    
                    setToast({ message: `Relatório de ML gerado com sucesso!`, type: 'success' });
                    setPdfChartData(null); // Clean up the DOM
                }, 500); // 500ms delay to ensure charts are rendered before capture
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            setToast({ message: `Erro ao gerar relatório.`, type: 'error' });
            setPdfChartData(null);
        } finally {
            // Delay setting isGenerating to false to allow for download to start
            setTimeout(() => setIsGenerating(false), 1000);
        }
    };

    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {pdfChartData && <PdfChartRenderer {...pdfChartData} />}

            <h1 className="text-3xl font-bold">Relatórios PDF</h1>

            <Card title="Gerar Novo Relatório">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
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
                        </div>
                        <Input label="Data de Início" id="startDate" type="date" />
                        <Input label="Data de Fim" id="endDate" type="date" />
                    </div>
                    <div className="mt-6 flex justify-end">
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