
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';

interface GaugeChartProps {
  item: ChartItemType;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ item }) => {
  const value = item.data.datasets[0]?.data[0] || 0;
  const max = 100; // Assuming max value is 100 for gauge
  const percentage = typeof value === 'number' ? (value / max) * 100 : 0;
  
  const gaugeData = [
    { name: "value", value: percentage },
    { name: "empty", value: 100 - percentage }
  ];
  
  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart style={chartStyle}>
        <Pie
          data={gaugeData}
          cx="50%"
          cy="80%"
          startAngle={180}
          endAngle={0}
          innerRadius="60%"
          outerRadius="80%"
          paddingAngle={0}
          dataKey="value"
        >
          <Cell fill={item.data.datasets[0]?.backgroundColor as string || "#4f46e5"} />
          <Cell fill="#E5E7EB" />
        </Pie>
        <text
          x="50%"
          y="85%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          {typeof value === 'number' ? value.toFixed(0) : String(value)}%
        </text>
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '14px' }}
        >
          {item.data.labels[0] || ""}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GaugeChart;
