import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/common/Card';
import { Table } from '../../../components/common/Table';
import * as hubsoftService from '../../../services/hubsoftService';
import type { ReportHistory } from '../../../types';
import Spinner from '../../../components/common/Spinner';

export const ReportHistoryTable: React.FC = () => {
    const [history, setHistory] = useState<ReportHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        hubsoftService.fetchReportHistory()
            .then(setHistory)
            .finally(() => setIsLoading(false));
    }, []);

    const columns: { key: keyof ReportHistory; header: string; render?: (item: ReportHistory) => React.ReactNode }[] = [
        { key: 'type', header: 'Tipo' },
        { key: 'generatedAt', header: 'Data de Geração', render: (item) => new Date(item.generatedAt).toLocaleString() },
        { key: 'generatedBy', header: 'Gerado Por' },
        { key: 'filters', header: 'Filtros Aplicados' },
    ];
    
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Card title="Histórico de Relatórios Gerados">
            <Table<ReportHistory>
                columns={columns}
                data={history}
                renderActions={() => (
                     <a href="#" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">Baixar</a>
                )}
            />
        </Card>
    );
};
