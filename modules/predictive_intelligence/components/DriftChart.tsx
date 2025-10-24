import React from 'react';
import { Card } from '../../../components/common/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DriftDataPoint } from '../../../types';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

interface DriftChartProps {
    title: string;
    data: DriftDataPoint[];
    dataKey: keyof DriftDataPoint;
    baselineKey: keyof DriftDataPoint;
    // FIX: Add tooltipText prop to satisfy usage in PredictiveIntelligencePage.
    tooltipText: string;
}

export const DriftChart: React.FC<DriftChartProps> = ({ title, data, dataKey, baselineKey, tooltipText }) => {
    // FIX: Combine title and tooltip into a single ReactNode to pass to the Card component.
    const cardTitle = (
        <div className="flex items-center">
            <span>{title}</span>
            <InfoTooltip text={tooltipText} />
        </div>
    );

    return (
        <Card title={cardTitle}>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" />
                    <YAxis tick={{ fontSize: 12 }} stroke="currentColor" domain={['dataMin - 0.05', 'dataMax + 0.05']} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-card-dark)', border: '1px solid var(--color-border)' }} />
                    <Area type="monotone" dataKey={dataKey} stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" name="Valor Atual" />
                    <ReferenceLine y={data[0]?.[baselineKey] as number} label={{ value: "Baseline", position: "insideTopRight", fill: "#f87171" }} stroke="#f87171" strokeDasharray="3 3" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};
