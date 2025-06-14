
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
import { formatChartData } from '@/utils/chartRendererUtils';

interface FunnelChartProps {
  item: ChartItemType;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ item }) => {
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
      <RechartsFunnelChart style={chartStyle}>
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
        />
        <Legend content={<CustomLegend />} />
        {item.data.datasets
          .filter(dataset => !dataset.hidden)
          .map((dataset, index) => (
          <Funnel
            key={index}
            dataKey={dataset.label || `dataset-${index}`}
            nameKey="name"
            data={processedData}
            isAnimationActive
          >
            {processedData.map((entry, index) => {
              const bgColors = dataset.backgroundColor;
              const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : (bgColors as string || "#4f46e5");
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
            <LabelList position="right" dataKey={dataset.label || `dataset-${index}`} />
          </Funnel>
        ))}
      </RechartsFunnelChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;
