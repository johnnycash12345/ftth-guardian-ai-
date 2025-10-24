import React from 'react';
import type { ShapValues, FeatureContribution } from '../../../types';

const FeatureBar: React.FC<{ contribution: FeatureContribution }> = ({ contribution }) => {
    const isPositive = contribution.contribution > 0;
    const width = Math.min(Math.abs(contribution.contribution), 100);

    return (
        <div className="flex items-center text-sm mb-2">
            <div className="w-1/3 text-right pr-2 truncate">
                <span className="text-text-light-secondary dark:text-dark-secondary">{contribution.feature}</span>
                <span className="font-mono text-xs ml-1">({contribution.value})</span>
            </div>
            <div className="w-2/3 flex items-center">
                {isPositive ? (
                    <>
                        <div className="bg-slate-200 dark:bg-slate-700" style={{ width: '50%', height: '20px' }} />
                        <div className="bg-red-500/80" style={{ width: `${width / 2}%`, height: '20px' }} />
                    </>
                ) : (
                    <>
                         <div className="bg-slate-200 dark:bg-slate-700 flex justify-end" style={{ width: '50%', height: '20px' }}>
                             <div className="bg-green-500/80" style={{ width: `${width / 2}%`, height: '20px' }} />
                         </div>
                    </>
                )}
                 <span className={`ml-2 font-semibold ${isPositive ? 'text-red-500' : 'text-green-500'}`}>{isPositive ? '+' : ''}{contribution.contribution.toFixed(2)}</span>
            </div>
        </div>
    );
};


export const ShapExplanation: React.FC<{ shapValues: ShapValues }> = ({ shapValues }) => {
    const sortedContributions = [...shapValues.contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return (
        <div>
            <div className="flex justify-between items-baseline mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div>
                    <span className="text-sm text-text-light-secondary dark:text-dark-secondary">Risco Base do Modelo</span>
                    <p className="text-2xl font-bold">{shapValues.baseValue.toFixed(2)}%</p>
                </div>
                <div className="text-2xl font-light text-text-light-secondary dark:text-dark-secondary mx-4">→</div>
                 <div>
                    <span className="text-sm text-text-light-secondary dark:text-dark-secondary">Previsão Final de Risco</span>
                    <p className="text-2xl font-bold text-red-500">{shapValues.finalPrediction.toFixed(2)}%</p>
                </div>
            </div>
            
            <div className="mb-4">
                 <div className="flex items-center text-sm mb-2">
                    <div className="w-1/3" />
                    <div className="w-2/3 flex items-center relative" style={{ height: '20px' }}>
                        <div className="w-full text-center text-xs absolute -top-4 text-text-light-secondary dark:text-dark-secondary">
                            <span className="mr-8">↓ Menor Risco</span>
                             <span>↑ Maior Risco</span>
                        </div>
                        <div className="h-full w-1/2 border-r border-slate-400 dark:border-slate-500" />
                    </div>
                </div>
                {sortedContributions.map((c, i) => (
                    <FeatureBar key={i} contribution={c} />
                ))}
            </div>

            <p className="text-xs text-center text-text-light-secondary dark:text-dark-secondary mt-6">
                Este gráfico mostra como cada característica empurrou a previsão para longe do risco base.
                Barras vermelhas aumentam o risco de falha, enquanto barras verdes diminuem.
            </p>
        </div>
    );
};
