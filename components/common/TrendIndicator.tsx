import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../../constants';

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable';
  text: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, text }) => {
  const isUp = direction === 'up';
  const isDown = direction === 'down';

  const colorClasses = isUp ? 'text-green-600 dark:text-green-400' : isDown ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400';

  return (
    <div className={`inline-flex items-center text-xs font-medium ${colorClasses}`}>
      {isUp && <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />}
      {isDown && <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
      <span>{text}</span>
    </div>
  );
};