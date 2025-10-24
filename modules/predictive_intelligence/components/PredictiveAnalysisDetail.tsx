import React from 'react';
import type { Prediction } from '../../../types';
import { ShapExplanation } from './ShapExplanation';
import { Card } from '../../../components/common/Card';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

interface PredictiveAnalysisDetailProps {
  prediction: Prediction;
}

export const PredictiveAnalysisDetail: React.FC<PredictiveAnalysisDetailProps> = ({ prediction }) => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">{prediction.entity}</h3>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{prediction.details}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-text-light-secondary dark:text-dark-secondary block">Risco de Falha</span>
            <span className="text-3xl font-bold text-red-500">{prediction.riskPercentage}%</span>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-text-light-secondary dark:text-dark-secondary block">Janela de Previsão</span>
            <span className="text-3xl font-bold text-text-light-primary dark:text-dark-primary">{prediction.timeframe}</span>
        </div>
      </div>
      
      <Card>
        <div className="flex items-center mb-4">
          <h4 className="text-lg font-semibold">Análise de Causa Raiz (XAI)</h4>
          <InfoTooltip text="SHAP (SHapley Additive exPlanations) é uma técnica de IA Explicável que mostra como cada característica (feature) contribuiu para a previsão de risco final, aumentando ou diminuindo o valor base do modelo." />
        </div>
        <ShapExplanation shapValues={prediction.shapValues} />
      </Card>
      
      {/* Placeholder for entity history chart */}
      <Card title="Histórico do Equipamento" subtitle="Métricas relevantes nos últimos 7 dias.">
         <div className="flex items-center justify-center h-32 bg-slate-100 dark:bg-slate-800 rounded-lg">
             <p className="text-slate-500">Gráfico de histórico de métricas (ex: potência, latência) viria aqui.</p>
         </div>
      </Card>
    </div>
  );
};