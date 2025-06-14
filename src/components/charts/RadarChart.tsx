
import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';
import { formatChartData } from '@/utils/chartRendererUtils';

interface RadarChartProps {
  item: ChartItemType;
}

const RadarChart: React.FC<RadarChartProps> = ({ item }) => {
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
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData} style={chartStyle}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
        <PolarRadiusAxis axisLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
        />
        <Legend content={<CustomLegend />} />
        {item.data.datasets
          .filter(dataset => !dataset.hidden)
          .map((dataset, index) => (
          <Radar
            key={index}
            name={dataset.label || `Dataset ${index + 1}`}
            dataKey={dataset.label || `dataset-${index}`}
            stroke={typeof dataset.borderColor === 'string' ? dataset.borderColor : "#4f46e5"}
            fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : "#4f46e533"}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
