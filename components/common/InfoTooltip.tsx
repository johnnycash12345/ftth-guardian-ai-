import React from 'react';
import { InformationCircleIcon } from '../../constants';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <div className="group relative inline-flex ml-2">
      <InformationCircleIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
      </div>
    </div>
  );
};