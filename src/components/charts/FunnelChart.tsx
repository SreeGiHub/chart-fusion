
import React from 'react';
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Cell,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';

interface FunnelChartProps {
  item: ChartItemType;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ item }) => {
  // Transform data for funnel chart with proper structure
  const processedData = item.data.labels.map((label, index) => {
    const value = item.data.datasets[0]?.data[index] || 0;
    return {
      name: label,
      value: typeof value === 'number' ? value : 0,
      fill: getLabelColor(index),
    };
  });

  // Get color for each label/segment
  const getLabelColor = (index: number) => {
    const dataset = item.data.datasets[0];
    if (!dataset) return "#8B5CF6";

    // Check for labelColors first (our custom property)
    if (dataset.labelColors && Array.isArray(dataset.labelColors)) {
      return dataset.labelColors[index % dataset.labelColors.length];
    }

    // Fall back to backgroundColor
    if (Array.isArray(dataset.backgroundColor)) {
      return dataset.backgroundColor[index % dataset.backgroundColor.length];
    }

    // Default color if nothing else
    return dataset.backgroundColor as string || "#8B5CF6";
  };
  
  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;
    
    return (
      <div className="flex justify-center flex-wrap mt-2 text-xs">
        {processedData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center mr-3 mb-1">
            <div 
              className="w-2.5 h-2.5 mr-1.5 rounded-sm" 
              style={{ backgroundColor: entry.fill }} 
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsFunnelChart style={chartStyle} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "8px", 
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" 
          }}
          formatter={(value: any) => [value, 'Value']}
        />
        <Legend content={<CustomLegend />} />
        <Funnel
          dataKey="value"
          data={processedData}
          isAnimationActive
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.fill}
            />
          ))}
          <LabelList 
            position="center" 
            fill="white" 
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={0.5}
            fontSize={12}
            fontWeight="bold"
          />
        </Funnel>
      </RechartsFunnelChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;
