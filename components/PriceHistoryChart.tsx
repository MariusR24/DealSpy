
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PriceHistoryPoint } from '../types';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-2 border border-slate-700 rounded-md shadow-lg">
          <p className="label text-white">{`${label}`}</p>
          <p className="intro text-red-400 font-semibold">{`Preț: €${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: -15,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }} />
        <Legend wrapperStyle={{ fontSize: '14px' }}/>
        <Line type="monotone" dataKey="price" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#b91c1c' }} activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }} name="Cel mai Mic Preț" />
      </LineChart>
    </ResponsiveContainer>
  );
};
