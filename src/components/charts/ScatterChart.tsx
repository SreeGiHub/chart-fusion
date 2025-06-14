
import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';

interface ScatterChartProps {
  item: ChartItemType;
}

const ScatterChart: React.FC<ScatterChartProps> = ({ item }) => {
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

  const isBubble = item.type === "bubble";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }} style={chartStyle}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          type="number"
          dataKey="x" 
          name="X"
          axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          type="number"
          dataKey="y"
          name="Y"
          axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        {isBubble && (
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[60, 400]} 
            name="Size" 
          />
        )}
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
          formatter={(value, name) => [value, name === 'z' ? 'Size' : name]}
        />
        <Legend content={<CustomLegend />} />
        {item.data.datasets
          .filter(dataset => !dataset.hidden)
          .map((dataset, index) => (
          <Scatter
            key={index}
            name={dataset.label || `Dataset ${index + 1}`}
            data={dataset.data.map((point: any, i: number) => ({
              x: typeof point === 'object' ? point.x : i,
              y: typeof point === 'object' ? point.y : point,
              z: isBubble && typeof point === 'object' && point.r ? point.r : 10,
            }))}
            fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e5"}
          />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChart;
