
import React from 'react';
import {
  Treemap,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';
import { formatChartData } from '@/utils/chartRendererUtils';

interface TreemapChartProps {
  item: ChartItemType;
}

const TreemapChart: React.FC<TreemapChartProps> = ({ item }) => {
  const processedData = formatChartData(item.data.labels, item.data.datasets);
  
  const chartStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={processedData}
        dataKey={item.data.datasets[0]?.label || "dataset-0"}
        nameKey="name"
        style={chartStyle}
        fill="#4f46e5"
      >
        {processedData.map((entry, index) => {
          const bgColors = item.data.datasets[0]?.backgroundColor;
          const color = Array.isArray(bgColors) ? bgColors[index % bgColors.length] : (bgColors as string || "#4f46e5");
          
          return <Cell key={`cell-${index}`} fill={color} />;
        })}
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapChart;
