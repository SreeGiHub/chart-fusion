
import React from 'react';
import { ChartItemType } from '@/types';

interface BoxPlotChartProps {
  item: ChartItemType;
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-4">
        <p className="text-lg font-semibold mb-2">Box Plot Chart</p>
        <p className="text-muted-foreground">
          Statistical box plot visualization showing data distribution
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">
            Min: {item.data.datasets[0]?.data[0] || 0} | 
            Max: {item.data.datasets[0]?.data[item.data.datasets[0]?.data.length - 1] || 100}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxPlotChart;
