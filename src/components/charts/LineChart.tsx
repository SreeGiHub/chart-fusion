
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';
import { formatChartData } from '@/utils/chartRendererUtils';

interface LineChartProps {
  item: ChartItemType;
}

const LineChart: React.FC<LineChartProps> = ({ item }) => {
  const processedData = formatChartData(item.data.labels, item.data.datasets);
  
  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;
    
    const filteredPayload = payload.filter((entry: any) => {
      const datasetIndex = item.data.datasets.findIndex(
        d => d.label === entry.value || (!d.label && `dataset-${item.data.datasets.indexOf(d)}` === entry.value)
      );
      return datasetIndex === -1 || !item.data.datasets[datasetIndex].legendHidden;
    });
    
    if (!filteredPayload.length) return null;
    
    return (
      <div className="flex justify-center flex-wrap mt-2 text-xs">
        {filteredPayload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center mr-3 mb-1">
            <div 
              className="w-2.5 h-2.5 mr-1.5 rounded-sm" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          labelStyle={{ fontWeight: "bold", color: "#111827" }}
        />
        <Legend content={<CustomLegend />} />
        {item.data.datasets
          .filter(dataset => !dataset.hidden)
          .map((dataset, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label || `dataset-${index}`}
            stroke={dataset.borderColor as string || "#4f46e5"}
            fill={dataset.backgroundColor as string || "#4f46e533"}
            strokeWidth={dataset.borderWidth || 3}
            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
