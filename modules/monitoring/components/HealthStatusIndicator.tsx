import React from 'react';
import type { FeedbackLoopStatus } from '../../../types';

type Status = 'operational' | 'standby' | FeedbackLoopStatus;

interface HealthStatusIndicatorProps {
  service: string;
  status: Status;
}

export const HealthStatusIndicator: React.FC<HealthStatusIndicatorProps> = ({ service, status }) => {
  const statusConfig: Record<Status, { text: string; color: string }> = {
    operational: { text: 'Operacional', color: 'text-green-500' },
    standby: { text: 'Em Espera', color: 'text-yellow-500' },
    active: { text: 'Ativo', color: 'text-green-500' },
    inactive: { text: 'Inativo', color: 'text-yellow-500' },
    alert: { text: 'Alerta', color: 'text-red-500' },
  };

  const config = statusConfig[status] || { text: 'Desconhecido', color: 'text-slate-500' };

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-text-light-secondary dark:text-dark-secondary">{service}</span>
      <span className={`flex items-center font-bold ${config.color}`}>
        <span className="mr-1.5">●</span>
        {config.text}
      </span>
    </div>
  );
};