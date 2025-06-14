
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartItemType } from '@/types';
import { formatChartData } from '@/utils/chartRendererUtils';

interface PieChartProps {
  item: ChartItemType;
}

const PieChart: React.FC<PieChartProps> = ({ item }) => {
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

  const isPie = item.type === "pie";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={chartStyle}>
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          labelStyle={{ fontWeight: "bold", color: "#111827" }}
          formatter={(value, name) => [
            `${value} (${((Number(value) / processedData.reduce((a: number, b: any) => 
              a + (Number(b[item.data.datasets[0]?.label || 'dataset-0']) || 0), 0)) * 100).toFixed(1)}%)`, 
            name
          ]}
        />
        <Legend content={<CustomLegend />} />
        <Pie
          data={processedData}
          dataKey={item.data.datasets[0]?.label || "dataset-0"}
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={isPie ? 0 : "60%"}
          outerRadius="80%"
          paddingAngle={2}
          fill="#4f46e5"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {processedData.map((entry, index) => {
            const bgColors = item.data.datasets[0].backgroundColor;
            let color;
            
            if (Array.isArray(bgColors)) {
              color = bgColors[index % bgColors.length];
            } else {
              color = bgColors || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            }
            
            return <Cell key={index} fill={color} />;
          })}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
