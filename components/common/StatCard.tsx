import React from 'react';
import { TrendIndicator } from './TrendIndicator';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    text: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex items-start space-x-4">
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 rounded-lg text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-light-secondary dark:text-dark-secondary truncate">{title}</p>
        <p className="text-2xl font-bold text-text-light-primary dark:text-dark-primary">{value}</p>
        <div className="flex items-center mt-1">
            {description && <p className="text-xs text-text-light-secondary dark:text-dark-secondary mr-2">{description}</p>}
            {trend && <TrendIndicator direction={trend.direction} text={trend.text} />}
        </div>
      </div>
    </div>
  );
};