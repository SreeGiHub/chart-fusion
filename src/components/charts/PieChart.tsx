
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
  
  // Get color for each label/segment
  const getLabelColor = (index: number) => {
    const dataset = item.data.datasets[0];
    if (!dataset) return "#8B5CF6";

    // Check for labelColors first (our custom property for per-label colors)
    if (dataset.labelColors && Array.isArray(dataset.labelColors)) {
      return dataset.labelColors[index % dataset.labelColors.length];
    }

    // Fall back to backgroundColor array
    if (Array.isArray(dataset.backgroundColor)) {
      return dataset.backgroundColor[index % dataset.backgroundColor.length];
    }

    // Generate different colors for each slice if no colors defined
    const defaultColors = ["#8B5CF6", "#EC4899", "#F97316", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];
    return defaultColors[index % defaultColors.length];
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
        {item.data.labels.map((label, index) => (
          <div key={`legend-${index}`} className="flex items-center mr-3 mb-1">
            <div 
              className="w-2.5 h-2.5 mr-1.5 rounded-sm" 
              style={{ backgroundColor: getLabelColor(index) }} 
            />
            <span>{label}</span>
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
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "8px", 
            border: "1px solid #E5E7EB", 
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" 
          }}
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
          {processedData.map((entry, index) => (
            <Cell key={index} fill={getLabelColor(index)} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
