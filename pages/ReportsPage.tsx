import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import Toast from '../components/common/Toast';
import { DocumentTextIcon, CpuChipIcon } from '../constants';

const ReportsPage: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleDownload = (reportType: string) => {
        setToast({ message: `Gerando ${reportType}... O download começará em breve.`, type: 'success' });
        // In a real app, this would trigger a backend API call to generate and download the PDF.
    };
    
    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h1 className="text-3xl font-bold">Relatórios PDF</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Relatório Operacional" actions={<Button onClick={() => handleDownload('Relatório Operacional')}>Baixar PDF</Button>}>
                    <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="w-10 h-10 text-primary-500 mt-1" />
                        <div>
                            <p className="text-text-light-secondary dark:text-dark-secondary">Gere um relatório completo com os principais indicadores de performance da rede.</p>
                            <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
                                <li>Clientes ativos e com falha</li>
                                <li>Tempo médio de reparo (MTTR)</li>
                                <li>Potência óptica média por região</li>
                                <li>Ordens de serviço abertas/concluídas</li>
                                <li>Disponibilidade da rede (%)</li>
                                <li>Status das integrações de API</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card title="Relatório de Machine Learning" actions={<Button onClick={() => handleDownload('Relatório de Machine Learning')}>Baixar PDF</Button>}>
                    <div className="flex items-start space-x-4">
                        <CpuChipIcon className="w-10 h-10 text-primary-500 mt-1" />
                        <div>
                           <p className="text-text-light-secondary dark:text-dark-secondary">Exporte um relatório técnico detalhado sobre a performance e as características do modelo preditivo atual.</p>
                             <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
                                <li>Versão, algoritmo e data de treinamento</li>
                                <li>Métricas: Acurácia, F1-Score, ROC-AUC</li>
                                <li>Principais features influentes</li>
                                <li>Matriz de confusão e curva ROC</li>
                                <li>Análise de previsões corretas vs. erros</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ReportsPage;
