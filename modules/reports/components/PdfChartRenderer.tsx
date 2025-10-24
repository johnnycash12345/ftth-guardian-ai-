import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { FeatureImportance, DriftDataPoint } from '../../../types';

interface PdfChartRendererProps {
    importanceData: FeatureImportance[];
    driftData: DriftDataPoint[];
}

export const PdfChartRenderer: React.FC<PdfChartRendererProps> = ({ importanceData, driftData }) => {
    return (
        // Positioned off-screen with a white background for clean capture
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', background: '#ffffff', padding: '20px' }}>
            <div id="importance-chart-pdf-container" style={{ width: '800px', height: '400px' }}>
                 <h3 style={{ fontFamily: 'sans-serif', fontSize: '16px', marginBottom: '10px', color: '#000000' }}>Importância das Features</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={importanceData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="feature" interval={0} tick={{ fontSize: 12, fill: '#000000' }} />
                        <Tooltip />
                        <Bar dataKey="importance" name="Importância" fill="#3b82f6" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div id="drift-chart-pdf-container" style={{ width: '800px', height: '300px', marginTop: '50px' }}>
                <h3 style={{ fontFamily: 'sans-serif', fontSize: '16px', marginBottom: '10px', color: '#000000' }}>Monitoramento de Model Drift (Acurácia)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driftData}>
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#000000' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#000000' }} domain={['dataMin - 0.05', 'dataMax + 0.05']} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" name="Valor Atual" />
                        <Bar dataKey="baseline" fill="#f87171" name="Baseline" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
