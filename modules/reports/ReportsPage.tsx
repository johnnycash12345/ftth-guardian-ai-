import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { DocumentTextIcon, CpuChipIcon } from '../../constants';
import { Input } from '../../components/common/Input';
import { ReportHistoryTable } from './components/ReportHistoryTable';

const ReportsPage: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setToast({ message: `Gerando relatório... O download começará em breve.`, type: 'success' });
        setTimeout(() => setIsGenerating(false), 2000);
    };
    
    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h1 className="text-3xl font-bold">Relatórios PDF</h1>

            <Card title="Gerar Novo Relatório">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="reportType" className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">Tipo de Relatório</label>
                            <select id="reportType" name="reportType" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="w-10 h-10 text-primary-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Relatório Operacional</h3>
                            <p className="text-text-light-secondary dark:text-dark-secondary text-sm">Gere um relatório completo com os principais indicadores de performance da rede.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                                <li>Clientes ativos e com falha</li>
                                <li>Tempo médio de reparo (MTTR)</li>
                                <li>Ordens de serviço abertas/concluídas</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card>
                     <div className="flex items-start space-x-4">
                        <CpuChipIcon className="w-10 h-10 text-primary-500 mt-1 flex-shrink-0" />
                        <div>
                           <h3 className="font-semibold">Relatório de Machine Learning</h3>
                           <p className="text-text-light-secondary dark:text-dark-secondary text-sm">Exporte um relatório técnico detalhado sobre a performance e as características do modelo preditivo.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                                <li>Métricas: Acurácia, F1-Score, ROC-AUC</li>
                                <li>Principais features influentes</li>
                                <li>Matriz de confusão e curva ROC</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <ReportHistoryTable />

        </div>
    );
};

export default ReportsPage;
