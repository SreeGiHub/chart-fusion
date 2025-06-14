
import React from 'react';
import { ChartItemType } from '@/types';

interface KPIChartProps {
  item: ChartItemType;
}

const KPIChart: React.FC<KPIChartProps> = ({ item }) => {
  const kpiValue = item.data.datasets[0]?.data[0] || 0;
  const kpiTarget = item.data.datasets[0]?.data[1] || 100;
  const kpiPercentage = typeof kpiValue === 'number' && typeof kpiTarget === 'number' 
    ? (kpiValue / kpiTarget) * 100 : 0;
  
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">KPI Performance</div>
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {typeof kpiValue === 'number' ? kpiValue.toLocaleString() : String(kpiValue)}
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Target: {typeof kpiTarget === 'number' ? kpiTarget.toLocaleString() : String(kpiTarget)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              kpiPercentage >= 100 ? 'bg-green-500' : 
              kpiPercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(kpiPercentage, 100)}%` }}
          />
        </div>
        <div className="text-sm font-medium">
          {kpiPercentage.toFixed(1)}% of target
        </div>
      </div>
    </div>
  );
};

export default KPIChart;
