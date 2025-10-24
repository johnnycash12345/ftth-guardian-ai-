import React from 'react';
import type { Alert } from '../../../types';

const severityConfig = {
    critical: {
        icon: '🔴',
        color: 'text-red-400',
    },
    warning: {
        icon: '🟡',
        color: 'text-yellow-400',
    },
    info: {
        icon: '🔵',
        color: 'text-blue-400',
    }
}

interface AlertsListProps {
    alerts: Alert[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
    return (
        <div className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
                <div key={alert.id} className="flex items-start p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    <span className={`text-xl mr-3 ${severityConfig[alert.severity].color}`}>{severityConfig[alert.severity].icon}</span>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                        <p className="text-xs text-text-light-secondary dark:text-dark-secondary">{alert.entity} - {new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            )) : (
                 <p className="text-center py-4 text-slate-500">Nenhum alerta recente.</p>
            )}
        </div>
    );
};
