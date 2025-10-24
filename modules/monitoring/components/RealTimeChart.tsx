import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TelemetryDataPoint } from '../../../types';

interface RealTimeChartProps {
  data: TelemetryDataPoint[];
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="time" stroke="currentColor" />
          <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Latência (ms)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#ef4444" label={{ value: 'Potência (dBm)', angle: -90, position: 'insideRight' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-card-dark)', border: '1px solid var(--color-border)' }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="latency" name="Latência" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line yAxisId="right" type="monotone" dataKey="opticalPower" name="Potência Óptica" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
